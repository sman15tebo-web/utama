// core/globals.js
const GAS_URL = "https://script.google.com/macros/s/AKfycbwp9y8k0YgFBuF3Dthd5Zh2_f1VBsY2XNvGsCT7OsuW5jEEylLj8FwZ4RoflvoVlvV0wg/exec";

var loadingInterval = null; var quillPegawaiBerita = null; var tFailsafe = setTimeout(function () { var l = document.getElementById('loader-text'); if (l) { l.innerHTML = "Menunggu respon server...<br><span class='text-xs font-normal'>Sistem sedang merakit data.</span>"; l.style.color = "#f59e0b"; } }, 3000);

var isAdmin = false;
var curRole = sessionStorage.getItem('edupro_role') || '';
var curUsername = sessionStorage.getItem('edupro_user') || '';
var curUserId = sessionStorage.getItem('edupro_id') || '';
var curNama = sessionStorage.getItem('edupro_nama') || '';
var curToken = sessionStorage.getItem('edupro_token') || '';

var dbGlobal = {}; var sliderInterval; var curShareId = ''; var curShareTitle = '';
var cropData = { berita: null, guru: null, tu: null, galeri: null, slider: null, logo: null, struktur: null, kepsek: null, pegawai_foto: null, eksternal: null, berita_guru: null };
var cropperInst = null;
var curKey = '';
var curPrevId = '';
var editDataId = { berita: null, guru: null, tu: null, siswa: null, galeri: null, slider: null, eksternal: null };
var pdfBase64 = null;
var curResetToken = ''; // Simpan reset token saat URL dibuka (global agar tidak hilang)
var quillEditor;

// Helper: SweetAlert selalu tampil DI ATAS semua modal (z-index > 9999)
function showAlert(titleOrObj, text, icon) {
    var opts = (typeof titleOrObj === 'object') ? titleOrObj : { title: titleOrObj, text: text, icon: icon };
    opts.customClass = opts.customClass || {};
    opts.customClass.container = opts.customClass.container || '';
    // Paksa z-index container SweetAlert di atas modal z-[9999]
    opts.didOpen = opts.didOpen || function(popup) {
        var cont = popup ? popup.closest('.swal2-container') : document.querySelector('.swal2-container');
        if (cont) cont.style.zIndex = '99999';
    };
    return Swal.fire(opts);
}

const viewCache = {};
const viewMap = {
    'login.html': ['login', 'ubah-password'],
    'admin.html': ['admin-layout', 'admin-dashboard', 'admin-guru', 'admin-tu', 'admin-berita', 'admin-eksternal', 'admin-siswa', 'admin-slider', 'admin-galeri', 'admin-settings', 'admin-widget', 'admin-profil'],
    'pegawai.html': ['pegawai-dash', 'pegawai-dashboard', 'pegawai-galeri', 'pegawai-berita'],
    'public.html': ['home', 'kontak-kami', 'profil-kepsek', 'profil-sejarah', 'profil-identitas', 'profil-visimisi', 'profil-sarpras', 'halaman-privasi', 'halaman-syarat', 'profil-pegawai-stat', 'profil-struktur', 'guru', 'tu', 'detail-pegawai', 'siswa', 'halaman-berita', 'halaman-pengumuman', 'detail-berita', 'galeri-foto', 'galeri-video']
};
