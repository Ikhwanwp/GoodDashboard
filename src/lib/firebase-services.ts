import { db } from './firebase-config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  query,
  where,
  writeBatch,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import type {
    Instansi, InstansiFromDB,
    User,
    KontrakPks, KontrakPksFromDB,
    KontrakMou, KontrakMouFromDB,
    DokumenSph, DokumenSphFromDB,
    StatusPekerjaan, StatusPekerjaanFromDB,
    PicEksternal
} from './types';
import type { User as FirebaseUser } from 'firebase/auth';

// Generic function to convert Firestore timestamps to JS Dates
function convertTimestamps<T>(docData: any): T {
    const data = { ...docData };
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate();
        }
    }
    return data as T;
}

// --- Instansi Services ---
const instansiCollection = collection(db, 'instansi');

export const getInstansi = async (): Promise<Instansi[]> => {
  const snapshot = await getDocs(instansiCollection);
  return snapshot.docs.map(doc => convertTimestamps<Instansi>({ ...doc.data(), id: doc.id } as InstansiFromDB));
};

export const addInstansiToDB = async (data: Omit<Instansi, 'id' | 'tanggalUpdateTerakhir' | 'internalPicId'>) => {
    // PIC GA logic is simplified. A default PIC should be assigned or handled separately.
    return await addDoc(instansiCollection, { ...data, tanggalUpdateTerakhir: serverTimestamp(), internalPicId: '' });
}

export const updateInstansiInDB = async (id: string, data: Partial<Omit<Instansi, 'id'>>) => {
    const docRef = doc(db, 'instansi', id);
    // Ensure we don't try to overwrite the id
    const updateData = { ...data };
    if ('id' in updateData) delete (updateData as any).id;
    
    // Only add timestamp if we are not just changing the PIC
    if (!('internalPicId' in data && Object.keys(data).length === 1)) {
        (updateData as any).tanggalUpdateTerakhir = serverTimestamp();
    }
    
    return await updateDoc(docRef, updateData);
}

export const deleteInstansiFromDB = async (id: string) => {
    const batch = writeBatch(db);

    // 1. Delete the instansi document itself
    const instansiRef = doc(db, 'instansi', id);
    batch.delete(instansiRef);

    // 2. Query and delete related documents in other collections
    const collectionsToDeleteFrom = ['kontrakPks', 'kontrakMou', 'dokumenSph', 'statusPekerjaan', 'picEksternal'];
    for (const coll of collectionsToDeleteFrom) {
        const q = query(collection(db, coll), where("instansiId", "==", id));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => batch.delete(doc.ref));
    }
    
    // Commit the batch
    await batch.commit();
}


// --- User (Internal PIC) Services ---
const usersCollection = collection(db, 'users');

export const getUsers = async (): Promise<User[]> => {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({...doc.data(), id: doc.id } as User));
}

export const getOrCreateUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const userData = { id: userSnap.id, ...userSnap.data() } as User;
        // Legacy role migration
        if ((userData.role as any) === 'PIC GA') {
            userData.role = 'GA';
            await updateDoc(userRef, { role: 'GA' });
        }
        return userData;
    } else {
        const newUser: Omit<User, 'id'> = {
            email: firebaseUser.email || 'N/A',
            nama: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'New User',
            noHp: firebaseUser.phoneNumber || 'N/A',
            role: 'Viewer' // Default role for new users
        };
        await setDoc(userRef, newUser);
        return { id: userRef.id, ...newUser };
    }
}


export const addUserToDB = async (data: Omit<User, 'id' | 'handledInstansiIds'>) => {
    // This function might need to be adapted to create Firebase Auth user as well
    // For now, it only creates the Firestore document.
    return await addDoc(usersCollection, data);
}
export const updateUserInDB = async (id: string, data: Partial<Omit<User, 'id'>>) => {
    const docRef = doc(db, 'users', id);
    const updateData = {...data};
    if ('handledInstansiIds' in updateData) delete (updateData as any).handledInstansiIds;
    return await updateDoc(docRef, updateData);
}
export const deleteUserFromDB = async (id: string) => {
    const docRef = doc(db, 'users', id);
    // Also unassign this user from any instansi
    const q = query(instansiCollection, where("internalPicId", "==", id));
    const instansiSnapshot = await getDocs(q);
    const batch = writeBatch(db);
    instansiSnapshot.forEach(doc => {
        batch.update(doc.ref, { internalPicId: '' });
    });
    
    batch.delete(docRef);
    await batch.commit();
}


// --- PIC Eksternal Services ---
const picEksternalCollection = collection(db, 'picEksternal');

export const getPicEksternal = async (): Promise<PicEksternal[]> => {
    const snapshot = await getDocs(picEksternalCollection);
    return snapshot.docs.map(doc => ({...doc.data(), id: doc.id } as PicEksternal));
}
export const addPicEksternalToDB = async (data: Omit<PicEksternal, 'id'>) => {
    return await addDoc(picEksternalCollection, data);
}
export const updatePicEksternalInDB = async (id: string, data: Partial<Omit<PicEksternal, 'id'>>) => {
    const docRef = doc(db, 'picEksternal', id);
    return await updateDoc(docRef, data);
}
export const deletePicEksternalFromDB = async (id: string) => {
    const docRef = doc(db, 'picEksternal', id);
    return await deleteDoc(docRef);
}


// --- Kontrak PKS Services ---
const kontrakPksCollection = collection(db, 'kontrakPks');

export const getKontrakPks = async (): Promise<KontrakPks[]> => {
    const snapshot = await getDocs(kontrakPksCollection);
    return snapshot.docs.map(doc => {
        const data = convertTimestamps<KontrakPks>({ ...doc.data(), id: doc.id } as KontrakPksFromDB);
        // Automatically determine status
        data.statusKontrak = new Date() > data.tanggalBerakhir ? 'Berakhir' : 'Aktif';
        return data;
    });
};
export const addKontrakPksToDB = async (data: Omit<KontrakPks, 'id' | 'statusKontrak'>) => {
    return await addDoc(kontrakPksCollection, { ...data, statusKontrak: 'Aktif' }); // Status will be recalculated on fetch
}
export const updateKontrakPksInDB = async (id: string, data: Partial<Omit<KontrakPks, 'id'>>) => {
    const docRef = doc(db, 'kontrakPks', id);
    return await updateDoc(docRef, data);
}
export const deleteKontrakPksFromDB = async (id: string) => {
    const docRef = doc(db, 'kontrakPks', id);
    return await deleteDoc(docRef);
}


// --- Kontrak MoU Services ---
const kontrakMouCollection = collection(db, 'kontrakMou');
export const getKontrakMou = async (): Promise<KontrakMou[]> => {
    const snapshot = await getDocs(kontrakMouCollection);
    return snapshot.docs.map(doc => convertTimestamps<KontrakMou>({ ...doc.data(), id: doc.id } as KontrakMouFromDB));
};
export const addKontrakMouToDB = async (data: Omit<KontrakMou, 'id'>) => {
    return await addDoc(kontrakMouCollection, { ...data });
}
export const updateKontrakMouInDB = async (id: string, data: Partial<Omit<KontrakMou, 'id'>>) => {
    const docRef = doc(db, 'kontrakMou', id);
    return await updateDoc(docRef, data);
}
export const deleteKontrakMouFromDB = async (id: string) => {
    const docRef = doc(db, 'kontrakMou', id);
    return await deleteDoc(docRef);
}


// --- Dokumen SPH Services ---
const dokumenSphCollection = collection(db, 'dokumenSph');
export const getDokumenSph = async (): Promise<DokumenSph[]> => {
    const snapshot = await getDocs(dokumenSphCollection);
    return snapshot.docs.map(doc => convertTimestamps<DokumenSph>({ ...doc.data(), id: doc.id } as DokumenSphFromDB));
};
export const addDokumenSphToDB = async (data: Omit<DokumenSph, 'id'>) => {
    return await addDoc(dokumenSphCollection, data);
}
export const updateDokumenSphInDB = async (id: string, data: Partial<Omit<DokumenSph, 'id'>>) => {
    const docRef = doc(db, 'dokumenSph', id);
    return await updateDoc(docRef, data);
}
export const deleteDokumenSphFromDB = async (id: string) => {
    const docRef = doc(db, 'dokumenSph', id);
    return await deleteDoc(docRef);
}


// --- Status Pekerjaan Services ---
const statusPekerjaanCollection = collection(db, 'statusPekerjaan');
export const getStatusPekerjaan = async (): Promise<StatusPekerjaan[]> => {
    const snapshot = await getDocs(statusPekerjaanCollection);
    return snapshot.docs.map(doc => convertTimestamps<StatusPekerjaan>({ ...doc.data(), id: doc.id } as StatusPekerjaanFromDB));
};
export const addStatusPekerjaanToDB = async (data: Omit<StatusPekerjaan, 'id' | 'tanggalUpdate'>) => {
    return await addDoc(statusPekerjaanCollection, { ...data, tanggalUpdate: serverTimestamp() });
}
export const updateStatusPekerjaanInDB = async (id: string, data: Partial<Omit<StatusPekerjaan, 'id' | 'tanggalUpdate'>>) => {
    const docRef = doc(db, 'statusPekerjaan', id);
    const updateData: Partial<StatusPekerjaan & { tanggalUpdate: any }> = {...data};
    
    // Always update the timestamp on every save.
    updateData.tanggalUpdate = serverTimestamp();
    
    return await updateDoc(docRef, updateData);
}
export const deleteStatusPekerjaanFromDB = async (id: string) => {
    const docRef = doc(db, 'statusPekerjaan', id);
    return await deleteDoc(docRef);
}
