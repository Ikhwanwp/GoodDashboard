
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Instansi, User, KontrakPks, KontrakMou, StatusPekerjaan, DokumenSph, PicEksternal } from '@/lib/types';
import {
    getInstansi, addInstansiToDB, updateInstansiInDB, deleteInstansiFromDB,
    getUsers, addUserToDB, updateUserInDB, deleteUserFromDB,
    getPicEksternal, addPicEksternalToDB, updatePicEksternalInDB, deletePicEksternalFromDB,
    getKontrakPks, addKontrakPksToDB, updateKontrakPksInDB, deleteKontrakPksFromDB,
    getKontrakMou, addKontrakMouToDB, updateKontrakMouInDB, deleteKontrakMouFromDB,
    getDokumenSph,
    getStatusPekerjaan, addStatusPekerjaanToDB, updateStatusPekerjaanInDB, deleteStatusPekerjaanFromDB
} from '@/lib/firebase-services';
import { useToast } from "@/hooks/use-toast";

interface DataContextType {
  users: User[];
  instansi: Instansi[];
  kontrakPks: KontrakPks[];
  kontrakMou: KontrakMou[];
  dokumenSph: DokumenSph[];
  statusPekerjaan: StatusPekerjaan[];
  picEksternal: PicEksternal[];
  loading: boolean;
  error: Error | null;
  reloadData: () => void;
  // Instansi
  addInstansi: (data: Omit<Instansi, 'id' | 'tanggalUpdateTerakhir' | 'internalPicId'>) => Promise<void>;
  updateInstansi: (id: string, data: Partial<Instansi>) => Promise<void>;
  deleteInstansi: (id: string) => Promise<void>;
  // Kontrak PKS
  addKontrakPks: (data: Omit<KontrakPks, 'id' | 'statusKontrak'>) => Promise<void>;
  updateKontrakPks: (id: string, data: Partial<KontrakPks>) => Promise<void>;
  deleteKontrakPks: (id: string) => Promise<void>;
  // Kontrak MoU
  addKontrakMou: (data: Omit<KontrakMou, 'id'>) => Promise<void>;
  updateKontrakMou: (id: string, data: Partial<KontrakMou>) => Promise<void>;
  deleteKontrakMou: (id: string) => Promise<void>;
  // Status Pekerjaan
  addStatusPekerjaan: (data: Omit<StatusPekerjaan, 'id' | 'tanggalUpdate'>) => Promise<void>;
  updateStatusPekerjaan: (id: string, data: Partial<StatusPekerjaan>) => Promise<void>;
  deleteStatusPekerjaan: (id: string) => Promise<void>;
  // User (Internal PIC)
  addUser: (data: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  // PIC Eksternal
  addPicEksternal: (data: Omit<PicEksternal, 'id'>) => Promise<void>;
  updatePicEksternal: (id: string, data: Partial<PicEksternal>) => Promise<void>;
  deletePicEksternal: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        usersData,
        instansiData,
        kontrakPksData,
        kontrakMouData,
        dokumenSphData,
        statusPekerjaanData,
        picEksternalData
      ] = await Promise.all([
        getUsers(),
        getInstansi(),
        getKontrakPks(),
        getKontrakMou(),
        getDokumenSph(),
        getStatusPekerjaan(),
        getPicEksternal()
      ]);
      setUsers(usersData);
      setInstansi(instansiData);
      setKontrakPks(kontrakPksData);
      setKontrakMou(kontrakMouData);
      setDokumenSph(dokumenSphData);
      setStatusPekerjaan(statusPekerjaanData);
      setPicEksternal(picEksternalData);
    } catch (err) {
      setError(err as Error);
      console.error(err);
      toast({
          variant: "destructive",
          title: "Gagal memuat data",
          description: "Tidak dapat terhubung ke database. Silakan coba lagi nanti."
      })
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createApiFunction = <T extends any[], U>(
    apiCall: (...args: T) => Promise<U>,
    successMessage: string
  ) => async (...args: T): Promise<void> => {
    try {
      await apiCall(...args);
      toast({ title: "Sukses", description: successMessage });
      await fetchData(); // Reload all data
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Operasi Gagal",
        description: (err as Error).message || "Terjadi kesalahan pada server.",
      });
    }
  };

  const value = {
    users,
    instansi,
    kontrakPks,
    kontrakMou,
    dokumenSph,
    statusPekerjaan,
    picEksternal,
    loading,
    error,
    reloadData: fetchData,
    // Instansi
    addInstansi: createApiFunction(addInstansiToDB, "Instansi baru berhasil ditambahkan."),
    updateInstansi: createApiFunction(updateInstansiInDB, "Data instansi berhasil diperbarui."),
    deleteInstansi: createApiFunction(deleteInstansiFromDB, "Data instansi telah dihapus."),
    // Kontrak PKS
    addKontrakPks: createApiFunction(addKontrakPksToDB, "Kontrak PKS baru berhasil ditambahkan."),
    updateKontrakPks: createApiFunction(updateKontrakPksInDB, "Kontrak PKS berhasil diperbarui."),
    deleteKontrakPks: createApiFunction(deleteKontrakPksFromDB, "Kontrak PKS telah dihapus."),
    // Kontrak MoU
    addKontrakMou: createApiFunction(addKontrakMouToDB, "Kontrak MoU baru berhasil ditambahkan."),
    updateKontrakMou: createApiFunction(updateKontrakMouInDB, "Kontrak MoU berhasil diperbarui."),
    deleteKontrakMou: createApiFunction(deleteKontrakMouFromDB, "Kontrak MoU telah dihapus."),
    // Status Pekerjaan
    addStatusPekerjaan: createApiFunction(addStatusPekerjaanToDB, "Status pekerjaan baru berhasil ditambahkan."),
    updateStatusPekerjaan: createApiFunction(updateStatusPekerjaanInDB, "Status pekerjaan berhasil diperbarui."),
    deleteStatusPekerjaan: createApiFunction(deleteStatusPekerjaanFromDB, "Status pekerjaan telah dihapus."),
    // User
    addUser: createApiFunction(addUserToDB, "PIC Internal baru berhasil ditambahkan."),
    updateUser: async (id: string, data: Partial<User>) => {
        try {
            if (data.handledInstansiIds) {
                // This is a complex operation: find which instansi to update
                const user = users.find(u => u.id === id);
                const originalHandledIds = instansi.filter(i => i.internalPicId === id).map(i => i.id);
                const newHandledIds = data.handledInstansiIds;
                
                const idsToAssign = newHandledIds.filter(i => !originalHandledIds.includes(i));
                const idsToUnassign = originalHandledIds.filter(i => !newHandledIds.includes(i));
                
                // Firestore doesn't support this transactionally easily without cloud functions
                // For now, we update the user and then update the instansi docs one by one
                // This is not atomic.
                await updateUserInDB(id, { role: data.role, nama: data.nama, email: data.email, noHp: data.noHp });
                for (const instansiId of idsToAssign) {
                    await updateInstansiInDB(instansiId, { internalPicId: id });
                }
                 for (const instansiId of idsToUnassign) {
                    await updateInstansiInDB(instansiId, { internalPicId: '' }); // or a default user
                }
            } else {
                 await updateUserInDB(id, data);
            }
            toast({ title: "Sukses", description: "PIC Internal berhasil diperbarui." });
            await fetchData();
        } catch(err) {
             console.error(err);
            toast({
                variant: "destructive",
                title: "Operasi Gagal",
                description: (err as Error).message || "Terjadi kesalahan pada server.",
            });
        }
    },
    deleteUser: createApiFunction(deleteUserFromDB, "PIC Internal telah dihapus."),
    // PIC Eksternal
    addPicEksternal: createApiFunction(addPicEksternalToDB, "PIC Eksternal baru berhasil ditambahkan."),
    updatePicEksternal: createApiFunction(updatePicEksternalInDB, "PIC Eksternal berhasil diperbarui."),
    deletePicEksternal: createApiFunction(deletePicEksternalFromDB, "PIC Eksternal telah dihapus."),
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
