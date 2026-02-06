// src/lib/export-utils.ts
import * as XLSX from 'xlsx';
import { Instansi, KontrakPks, KontrakMou, DokumenSph, StatusPekerjaan, PicEksternal, User } from './types';
import { format } from 'date-fns';

// A helper to format date or return 'N/A'
const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'N/A';
    try {
        return format(date, 'dd/MM/yyyy');
    } catch {
        return 'Invalid Date';
    }
}

type ExportData = {
    instansi: Instansi[];
    users: User[];
    kontrakPks: KontrakPks[];
    kontrakMou: KontrakMou[];
    dokumenSph: DokumenSph[];
    statusPekerjaan: StatusPekerjaan[];
    picEksternal: PicEksternal[];
}

export const exportToExcel = ({
    instansi,
    users,
    kontrakPks,
    kontrakMou,
    dokumenSph,
    statusPekerjaan,
    picEksternal
}: ExportData) => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Instansi
    const instansiData = instansi.map(i => ({
        "Kode Instansi": i.kodeInstansi,
        "Nama Instansi": i.namaInstansi,
        "Pejabat Terkait": i.pejabatTerkait || 'N/A',
        "Tanggal Ulang Tahun": formatDate(i.tanggalUlangTahun),
        "Status Kementrian": i.statusKementrian,
        "Jenis Layanan": i.jenisLayanan,
        "PIC Internal": users.find(u => u.id === i.internalPicId)?.nama || 'N/A',
        "Update Terakhir": formatDate(i.tanggalUpdateTerakhir),
    }));
    const wsInstansi = XLSX.utils.json_to_sheet(instansiData);
    wsInstansi['!cols'] = [{ wch: 15 }, { wch: 40 }, { wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsInstansi, 'Daftar Instansi');

    // Sheet 2: Kontrak PKS
    const pksData = kontrakPks.map(k => ({
        "Kode Instansi": instansi.find(i => i.id === k.instansiId)?.kodeInstansi || 'N/A',
        "Nomor Kontrak Peruri": k.nomorKontrakPeruri,
        "Nomor Kontrak K/L": k.nomorKontrakKl,
        "Judul Kontrak": k.judulKontrak,
        "Nominal": k.nominal,
        "Tanggal Mulai": formatDate(k.tanggalMulai),
        "Tanggal Berakhir": formatDate(k.tanggalBerakhir),
        "Status": k.statusKontrak,
        "PIC GA": users.find(u => u.id === k.picGaId)?.nama || 'N/A',
        "Ruang Lingkup": k.ruangLingkup,
        "Link Dokumen": k.linkDokumen,
    }));
    const wsPks = XLSX.utils.json_to_sheet(pksData);
    wsPks['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 25 }, { wch: 40 }, { wch: 30 }];
    pksData.forEach((_row, index) => {
        const cellRef = XLSX.utils.encode_cell({c: 4, r: index + 1});
        if (wsPks[cellRef]) {
            wsPks[cellRef].t = 'n';
            wsPks[cellRef].z = '"Rp"#,##0';
        }
    });
    XLSX.utils.book_append_sheet(wb, wsPks, 'Kontrak PKS');

    // Sheet 3: Kontrak MoU
    const mouData = kontrakMou.map(m => ({
        "Kode Instansi": instansi.find(i => i.id === m.instansiId)?.kodeInstansi || 'N/A',
        "Nomor MoU Peruri": m.nomorMouPeruri,
        "Nomor MoU K/L": m.nomorMouKl,
        "Tentang MoU": m.isiMou,
        "Tanggal Mulai": formatDate(m.tanggalMulai),
        "Tanggal Berakhir": formatDate(m.tanggalBerakhir),
        "Status": m.statusKontrak,
        "PIC GA": users.find(u => u.id === m.picGaId)?.nama || 'N/A',
        "Ruang Lingkup": m.ruangLingkup,
        "Link Dokumen": m.linkDokumen,
    }));
    const wsMou = XLSX.utils.json_to_sheet(mouData);
    wsMou['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 25 }, { wch: 40 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, wsMou, 'Kontrak MoU');

    // Sheet 4: Dokumen SPH
    const sphData = dokumenSph.map(s => ({
         "Kode Instansi": instansi.find(i => i.id === s.instansiId)?.kodeInstansi || 'N/A',
         "Nomor Surat Peruri": s.nomorSuratPeruri,
         "Perihal": s.perihal,
         "Tanggal SPH": formatDate(s.tanggal),
         "Link Dokumen": s.linkDokumen
    }));
    const wsSph = XLSX.utils.json_to_sheet(sphData);
    wsSph['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 40 }, { wch: 15 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, wsSph, 'Dokumen SPH');

    // Sheet 5: Status Pekerjaan
    const statusData = statusPekerjaan.map(s => ({
         "Kode Instansi": instansi.find(i => i.id === s.instansiId)?.kodeInstansi || 'N/A',
         "Tanggal Event": formatDate(s.tanggalEvent),
         "Judul Update": s.judulUpdate,
         "Deskripsi": s.deskripsi,
         "Tanggal Input": formatDate(s.tanggalUpdate),
         "Link MoM": s.linkMom
    }));
    const wsStatus = XLSX.utils.json_to_sheet(statusData);
    wsStatus['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 50 }, { wch: 15 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, wsStatus, 'Status Pekerjaan');

    // Sheet 6: PIC Eksternal
    const picEksternalData = picEksternal.map(p => ({
         "Kode Instansi": instansi.find(i => i.id === p.instansiId)?.kodeInstansi || 'N/A',
         "Nama PIC": p.namaPic,
         "Jabatan": p.jabatan,
         "Email": p.email,
         "No. HP": p.noHp
    }));
    const wsPic = XLSX.utils.json_to_sheet(picEksternalData);
    wsPic['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 30 }, { wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsPic, 'PIC Eksternal');
    
    // --- Write and Download ---
    const fileName = `Export_Govtech_Dashboard_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(wb, fileName);
}
