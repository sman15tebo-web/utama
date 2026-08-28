// main.js
window.onload = function () {
    muatDataServer();
    setInterval(jalankanSlider, 5000);
    var Quill = window.Quill;
    if (Quill) {
        quillEditor = new Quill('#editor-container', { theme: 'snow' });
        quillPegawaiBerita = new Quill('#pg-editor-container', { theme: 'snow' });
    }
};

window.addEventListener('popstate', function () { navigate('home'); });

var allInputs = document.querySelectorAll('input, select, textarea');
for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].addEventListener('change', function () { this.classList.remove('border-red-500'); });
}
