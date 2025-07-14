
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
  updateInstansi: (id: string, updatedInstansi: Partial<Instansi>) => void;
  deleteInstansi: (id: string) => void;
  addKontrakPks: (newKontrak: KontrakPks) => void;
  updateKontrakPks: (id: string, updatedKontrak: Partial<KontrakPks>) => void;
  deleteKontrakPks: (id: string) => void;
  addKontrakMou: (newKontrak: KontrakMou) => void;
  updateKontrakMou: (id: string, updatedKontrak: Partial<KontrakMou>) => void;
  deleteKontrakMou: (id: string) => void;
  addStatusPekerjaan: (newStatus: StatusPekerjaan) => void;
  updateStatusPekerjaan: (id: string, updatedStatus: Partial<StatusPekerjaan>) => void;
  deleteStatusPekerjaan: (id: string) => void;
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
  const updateInstansi = (id: string, updatedInstansi: Partial<Instansi>) => {
    setInstansi(prev => prev.map(i => i.id === id ? { ...i, ...updatedInstansi, tanggalUpdateTerakhir: new Date() } : i));
  };
  const deleteInstansi = (id: string) => {
    setInstansi(prev => prev.filter(i => i.id !== id));
  };

  const addKontrakPks = (newKontrak: KontrakPks) => {
    setKontrakPks(prev => [newKontrak, ...prev]);
  };
  const updateKontrakPks = (id: string, updatedKontrak: Partial<KontrakPks>) => {
    setKontrakPks(prev => prev.map(k => k.id === id ? { ...k, ...updatedKontrak } : k));
  };
  const deleteKontrakPks = (id: string) => {
    setKontrakPks(prev => prev.filter(k => k.id !== id));
  };
  
  const addKontrakMou = (newKontrak: KontrakMou) => {
    setKontrakMou(prev => [newKontrak, ...prev]);
  };
  const updateKontrakMou = (id: string, updatedKontrak: Partial<KontrakMou>) => {
    setKontrakMou(prev => prev.map(k => k.id === id ? { ...k, ...updatedKontrak } : k));
  };
  const deleteKontrakMou = (id: string) => {
    setKontrakMou(prev => prev.filter(k => k.id !== id));
  };

  const addStatusPekerjaan = (newStatus: StatusPekerjaan) => {
    setStatusPekerjaan(prev => [newStatus, ...prev]);
  };
  const updateStatusPekerjaan = (id: string, updatedStatus: Partial<StatusPekerjaan>) => {
    setStatusPekerjaan(prev => prev.map(s => s.id === id ? { ...s, ...updatedStatus, tanggalUpdate: new Date() } : s));
  };
  const deleteStatusPekerjaan = (id: string) => {
    setStatusPekerjaan(prev => prev.filter(s => s.id !== id));
  };

  const value = {
    users,
    instansi,
    kontrakPks,
    kontrakMou,
    dokumenSph,
    statusPekerjaan,
    addInstansi,
    updateInstansi,
    deleteInstansi,
    addKontrakPks,
    updateKontrakPks,
    deleteKontrakPks,
    addKontrakMou,
    updateKontrakMou,
    deleteKontrakMou,
    addStatusPekerjaan,
    updateStatusPekerjaan,
    deleteStatusPekerjaan,
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
