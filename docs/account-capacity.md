# Batas akun LovSpeak

LovSpeak menggunakan server-side seat gate untuk membatasi jumlah akun yang
boleh mengakses aplikasi.

- Set Vercel Environment Variable **`LOVSPEAK_MAX_ACCOUNTS`** menjadi `15` pada
  environment yang dipakai deployment. Nilai default di kode juga `15` sebagai
  pengaman, tetapi variable ini sebaiknya tetap disimpan di Vercel.
- Saat pertama kali endpoint gate dipanggil setelah deploy, semua akun Firebase
  Auth yang sudah ada otomatis dicatat sebagai seat. Dengan begitu enam akun
  lama, termasuk akun admin master, tetap memiliki akses dan ikut dihitung.
- Akun baru hanya mendapat seat melalui transaksi server atomik. Admin tidak
  dapat menambah seat dari dashboard atau dari browser.
- Jika seat habis, login ditolak dengan pesan umum tanpa menampilkan angka
  kapasitas. Untuk menambah kapasitas, ubah variable di Vercel lalu redeploy.

Deploy juga harus menyertakan `firestore.rules` terbaru. Rules tersebut
mewajibkan adanya dokumen seat untuk membaca atau menulis data user; dokumen
`accessSeats` hanya dapat ditulis oleh Firebase Admin SDK dari endpoint server.
