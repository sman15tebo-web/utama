// main.js
window.onload = async function () {
    var urlParams = new URLSearchParams(window.location.search);
    var resetToken = urlParams.get('reset_token');
    if (resetToken) {
        bukaModal('modal-reset-pass');
    }

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
        await navigate('home');
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
        var adminEditor = document.getElementById('editor-container');
        if (adminEditor) {
            quillEditor = new Quill(adminEditor, { theme: 'snow', modules: { toolbar: toolbarOptions } });
        }
        var pgEditor = document.getElementById('pg-b-konten');
        if (pgEditor && !quillPegawaiBerita) {
            quillPegawaiBerita = new Quill(pgEditor, { theme: 'snow', modules: { toolbar: toolbarOptions } });
        }
    }
};

window.addEventListener('popstate', function (e) {
    if(window.location.hash) return;
});

var allInputs = document.querySelectorAll('input, select, textarea');
for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].addEventListener('change', function () { this.classList.remove('border-red-500'); });
}
