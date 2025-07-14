
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Instansi, User, KontrakPks, KontrakMou, StatusPekerjaan, DokumenSph } from '@/lib/types';
import { 
    mockUsers, 
    mockInstansi, 
    mockKontrakPks, 
    mockKontrakMou, 
    mockDokumenSph, 
    mockStatusPekerjaan 
} from '@/lib/mock-data';

interface DataContextType {
  users: User[];
  instansi: Instansi[];
  kontrakPks: KontrakPks[];
  kontrakMou: KontrakMou[];
  dokumenSph: DokumenSph[];
  statusPekerjaan: StatusPekerjaan[];
  addInstansi: (newInstansi: Instansi) => void;
  addKontrakPks: (newKontrak: KontrakPks) => void;
  addKontrakMou: (newKontrak: KontrakMou) => void;
  addStatusPekerjaan: (newStatus: StatusPekerjaan) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [instansi, setInstansi] = useState<Instansi[]>(mockInstansi);
  const [kontrakPks, setKontrakPks] = useState<KontrakPks[]>(mockKontrakPks);
  const [kontrakMou, setKontrakMou] = useState<KontrakMou[]>(mockKontrakMou);
  const [dokumenSph, setDokumenSph] = useState<DokumenSph[]>(mockDokumenSph);
  const [statusPekerjaan, setStatusPekerjaan] = useState<StatusPekerjaan[]>(mockStatusPekerjaan);

  const addInstansi = (newInstansi: Instansi) => {
    setInstansi(prev => [newInstansi, ...prev]);
  };

  const addKontrakPks = (newKontrak: KontrakPks) => {
    setKontrakPks(prev => [newKontrak, ...prev]);
  };
  
  const addKontrakMou = (newKontrak: KontrakMou) => {
    setKontrakMou(prev => [newKontrak, ...prev]);
  };

  const addStatusPekerjaan = (newStatus: StatusPekerjaan) => {
    setStatusPekerjaan(prev => [newStatus, ...prev]);
  };

  const value = {
    users,
    instansi,
    kontrakPks,
    kontrakMou,
    dokumenSph,
    statusPekerjaan,
    addInstansi,
    addKontrakPks,
    addKontrakMou,
    addStatusPekerjaan
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
