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

export const updateInstansiInDB = async (id: string, data: Partial<Omit<Instansi, 'id' | 'tanggalUpdateTerakhir'>>) => {
    const docRef = doc(db, 'instansi', id);
    return await updateDoc(docRef, {...data, tanggalUpdateTerakhir: serverTimestamp()});
}

export const deleteInstansiFromDB = async (id: string) => {
    const docRef = doc(db, 'instansi', id);
    return await deleteDoc(docRef);
}


// --- User (Internal PIC) Services ---
const usersCollection = collection(db, 'users');

export const getUsers = async (): Promise<User[]> => {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({...doc.data(), id: doc.id } as User));
}
export const addUserToDB = async (data: Omit<User, 'id' | 'handledInstansiIds'>) => {
    return await addDoc(usersCollection, data);
}
export const updateUserInDB = async (id: string, data: Partial<Omit<User, 'id'>>) => {
    const docRef = doc(db, 'users', id);
    return await updateDoc(docRef, data);
}
export const deleteUserFromDB = async (id: string) => {
    const docRef = doc(db, 'users', id);
    return await deleteDoc(docRef);
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
    return snapshot.docs.map(doc => convertTimestamps<KontrakPks>({ ...doc.data(), id: doc.id } as KontrakPksFromDB));
};
export const addKontrakPksToDB = async (data: Omit<KontrakPks, 'id' | 'statusKontrak' | 'picGaId'>) => {
    // This logic assumes a PIC GA is assigned later, or through a different process.
    return await addDoc(kontrakPksCollection, { ...data, picGaId: 'default-pic-id', statusKontrak: 'Aktif' });
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
export const addKontrakMouToDB = async (data: Omit<KontrakMou, 'id' | 'picGaId'>) => {
    return await addDoc(kontrakMouCollection, { ...data, picGaId: 'default-pic-id' });
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
// Add, Update, Delete for SPH can be added here if needed


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
    return await updateDoc(docRef, { ...data, tanggalUpdate: serverTimestamp() });
}
export const deleteStatusPekerjaanFromDB = async (id: string) => {
    const docRef = doc(db, 'statusPekerjaan', id);
    return await deleteDoc(docRef);
}
