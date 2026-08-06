# Standalone Scalev Webhook for LovSpeak

Folder ini adalah backend webhook terpisah yang bisa Anda deploy sebagai project Vercel baru.

## Fungsi

Menerima webhook Scalev, lalu menulis akses pembeli LovSpeak ke Firestore collection:

`scalevWebhookAccess`

## Env Vercel yang Wajib

- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `SCALEV_SIGNING_SECRET`
- `SCALEV_ALLOWED_SKUS`

Opsional:

- `SCALEV_LOVSPEAK_SOURCE_URLS`

## Nilai yang Disarankan

`SCALEV_ALLOWED_SKUS`

```txt
LovspeakAks
```

`SCALEV_LOVSPEAK_SOURCE_URLS`

```txt
https://lovelya-edu.myscalev.com/lovspeakcop
```

## Cara Deploy di Vercel

1. Buat project Vercel baru
2. Hubungkan ke repo yang sama
3. Saat diminta `Root Directory`, pilih:

```txt
standalone-scalev-webhook
```

4. Tambahkan env yang wajib
5. Deploy

## URL Webhook

Setelah deploy, pakai URL:

```txt
https://DOMAIN-ANDA/api/webhooks/scalev?key=SCALEV_SIGNING_SECRET_ANDA
```

Contoh:

```txt
https://lovspeak-hook.vercel.app/api/webhooks/scalev?key=SECRET_ANDA
```

## Test Cepat

Buka:

```txt
https://DOMAIN-ANDA/api/webhooks/scalev
```

Jika benar, akan muncul respons JSON `ok: true`.

Kalau endpoint ini sudah hidup, baru masukkan URL tersebut ke Scalev.
