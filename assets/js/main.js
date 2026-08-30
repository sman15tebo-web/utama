// main.js
window.onload = async function () {
    var urlParams = new URLSearchParams(window.location.search);
    var resetToken = urlParams.get('reset_token');
    if (resetToken) {
        curResetToken = resetToken; // Simpan ke global agar tidak hilang jika URL dibersihkan
        bukaModal('modal-reset-pass');
        // Bersihkan token dari URL (agar tidak terekspos) tapi token sudah tersimpan di curResetToken
        try { window.history.replaceState(null, null, window.location.pathname); } catch(e) {}
    }

    // Handler ?page= dari link di HTML berita GitHub
    // Contoh: index.html?page=halaman-berita atau index.html?page=halaman-pengumuman
    var pageParam = urlParams.get('page');

    if (curRole === 'admin') {
        document.getElementById('nav-publik').classList.add('hidden');
        document.getElementById('nav-admin').classList.add('hidden'); // Sembunyikan global nav-admin agar tidak tumpang tindih
        document.getElementById('bottom-nav-publik').classList.add('hidden');
        document.getElementById('bottom-nav-admin').classList.remove('hidden');
        await navigate('admin-dashboard');
    } else if (curRole === 'guru' || curRole === 'tu') {
        document.getElementById('nav-publik').classList.add('hidden');
        document.getElementById('nav-pegawai').classList.remove('hidden');
        document.getElementById('bottom-nav-publik').classList.add('hidden');
        document.getElementById('bottom-nav-pegawai').classList.remove('hidden');
        await navigate('pegawai-dash');
    } else {
        // Jika ada ?page= parameter (dari link di halaman berita GitHub), navigate ke section itu
        var targetPage = pageParam || 'home';
        await navigate(targetPage);
        if (pageParam) {
            // Bersihkan URL setelah navigate agar tidak loop
            try { window.history.replaceState(null, null, window.location.pathname); } catch(e) {}
        }
    }
    muatDataServer();
    var Quill = window.Quill;
    var toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }, { 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image', 'video'],
        ['clean']
    ];
    if (Quill) {
        // Editor Admin: di-init saat modal-berita dibuka (bukan di sini) agar toolbar bisa render
        // quillEditor di-init di components.js bukaModal('modal-berita')
        var pgEditor = document.getElementById('pg-b-konten');
        if (pgEditor && !quillPegawaiBerita) {
            quillPegawaiBerita = new Quill(pgEditor, { theme: 'snow', modules: { toolbar: toolbarOptions } });
        }
    }
    // Simpan toolbarOptions ke global agar bisa dipakai saat init Quill admin di modal
    window._quillToolbar = toolbarOptions;
};

window.addEventListener('popstate', function (e) {
    if(window.location.hash) return;
});

var allInputs = document.querySelectorAll('input, select, textarea');
for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].addEventListener('change', function () { this.classList.remove('border-red-500'); });
}
