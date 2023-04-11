# Lazy Kindler
<br>

<!-- ![cooltext400798739959192](https://user-images.githubusercontent.com/16133390/147348820-9db84863-9431-4e67-814c-f1e1ddde8372.png) -->

<img src="./header.svg" width="800" height="400" alt="Click to see the source">

# ✨ Fitur

- 🌈 Impor buku dan tampilkan daftar buku dengan efisien.

- 💅 Buat koleksi, seperti koleksi novel fiksi ilmiah atau novel seni bela diri.

- 🚀 Tampilan multi-dimensi, menunjukkan daftar buku berdasarkan judul, penulis, peringkat, koleksi, tag, dll.

- 🛡 Cari buku menggunakan kata kunci apa pun, seperti judul, penulis atau penerbit.

- 📦 Unduh buku-buku tersebut melalui menu konteks klik kanan atau dengan mengunduh semua buku yang dikelola oleh platform ini.

- 🛡 Membaca Buku. Platform ini mendukung fitur membaca buku.

- 📦 Fungsi cadangan. Platform ini menggunakan `sqlite3` untuk database dan menyimpan semua buku dalam direktori tertentu sehingga mudah dicadangkan.

- 🎻 Impor catatan sorot otomatis saat menghubungkan komputer ke `kindle`.

- 📣 Impor catatan sorot dari aplikasi Android `静 读 天下 apk` (Jing Du Tian Xia).

- 🎺 Catatan Sorotan Mendukung 'sorot sekunder' dan 'penghapusan sorot sekunder' untuk catatan yang diimpor

.-🥁 Tambahkan komentar pada catatan sorot Anda

.-🎻 Buat koleksi untuk catatan sorot Anda dan kelola secara kategorikal

.-🚀 Kindle Vocabulary Builder. Platform ini mendukung impor dari kindle vocabulary builder.

# Platform Yang Didukung

Saat ini hanya disesuaikan untuk platform `mac`, mungkin ada kesalahan yang tidak diketahui saat dijalankan pada platform `windows`.

# Format eBook Yang Didukung

mobi dan azw3. Jenis eBook lainnya akan secara otomatis diabaikan selama impor.

# Masalah yang Dipecahkan

Setelah mengunduh **ribuan** buku dari internet, bagaimana cara mengelolanya dengan efisien?

<br />

Kualitas berbagai buku bervariasi sangat, beberapa ditulis oleh penulis biasa dan yang lain oleh penulis terkenal dunia. Ada juga banyak genre yang berbeda, seperti fiksi ilmiah, roman, fantasi, dan banyak lagi.

<br />

Jika Anda harus mencari buku dalam direktori yang berisi ribuan buku setiap kali, itu menyebabkan sakit kepala. Oleh karena itu perlu untuk mengelola eBook ini dengan cara yang tepat sehingga kita dapat mencari buku dalam rentang lebih kecil berdasarkan preferensi tertentu , menemukan buku yang diinginkan dengan cepat ,dan menghindari membuang terlalu banyak waktu untuk pencarian.

<br />

`lazykindler` lahir untuk tujuan ini.


# Pengenalan Fitur

## 1. Impor Buku

Klik tombol `Unggah Berkas`, dan platform akan secara rekursif memindai file eBook yang didukung di direktori seperti `~/Download`, `~/下载`, `~/Desktop`, `~/桌面`, dll. File duplikat tidak akan diunggah lagi.

<br />

Saat ini, hanya format `mobi` dan `azw3` yang didukung untuk impor, dan platform tidak menyediakan fitur konversi format eBook. Mudah untuk menemukan buku dalam format tertentu; Saya biasanya menemukannya di situs web ini: http://www.fast8.com. Keuntungan dari situs ini adalah bahwa ia menawarkan berbagai pilihan buku, dan opsi format ganda tersedia saat mengunduh. Cukup unduh buku dalam format yang diinginkan.

## 2. Tambahkan Metadata ke Buku

Anda dapat mengubah peringkat, tag, koleksi, penulis, penerbit, dan sampul buku. Perlu dicatat bahwa operasi ini sebenarnya tidak akan memodifikasi file buku itu sendiri tetapi akan menambahkan catatan ke database.

## 3. Parsing Informasi Buku

Setelah mengimpor eBook, platform secara otomatis akan mengekstrak data dari file eBook untuk tampilan informasi dan pengelolaan buku.

## 4. Koleksi

Anda dapat membuat koleksi buku seperti "Koleksi Fiksi Ilmiah", "Koleksi Novel Fantasi", "Koleksi Novel Romantis", dll.Tambahkan sampul representatif ke koleksi yang Anda sukai,dan Anda dapat `menilai` dan `menambahkan tag` ke koleksi. Setiap koleksi dapat memiliki buku yang dipilih dan ditambahkan dari perpustakaan, dan Anda juga dapat menilai, menambahkan tag, dan menambahkan sampul ke koleksi tersebut. Setelah Anda memiliki beberapa koleksi, Anda dapat mencari buku langsung dari koleksi ini di masa depan.

## 5. Tampilan

Untuk mendukung tampilan buku dari berbagai dimensi, Anda dapat `menilai` dan `menambahkan tag` pada buku serta `mengubah penulis`dan `mengubah penerbit`. Buku bisa ditampilkan dari berbagai dimensi seperti 'peringkat', 'tag', 'penulis',dan 'penerbit'. Selain itu, Anda bisa mengubah sampul bukunya.

## 6. Unduh

Buku dalam platform dapat diunduh dengan mengklik tombol "Unduh" di bagian "Operasi" kartu buku. Buku yang telah didownload akan disimpan di direktori pengguna di bawah direktori "Download" atau "下载". Mengklik "Unduh Semua Buku" pada halaman utama akan mengunduh semua buku ke folder "Documents" atau "文稿"di bawah direktori "lazykindler" di direktori pengguna.Mengklik “Unduh Semua Buku” beberapa kali tidak akan mengunduh ulangbuku yang sudah ada.

## 7. Membaca

Platform menyediakan fungsi dasar untuk membaca buku.Saat ini saya belum menemukan perpustakaan untuk melaksanakan membaca format ‘mobi’ and ‘azw3’ menggunakan reactjs’. Oleh karena itu, ketika mengklik tombol "Baca Buku" untuk pertama kalinya, platform akan mengonversi dua format tersebut ke format 'epub'. Alat yang digunakan untuk konversi adalah '/Applications/calibre.app/Contents/MacOS/ebook-convert', sehingga komputer harus memiliki `calibre` terinstal agar fungsi membaca buku dapat berjalan dengan baik. Konversi hanya diperlukan saat pertama kali mengklik "Baca Buku". Halaman mungkin menjadi tidak responsif untuk jangka waktu singkat, yang normal saja. Waktu tunggu tergantung pada ukuran eBook, tetapi biasanya cepat. Buku yang dikonversi disimpan di direktori `backend/data` dari platform utama.

<br />

## 8. Alur Kerja Pengolahan

Buku-buku yang ditampilkan di halaman `Books -> Library` adalah buku-buku resmi yang disimpan, sedangkan buku-buku baru yang diimpor ditampilkan di halaman `Books -> Temporary`. (Selain perbedaan lokasi halaman, tidak banyak perbedaan antara buku resmi dan sementara di backend).

<br />

Setelah sebuah buku sementara ditambahkan ke koleksi apa pun, maka akan dipindahkan dari `Books -> Temporary` ke `Books -> Library`. Tujuannya adalah untuk **membedakan antara buku yang disimpan secara resmi dan buku impor sementara. Buku yang disimpan secara resmi telah difilter, dibuang bagian tak diperlukan, dan dikategorikan, sedangkan buku impor sementara cenderung beragam.**

## 9. Cadangan

Database yang digunakan adalah `sqlite3`, terletak di `backend/lazykindler.db`.

<br />

Ketika platform diluncurkan pertama kali, file database akan otomatis dibuat dan diinisialisasi. File ini berisi semua informasi data dalam platform kecuali untuk buku-bukunya sendiri. Buku-buku impor dicopy ke direktori `backend/data`. Perlu diperhatikan bahwa agar operasional internal platform lebih mudah dilakukan, nama-nama file pada direktori tersebut akan ditambahi dengan nilai md5 dari masing-masing judulnya.

<br />

Untuk melakukan backup seluruh data termasuk semua bukunya dalam platform ini cukup menyimpan file-file tersebut yaitu: 'backend/lazykindler.db' and 'backend/data'. Untuk memulai layanan di lokasi lain di waktu berikutnya, cukup copy 'backend/lazykindler.db' dan 'backend/data' ke posisi yang sesuai.

## 10. Impor Sorotan Kindle

Fitur ini saat ini hanya didukung pada platform Mac.

<br />

Platform akan secara otomatis mendeteksi apakah `kindle` terhubung. Ketika `kindle` terhubung ke komputer, platform akan mengimpor file `My Clippings.txt` dari `kindle` untuk pengelolaan seragam dan tampilan multidimensi. Ketika file `My Clippings.txt` milik kindle berubah, platform akan secara otomatis mengimpor konten baru yang ditambahkan dalam file tersebut, dan data lama tidak akan diimpor lagi. Pengguna dapat melihat konten baru dengan menyegarkan halaman setelah menghubungkan kindlenya ke komputer.

<br />

Perlu diperhatikan bahwa kindle memproses catatan sorotan yang ditambahkan oleh pengguna menjadi seutas teks tanpa jeda baris, bahkan jika itu adalah isi beberapa paragraf. lazykindler cerdik dalam mengenali dan memproses jeda baris ketika mengimpor file My Clippings.txt milik kindle seperti yang ditunjukkan di bawah ini.

<img src="https://user-images.githubusercontent.com/16133390/210229975-4e7145e7-5d91-4aff-85ff-f5550fd7fe2c.png" width="66%">

## 11. Melakukan Sorotan Sekunder pada Catatan Sorot

Catatan sorot adalah bagian dari teks atau paragraf terkait yang kita soroti dan rekam saat membaca buku, seringkali karena kalimat atau kata di dalamnya memiliki dampak tertentu pada kita. Setelah mengimpor catatan sorotan ke platform, perlu untuk menyoroti kembali kalimat atau kata yang beresonansi dengan Anda saat proses pengurutan selanjutnya, sehingga lebih mudah untuk menyoroti dan menampilkan bagian kecil teks tersebut yang beresonansi dengan Anda.

<br />

Dengan menggunakan `lazykindler`, Anda dapat dengan mudah melakukan sorotan sekunder. Cukup pilih teks yang relevan dan klik `OK` pada kotak dialog yang muncul secara otomatis.

<img src="https://user-images.githubusercontent.com/16133390/210230077-c9a4532b-aafc-4ba2-a163-cd151c98d831.png" width="66%">

## 12. Tambahkan komentar pada catatan yang di-highlight

Anda dapat merekam beberapa pemikiran tentang teks yang beresonansi dengan Anda.

<img width="1379" alt="Xnip2023-02-05_15-19-18" src="https://user-images.githubusercontent.com/16133390/216806787-4b76a541-608d-4e8e-9d8e-2651bf7842ef.png">

## 13. Impor highlight dari aplikasi Jingdu Tianxia apk

`Jingdu Tianxia apk` adalah pembaca populer di platform Android. Saat ini saya menggunakan perangkat lunak ini untuk membaca buku pada Hisense e-reader, dan perangkat lunak juga mendukung menambahkan catatan yang di-highlight. Jadi saya menambahkan dukungan untuk mengimpor catatan yang di-highlight dari perangkat lunak ini.

<br />

Format file catatan yang di-highlight diekspor dari `Jingdu Tianxia apk` adalah `.mrexpt`. Letakkan file ini dalam direktori apa pun seperti `~/Download`, `~/下载`, `~/Desktop`, `~/桌面`, dll., Dan platform dapat secara otomatis menyelesaikan operasi impor.

## 14. Impor Kindle Vocabulary Builder

Vocabulary Builder adalah fitur dalam Kindle yang mencatat kata-kata atau frasa-frasa saat membaca buku. Metode ini dapat digunakan untuk membaca buku asli bahasa Inggris dan mencatat kata-kata, yang dapat digunakan untuk belajar dan mempelajari kembali kata-kata tersebut nanti. Platform mendukung impor kosakata tersebut.

Berdasarkan impor kosakata tersebut, platform menyediakan antarmuka yang baik untuk menampilkan informasi ini, dan Anda dapat membuat kosakata dan contoh secara manual, serta menambahkan terjemahan ke contoh.

<img width="1322" alt="Xnip2023-03-31_23-23-41" src="https://user-images.githubusercontent.com/16133390/229163528-952ee43f-bf31-43a7-b39b-98d637e584da.png">

<img width="1320" alt="Xnip2023-03-31_23-23-57" src="https://user-images.githubusercontent.com/16133390/229163550-8c321a41-7df4-41af-9bd0-fd765e113a1f.png">

# Persyaratan Sistem

`python 3.10.4`

`nodejs v19.6.0`

`Calibre`

Versi lain belum diuji

# Mulai Layanan

## Instal Dependensi

1. Jalankan di direktori `backend`

```

pip3 install -r requirements.txt

```

2. Jalankan di direktori `frontend`

```

yarn install

```

## Memulai Layanan

```

./start.sh

```

Kemudian kunjungi http://localhost:8000 di browser Anda.

## Menghentikan Layanan

```

./stop.sh

```

## Catatan

Platform ini dirancang untuk individu dan tidak memiliki fitur seperti login dan registrasi.

# Showcase Platform

Berikut adalah tangkapan layar dari pengaturan lokal saya setelah mengunggah buku dan mengonfigurasi koleksi.

<img width="1418" alt="1" src="https://user-images.githubusercontent.com/16133390/216806475-97ee4960-40cc-4649-b414-0687724bb6ad.png">
<br />
<img width="1398" alt="Xnip2023-02-05_15-13-49" src="https://user-images.githubusercontent.com/16133390/216806612-dc1baf4f-7ed5-4b3d-ab44-73c7f07c73a7.png">
<br />
<img width="1418" alt="2" src="https://user-images.githubusercontent.com/16133390/216806480-def76f45-f8ba-41fc-9512-a448e9fbce32.png">
<br />
<img width="1418" alt="3" src="https://user-images.githubusercontent.com/16133390/216806485-caf74fe2-0cef-45f8-9a29-47780e72132d.png">
<br />
<img width="1799" alt="Xnip2023-02-14_12-36-20" src="https://user-images.githubusercontent.com/16133390/218640667-ba74048a-3b78-41c6-a772-dc1e56485b56.png">

<br />
<img width="1801" alt="Xnip2023-02-14_12-36-38" src="https://user-images.githubusercontent.com/16133390/218640680-263195c2-7ac3-4947-b7a5-b70375074e9c.png">

<br />

# Lainnya

Alat yang paling terkenal untuk `kindle` seharusnya adalah `calibre`, tetapi fungsionalitas perangkat lunak ini lebih difokuskan pada "pengeditan", dan tampilan multi-dimensi dari ebook relatif sederhana. Oleh karena itu, saya berencana menulis alat khusus untuk mengelola ebook yang memenuhi kebutuhan praktis.

Saat ini, saya sedang mengembangkan alat ini di waktu luang saya. Jika Anda juga suka membaca ebook dan memiliki saran fitur pengelolaan ebook, jangan ragu untuk mengajukan masalah.

Jika Anda memiliki masalah atau permintaan fitur, silakan hubungi penulis melalui email: wupengcn301@gmail.com, WeChat: leowucn. Terima kasih.
