function togglePasswordVisibility(inputId, iconId) { var inp = document.getElementById(inputId); var icon = document.getElementById(iconId); if (inp.type === "password") { inp.type = "text"; icon.classList.remove("fa-eye"); icon.classList.add("fa-eye-slash"); } else { inp.type = "password"; icon.classList.remove("fa-eye-slash"); icon.classList.add("fa-eye"); } }

function toggleMobileMenu(menuId, iconId) { var menu = document.getElementById(menuId); var icon = document.getElementById(iconId); if (menu.classList.contains('hidden')) { menu.classList.remove('hidden'); menu.classList.add('flex'); icon.className = 'fas fa-times'; } else { menu.classList.add('hidden'); menu.classList.remove('flex'); icon.className = 'fas fa-bars'; var subs = ['mob-profil', 'mob-pegawai', 'mob-galeri', 'mob-info']; for (var i = 0; i < subs.length; i++) { var el = document.getElementById(subs[i]); var ic = document.getElementById('icon-' + subs[i]); if (el) { el.classList.add('hidden'); el.classList.remove('flex'); } if (ic) { ic.style.transform = 'rotate(0deg)'; } } } }

function toggleMobileSub(id) { var el = document.getElementById(id); var icon = document.getElementById('icon-' + id); if (el.classList.contains('hidden')) { el.classList.remove('hidden'); el.classList.add('flex'); icon.style.transform = 'rotate(180deg)'; } else { el.classList.add('hidden'); el.classList.remove('flex'); icon.style.transform = 'rotate(0deg)'; } }

function jalankanSlider() { clearInterval(sliderInterval); var slides = document.querySelectorAll('.slide-item'); if (slides.length <= 1) return; var curSlide = 0; sliderInterval = setInterval(function () { slides[curSlide].classList.remove('active'); curSlide = (curSlide + 1) % slides.length; slides[curSlide].classList.add('active'); }, 4500); }

function bukaCropper(event, rasio, key, prevId) {
    if (typeof Cropper === 'undefined') { Swal.fire('Peringatan', 'Sistem Cropper belum dimuat sempurna. Coba refresh halaman.', 'warning'); return; }
    var file = event.target.files[0]; if (!file) return; curKey = key; curPrevId = prevId;
    var reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('crop-image').src = e.target.result; document.getElementById('crop-modal').style.display = 'flex';
        if (cropperInst) cropperInst.destroy(); cropperInst = new Cropper(document.getElementById('crop-image'), { aspectRatio: (rasio === 0 ? NaN : rasio), viewMode: 1, autoCropArea: 1 });
    }; reader.readAsDataURL(file);
}

function batalCrop() { document.getElementById('crop-modal').style.display = 'none'; if (cropperInst) cropperInst.destroy(); var inps = document.querySelectorAll('input[type="file"]'); for (var i = 0; i < inps.length; i++) inps[i].value = ''; }

function terapkanCrop() {
    if (!cropperInst) return;
    var isT = (curKey === 'logo' || curKey === 'struktur' || curKey === 'eksternal');
    var base64 = cropperInst.getCroppedCanvas({ imageSmoothingEnabled: true, imageSmoothingQuality: 'high' }).toDataURL(isT ? 'image/png' : 'image/jpeg', isT ? undefined : 0.7);
    cropData[curKey] = base64;
    var p = document.getElementById(curPrevId); p.src = base64; p.classList.remove('hidden');
    batalCrop();
}

function kembaliKeDash() { if (curRole === 'admin') navigate('admin-dashboard'); else navigate('pegawai-dashboard'); }

async function loadViewForPage(pageId) {
    let targetView = null;
    for (let view in viewMap) {
        if (viewMap[view].indexOf(pageId) !== -1) {
            targetView = view;
            break;
        }
    }
    if (!targetView) return;

    if (!viewCache[targetView]) {
        document.getElementById('loader').style.display = 'flex';
        document.getElementById('loader-text').innerText = 'Memuat Antarmuka...';
        
        try {
            const res = await fetch('./assets/views/' + targetView + '?v=' + new Date().getTime());
            const html = await res.text();
            
            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            
            const container = document.getElementById('view-container');
            while(wrapper.firstChild) {
                container.appendChild(wrapper.firstChild);
            }
            viewCache[targetView] = true;
        } catch (e) {
            console.error("Gagal memuat view:", targetView, e);
        }
        document.getElementById('loader').style.display = 'none';
    }
}

async function navigate(pageId) {
    var mm1 = document.getElementById('mobile-menu'); if (mm1 && !mm1.classList.contains('hidden')) { toggleMobileMenu('mobile-menu', 'btn-mobile-icon'); }
    var mm2 = document.getElementById('mobile-admin'); if (mm2 && !mm2.classList.contains('hidden')) { toggleMobileMenu('mobile-admin', 'btn-admin-icon'); }
    var mm3 = document.getElementById('mobile-pegawai'); if (mm3 && !mm3.classList.contains('hidden')) { toggleMobileMenu('mobile-pegawai', 'btn-pegawai-icon'); }

    if (pageId.startsWith('admin-') && curRole !== 'admin') return navigate('login');
    if (pageId.startsWith('pegawai-') && curRole !== 'guru' && curRole !== 'tu') return navigate('login');
    if (pageId === 'ubah-password' && !curRole) return navigate('login');

    try { if (pageId !== 'detail-berita') { window.history.replaceState(null, null, window.location.pathname); } } catch (e) { }

    await loadViewForPage(pageId);

    var sec = document.querySelectorAll('.page-section'); for (var k = 0; k < sec.length; k++) sec[k].classList.remove('active');
    
    // Hide or show footer
    var fp = document.getElementById('footer-publik');
    if (fp) {
        if (pageId.startsWith('admin-') || pageId.startsWith('pegawai-') || pageId === 'login') {
            fp.classList.add('hidden');
        } else {
            fp.classList.remove('hidden');
        }
    }

    // Khusus Admin Dashboard
    if (pageId.startsWith('admin-') && pageId !== 'admin-layout') {
        var targetEl = document.getElementById('admin-layout');
        if (targetEl) targetEl.classList.add('active');
        
        // Auto-switch menu based on old IDs
        if(pageId === 'admin-dashboard') switchAdminMenu('admin-dash');
        else if(pageId === 'admin-berita') { switchAdminMenu('admin-posting'); switchTab('posting', 'tab-berita'); }
        else if(pageId === 'admin-guru') { switchAdminMenu('admin-pegawai'); switchTab('pegawai', 'tab-guru'); }
        else if(pageId === 'admin-tu') { switchAdminMenu('admin-pegawai'); switchTab('pegawai', 'tab-tu'); }
        else if(pageId === 'admin-siswa') switchAdminMenu('admin-siswa');
        else if(pageId === 'admin-slider') { switchAdminMenu('admin-galeri'); switchTab('galeri', 'tab-banner'); }
        else if(pageId === 'admin-galeri') { switchAdminMenu('admin-galeri'); switchTab('galeri', 'tab-foto'); }
        else if(pageId === 'admin-settings') { switchAdminMenu('admin-pengaturan'); switchTab('pengaturan', 'tab-sistem'); }
        else if(pageId === 'admin-widget') { switchAdminMenu('admin-pengaturan'); switchTab('pengaturan', 'tab-widget'); }
        else if(pageId === 'admin-eksternal') switchAdminMenu('admin-link');
        else if(pageId === 'admin-profil') switchAdminMenu('admin-profil');
    } else {
        var targetEl = document.getElementById(pageId);
        if(targetEl) {
            targetEl.classList.add('active'); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    try { if (typeof AOS !== 'undefined') AOS.refresh(); } catch (e) { }
}

/* ============================
   ADMIN DASHBOARD UI LOGIC
   ============================ */

function switchAdminMenu(menuId) {
    // Sembunyikan semua konten view admin
    var views = document.querySelectorAll('.admin-view-content');
    for (var i = 0; i < views.length; i++) {
        views[i].classList.add('hidden');
        views[i].classList.remove('block');
    }
    // Hapus active state dari semua link menu sidebar
    var links = document.querySelectorAll('.admin-menu-link');
    for (var i = 0; i < links.length; i++) {
        links[i].className = 'admin-menu-link flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all';
    }
    
    // Tampilkan view yang dituju
    var target = document.getElementById(menuId);
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('block');
    }
    // Set menu menjadi active
    var activeLink = document.getElementById('menu-' + menuId);
    if(activeLink) {
        activeLink.className = 'admin-menu-link flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all';
    }
}

function switchTab(groupName, tabId) {
    // Sembunyikan semua tab konten dalam grup
    var tabs = document.querySelectorAll('.tab-content-' + groupName);
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.add('hidden');
        tabs[i].classList.remove('block');
    }
    // Hapus active style dari semua tombol tab
    var btns = document.querySelectorAll('.tab-btn-' + groupName);
    for (var i = 0; i < btns.length; i++) {
        // Reset warna (Bisa disesuaikan dengan skema warna dasar tailwind)
        btns[i].className = btns[i].className.replace(/bg-white|dark:bg-gray-700|text-blue-600|text-green-600|text-orange-600|text-pink-600|text-gray-900|shadow-sm|bg-yellow-500/g, '').trim();
        if(!btns[i].className.includes('text-gray-500')) btns[i].classList.add('text-gray-500');
    }
    
    // Tampilkan tab konten yang dituju
    var target = document.getElementById(tabId);
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('block');
    }
    // Set tombol menjadi active
    var activeBtn = document.getElementById('btn-' + tabId);
    if(activeBtn) {
        activeBtn.classList.remove('text-gray-500');
        activeBtn.classList.add('shadow-sm');
        // Custom warna berdasarkan grup
        if(groupName === 'posting') { activeBtn.classList.add('bg-white', 'dark:bg-gray-700', 'text-blue-600'); }
        else if(groupName === 'pegawai') { activeBtn.classList.add('bg-white', 'dark:bg-gray-700', 'text-green-600'); }
        else if(groupName === 'siswa') { activeBtn.classList.add('bg-white', 'dark:bg-gray-700', 'text-orange-600'); }
        else if(groupName === 'galeri') { activeBtn.classList.add('bg-white', 'dark:bg-gray-700', 'text-pink-600'); }
        else if(groupName === 'pengaturan') { activeBtn.classList.add('bg-yellow-500', 'text-gray-900'); }
    }
}

function bukaModal(modalId) {
    var m = document.getElementById(modalId);
    if(m) {
        m.classList.remove('hidden');
        m.classList.add('flex');
        // Simple animation trigger
        setTimeout(() => {
            let content = m.querySelector('div');
            if(content && content.classList.contains('scale-95')) {
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            }
        }, 10);
    }
}

function tutupModal(modalId) {
    var m = document.getElementById(modalId);
    if(m) {
        let content = m.querySelector('div');
        if(content && content.classList.contains('scale-100')) {
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
        }
        setTimeout(() => {
            m.classList.add('hidden');
            m.classList.remove('flex');
        }, 150);
    }
}

var activePegawaiTab = 'guru';
document.addEventListener('click', function(e) {
    if(e.target.closest('#btn-tab-guru')) activePegawaiTab = 'guru';
    if(e.target.closest('#btn-tab-tu')) activePegawaiTab = 'tu';
});

function bukaModalPegawai() {
    if(activePegawaiTab === 'guru') bukaModal('modal-guru');
    else bukaModal('modal-tu');
}

function bukaModalGaleri() {
    // Galeri actually has 3 sub types: Banner, Foto, Video.
    // They have different modals.
    var act = document.querySelector('.tab-btn-galeri.bg-white'); // Find active
    if(act && act.id === 'btn-tab-banner') { bukaModal('modal-slider'); }
    else { bukaModal('modal-galeri'); } // Galeri Foto and Video use same modal-galeri, the category dropdown will handle it
}
