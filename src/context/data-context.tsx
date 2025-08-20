
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Instansi, User, UserWithPassword, KontrakPks, KontrakMou, StatusPekerjaan, DokumenSph, PicEksternal } from '@/lib/types';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase-config';
import {
    getInstansi, addInstansiToDB, updateInstansiInDB, deleteInstansiFromDB,
    getUsers, addUserToDB, updateUserInDB, deleteUserFromDB, getOrCreateUser,
    getPicEksternal, addPicEksternalToDB, updatePicEksternalInDB, deletePicEksternalFromDB,
    getKontrakPks, addKontrakPksToDB, updateKontrakPksInDB, deleteKontrakPksFromDB,
    getKontrakMou, addKontrakMouToDB, updateKontrakMouInDB, deleteKontrakMouFromDB,
    getDokumenSph, addDokumenSphToDB, updateDokumenSphInDB, deleteDokumenSphFromDB,
    getStatusPekerjaan, addStatusPekerjaanToDB, updateStatusPekerjaanInDB, deleteStatusPekerjaanFromDB
} from '@/lib/firebase-services';
import { useToast } from "@/hooks/use-toast";

type CollectionName = 'users' | 'instansi' | 'kontrakPks' | 'kontrakMou' | 'dokumenSph' | 'statusPekerjaan' | 'picEksternal';

interface DataContextType {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  users: User[];
  instansi: Instansi[];
  kontrakPks: KontrakPks[];
  kontrakMou: KontrakMou[];
  dokumenSph: DokumenSph[];
  statusPekerjaan: StatusPekerjaan[];
  picEksternal: PicEksternal[];
  error: Error | null;
  reloadData: (collections?: CollectionName[]) => Promise<void>;
  // Instansi
  addInstansi: (data: Partial<Omit<Instansi, 'id' | 'tanggalUpdateTerakhir' | 'internalPicId'>>) => Promise<void>;
  updateInstansi: (id: string, data: Partial<Instansi>) => Promise<void>;
  deleteInstansi: (id: string) => Promise<void>;
  // Kontrak PKS
  addKontrakPks: (data: Omit<KontrakPks, 'id' | 'statusKontrak' >) => Promise<void>;
  updateKontrakPks: (id: string, data: Partial<KontrakPks>) => Promise<void>;
  deleteKontrakPks: (id: string) => Promise<void>;
  // Kontrak MoU
  addKontrakMou: (data: Omit<KontrakMou, 'id' >) => Promise<void>;
  updateKontrakMou: (id: string, data: Partial<KontrakMou>) => Promise<void>;
  deleteKontrakMou: (id: string) => Promise<void>;
  // Dokumen SPH
  addDokumenSph: (data: Omit<DokumenSph, 'id'>) => Promise<void>;
  updateDokumenSph: (id: string, data: Partial<DokumenSph>) => Promise<void>;
  deleteDokumenSph: (id: string) => Promise<void>;
  // Status Pekerjaan
  addStatusPekerjaan: (data: Omit<StatusPekerjaan, 'id' | 'tanggalUpdate'>) => Promise<void>;
  updateStatusPekerjaan: (id: string, data: Partial<Omit<StatusPekerjaan, 'id' | 'tanggalUpdate'>>) => Promise<void>;
  deleteStatusPekerjaan: (id: string) => Promise<void>;
  // User (Internal PIC)
  addUser: (data: UserWithPassword) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  // PIC Eksternal
  addPicEksternal: (data: Omit<PicEksternal, 'id'>) => Promise<void>;
  updatePicEksternal: (id: string, data: Partial<PicEksternal>) => Promise<void>;
  deletePicEksternal: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [instansi, setInstansi] = useState<Instansi[]>([]);
  const [kontrakPks, setKontrakPks] = useState<KontrakPks[]>([]);
  const [kontrakMou, setKontrakMou] = useState<KontrakMou[]>([]);
  const [dokumenSph, setDokumenSph] = useState<DokumenSph[]>([]);
  const [statusPekerjaan, setStatusPekerjaan] = useState<StatusPekerjaan[]>([]);
  const [picEksternal, setPicEksternal] = useState<PicEksternal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async (collectionsToReload?: CollectionName[]) => {
    const isFullReload = !collectionsToReload;
    if (isFullReload) {
        setLoading(true);
    }
    setError(null);
    try {
        const allCollections: CollectionName[] = ['users', 'instansi', 'kontrakPks', 'kontrakMou', 'dokumenSph', 'statusPekerjaan', 'picEksternal'];
        const collections = collectionsToReload || allCollections;

        const dataFetchers = {
            users: getUsers,
            instansi: getInstansi,
            kontrakPks: getKontrakPks,
            kontrakMou: getKontrakMou,
            dokumenSph: getDokumenSph,
            statusPekerjaan: getStatusPekerjaan,
            picEksternal: getPicEksternal,
        };

        const setters: { [key in CollectionName]: React.Dispatch<React.SetStateAction<any[]>> } = {
            users: setUsers,
            instansi: setInstansi,
            kontrakPks: setKontrakPks,
            kontrakMou: setKontrakMou,
            dokumenSph: setDokumenSph,
            statusPekerjaan: setStatusPekerjaan,
            picEksternal: setPicEksternal,
        };

        const fetchPromises = collections.map(async (collectionName) => {
            if (dataFetchers[collectionName]) {
                const data = await dataFetchers[collectionName]();
                setters[collectionName](data);
            }
        });
        
        await Promise.all(fetchPromises);

    } catch (err) {
      setError(err as Error);
      console.error(err);
      toast({
          variant: "destructive",
          title: "Gagal memuat data",
          description: "Tidak dapat terhubung ke database. Silakan coba lagi nanti."
      })
    } finally {
      if (isFullReload) {
        setLoading(false);
      }
    }
  }, [toast]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          const userData = await getOrCreateUser(firebaseUser);
          setCurrentUser(userData);
          // Fetch all other data after confirming user
          await fetchData();
        } catch (e) {
            console.error("Failed to get or create user:", e);
            await signOut(auth);
            setCurrentUser(null);
        }
      } else {
        // No firebase user, so clear all data
        setCurrentUser(null);
        setUsers([]);
        setInstansi([]);
        setKontrakPks([]);
        setKontrakMou([]);
        setDokumenSph([]);
        setStatusPekerjaan([]);
        setPicEksternal([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchData]);


  const createApiFunction = <T extends any[], U>(
    apiCall: (...args: T) => Promise<U>,
    successMessage: string,
    collectionsToReload: CollectionName[]
  ) => async (...args: T): Promise<void> => {
    try {
      await apiCall(...args);
      toast({ title: "Sukses", description: successMessage });
      await fetchData(collectionsToReload); // Reload only relevant data
    } catch (err) {
      console.error(err);
      let errorMessage = (err as Error).message || "Terjadi kesalahan pada server.";
      if (errorMessage.includes('auth/email-already-in-use')) {
          errorMessage = 'Email ini sudah terdaftar. Silakan gunakan email lain.';
      }
      toast({
        variant: "destructive",
        title: "Operasi Gagal",
        description: errorMessage,
      });
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    // State will be cleared by the onAuthStateChanged listener
  };

  const value: DataContextType = {
    currentUser,
    loading,
    logout,
    users,
    instansi,
    kontrakPks,
    kontrakMou,
    dokumenSph,
    statusPekerjaan,
    picEksternal,
    error,
    reloadData: fetchData,
    // Instansi
    addInstansi: createApiFunction(addInstansiToDB, "Instansi baru berhasil ditambahkan.", ['instansi']),
    updateInstansi: async (id: string, data: Partial<Instansi>) => {
      try {
        const dataToUpdate = { ...data };
        if (dataToUpdate.tanggalUlangTahun === undefined || dataToUpdate.tanggalUlangTahun === null) {
          dataToUpdate.tanggalUlangTahun = null;
        }
        await updateInstansiInDB(id, dataToUpdate);
        toast({ title: "Sukses", description: "Data instansi berhasil diperbarui." });
        await fetchData(['instansi', 'users']);
      } catch (err) {
         console.error(err);
         toast({
           variant: "destructive",
           title: "Operasi Gagal",
           description: (err as Error).message || "Terjadi kesalahan pada server.",
         });
         throw err;
      }
    },
    deleteInstansi: createApiFunction(deleteInstansiFromDB, "Data instansi telah dihapus.", ['instansi', 'kontrakPks', 'kontrakMou', 'dokumenSph', 'statusPekerjaan', 'picEksternal']),
    // Kontrak PKS
    addKontrakPks: createApiFunction(addKontrakPksToDB, "Kontrak PKS baru berhasil ditambahkan.", ['kontrakPks']),
    updateKontrakPks: createApiFunction(updateKontrakPksInDB, "Kontrak PKS berhasil diperbarui.", ['kontrakPks']),
    deleteKontrakPks: createApiFunction(deleteKontrakPksFromDB, "Kontrak PKS telah dihapus.", ['kontrakPks']),
    // Kontrak MoU
    addKontrakMou: createApiFunction(addKontrakMouToDB, "Kontrak MoU baru berhasil ditambahkan.", ['kontrakMou']),
    updateKontrakMou: createApiFunction(updateKontrakMouInDB, "Kontrak MoU berhasil diperbarui.", ['kontrakMou']),
    deleteKontrakMou: createApiFunction(deleteKontrakMouFromDB, "Kontrak MoU telah dihapus.", ['kontrakMou']),
    // Dokumen SPH
    addDokumenSph: createApiFunction(addDokumenSphToDB, "SPH baru berhasil ditambahkan.", ['dokumenSph']),
    updateDokumenSph: createApiFunction(updateDokumenSphInDB, "SPH berhasil diperbarui.", ['dokumenSph']),
    deleteDokumenSph: createApiFunction(deleteDokumenSphFromDB, "SPH telah dihapus.", ['dokumenSph']),
    // Status Pekerjaan
    addStatusPekerjaan: createApiFunction(addStatusPekerjaanToDB, "Status pekerjaan baru berhasil ditambahkan.", ['statusPekerjaan']),
    updateStatusPekerjaan: createApiFunction(updateStatusPekerjaanInDB, "Status pekerjaan berhasil diperbarui.", ['statusPekerjaan']),
    deleteStatusPekerjaan: createApiFunction(deleteStatusPekerjaanFromDB, "Status pekerjaan telah dihapus.", ['statusPekerjaan']),
    // User
    addUser: createApiFunction(addUserToDB, "PIC Internal baru berhasil ditambahkan.", ['users', 'instansi']),
    updateUser: async (id: string, data: Partial<User>) => {
        try {
            const collectionsToUpdate: CollectionName[] = ['users'];
            const user = users.find(u => u.id === id);
            const originalHandledIds = instansi.filter(i => i.internalPicId === id).map(i => i.id);
            
            const updateData: Partial<User> = { role: data.role, nama: data.nama, email: data.email, noHp: data.noHp };
            await updateUserInDB(id, updateData);
            
            if (data.handledInstansiIds) {
                const newHandledIds = data.handledInstansiIds;
                const idsToAssign = newHandledIds.filter(i => !originalHandledIds.includes(i));
                const idsToUnassign = originalHandledIds.filter(i => !newHandledIds.includes(i));

                const updatePromises: Promise<any>[] = [];
                for (const instansiId of idsToAssign) {
                    updatePromises.push(updateInstansiInDB(instansiId, { internalPicId: id }));
                }
                 for (const instansiId of idsToUnassign) {
                    updatePromises.push(updateInstansiInDB(instansiId, { internalPicId: '' }));
                }
                await Promise.all(updatePromises);
                if (updatePromises.length > 0) {
                    collectionsToUpdate.push('instansi');
                }
            }
            
            toast({ title: "Sukses", description: "PIC Internal berhasil diperbarui." });
            await fetchData(collectionsToUpdate);
        } catch(err) {
             console.error(err);
            toast({
                variant: "destructive",
                title: "Operasi Gagal",
                description: (err as Error).message || "Terjadi kesalahan pada server.",
            });
            throw err;
        }
    },
    deleteUser: createApiFunction(deleteUserFromDB, "PIC Internal telah dihapus.", ['users', 'instansi']),
    // PIC Eksternal
    addPicEksternal: createApiFunction(addPicEksternalToDB, "PIC Eksternal baru berhasil ditambahkan.", ['picEksternal']),
    updatePicEksternal: createApiFunction(updatePicEksternalInDB, "PIC Eksternal berhasil diperbarui.", ['picEksternal']),
    deletePicEksternal: createApiFunction(deletePicEksternalFromDB, "PIC Eksternal telah dihapus.", ['picEksternal']),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
