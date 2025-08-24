# K/L Monitor - Database Schema (Firestore)

This document outlines the proposed database schema for the K/L Monitor application, designed for a NoSQL database like Cloud Firestore. The structure is based on the data types defined in the application.

## Collections

### 1. `users`

This collection stores information about internal users of the application. The document ID should correspond to the Firebase Authentication User UID.

- **Document ID**: `auth_uid`
- **Fields**:
  - `nama`: `string` (e.g., "Genta Anugrah")
  - `email`: `string` (e.g., "genta@peruri.co.id")
  - `noHp`: `string` (e.g., "081234567891")
  - `role`: `string` ("Admin", "GA", "BA", "Viewer")

---

### 2. `instansi`

This collection stores data for each Ministry/Institution (K/L).

- **Document ID**: `auto-generated`
- **Fields**:
  - `kodeInstansi`: `string` (e.g., "KEMENKEU")
  - `namaInstansi`: `string` (e.g., "Kementerian Keuangan")
  - `tanggalUlangTahun`: `timestamp` | `null`
  - `statusKementrian`: `string` ("STG Prioritas", "Non Prioritas")
  - `jenisLayanan`: `string` (e.g., "Digital Seal")
  - `tanggalUpdateTerakhir`: `timestamp`
  - `internalPicId`: `string` (Reference to a document ID in the `users` collection)

---

### 3. `picEksternal`

Stores contact information for external PICs from the institutions.

- **Document ID**: `auto-generated`
- **Fields**:
  - `namaPic`: `string` (e.g., "Budi Santoso")
  - `instansiId`: `string` (Reference to a document ID in the `instansi` collection)
  - `jabatan`: `string` (e.g., "Kepala Divisi IT")
  - `noHp`: `string` (e.g., "081122334455")
  - `email`: `string` (e.g., "budi.s@kemenkeu.go.id")

---

### 4. `kontrakPks`

Stores details for PKS (Perjanjian Kerja Sama) contracts.

- **Document ID**: `auto-generated`
- **Fields**:
  - `instansiId`: `string` (Reference to a document ID in the `instansi` collection)
  - `nomorKontrakPeruri`: `string`
  - `nomorKontrakKl`: `string`
  - `judulKontrak`: `string`
  - `nominal`: `number` (e.g., 50000000)
  - `tanggalMulai`: `timestamp`
  - `tanggalBerakhir`: `timestamp`
  - `picGaId`: `string` (Reference to a document ID in the `users` collection)
  - `ruangLingkup`: `string`
  - `keterangan`: `string`
  - `statusKontrak`: `string` ("Aktif", "Berakhir") - This is calculated on the client-side and not stored in DB.
  - `linkDokumen`: `string` (Optional URL to the document)

---

### 5. `kontrakMou`

Stores details for MoU (Memorandum of Understanding) contracts.

- **Document ID**: `auto-generated`
- **Fields**:
  - `instansiId`: `string` (Reference to a document ID in the `instansi` collection)
  - `nomorMouPeruri`: `string`
  - `nomorMouKl`: `string`
  - `isiMou`: `string`
  - `tanggalMulai`: `timestamp`
  - `tanggalBerakhir`: `timestamp`
  - `picGaId`: `string` (Reference to a document ID in the `users` collection)
  - `ruangLingkup`: `string`
  - `keterangan`: `string`
  - `statusKontrak`: `string` ("Aktif", "Berakhir") - This is calculated on the client-side and not stored in DB.
  - `linkDokumen`: `string` (Optional URL to the document)

---

### 6. `dokumenSph`

Stores details for SPH (Surat Penawaran Harga) documents.

- **Document ID**: `auto-generated`
- **Fields**:
  - `instansiId`: `string` (Reference to a document ID in the `instansi` collection)
  - `nomorSuratPeruri`: `string`
  - `tanggal`: `timestamp`
  - `perihal`: `string`
  - `linkDokumen`: `string` (Optional URL to the document)

---

### 7. `statusPekerjaan`

Stores work status updates for each institution.

- **Document ID**: `auto-generated`
- **Fields**:
  - `instansiId`: `string` (Reference to a document ID in the `instansi` collection)
  - `kontrakId`: `string` (Optional, reference to a document in `kontrakPks` or `kontrakMou`)
  - `tanggalUpdate`: `timestamp` (When the update was saved to the system)
  - `tanggalEvent`: `timestamp` (When the actual event happened)
  - `judulUpdate`: `string`
  - `deskripsi`: `string`
  - `linkMom`: `string` (Optional URL to Meeting Minutes)
  - `type`: `string` (Optional, from AI classification)
  - `subject`: `string` (Optional, from AI classification)
