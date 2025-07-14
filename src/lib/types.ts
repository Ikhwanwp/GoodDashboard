import type { LucideIcon } from "lucide-react";

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

export interface User {
  id: string; // Corresponds to Firebase Auth User UID
  nama: string;
  email: string;
  noHp: string;
  role: "Admin" | "PIC GA" | "Viewer";
  handledInstansiIds?: string[];
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

export interface DokumenSph {
    id: string;
    instansiId: string;
    nomorSuratPeruri: string;
    tanggal: Date;
    perihal: string;
    linkDokumen?: string;
}

export interface StatusPekerjaan {
    id: string;
    instansiId: string;
    tanggalUpdate: Date;
    judulUpdate: string;
    deskripsi: string;
    linkMom?: string;
    // Fields from AI classification
    type?: string;
    subject?: string;
}

// For timeline aggregation
export type TimelineEvent = {
  instansiId: string;
  date: Date;
  type: 'PKS' | 'MoU' | 'SPH' | 'Update';
  title: string;
  description: string;
  icon: LucideIcon;
};
