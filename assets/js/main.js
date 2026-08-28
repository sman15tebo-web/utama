// main.js
window.onload = async function () {
    if (curRole === 'admin') {
        document.getElementById('nav-publik').classList.add('hidden');
        document.getElementById('nav-admin').classList.remove('hidden');
        document.getElementById('bottom-nav-publik').classList.add('hidden');
        document.getElementById('bottom-nav-admin').classList.remove('hidden');
        await navigate('admin-dashboard');
    } else if (curRole === 'guru' || curRole === 'tu') {
        document.getElementById('nav-publik').classList.add('hidden');
        document.getElementById('nav-pegawai').classList.remove('hidden');
        document.getElementById('bottom-nav-publik').classList.add('hidden');
        document.getElementById('bottom-nav-pegawai').classList.remove('hidden');
        await navigate('pegawai-dashboard');
    } else {
        await navigate('home');
    }
    muatDataServer();
    setInterval(jalankanSlider, 5000);
    var Quill = window.Quill;
    if (Quill) {
        var adminEditor = document.getElementById('editor-container');
        if (adminEditor) {
            quillEditor = new Quill(adminEditor, { theme: 'snow' });
        }
        var pgEditor = document.getElementById('pg-editor-container');
        if (pgEditor) {
            quillPegawaiBerita = new Quill(pgEditor, { theme: 'snow' });
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
