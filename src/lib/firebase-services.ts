
import { db, auth, firebaseConfig } from './firebase-config';
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
import { createUserWithEmailAndPassword, getAuth, signOut as authSignOut } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import type {
    Instansi, InstansiFromDB,
    User, UserWithPassword,
    KontrakPks, KontrakPksFromDB,
    KontrakMou, KontrakMouFromDB,
    DokumenSph, DokumenSphFromDB,
    StatusPekerjaan, StatusPekerjaanFromDB,
    PicEksternal,
    Fulfillment, FulfillmentFromDB, WorkflowStep
} from './types';
import type { User as FirebaseUser } from 'firebase/auth';

// Generic function to convert Firestore timestamps to JS Dates
function convertTimestamps<T>(docData: any): T {
    const data = { ...docData };
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate();
        } else if (Array.isArray(data[key])) {
            // Recursively convert timestamps in arrays of objects
            data[key] = data[key].map(item =>
                (typeof item === 'object' && item !== null) ? convertTimestamps(item) : item
            );
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

export const addInstansiToDB = async (data: Partial<Omit<Instansi, 'id' | 'tanggalUpdateTerakhir' | 'internalPicId'>>) => {
    const dataToSave = {
      ...data,
      pejabatTerkait: data.pejabatTerkait || "",
      tanggalUlangTahun: data.tanggalUlangTahun || null, // Ensure null instead of undefined
      jenisLayanan: data.jenisLayanan || "",
      tanggalUpdateTerakhir: serverTimestamp(),
      internalPicId: '',
    };
    return await addDoc(instansiCollection, dataToSave);
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
    const collectionsToDeleteFrom = ['kontrakPks', 'kontrakMou', 'dokumenSph', 'statusPekerjaan', 'picEksternal', 'fulfillment'];
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
        // If a user exists in Auth but not in Firestore, they shouldn't be able to log in.
        // An admin must create their user document first.
        throw new Error("User document not found. Please contact an administrator.");
    }
}


export const addUserToDB = async (data: UserWithPassword) => {
    if (!data.password) {
        throw new Error("Password is required to create a new user.");
    }
    
    // Use a secondary app instance to create user without logging out the current admin
    const secondaryAppName = 'UserCreationApp';
    const secondaryApp = getApps().find(a => a.name === secondaryAppName) 
        || initializeApp(firebaseConfig, secondaryAppName);
    const secondaryAuth = getAuth(secondaryApp);
    
    // 1. Create user in Firebase Auth using the secondary instance
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
    const user = userCredential.user;

    // 2. Prepare user data for Firestore
    const userDataForDB: Omit<User, 'id'> = {
        nama: data.nama,
        email: data.email,
        noHp: data.noHp || '',
        role: data.role,
    };

    const batch = writeBatch(db);

    // 3. Set the user document in 'users' collection
    const userRef = doc(db, "users", user.uid);
    batch.set(userRef, userDataForDB);

    // 4. If role is GA and instansi are selected, update instansi documents
    if (data.role === 'GA' && data.handledInstansiIds && data.handledInstansiIds.length > 0) {
        data.handledInstansiIds.forEach(instansiId => {
            const instansiRef = doc(db, 'instansi', instansiId);
            batch.update(instansiRef, { internalPicId: user.uid });
        });
    }

    // 5. Commit all writes at once
    await batch.commit();

    // 6. Sign out from secondary auth to clear state
    await authSignOut(secondaryAuth);
}
export const updateUserInDB = async (id: string, data: Partial<Omit<User, 'id'>>) => {
    const docRef = doc(db, 'users', id);
    const updateData = {...data};
    if ('handledInstansiIds' in updateData) delete (updateData as any).handledInstansiIds;
    return await updateDoc(docRef, updateData);
}
export const deleteUserFromDB = async (id: string) => {
    const docRef = doc(db, 'users', id);
    // This only deletes the Firestore record, not the Auth user for safety.
    // Deleting Auth users should be a separate, more deliberate admin action.

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
export const addKontrakPksToDB = async (data: Omit<KontrakPks, 'id' | 'statusKontrak' >) => {
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
    return snapshot.docs.map(doc => {
        const data = convertTimestamps<KontrakMou>({ ...doc.data(), id: doc.id } as KontrakMouFromDB);
        // Automatically determine status
        data.statusKontrak = new Date() > data.tanggalBerakhir ? 'Berakhir' : 'Aktif';
        return data;
    });
};
export const addKontrakMouToDB = async (data: Omit<KontrakMou, 'id' | 'statusKontrak'>) => {
    return await addDoc(kontrakMouCollection, { ...data, statusKontrak: 'Aktif' });
}
export const updateKontrakMouInDB = async (id: string, data: Partial<Omit<KontrakMou, 'id' | 'statusKontrak'>>) => {
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

// --- Fulfillment Services ---
const fulfillmentCollection = collection(db, 'fulfillment');

export const getFulfillments = async (): Promise<Fulfillment[]> => {
    const snapshot = await getDocs(fulfillmentCollection);
    return snapshot.docs.map(doc => convertTimestamps<Fulfillment>({ ...doc.data(), id: doc.id } as FulfillmentFromDB));
}

export const getFulfillment = async (kontrakId: string): Promise<Fulfillment | null> => {
    const docRef = doc(db, 'fulfillment', kontrakId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return convertTimestamps<Fulfillment>({ ...docSnap.data(), id: docSnap.id } as FulfillmentFromDB);
    }
    return null;
}

export const deleteFulfillmentFromDB = async (kontrakId: string) => {
    const docRef = doc(db, 'fulfillment', kontrakId);
    return await deleteDoc(docRef);
}

export const initializeFulfillment = async (kontrakId: string, terminCount: number): Promise<Fulfillment> => {
    const steps: WorkflowStep[] = [];
    
    // Step 1: Kontrak K/L
    steps.push({
        name: "Kontrak K/L",
        role: "GA",
        status: "active",
        completedAt: null,
        completedBy: null,
        refNumber: null,
        billingAmount: null,
        billingDate: null,
        notes: null,
        linkDokumen: null,
    });

    // Dynamic Termin Steps
    for (let i = 1; i <= terminCount; i++) {
        steps.push({
            name: `Termin ${i}`,
            role: "GA",
            status: "pending",
            completedAt: null,
            completedBy: null,
            refNumber: null,
            billingAmount: null,
            billingDate: null,
            notes: null,
            linkDokumen: null,
        });
    }

    // Final Step: End Of Contract
    steps.push({
        name: "End Of Contract",
        role: "GA",
        status: "pending",
        completedAt: null,
        completedBy: null,
        refNumber: null,
        billingAmount: null,
        billingDate: null,
        notes: null,
        linkDokumen: null,
    });

    const newFulfillment: Omit<Fulfillment, 'id'> = {
        kontrakId,
        currentStep: 0,
        lastUpdatedAt: new Date(),
        steps,
    };

    const docRef = doc(db, 'fulfillment', kontrakId);
    await setDoc(docRef, {
        ...newFulfillment,
        lastUpdatedAt: serverTimestamp(),
    });

    return {
        ...newFulfillment,
        id: kontrakId,
    };
}


export const updateFulfillmentStep = async (
    kontrakId: string, 
    stepIndex: number, 
    stepData: { refNumber: string; billingAmount: number | null; billingDate: Date | null; notes: string; linkDokumen: string; userId: string; }
): Promise<void> => {
    const docRef = doc(db, 'fulfillment', kontrakId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        throw new Error("Fulfillment document not found.");
    }

    const fulfillment = docSnap.data() as Fulfillment;
    const { steps } = fulfillment;

    if (stepIndex < 0 || stepIndex >= steps.length) {
        throw new Error("Invalid step index.");
    }
    
    // Mark current step as completed
    steps[stepIndex] = {
        ...steps[stepIndex],
        status: 'completed',
        completedAt: new Date() as any, 
        completedBy: stepData.userId,
        refNumber: stepData.refNumber,
        billingAmount: stepData.billingAmount,
        billingDate: stepData.billingDate as any,
        notes: stepData.notes,
        linkDokumen: stepData.linkDokumen,
    };
    
    // Mark next step as active, if it exists
    const nextStepIndex = stepIndex + 1;
    if (nextStepIndex < steps.length) {
        steps[nextStepIndex].status = 'active';
    }

    await updateDoc(docRef, {
        steps,
        currentStep: nextStepIndex < steps.length ? nextStepIndex : stepIndex,
        lastUpdatedAt: serverTimestamp(),
    });
}
