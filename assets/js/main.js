// main.js
window.onload = function () {
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

window.addEventListener('popstate', function () { navigate('home'); });

var allInputs = document.querySelectorAll('input, select, textarea');
for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].addEventListener('change', function () { this.classList.remove('border-red-500'); });
}
