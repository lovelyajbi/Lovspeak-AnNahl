# LovSpeak

Frontend LovSpeak ini tetap memakai alur lama:

- user lama tetap bisa masuk
- kode aktivasi manual tetap ada
- pembeli non-Scalev tetap bisa aktivasi manual

Tambahan baru yang aman:

- jika ada data akses Scalev yang valid di Firestore, user otomatis aktif tanpa input kode aktivasi

## Cara Kerja Yang Dipakai

Project ini tidak perlu dipaksa menerima webhook langsung.

Yang paling aman:

1. Webhook Scalev diterima oleh backend yang memang sudah hidup dan terbukti berjalan.
2. Backend itu menulis record akses ke Firestore collection `scalevWebhookAccess`.
3. LovSpeak membaca collection itu saat user login.
4. Jika email cocok dan SKU valid, user langsung lolos ke halaman API key.
5. Jika tidak ada record valid, flow lama tetap berjalan.

## SKU Yang Diizinkan

LovSpeak hanya auto-aktif untuk SKU berikut:

`LovspeakAks`

Checkout URL yang boleh diperlakukan sebagai LovSpeak fallback:

`https://lovelya-edu.myscalev.com/lovspeakcop`

## Data Yang Harus Ditulis Backend ke Firestore

Collection:

`scalevWebhookAccess`

Field minimal per dokumen:

```json
{
  "email": "user@gmail.com",
  "emailNormalized": "user@gmail.com",
  "status": "paid",
  "active": true,
  "sku": "LovspeakAks",
  "orderId": "ORDER123",
  "sourceUrl": "https://lovelya-edu.myscalev.com/lovspeakcop",
  "createdAt": "2026-07-10T00:00:00.000Z",
  "updatedAt": "2026-07-10T00:00:00.000Z"
}
```

Field yang dibaca app:

- `emailNormalized`
- `status`
- `active`
- `sku`
- `sourceUrl`

## Rule Akses

User auto-aktif jika:

- email login Google = `emailNormalized`
- dan `active = true` atau `status` termasuk `paid/active/completed/success/confirmed`
- dan `sku = LovspeakAks`

Fallback:

- jika `sku` kosong, `sourceUrl` akan dicek
- jika `sourceUrl = https://lovelya-edu.myscalev.com/lovspeakcop`, akses tetap dianggap valid

## Setting Yang Wajib di Luar Repo Ini

Repo ini hanya butuh hasil akhir di Firestore.

Yang harus Anda siapkan di backend/webhook luar:

1. terima webhook Scalev
2. cek event `payment.received`
3. cek `payment_status = paid`
4. cek SKU `LovspeakAks`
5. tulis dokumen ke `scalevWebhookAccess`

## Firebase

Frontend Firebase config ada di:

`firebase-applet-config.json`

Jadi env Vercel frontend Firebase tidak wajib dipakai oleh repo ini.

Yang penting untuk backend webhook luar:

- backend webhook harus punya akses tulis ke Firestore

## Run Locally

1. `npm install`
2. `npm run dev`
