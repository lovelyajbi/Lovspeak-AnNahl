# Integrasi Backend Scalev untuk LovSpeak

Dokumen ini menjelaskan bagian yang belum ada di repo frontend LovSpeak:

- menerima webhook Scalev
- memfilter pembeli LovSpeak
- menulis akses ke Firestore

Frontend LovSpeak di repo ini sudah siap membaca hasil akhirnya dari Firestore.

## Tujuan

Jika pembeli dari Scalev membeli SKU:

`LovspeakAks`

maka user bisa login ke LovSpeak tanpa input kode aktivasi manual.

Jika user bukan dari Scalev atau email pembelian tidak sama dengan email Google login, flow lama tetap dipakai.

## Yang Sudah Siap di Frontend

Frontend LovSpeak akan menganggap user aktif jika ada dokumen valid di:

`scalevWebhookAccess`

dengan field:

- `emailNormalized`
- `status`
- `active`
- `sku`
- `sourceUrl`

## Yang Perlu Dilakukan di Backend

Backend webhook yang sudah hidup perlu:

1. menerima payload Scalev apa adanya
2. membaca field dari payload
3. cek apakah ini pembelian LovSpeak
4. jika valid, tulis ke Firestore

## Mapping Payload Scalev

Field yang dipakai dari payload:

- `event`
- `data.payment_status`
- `data.customer.email`
- `data.order_id`
- `data.sku` atau `data.product_sku` atau `data.productSku`
- `data.metadata.event_source_url`
- `data.created_at`
- `data.last_updated_at`
- `data.paid_time`

## Rule Validasi LovSpeak

Anggap user berhak auto-akses jika:

1. `event === "payment.received"`
2. `data.payment_status === "paid"`
3. dan salah satu:
   - `sku === "LovspeakAks"`
   - atau fallback `event_source_url === "https://lovelya-edu.myscalev.com/lovspeakcop"`

## Dokumen Firestore yang Harus Ditulis

Collection:

`scalevWebhookAccess`

Contoh data:

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
  "updatedAt": "2026-07-10T00:00:00.000Z",
  "paidTime": "2026-07-10T00:10:00.000Z"
}
```

## Catatan Penting

- email login Google user harus sama dengan `data.customer.email`
- jika tidak sama, auto-akses tidak akan jalan
- manual activation code tetap tersedia
- user lama tetap aman

## Alur Singkat

1. User beli di Scalev.
2. Scalev kirim webhook ke backend yang sudah hidup.
3. Backend cek SKU/status.
4. Backend tulis data ke `scalevWebhookAccess`.
5. User login ke LovSpeak.
6. LovSpeak baca Firestore dan langsung auto-aktif.
