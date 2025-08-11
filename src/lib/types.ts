import type { LucideIcon } from "lucide-react";
import type { Timestamp } from "firebase/firestore";

// Helper type to convert Firestore Timestamps to JS Dates in other types
type WithDates<T> = {
  [K in keyof T]: T[K] extends Timestamp ? Date : T[K];
};

export interface Instansi {
  id: string;
  kodeInstansi: string;
  namaInstansi: string;
  tanggalUlangTahun: Date;
  statusKementrian: "STG Prioritas" | "Non Prioritas";
  jenisLayanan: string;
  tanggalUpdateTerakhir: Date;
  internalPicId: string;
}

export interface InstansiFromDB {
  id: string;
  kodeInstansi: string;
  namaInstansi: string;
  tanggalUlangTahun: Timestamp;
  statusKementrian: "STG Prioritas" | "Non Prioritas";
  jenisLayanan: string;
  tanggalUpdateTerakhir: Timestamp;
  internalPicId: string;
}

export interface User {
  id: string; // Corresponds to Firebase Auth User UID
  nama: string;
  email: string;
  noHp: string;
  role: "Admin" | "GA" | "BA" | "Viewer";
  handledInstansiIds?: string[]; // Used in form, not in DB directly
}

export interface PicEksternal {
  id: string;
  namaPic: string;
  instansiId: string;
  jabatan: string;
  noHp: string;
  email: string;
}

export interface KontrakPks {
  id: string;
  instansiId: string;
  nomorKontrakPeruri: string;
  nomorKontrakKl: string;
  judulKontrak: string;
  tanggalMulai: Date;
  tanggalBerakhir: Date;
  picGaId: string;
  ruangLingkup: string;
  keterangan: string;
  statusKontrak: "Aktif" | "Berakhir";
  linkDokumen?: string;
}
export interface KontrakPksFromDB extends Omit<KontrakPks, 'tanggalMulai' | 'tanggalBerakhir'> {
  tanggalMulai: Timestamp;
  tanggalBerakhir: Timestamp;
}


export interface KontrakMou {
    id: string;
    instansiId: string;
    nomorMouPeruri: string;
    isiMou: string;
    tanggalMulai: Date;
    tanggalBerakhir: Date;
    picGaId: string;
    ruangLingkup: string;
    keterangan: string;
}
export interface KontrakMouFromDB extends Omit<KontrakMou, 'tanggalMulai' | 'tanggalBerakhir'> {
  tanggalMulai: Timestamp;
  tanggalBerakhir: Timestamp;
}

export interface DokumenSph {
    id: string;
    instansiId: string;
    nomorSuratPeruri: string;
    tanggal: Date;
    perihal: string;
    linkDokumen?: string;
}
export interface DokumenSphFromDB extends Omit<DokumenSph, 'tanggal'> {
    tanggal: Timestamp;
}

export interface StatusPekerjaan {
    id: string;
    instansiId: string;
    kontrakId?: string; // Optional: To link to a specific contract
    tanggalUpdate: Date;
    tanggalEvent: Date; // New field for the event date
    judulUpdate: string;
    deskripsi: string;
    linkMom?: string;
    // Fields from AI classification
    type?: string;
    subject?: string;
}
export interface StatusPekerjaanFromDB extends Omit<StatusPekerjaan, 'tanggalUpdate' | 'tanggalEvent'> {
    tanggalUpdate: Timestamp;
    tanggalEvent: Timestamp;
}

// For timeline aggregation
export type TimelineEvent = {
  instansiId: string;
  kontrakId?: string;
  date: Date;
  type: 'PKS' | 'MoU' | 'SPH' | 'Update';
  title: string;
  description: string;
  icon: LucideIcon;
};