function prosesUploadPdf(event) {
    var file = event.target.files[0]; if (!file) { pdfBase64 = null; return; }
    if (file.type !== "application/pdf") { event.target.value = ''; return showAlert('Error', 'Hanya file PDF yang diizinkan!', 'error'); }
    if (file.size > 300 * 1024) { event.target.value = ''; return showAlert('Error', 'Ukuran file terlalu besar! Maksimal 300KB.', 'error'); }
    var reader = new FileReader(); reader.onload = function (e) { pdfBase64 = e.target.result; var n = document.getElementById('sw-pdf-name'); if (n) { n.innerText = file.name + " (Siap disave)"; n.classList.remove('hidden'); } }; reader.readAsDataURL(file);
}

function downloadTemplateCSV(modul) {
    var header = modul === 'guru' ? "NIP,Nama Lengkap,Password,Tempat Lahir,Tanggal Lahir (YYYY-MM-DD),Jenis Kelamin,Pangkat Golongan,Status Pegawai,TMT,Jabatan Utama,Mata Pelajaran,No HP,Email\n" : "NIP,Nama Lengkap,Password,Tempat Lahir,Tanggal Lahir (YYYY-MM-DD),Jenis Kelamin,Pangkat Golongan,Status Pegawai,TMT,Jabatan Khusus,Bagian,No HP,Email\n";
    var sample = modul === 'guru' ? "19800101,Budi Santoso,guru123,Jakarta,1980-01-01,Laki-Laki,III/b,PNS,2010-07-01,Wali Kelas,Matematika,08123456789,guru@email.com\n" : "19900202,Siti Aminah,tu123,Bandung,1990-02-02,Perempuan,II/c,Honorer Daerah,2015-01-01,Staf,Administrasi,08123456789,tu@email.com\n";
    var csvContent = "data:text/csv;charset=utf-8," + header + sample; var encodedUri = encodeURI(csvContent); var link = document.createElement("a"); link.setAttribute("href", encodedUri); link.setAttribute("download", "template_" + modul + ".csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

function prosesImportCSV(event, modul) {
    var file = event.target.files[0]; if (!file) return;
    showAlert({ title: 'Upload Data ' + modul.toUpperCase() + '?', text: "Pastikan format file sesuai template CSV.", icon: 'info', showCancelButton: true, confirmButtonText: 'Ya, Import!' }).then((result) => {
        if (result.isConfirmed) {
            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('loader-text').innerHTML = "Mengimpor Data CSV...<br><span class='text-xs font-normal mt-2'>Ini mungkin memakan waktu beberapa detik.</span>";
                document.getElementById('loader').style.display = 'flex'; startTimer();
                callAPI('importCSV', { token: curToken, modul: modul, csvData: e.target.result }).then(function (res) {
                    document.getElementById('loader').style.display = 'none'; stopTimer(); event.target.value = '';
                    if (res.status === 'success') { showAlert('Import Berhasil', res.message, 'success'); refreshHalamanLunak(); } else { showAlert('Gagal Import', res.message, 'error'); }
                }).catch(function (err) { document.getElementById('loader').style.display = 'none'; stopTimer(); event.target.value = ''; showAlert('Error', err.toString(), 'error'); });
            }; reader.readAsText(file);
        } else { event.target.value = ''; }
    });
}

function ubahTipeGaleri() { var val = document.getElementById('gl-kategori').value; if (val === 'Video') { document.getElementById('wrap-gl-foto').style.display = 'none'; document.getElementById('file-gl-foto').value = ''; document.getElementById('wrap-gl-video').style.display = 'block'; } else { document.getElementById('wrap-gl-foto').style.display = 'block'; document.getElementById('wrap-gl-video').style.display = 'none'; document.getElementById('gl-video').value = ''; } }

function ubahTipeGaleriPegawai() { var val = document.getElementById('pg-kategori').value; if (val === 'Video') { document.getElementById('wrap-pg-foto').style.display = 'none'; document.getElementById('file-pg-foto').value = ''; document.getElementById('wrap-pg-video').style.display = 'block'; } else { document.getElementById('wrap-pg-foto').style.display = 'block'; document.getElementById('wrap-pg-video').style.display = 'none'; document.getElementById('pg-video').value = ''; } }

// ===== Bug Fix: Fungsi hitung total siswa otomatis =====
function hitungTotalSiswa() {
    var l = parseInt(document.getElementById('sw-l').value) || 0;
    var p = parseInt(document.getElementById('sw-p').value) || 0;
    document.getElementById('sw-jumlah').value = l + p;
}

function batalEditSemua() { var m = ['berita', 'guru', 'tu', 'siswa', 'galeri', 'slider', 'eksternal']; for (var i = 0; i < m.length; i++) batalEdit(m[i]); }

function batalEdit(modul) {
    editDataId[modul] = null; var btnU = document.getElementById('btn-' + modul); var btnB = document.getElementById('btn-batal-' + modul);
    if (btnU) { btnU.innerHTML = '<i class="fas fa-save mr-2"></i> Simpan Data'; btnU.className = "px-8 py-3 text-white rounded-xl font-bold shadow-lg w-full md:w-auto " + (modul === 'guru' ? 'bg-green-600 hover:bg-green-700' : modul === 'tu' ? 'bg-teal-600 hover:bg-teal-700' : modul === 'siswa' ? 'bg-orange-600 hover:bg-orange-700' : modul === 'slider' ? 'bg-pink-600 hover:bg-pink-700' : modul === 'galeri' ? 'bg-purple-600 hover:bg-purple-700' : modul === 'eksternal' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-blue-600 hover:bg-blue-700'); }
    if (btnB) btnB.classList.add('hidden');
    var inps = document.querySelectorAll('#modal-' + modul + ' input, #modal-' + modul + ' textarea, #modal-' + modul + ' select');
    for (var i = 0; i < inps.length; i++) { if (inps[i].type !== 'file') inps[i].value = ''; }
    var imgP = document.getElementById('prev-' + modul); if (imgP) { imgP.classList.add('hidden'); imgP.src = ''; }
    cropData[modul] = null;
    if (modul === 'galeri') { var gk = document.getElementById('gl-kategori'); if (gk) { gk.value = 'Foto'; ubahTipeGaleri(); } }
    if (modul === 'berita' && typeof quillEditor !== 'undefined' && quillEditor) { quillEditor.root.innerHTML = ''; document.getElementById('b-kategori').value = 'Berita'; var bTgl = document.getElementById('b-tanggal'); if (bTgl) bTgl.value = ''; }
    if (modul === 'siswa') { pdfBase64 = null; var pdfl = document.getElementById('sw-pdf-link'); if (pdfl) pdfl.classList.add('hidden'); var pdfn = document.getElementById('sw-pdf-name'); if (pdfn) pdfn.classList.add('hidden'); var pdfi = document.getElementById('sw-pdf'); if (pdfi) pdfi.value = ''; }
    // Reset readonly NIP saat batalEdit
    if (modul === 'guru') { var nipG = document.getElementById('g-nip'); if (nipG) { nipG.readOnly = false; nipG.classList.remove('bg-gray-100','cursor-not-allowed'); } }
    if (modul === 'tu') { var nipT = document.getElementById('tu-nip'); if (nipT) { nipT.readOnly = false; nipT.classList.remove('bg-gray-100','cursor-not-allowed'); } }
}

function siapkanEdit(modul, id) {
    batalEdit(modul); editDataId[modul] = id; var dt = null; for (var i = 0; i < dbGlobal[modul].length; i++) { if (dbGlobal[modul][i].id == id) { dt = dbGlobal[modul][i]; break; } } if (!dt) return;
    if (modul === 'berita') {
        document.getElementById('b-judul').value = dt.judul;
        quillEditor.root.innerHTML = dt.konten || '';
        document.getElementById('b-kategori').value = (((dt.kategori || '').toString().toLowerCase() === 'pengumuman') ? 'Pengumuman' : 'Berita');
        var bTgl = document.getElementById('b-tanggal');
        if (bTgl && dt.tanggal) {
            // datetime-local butuh format: YYYY-MM-DDTHH:MM
            try {
                var dObj = new Date(dt.tanggal);
                if (!isNaN(dObj.getTime())) {
                    // Sesuaikan ke waktu lokal
                    dObj.setMinutes(dObj.getMinutes() - dObj.getTimezoneOffset());
                    bTgl.value = dObj.toISOString().slice(0, 16);
                } else {
                    // Fallback: coba langsung isi jika sudah berformat YYYY-MM-DDTHH:MM
                    bTgl.value = dt.tanggal.toString().slice(0, 16);
                }
            } catch(e) { bTgl.value = dt.tanggal.toString().slice(0, 16); }
        }
    }

    if (modul === 'siswa') { document.getElementById('sw-kategori').value = dt.kategori; document.getElementById('sw-label').value = dt.label; document.getElementById('sw-l').value = dt.jumlah_l || 0; document.getElementById('sw-p').value = dt.jumlah_p || 0; document.getElementById('sw-jumlah').value = dt.jumlah; pdfBase64 = null; document.getElementById('sw-pdf').value = ''; var pdfl = document.getElementById('sw-pdf-link'); var pdfn = document.getElementById('sw-pdf-name'); if (pdfn) pdfn.classList.add('hidden'); if (dt.dokumen_url) { pdfl.href = dt.dokumen_url; pdfl.classList.remove('hidden'); } else { pdfl.classList.add('hidden'); } }
    if (modul === 'slider') { document.getElementById('sl-judul').value = dt.judul; document.getElementById('sl-sub').value = dt.subjudul; }
    if (modul === 'eksternal') { document.getElementById('ex-nama').value = dt.nama; document.getElementById('ex-url').value = dt.url; }
    if (modul === 'galeri') { document.getElementById('gl-judul').value = dt.judul; document.getElementById('gl-deskripsi').value = dt.deskripsi || ''; var kateg = dt.kategori || 'Foto'; document.getElementById('gl-kategori').value = kateg; ubahTipeGaleri(); if (kateg === 'Video') document.getElementById('gl-video').value = dt.video_url || ''; }
    if (modul === 'guru') { document.getElementById('g-nip').value = dt.nip || ''; document.getElementById('g-nama').value = dt.nama || ''; document.getElementById('g-pass').value = ''; document.getElementById('g-jk').value = dt.jk || ''; document.getElementById('g-tempat_lahir').value = dt.tempat_lahir || ''; document.getElementById('g-tgl_lahir').value = formatTanggal(dt.tanggal_lahir); document.getElementById('g-golongan').value = dt.pangkat_gol || ''; document.getElementById('g-status').value = dt.status_pegawai || ''; document.getElementById('g-tmt').value = formatTanggal(dt.tmt_pgw); document.getElementById('g-jabatan').value = dt.jabatan || ''; document.getElementById('g-mapel').value = dt.mapel || ''; document.getElementById('g-no_hp').value = dt.no_hp || ''; document.getElementById('g-email').value = dt.email || ''; var nipG = document.getElementById('g-nip'); if (nipG) { nipG.readOnly = true; nipG.classList.add('bg-gray-100','cursor-not-allowed'); } }
    if (modul === 'tu') { document.getElementById('tu-nip').value = dt.nip || ''; document.getElementById('tu-nama').value = dt.nama || ''; document.getElementById('tu-pass').value = ''; document.getElementById('tu-jk').value = dt.jk || ''; document.getElementById('tu-tempat_lahir').value = dt.tempat_lahir || ''; document.getElementById('tu-tgl_lahir').value = formatTanggal(dt.tanggal_lahir); document.getElementById('tu-golongan').value = dt.pangkat_gol || ''; document.getElementById('tu-status').value = dt.status_pegawai || ''; document.getElementById('tu-tmt').value = formatTanggal(dt.tmt_pgw); document.getElementById('tu-jabatan').value = dt.jabatan || ''; document.getElementById('tu-bagian').value = dt.bagian || ''; document.getElementById('tu-no_hp').value = dt.no_hp || ''; document.getElementById('tu-email').value = dt.email || ''; var nipT = document.getElementById('tu-nip'); if (nipT) { nipT.readOnly = true; nipT.classList.add('bg-gray-100','cursor-not-allowed'); } }

    var imgUrl = dt.gambar_url || dt.foto_url || dt.icon_url;
    var img2 = document.getElementById('prev-' + modul);
    if (img2 && imgUrl) { img2.src = getValidImg(imgUrl, ''); img2.classList.remove('hidden'); }

    var btnU = document.getElementById('btn-' + modul); var btnB = document.getElementById('btn-batal-' + modul);
    if (btnU) { btnU.innerHTML = '<i class="fas fa-sync mr-2"></i> Update Data'; btnU.className = "px-8 py-3 bg-yellow-500 text-gray-900 rounded-xl font-bold shadow-lg hover:bg-yellow-400 w-full md:w-auto"; }
    if (btnB) btnB.classList.remove('hidden');
    
    // Buka modal yang relevan secara otomatis
    var modalMap = { 'berita': 'modal-berita', 'guru': 'modal-guru', 'tu': 'modal-tu', 'siswa': 'modal-siswa', 'galeri': 'modal-galeri', 'slider': 'modal-slider', 'eksternal': 'modal-eksternal' };
    if (modalMap[modul]) bukaModal(modalMap[modul]);
}

function gagalSimpan(err) { document.getElementById('loader').style.display = 'none'; stopTimer(); showAlert('Sistem Sibuk', err.toString(), 'error'); }

function resetPasswordPegawai(modul, id) {
    showAlert({
        title: 'Reset Password?',
        html: 'Password <b>' + (modul === 'guru' ? 'Guru' : 'TU') + '</b> ini akan direset ke <b>123456</b>.<br>Pegawai <b>wajib mengganti</b> password baru saat login berikutnya.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f59e0b',
        cancelButtonColor: '#6b7280',
        confirmButtonText: '<i class="fas fa-key mr-1"></i> Ya, Reset!',
        cancelButtonText: 'Batal'
    }).then(function(result) {
        if (result.isConfirmed) {
            document.getElementById('loader-text').innerText = 'Mereset password...'; document.getElementById('loader').style.display = 'flex'; startTimer();
            callAPI('resetPasswordPegawai', { token: curToken, modul: modul, id: id }).then(function(res) {
                document.getElementById('loader').style.display = 'none'; stopTimer();
                if (res.status === 'success') {
                    showAlert({ title: '\u2705 Password Direset!', text: 'Password pegawai telah diset ke 123456. Pegawai wajib ganti saat login.', icon: 'success', timer: 2500, showConfirmButton: false });
                } else { showAlert('Gagal', res.message, 'error'); }
            }).catch(gagalSimpan);
        }
    });
}


async function simpanAtauUpdate(modul) {
    var d = {}; var base64 = cropData[modul]; var isEdit = editDataId[modul] !== null;
    if (modul === 'berita') {
        var inputTgl = document.getElementById('b-tanggal').value;
        if (!inputTgl && !isEdit) {
            // Berita BARU tanpa tanggal → pakai waktu sekarang
            var now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            inputTgl = now.toISOString().slice(0, 16);
        }
        // Saat EDIT: jika tanggal kosong (tidak diisi user), jangan kirim
        // agar GAS mempertahankan tanggal lama dari spreadsheet
        if (inputTgl) d.tanggal = inputTgl;

        // PERBAIKAN: Hanya set nama penulis jika sedang membuat berita BARU
        if (!isEdit) { d.penulis = curNama; }

        d.judul = document.getElementById('b-judul').value;
        // ... baris lainnya tetap sama
        d.konten = quillEditor.root.innerHTML;
        if (d.konten === '<p><br></p>') d.konten = '';
        d.kategori = document.getElementById('b-kategori').value;
        if (!d.judul || !d.konten) return showAlert('Peringatan', 'Isi judul & konten berita!', 'warning');
        if (!isEdit && !base64) return showAlert('Peringatan', 'Silakan Crop gambar utama!', 'warning');
    }
    else if (modul === 'siswa') { d.kategori = document.getElementById('sw-kategori').value; d.label = document.getElementById('sw-label').value; d.jumlah_l = document.getElementById('sw-l').value || 0; d.jumlah_p = document.getElementById('sw-p').value || 0; d.jumlah = document.getElementById('sw-jumlah').value || 0; if (!d.label || !d.jumlah) return showAlert('Peringatan', 'Isi data label dan jumlah!', 'warning'); base64 = pdfBase64; }
    else if (modul === 'slider') { d.judul = document.getElementById('sl-judul').value; d.subjudul = document.getElementById('sl-sub').value; if (!isEdit && !base64) return showAlert('Peringatan', 'Crop banner terlebih dahulu!', 'warning'); }
    else if (modul === 'eksternal') { d.nama = document.getElementById('ex-nama').value; d.url = document.getElementById('ex-url').value; if (!d.nama || !d.url) return showAlert('Peringatan', 'Isi nama dan link URL!', 'warning'); if (!isEdit && !base64) return showAlert('Peringatan', 'Upload dan Crop Ikon/Logo!', 'warning'); }
    else if (modul === 'galeri') { d.kategori = document.getElementById('gl-kategori').value; d.judul = document.getElementById('gl-judul').value; d.deskripsi = document.getElementById('gl-deskripsi').value; d.video_url = document.getElementById('gl-video').value; if (!d.judul) return showAlert('Peringatan', 'Isi Judul!', 'warning'); if (d.kategori === 'Foto' && !isEdit && !base64) return showAlert('Peringatan', 'Silakan Crop foto!', 'warning'); if (d.kategori === 'Video' && !d.video_url) return showAlert('Peringatan', 'Isi link Youtube!', 'warning'); d.uploader = 'Admin'; }
    else if (modul === 'guru') { d.nip = document.getElementById('g-nip').value; d.nama = document.getElementById('g-nama').value; d.password = document.getElementById('g-pass').value; d.jk = document.getElementById('g-jk').value; d.tempat_lahir = document.getElementById('g-tempat_lahir').value; d.tanggal_lahir = document.getElementById('g-tgl_lahir').value; d.pangkat_gol = document.getElementById('g-golongan').value; d.status_pegawai = document.getElementById('g-status').value; d.tmt_pgw = document.getElementById('g-tmt').value; d.jabatan = document.getElementById('g-jabatan').value; d.mapel = document.getElementById('g-mapel').value; d.no_hp = document.getElementById('g-no_hp').value; d.email = document.getElementById('g-email').value; if (!d.nip || !d.nama) return showAlert('Peringatan', 'NIP dan Nama wajib diisi!', 'warning'); if (!isEdit && !d.password) return showAlert('Peringatan', 'Password wajib diisi!', 'warning'); }
    else if (modul === 'tu') { d.nip = document.getElementById('tu-nip').value; d.nama = document.getElementById('tu-nama').value; d.password = document.getElementById('tu-pass').value; d.jk = document.getElementById('tu-jk').value; d.tempat_lahir = document.getElementById('tu-tempat_lahir').value; d.tanggal_lahir = document.getElementById('tu-tgl_lahir').value; d.pangkat_gol = document.getElementById('tu-golongan').value; d.status_pegawai = document.getElementById('tu-status').value; d.tmt_pgw = document.getElementById('tu-tmt').value; d.jabatan = document.getElementById('tu-jabatan').value; d.bagian = document.getElementById('tu-bagian').value; d.no_hp = document.getElementById('tu-no_hp').value; d.email = document.getElementById('tu-email').value; if (!d.nip || !d.nama) return showAlert('Peringatan', 'NIP dan Nama wajib diisi!', 'warning'); if (!isEdit && !d.password) return showAlert('Peringatan', 'Password wajib diisi!', 'warning'); }

    document.getElementById('loader-text').innerText = isEdit ? 'Menyimpan Perubahan...' : 'Mengunggah & Menyimpan...'; document.getElementById('loader').style.display = 'flex'; startTimer();

    try {
        if (base64 && modul !== 'siswa') {
            if (modul === 'guru' || modul === 'tu') {
                // Simpan base64 langsung ke spreadsheet (tidak ke Drive)
                // karena Drive URL sudah tidak bisa di-embed dari luar
                document.getElementById('loader-text').innerText = 'Menyimpan foto pegawai...';
                d.foto_url = base64;
                base64 = null; // Pastikan base64Data=null agar GAS tidak upload ke Drive
            } else if (modul === 'berita' || modul === 'galeri' || modul === 'slider' || modul === 'eksternal') {
                document.getElementById('loader-text').innerText = 'Mengunggah Gambar ke Cloudinary...';
                var imgUrl = await uploadKeCloudinary(base64);
                d.gambar_url = imgUrl;
                d.foto_url = imgUrl;
                d.icon_url = imgUrl;
                base64 = null;
            } else {
                document.getElementById('loader-text').innerText = 'Menyimpan gambar...';
                d.gambar_url = base64;
                d.foto_url = base64;
                d.icon_url = base64;
            }
        }
        if (modul === 'berita') {
            document.getElementById('loader-text').innerText = 'Membangun HTML Statis & Menyimpan ke GitHub...';
        }
    } catch (e) { return gagalSimpan(e.message); }

    var payload = { token: curToken, modul: modul, dataBaru: d, base64Data: base64, filename: modul + (modul === 'siswa' ? '.pdf' : '.jpg') };
    if (isEdit) { payload.id = editDataId[modul]; callAPI('updateData', payload).then(selesaiSimpan).catch(gagalSimpan); }
    else { callAPI('simpanData', payload).then(selesaiSimpan).catch(gagalSimpan); }
}

async function simpanGaleriPegawai() {
    var d = {};
    var base64 = cropData['galeri'];
    d.kategori = document.getElementById('pg-kategori').value;
    d.judul = document.getElementById('pg-judul').value;
    d.deskripsi = document.getElementById('pg-deskripsi').value;
    d.video_url = document.getElementById('pg-video').value;

    if (!d.judul) return showAlert('Peringatan', 'Isi Judul kegiatan!', 'warning');
    if (d.kategori === 'Foto' && !base64) return showAlert('Peringatan', 'Silakan Crop foto terlebih dahulu!', 'warning');
    if (d.kategori === 'Video' && !d.video_url) return showAlert('Peringatan', 'Isi link Youtube!', 'warning');

    d.uploader = curNama;
    var tgl = new Date();
    d.tanggal = ('0' + tgl.getDate()).slice(-2) + '/' + ('0' + (tgl.getMonth() + 1)).slice(-2) + '/' + tgl.getFullYear();

    document.getElementById('loader-text').innerText = 'Mengunggah ke Galeri Publik...';
    document.getElementById('loader').style.display = 'flex'; startTimer();

    try {
        if (base64 && d.kategori === 'Foto') {
            document.getElementById('loader-text').innerText = 'Mengunggah Gambar ke Cloudinary...';
            d.gambar_url = await uploadKeCloudinary(base64);
            base64 = null;
        }
    } catch (e) { return gagalSimpan(e.message); }

    var payload = { token: curToken, modul: 'galeri', dataBaru: d, base64Data: base64, filename: 'galeri_pegawai.jpg' };
    callAPI('simpanData', payload).then(function (res) {
        document.getElementById('loader').style.display = 'none'; stopTimer();
        if (res.status === 'success') {
            showAlert('Berhasil!', 'Postingan Anda telah tayang di Galeri Publik.', 'success');
            document.getElementById('pg-judul').value = '';
            document.getElementById('pg-deskripsi').value = '';
            document.getElementById('pg-video').value = '';
            var img = document.getElementById('prev-pg-galeri'); if (img) { img.src = ''; img.classList.add('hidden'); }
            cropData['galeri'] = null;
            refreshHalamanLunak();
        } else {
            showAlert('Gagal Menyimpan', res.message, 'error');
        }
    }).catch(gagalSimpan);
}

async function simpanDataDiriPegawai() {
    var d = {}; d.nama = document.getElementById('pegawai-nama').value; d.tempat_lahir = document.getElementById('pegawai-tempat-lahir').value; d.tanggal_lahir = document.getElementById('pegawai-tgl-lahir').value; d.jk = document.getElementById('pegawai-jk').value; d.pangkat_gol = document.getElementById('pegawai-golongan').value; d.status_pegawai = document.getElementById('pegawai-status').value; d.tmt_pgw = document.getElementById('pegawai-tmt').value; d.jabatan = document.getElementById('pegawai-jabatan').value; d.no_hp = document.getElementById('pegawai-no_hp').value; d.email = document.getElementById('pegawai-email').value;
    if (curRole === 'guru') d.mapel = document.getElementById('pegawai-tugas').value; else d.bagian = document.getElementById('pegawai-tugas').value;
    if (!d.nama) return showAlert('Peringatan', 'Nama wajib diisi!', 'warning');

    var base64 = cropData['pegawai_foto'];
    document.getElementById('loader-text').innerText = 'Menyimpan Biodata...'; document.getElementById('loader').style.display = 'flex'; startTimer();
    try {
        if (base64) {
            // Simpan foto langsung sebagai base64 (tidak ke Drive)
            document.getElementById('loader-text').innerText = 'Menyimpan foto profil...';
            d.foto_url = base64;
            base64 = null; // null agar GAS tidak panggil uploadKeDrive
        }
    } catch (e) { return gagalSimpan(e.message); }
    callAPI('simpanProfilPegawai', { token: curToken, modul: curRole, id: curUserId, dataBaru: d, base64Data: base64, filename: 'foto_' + curUsername + '.jpg' }).then(selesaiSimpan).catch(gagalSimpan);
}

function hapusData(modul, id) {
    showAlert({ title: 'Yakin hapus data permanen?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280', confirmButtonText: 'Ya, Hapus!' }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('loader-text').innerText = 'Menghapus...'; document.getElementById('loader').style.display = 'flex'; startTimer();
            callAPI('hapusData', { token: curToken, modul: modul, id: id }).then(selesaiSimpan).catch(gagalSimpan);
        }
    });
}

async function simpanPengaturanLengkap() {
    var getInp = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
    try {
        var setObj = { 'nama_sekolah': getInp('set-nama'), 'alamat': getInp('set-alamat'), 'deskripsi': getInp('set-deskripsi'), 'npsn': getInp('set-npsn'), 'nss': getInp('set-nss'), 'status_jenjang': getInp('set-status'), 'akreditasi': getInp('set-akreditasi'), 'tahun_berdiri': getInp('set-tahun'), 'sejarah': getInp('set-sejarah'), 'visi_misi': getInp('set-visimisi'), 'sarpras': getInp('set-sarpras'), 'privasi': getInp('set-privasi'), 'syarat': getInp('set-syarat'), 'domain_resmi': getInp('set-domain'), 'kepsek_nama': getInp('set-kepsek-nama'), 'kepsek_sambutan': getInp('set-kepsek-sambutan'), 'teks_berjalan': getInp('set-teks-berjalan'), 'maps_url': getInp('set-maps') };
        document.getElementById('loader-text').innerText = 'Menyimpan Profil Web...'; document.getElementById('loader').style.display = 'flex'; startTimer();

        // Logo & Kepsek: base64 langsung di spreadsheet (ukuran kecil, aman)
        if (cropData.logo)   { document.getElementById('loader-text').innerText = 'Menyimpan Logo...';        setObj.logo_url   = cropData.logo; }
        if (cropData.kepsek) { document.getElementById('loader-text').innerText = 'Menyimpan Foto Kepsek...'; setObj.kepsek_foto = cropData.kepsek; }

        // Struktur organisasi: upload ke Cloudinary (bebas ukuran, resolusi tinggi)
        if (cropData.struktur) {
            document.getElementById('loader-text').innerText = 'Mengunggah Bagan Struktur ke Cloudinary...';
            var strUrl = await uploadKeCloudinary(cropData.struktur);
            setObj.struktur_url = strUrl;
        }

        // Semua base64 sudah dimasukkan ke setObj, kirim null untuk parameter lama
        callAPI('simpanPengaturan', { token: curToken, setObj: setObj, base64Logo: null, namaFileLogo: null, base64Str: null, namaFileStr: null, base64Kepsek: null, namaFileKepsek: null }).then(selesaiSimpan).catch(gagalSimpan);

    } catch (e) { showAlert('Error System', e.message, 'error'); document.getElementById('loader').style.display = 'none'; stopTimer(); }
}


function simpanPengaturanWidget() {
    var getInp = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
    try {
        var widObj = { 'yt_url': getInp('wid-yt'), 'fb_plugin': getInp('wid-fb-plugin'), 'cal_url': getInp('wid-cal'), 'wa': getInp('wid-wa'), 'email': getInp('wid-email'), 'ig': getInp('wid-ig'), 'fb': getInp('wid-fb'), 'link_ppdb': getInp('wid-ppdb'), 'link_dinas': getInp('wid-dinas'), 'link_dapodik': getInp('wid-dapodik') };
        document.getElementById('loader-text').innerText = 'Menyimpan Widget...'; document.getElementById('loader').style.display = 'flex'; startTimer();
        callAPI('simpanWidget', { token: curToken, setObj: widObj }).then(selesaiSimpan).catch(gagalSimpan);
    } catch (e) { showAlert('Error System', e.message, 'error'); document.getElementById('loader').style.display = 'none'; stopTimer(); }
}

function selesaiSimpan(res) {
    document.getElementById('loader').style.display = 'none'; stopTimer();
    if (res.status === 'success') {
        // Tutup semua modal yang mungkin terbuka setelah simpan/update berhasil
        var semuaModal = ['modal-berita', 'modal-guru', 'modal-tu', 'modal-siswa', 'modal-galeri', 'modal-slider', 'modal-eksternal'];
        for (var mi = 0; mi < semuaModal.length; mi++) {
            var mEl = document.getElementById(semuaModal[mi]);
            if (mEl && !mEl.classList.contains('hidden')) { tutupModal(semuaModal[mi]); }
        }
        batalEditSemua();
        showAlert({ title: 'Berhasil!', text: res.message || 'Data telah tersimpan.', icon: 'success', timer: 2000, showConfirmButton: false });
        refreshHalamanLunak();
    } else { showAlert('Gagal Menyimpan', res.message, 'error'); }
}

function siapkanFormPegawai() {
    // Tampilkan panel berita JIKA hak akses guru diizinkan
    var akses = sessionStorage.getItem('edupro_akses_berita');
    var menuDesktop = document.getElementById('menu-berita-pegawai');
    var menuMobile = document.getElementById('menu-berita-pegawai-mob');

    if (curRole === 'guru' && (akses === 'Y' || akses === 'Aktif')) {
        if (menuDesktop) menuDesktop.classList.remove('hidden');
        if (menuMobile) menuMobile.classList.remove('hidden');

        var menuBotPegawai = document.getElementById('btn-bot-berita-pegawai');
        if (menuBotPegawai) menuBotPegawai.classList.remove('hidden');

        if (!quillPegawaiBerita && typeof Quill !== 'undefined') {
            quillPegawaiBerita = new Quill('#pg-b-konten', { theme: 'snow', placeholder: 'Ketik isi...', modules: { toolbar: [[{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'image', 'video'], ['clean']] } });
        }
    } else {
        if (menuDesktop) menuDesktop.classList.add('hidden');
        if (menuMobile) menuMobile.classList.add('hidden');
        if (menuBotPegawai) menuBotPegawai.classList.add('hidden');
    }

    // (Kode lama pengisian form profil tetap berjalan di bawah ini)
    var dt = null; var dbP = dbGlobal[curRole] || [];
    for (var i = 0; i < dbP.length; i++) { if (dbP[i].id == curUserId) { dt = dbP[i]; break; } }
    if (!dt) return;

    document.getElementById('pegawai-nip').value = dt.nip || curUsername;
    document.getElementById('pegawai-nama').value = dt.nama || '';
    document.getElementById('pegawai-tempat-lahir').value = dt.tempat_lahir || '';
    document.getElementById('pegawai-tgl-lahir').value = formatTanggal(dt.tanggal_lahir);
    document.getElementById('pegawai-jk').value = dt.jk || '';
    document.getElementById('pegawai-golongan').value = dt.pangkat_gol || '';
    document.getElementById('pegawai-status').value = dt.status_pegawai || '';
    document.getElementById('pegawai-tmt').value = formatTanggal(dt.tmt_pgw);
    document.getElementById('pegawai-jabatan').value = dt.jabatan || '';
    document.getElementById('pegawai-no_hp').value = dt.no_hp || '';
    document.getElementById('pegawai-email').value = dt.email || '';

    if (curRole === 'guru') {
        document.getElementById('lbl-pegawai-tugas').innerText = 'Mata Pelajaran';
        document.getElementById('pegawai-tugas').value = dt.mapel || '';
    } else {
        document.getElementById('lbl-pegawai-tugas').innerText = 'Bagian / Divisi';
        document.getElementById('pegawai-tugas').value = dt.bagian || '';
    }

    var img = document.getElementById('prev-pegawai-foto');
    if (dt.foto_url) {
        img.src = getValidImg(dt.foto_url, '');
        img.classList.remove('hidden');
    }
}

function ubahAksesBerita(idGuru, statusBaru) {
    showAlert({ title: 'Ubah Akses?', text: "Anda akan merubah hak akses pembuat berita untuk guru ini.", icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, Ubah' }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('loader-text').innerText = 'Menyimpan Izin...'; document.getElementById('loader').style.display = 'flex'; startTimer();
            callAPI('updateData', { token: curToken, modul: 'guru', id: idGuru, dataBaru: { akses_berita: statusBaru } }).then(selesaiSimpan).catch(gagalSimpan);
        }
    });
}
async function simpanBeritaPegawai() {
    var editId = document.getElementById('pg-b-edit-id') ? document.getElementById('pg-b-edit-id').value : '';
    var d = {};
    d.judul = document.getElementById('pg-b-judul').value;
    d.konten = quillPegawaiBerita.root.innerHTML;
    if (d.konten === '<p><br></p>') d.konten = '';
    d.kategori = document.getElementById('pg-b-kategori').value;

    // Setting Waktu Otomatis
    var inputTgl = document.getElementById('pg-b-tanggal').value;
    if (!inputTgl) {
        var now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        inputTgl = now.toISOString().slice(0, 16);
    }
    d.tanggal = inputTgl;
    d.penulis = curNama;

    var base64 = cropData['berita_guru'];

    if (!d.judul || !d.konten) return showAlert('Peringatan', 'Isi judul & konten berita!', 'warning');
    // Gambar wajib hanya saat tambah baru
    if (!editId && !base64) return showAlert('Peringatan', 'Silakan Crop gambar utama terlebih dahulu!', 'warning');

    // Saat edit tanpa gambar baru, gunakan gambar lama
    if (editId && !base64) {
        var lama = (dbGlobal.berita || []).find(function(x) { return x.id == editId; });
        if (!lama) return showAlert('Error', 'Data berita tidak ditemukan di lokal. Coba refresh.', 'error');
        if (lama.gambar_url) d.gambar_url = lama.gambar_url;
    }

    document.getElementById('loader-text').innerText = editId ? 'Menyimpan Perubahan...' : 'Menyimpan Postingan...';
    document.getElementById('loader').style.display = 'flex'; startTimer();

    try {
        if (base64) {
            document.getElementById('loader-text').innerText = 'Mengunggah Gambar ke Cloudinary...';
            d.gambar_url = await uploadKeCloudinary(base64);
            base64 = null;
        }
        document.getElementById('loader-text').innerText = 'Membangun HTML Statis & Menyimpan ke GitHub...';
    } catch(e) { return gagalSimpan(e.message); }

    var action = editId ? 'updateData' : 'simpanData';
    var payload = editId
        ? { token: curToken, modul: 'berita', id: editId, dataUpdate: d }
        : { token: curToken, modul: 'berita', dataBaru: d, base64Data: null, filename: 'berita_guru.jpg' };

    callAPI(action, payload).then(function (res) {
        if (res.status === 'success') {
            batalEditBeritaPegawai();
        }
        selesaiSimpan(res);
    }).catch(gagalSimpan);
}

// ===== FUNGSI TABEL & EDIT/HAPUS PEGAWAI =====

function toggleFormPegawai(formId, btn) {
    var form = document.getElementById(formId);
    if (!form) return;
    var isHidden = form.classList.contains('hidden');
    form.classList.toggle('hidden');
    if (btn) {
        if (isHidden) {
            btn.innerHTML = '<i class="fas fa-times mr-1"></i> Tutup Form';
            btn.classList.replace('bg-blue-600', 'bg-gray-500');
            btn.classList.replace('bg-purple-600', 'bg-gray-500');
            btn.classList.replace('hover:bg-blue-700', 'hover:bg-gray-600');
            btn.classList.replace('hover:bg-purple-700', 'hover:bg-gray-600');
        } else {
            if (formId === 'form-berita-pegawai') btn.innerHTML = '<i class="fas fa-plus"></i> Tulis Berita Baru';
            else btn.innerHTML = '<i class="fas fa-plus"></i> Upload Galeri Baru';
            btn.className = btn.className.replace('bg-gray-500', formId === 'form-berita-pegawai' ? 'bg-blue-600' : 'bg-purple-600');
        }
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function renderTabelBeritaPegawai() {
    var tbody = document.getElementById('tbl-berita-pegawai');
    if (!tbody) return;
    var semua = (dbGlobal.berita || []).filter(function(b) { return b.penulis === curNama; });
    if (semua.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-8 text-gray-400 italic">Belum ada postingan Anda.</td></tr>';
        return;
    }
    var html = '';
    semua.forEach(function(b) {
        var kat = b.kategori || 'Berita';
        var badge = kat === 'Pengumuman'
            ? '<span class="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Pengumuman</span>'
            : '<span class="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">Berita</span>';
        var tgl = b.tanggal ? b.tanggal.split('T')[0] : '-';
        html += '<tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">';
        html += '<td class="px-4 py-3 font-medium text-gray-800 dark:text-white max-w-xs truncate" title="' + (b.judul||'') + '">' + (b.judul || '-') + '</td>';
        html += '<td class="px-4 py-3">' + badge + '</td>';
        html += '<td class="px-4 py-3 text-gray-500 text-xs">' + tgl + '</td>';
        html += '<td class="px-4 py-3 text-center"><div class="flex justify-center gap-2">';
        html += '<button onclick="bukaBerita(\'' + b.id + '\')" class="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition"><i class="fas fa-eye mr-1"></i>Lihat</button>';
        html += '<button onclick="editBeritaPegawai(\'' + b.id + '\')" class="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition"><i class="fas fa-edit mr-1"></i>Edit</button>';
        html += '<button onclick="hapusBeritaPegawai(\'' + b.id + '\')" class="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition"><i class="fas fa-trash mr-1"></i>Hapus</button>';
        html += '</div></td></tr>';
    });
    tbody.innerHTML = html;
}

function renderTabelGaleriPegawai() {
    var tbody = document.getElementById('tbl-galeri-pegawai');
    if (!tbody) return;
    var semua = (dbGlobal.galeri || []).filter(function(g) { return g.uploader === curNama; });
    if (semua.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-8 text-gray-400 italic">Belum ada upload galeri Anda.</td></tr>';
        return;
    }
    var html = '';
    semua.forEach(function(g) {
        var kat = g.kategori || 'Foto';
        var badge = kat === 'Video'
            ? '<span class="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-bold">Video</span>'
            : '<span class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Foto</span>';
        html += '<tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">';
        html += '<td class="px-4 py-3 font-medium text-gray-800 dark:text-white max-w-xs truncate" title="' + (g.judul||'') + '">' + (g.judul || '-') + '</td>';
        html += '<td class="px-4 py-3">' + badge + '</td>';
        html += '<td class="px-4 py-3 text-gray-500 text-xs">' + (g.tanggal || '-') + '</td>';
        html += '<td class="px-4 py-3 text-center"><div class="flex justify-center gap-2">';
        if (g.foto_url) {
            html += '<button onclick="window.open(\'' + g.foto_url + '\', \'_blank\')" class="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition"><i class="fas fa-eye mr-1"></i>Lihat</button>';
        }
        html += '<button onclick="hapusGaleriPegawai(\'' + g.id + '\')" class="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition"><i class="fas fa-trash mr-1"></i>Hapus</button>';
        html += '</div></td></tr>';
    });
    tbody.innerHTML = html;
}

function editBeritaPegawai(id) {
    var b = (dbGlobal.berita || []).find(function(x) { return x.id == id; });
    if (!b) return showAlert('Error', 'Data tidak ditemukan.', 'error');
    var form = document.getElementById('form-berita-pegawai');
    if (form) form.classList.remove('hidden');
    document.getElementById('pg-b-edit-id').value = id;
    document.getElementById('pg-b-judul').value = b.judul || '';
    document.getElementById('pg-b-kategori').value = b.kategori || 'Berita';
    if (b.tanggal) {
        try {
            var dt = new Date(b.tanggal.replace(' ', 'T'));
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            document.getElementById('pg-b-tanggal').value = dt.toISOString().slice(0, 16);
        } catch(e) { document.getElementById('pg-b-tanggal').value = ''; }
    }
    if (quillPegawaiBerita) quillPegawaiBerita.root.innerHTML = b.konten || '';
    // Tampilkan preview gambar lama
    var prevImg = document.getElementById('prev-pg-berita');
    if (prevImg) {
        if (b.gambar_url) {
            prevImg.src = b.gambar_url;
            prevImg.classList.remove('hidden');
        } else {
            prevImg.src = ''; prevImg.classList.add('hidden');
        }
    }
    cropData['berita_guru'] = null; // reset crop baru, biar pakai gambar lama
    var label = document.getElementById('label-btn-berita-pegawai'); if (label) label.textContent = 'Simpan Perubahan';
    var h = document.getElementById('judul-form-berita-pegawai'); if (h) h.innerHTML = '<i class="fas fa-edit text-orange-500"></i> Edit Berita / Pengumuman';
    var info = document.getElementById('info-gambar-berita-pegawai'); if (info) info.textContent = 'Kosongkan jika tidak ingin mengubah gambar.';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function batalEditBeritaPegawai() {
    var ei = document.getElementById('pg-b-edit-id'); if (ei) ei.value = '';
    var j = document.getElementById('pg-b-judul'); if (j) j.value = '';
    var t = document.getElementById('pg-b-tanggal'); if (t) t.value = '';
    if (quillPegawaiBerita) quillPegawaiBerita.root.innerHTML = '';
    cropData['berita_guru'] = null;
    var prev = document.getElementById('prev-pg-berita'); if (prev) { prev.src=''; prev.classList.add('hidden'); }
    var label = document.getElementById('label-btn-berita-pegawai'); if (label) label.textContent = 'Publikasikan';
    var h = document.getElementById('judul-form-berita-pegawai'); if (h) h.innerHTML = '<i class="fas fa-newspaper text-blue-500"></i> Tulis Berita / Pengumuman';
    var form = document.getElementById('form-berita-pegawai'); if (form) form.classList.add('hidden');
    var btn = document.getElementById('btn-toggle-berita'); if (btn) btn.innerHTML = '<i class="fas fa-plus"></i> Tulis Berita Baru';
}

async function hapusBeritaPegawai(id) {
    var conf = await showAlert({ title: 'Hapus Postingan?', text: 'Postingan akan dihapus permanen dari web publik.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Ya, Hapus', cancelButtonText: 'Batal' });
    if (!conf.isConfirmed) return;
    document.getElementById('loader-text').innerText = 'Menghapus data...';
    document.getElementById('loader').style.display = 'flex'; startTimer();
    callAPI('hapusData', { token: curToken, modul: 'berita', id: id }).then(function(res) {
        document.getElementById('loader').style.display = 'none'; stopTimer();
        if (res.status === 'success') { showAlert('Terhapus!', 'Postingan berhasil dihapus.', 'success'); refreshHalamanLunak(); }
        else { showAlert('Gagal', res.message || 'Gagal menghapus.', 'error'); }
    }).catch(gagalSimpan);
}

async function hapusGaleriPegawai(id) {
    var conf = await showAlert({ title: 'Hapus Galeri?', text: 'Item galeri akan dihapus dari web publik.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Ya, Hapus', cancelButtonText: 'Batal' });
    if (!conf.isConfirmed) return;
    document.getElementById('loader-text').innerText = 'Menghapus data...';
    document.getElementById('loader').style.display = 'flex'; startTimer();
    callAPI('hapusData', { token: curToken, modul: 'galeri', id: id }).then(function(res) {
        document.getElementById('loader').style.display = 'none'; stopTimer();
        if (res.status === 'success') { showAlert('Terhapus!', 'Galeri berhasil dihapus.', 'success'); refreshHalamanLunak(); }
        else { showAlert('Gagal', res.message || 'Gagal menghapus.', 'error'); }
    }).catch(gagalSimpan);
}
