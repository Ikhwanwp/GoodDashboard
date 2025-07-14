import type { Instansi, User, KontrakPks, KontrakMou, StatusPekerjaan, DokumenSph } from './types';
import { add, sub } from 'date-fns';

const now = new Date();

export const mockUsers: User[] = [
  { id: 'user-1', nama: 'Admin Peruri', email: 'admin@peruri.co.id', noHp: '081234567890', role: 'Admin' },
  { id: 'user-2', nama: 'Genta Anugrah', email: 'genta@peruri.co.id', noHp: '081234567891', role: 'PIC GA' },
  { id: 'user-3', nama: 'Viewer 1', email: 'viewer@peruri.co.id', noHp: '081234567892', role: 'Viewer' },
];

export const mockInstansi: Instansi[] = [
  { id: 'inst-1', kodeInstansi: 'KEMENKEU', namaInstansi: 'Kementerian Keuangan', tanggalUlangTahun: new Date('2024-10-29'), statusKementrian: 'STG Prioritas', jenisLayanan: 'Digital Seal', tanggalUpdateTerakhir: sub(now, { days: 5 }), internalPicId: 'user-2' },
  { id: 'inst-2', kodeInstansi: 'BI', namaInstansi: 'Bank Indonesia', tanggalUlangTahun: new Date('2024-07-01'), statusKementrian: 'Non Prioritas', jenisLayanan: 'Printing', tanggalUpdateTerakhir: sub(now, { days: 2 }), internalPicId: 'user-2' },
  { id: 'inst-3', kodeInstansi: 'KOMINFO', namaInstansi: 'Kementerian Komunikasi dan Informatika', tanggalUlangTahun: add(now, { days: 25 }), statusKementrian: 'STG Prioritas', jenisLayanan: 'Digital Certificate', tanggalUpdateTerakhir: sub(now, { days: 10 }), internalPicId: 'user-2' },
];

export const mockKontrakPks: KontrakPks[] = [
  { id: 'pks-1', instansiId: 'inst-1', nomorKontrakPeruri: 'PKS/001/2023', nomorKontrakKl: 'KL/XYZ/001', judulKontrak: 'Penyediaan Meterai Elektronik', tanggalMulai: sub(now, { months: 6 }), tanggalBerakhir: add(now, { days: 88 }), picGaId: 'user-2', ruangLingkup: 'Meterai Elektronik', keterangan: 'Kontrak tahunan', statusKontrak: 'Aktif' },
  { id: 'pks-2', instansiId: 'inst-2', nomorKontrakPeruri: 'PKS/002/2023', nomorKontrakKl: 'KL/ABC/002', judulKontrak: 'Cetak Uang Kertas', tanggalMulai: sub(now, { years: 1 }), tanggalBerakhir: add(now, { days: 240 }), picGaId: 'user-2', ruangLingkup: 'Cetak Uang', keterangan: 'Multi-year', statusKontrak: 'Aktif' },
  { id: 'pks-3', instansiId: 'inst-3', nomorKontrakPeruri: 'PKS/003/2022', nomorKontrakKl: 'KL/DEF/003', judulKontrak: 'Pengembangan Aplikasi Satu Sehat', tanggalMulai: sub(now, { years: 2 }), tanggalBerakhir: sub(now, { days: 30 }), picGaId: 'user-2', ruangLingkup: 'IT Development', keterangan: '-', statusKontrak: 'Berakhir' },
];

export const mockKontrakMou: KontrakMou[] = [
    { id: 'mou-1', instansiId: 'inst-1', nomorMouPeruri: 'MOU/01/2022', isiMou: 'Kerja Sama Strategis Sektor Keuangan', tanggalMulai: sub(now, { years: 2 }), tanggalBerakhir: add(now, { days: 55 }), picGaId: 'user-2', ruangLingkup: 'Keuangan Digital', keterangan: 'Akan diperpanjang' },
    { id: 'mou-2', instansiId: 'inst-3', nomorMouPeruri: 'MOU/02/2023', isiMou: 'Kerja Sama Keamanan Siber', tanggalMulai: sub(now, { months: 8 }), tanggalBerakhir: add(now, { days: 28 }), picGaId: 'user-2', ruangLingkup: 'Cyber Security', keterangan: 'Potensi PKS baru' },
];

export const mockDokumenSph: DokumenSph[] = [
    { id: 'sph-1', instansiId: 'inst-2', nomorSuratPeruri: 'SPH/001/VI/2024', tanggal: sub(now, {days: 15}), perihal: 'Penawaran Harga Cetak Dokumen Negara', linkDokumen: '#' },
    { id: 'sph-2', instansiId: 'inst-1', nomorSuratPeruri: 'SPH/002/VI/2024', tanggal: sub(now, {days: 20}), perihal: 'Penawaran Solusi Digital Signature', linkDokumen: '#' },
];


export const mockStatusPekerjaan: StatusPekerjaan[] = [
  { id: 'stat-1', instansiId: 'inst-1', tanggalUpdate: sub(now, { days: 5 }), judulUpdate: 'Kick-off Meeting Integrasi API', deskripsi: 'Meeting awal dengan tim teknis Kemenkeu untuk membahas alur integrasi API Digital Seal.', linkMom: '#' },
  { id: 'stat-2', instansiId: 'inst-2', tanggalUpdate: sub(now, { days: 2 }), judulUpdate: 'Pengiriman Proof of Concept', deskripsi: 'Sample cetakan pertama telah dikirimkan ke Bank Indonesia untuk proses review.', type: "Project Update", subject: "Proof of Concept Delivery" },
  { id: 'stat-3', instansiId: 'inst-1', tanggalUpdate: sub(now, { days: 12 }), judulUpdate: 'Follow Up Penawaran', deskripsi: 'Follow up via email terkait penawaran solusi digital signature yang telah dikirim.', type: "Sales Activity", subject: "Offer Follow-up" },
  { id: 'stat-4', instansiId: 'inst-3', tanggalUpdate: sub(now, { days: 10 }), judulUpdate: 'UAT Phase 1', deskripsi: 'User Acceptance Testing untuk modul pendaftaran selesai dilaksanakan.', linkMom: '#' },
];
