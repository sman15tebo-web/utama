// core/globals.js
const GAS_URL = "https://script.google.com/macros/s/AKfycbzgGTy6R55jbJvqPHL2p3owp3DQsnQm1iE1txSh7uQbd4PFyPQ8ogLZNplXSC_98eHs/exec";

var loadingInterval = null; var quillPegawaiBerita = null; var tFailsafe = setTimeout(function () { var l = document.getElementById('loader-text'); if (l) { l.innerHTML = "Menunggu respon server...<br><span class='text-xs font-normal'>Sistem sedang merakit data.</span>"; l.style.color = "#f59e0b"; } }, 3000);

var isAdmin = false;
var curRole = sessionStorage.getItem('edupro_role') || '';
var curUsername = sessionStorage.getItem('edupro_user') || '';
var curUserId = sessionStorage.getItem('edupro_id') || '';
var curNama = sessionStorage.getItem('edupro_nama') || '';
var curToken = sessionStorage.getItem('edupro_token') || '';

var dbGlobal = {}; var sliderInterval; var curShareId = ''; var curShareTitle = '';
var cropData = { berita: null, guru: null, tu: null, galeri: null, slider: null, logo: null, struktur: null, kepsek: null, pegawai_foto: null, eksternal: null };
var editDataId = { berita: null, guru: null, tu: null, siswa: null, galeri: null, slider: null, eksternal: null };
var pdfBase64 = null;
var quillEditor;

const viewCache = {};
const viewMap = {
    'login.html': ['login', 'ubah-password'],
    'admin.html': ['admin-layout', 'admin-dashboard', 'admin-guru', 'admin-tu', 'admin-berita', 'admin-eksternal', 'admin-siswa', 'admin-slider', 'admin-galeri', 'admin-settings', 'admin-widget', 'admin-profil'],
    'pegawai.html': ['pegawai-dash', 'pegawai-dashboard', 'pegawai-galeri', 'pegawai-berita'],
    'public.html': ['home', 'kontak-kami', 'profil-kepsek', 'profil-sejarah', 'profil-identitas', 'profil-visimisi', 'profil-sarpras', 'halaman-privasi', 'halaman-syarat', 'profil-pegawai-stat', 'profil-struktur', 'guru', 'tu', 'detail-pegawai', 'siswa', 'halaman-berita', 'halaman-pengumuman', 'detail-berita', 'galeri-foto', 'galeri-video']
};
