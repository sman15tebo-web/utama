function renderSemuaData(data) {
    try {
        var setArr = data.settings || []; var widArr = data.widget || []; var nSekolah = getVal('nama_sekolah', setArr) || 'SMA EduPro';
        setTextAman('nav-nama-sekolah', nSekolah); setTextAman('foot-nama', nSekolah); setTextAman('id-nama', nSekolah); setTextAman('id-npsn', getVal('npsn', setArr) || '-'); setTextAman('id-nss', getVal('nss', setArr) || '-'); setTextAman('id-akreditasi', getVal('akreditasi', setArr) || '-'); setTextAman('id-tahun', getVal('tahun_berdiri', setArr) || '-'); setTextAman('id-status', getVal('status_jenjang', setArr) || '-'); setTextAman('id-alamat', getVal('alamat', setArr)); setTextAman('id-desc', getVal('deskripsi', setArr)); setTextAman('foot-alamat', getVal('alamat', setArr)); setTextAman('home-kepsek-nama', getVal('kepsek_nama', setArr) || 'Bpk/Ibu Kepala Sekolah'); setTextAman('home-kepsek-sambutan', '"' + (getVal('kepsek_sambutan', setArr) || 'Pendidikan adalah kunci kesuksesan.') + '"'); setTextAman('detail-kepsek-nama', getVal('kepsek_nama', setArr) || 'Bpk/Ibu Kepala Sekolah'); setTextAman('detail-kepsek-sambutan', getVal('kepsek_sambutan', setArr) || 'Pendidikan adalah kunci kesuksesan.'); setTextAman('teks-sejarah', getVal('sejarah', setArr) || 'Sejarah belum ditulis.'); setTextAman('teks-visimisi', getVal('visi_misi', setArr) || 'Visi Misi belum ditulis.'); setTextAman('teks-sarpras', getVal('sarpras', setArr) || 'Sarana Prasarana belum diisi.'); setTextAman('teks-privasi', getVal('privasi', setArr) || 'Kebijakan privasi belum diatur.'); setTextAman('teks-syarat', getVal('syarat', setArr) || 'Syarat dan ketentuan belum diatur.'); setTextAman('foot-copy-nama', nSekolah); setTextAman('teks-berjalan', getVal('teks_berjalan', setArr) || 'Selamat datang di website resmi kami.');

        setTextAman('kk-nama', nSekolah); setTextAman('kk-alamat', getVal('alamat', setArr) || '-'); setTextAman('kk-wa', getVal('wa', widArr) || '-'); setTextAman('kk-email', getVal('email', widArr) || '-'); setTextAman('kk-web', getVal('domain_resmi', setArr) || window.location.hostname); setTextAman('kk-fb', getVal('fb', widArr) || 'Facebook'); setTextAman('kk-ig', getVal('ig', widArr) || 'Instagram');
        setLinkAman('kk-link-wa', getVal('wa', widArr) ? 'https://wa.me/' + amankanTeks(getVal('wa', widArr)) : '#'); setLinkAman('kk-link-email', getVal('email', widArr) ? 'mailto:' + amankanTeks(getVal('email', widArr)) : '#'); setLinkAman('kk-link-fb', getVal('fb', widArr)); setLinkAman('kk-link-ig', getVal('ig', widArr)); setLinkAman('kk-link-ppdb', getVal('link_ppdb', widArr)); setLinkAman('kk-link-dinas', getVal('link_dinas', widArr)); setLinkAman('kk-link-dapodik', getVal('link_dapodik', widArr));

        var kepUrl = getValidImg(getVal('kepsek_foto', setArr), 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500'); var imgK1 = document.getElementById('home-kepsek-foto'); if (imgK1) imgK1.src = kepUrl; var imgK2 = document.getElementById('prev-kepsek'); if (imgK2) { imgK2.src = kepUrl; imgK2.classList.remove('hidden'); } var imgK3 = document.getElementById('detail-kepsek-foto'); if (imgK3) imgK3.src = kepUrl;
        var mapContainer = document.getElementById('wrapper-maps'); var mapIframe = document.getElementById('iframe-maps'); var mapUrl = getVal('maps_url', setArr); if (mapContainer && mapIframe) { if (mapUrl) { mapIframe.src = amankanTeks(mapUrl); mapContainer.classList.remove('hidden'); } else { mapContainer.classList.add('hidden'); } }

        setValAman('set-nama', nSekolah); setValAman('set-deskripsi', getVal('deskripsi', setArr)); setValAman('set-alamat', getVal('alamat', setArr)); setValAman('set-npsn', getVal('npsn', setArr)); setValAman('set-nss', getVal('nss', setArr)); setValAman('set-akreditasi', getVal('akreditasi', setArr)); setValAman('set-status', getVal('status_jenjang', setArr)); setValAman('set-tahun', getVal('tahun_berdiri', setArr)); setValAman('set-sejarah', getVal('sejarah', setArr)); setValAman('set-visimisi', getVal('visi_misi', setArr)); setValAman('set-sarpras', getVal('sarpras', setArr)); setValAman('set-privasi', getVal('privasi', setArr)); setValAman('set-syarat', getVal('syarat', setArr)); dbGlobal.domainResmi = getVal('domain_resmi', setArr); setValAman('set-domain', dbGlobal.domainResmi); setValAman('set-kepsek-nama', getVal('kepsek_nama', setArr)); setValAman('set-kepsek-sambutan', getVal('kepsek_sambutan', setArr)); setValAman('set-teks-berjalan', getVal('teks_berjalan', setArr)); setValAman('set-maps', mapUrl);
        var logoUrl = getValidImg(getVal('logo_url', setArr), null); if (logoUrl) { var navL = document.getElementById('nav-logo'); if (navL) { navL.src = logoUrl; navL.classList.remove('hidden'); } var footL = document.getElementById('foot-logo'); if (footL) { footL.src = logoUrl; footL.classList.remove('hidden'); } var loginL = document.getElementById('login-logo'); if (loginL) { loginL.src = logoUrl; loginL.classList.remove('hidden'); } var prevL = document.getElementById('prev-logo'); if (prevL) prevL.src = logoUrl; }
        var strUrl = getValidImg(getVal('struktur_url', setArr), null); if (strUrl) { var imgS = document.getElementById('img-struktur'); if (imgS) imgS.src = strUrl; var prevS = document.getElementById('prev-struktur'); if (prevS) { prevS.src = strUrl; prevS.classList.remove('hidden'); } }

        setLinkAman('link-wa', getVal('wa', widArr) ? 'https://wa.me/' + amankanTeks(getVal('wa', widArr)) : ''); setLinkAman('link-ig', getVal('ig', widArr)); setLinkAman('link-fb', getVal('fb', widArr)); setLinkAman('link-email', getVal('email', widArr) ? 'mailto:' + amankanTeks(getVal('email', widArr)) : ''); setLinkAman('link-ppdb', getVal('link_ppdb', widArr)); setLinkAman('link-dinas', getVal('link_dinas', widArr)); setLinkAman('link-dapodik', getVal('link_dapodik', widArr));

        var ytVal = getVal('yt_url', widArr); var fbVal = getVal('fb_plugin', widArr); var calVal = getVal('cal_url', widArr);
        
        var eYt = document.getElementById('iframe-yt'); var bYt = document.getElementById('box-yt');
        if (ytVal) { if (eYt) eYt.src = amankanTeks(ytVal); if (bYt) bYt.style.display = 'block'; } else { if (bYt) bYt.style.display = 'none'; }
        
        var eFb = document.getElementById('iframe-fb'); var bFb = document.getElementById('box-fb');
        if (fbVal) { if (eFb) eFb.src = 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F' + amankanTeks(fbVal) + '&tabs=timeline&width=340&height=250&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId'; if (bFb) bFb.style.display = 'block'; } else { if (bFb) bFb.style.display = 'none'; }
        
        var eCal = document.getElementById('iframe-cal'); var bCal = document.getElementById('box-cal');
        if (calVal) { if (eCal) eCal.src = amankanTeks(calVal); if (bCal) bCal.style.display = 'block'; } else { if (bCal) bCal.style.display = 'none'; }
        
        setValAman('wid-wa', getVal('wa', widArr)); setValAman('wid-email', getVal('email', widArr)); setValAman('wid-ig', getVal('ig', widArr)); setValAman('wid-fb', getVal('fb', widArr)); setValAman('wid-ppdb', getVal('link_ppdb', widArr)); setValAman('wid-dinas', getVal('link_dinas', widArr)); setValAman('wid-dapodik', getVal('link_dapodik', widArr)); setValAman('wid-yt', ytVal); setValAman('wid-fb-plugin', fbVal); setValAman('wid-cal', calVal);

        setTextAman('stat-guru', (data.guru ? data.guru.length : 0) + (data.tu ? data.tu.length : 0)); setTextAman('stat-p-guru', (data.guru ? data.guru.length : 0)); setTextAman('stat-p-tu', (data.tu ? data.tu.length : 0)); setTextAman('stat-berita', (data.berita ? data.berita.length : 0));
        setTextAman('stat-guru-dash', (data.guru ? data.guru.length : 0)); setTextAman('stat-tu-dash', (data.tu ? data.tu.length : 0)); setTextAman('stat-berita-dash', (data.berita ? data.berita.length : 0));

        var sContainer = document.getElementById('slider-container'); var tSlid = '', tTblSl = '';
        if ((data.slider || []).length > 0) {
            for (var s = 0; s < data.slider.length; s++) {
                var isld = data.slider[s]; if (!isld.id) continue; var iUrl = getValidImg(isld.gambar_url, 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600');
                tSlid += '<div class="slide-item ' + (s === 0 ? 'active' : '') + ' bg-cover bg-center" style="background-image: url(\'' + iUrl + '\');"><div class="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4"><h1 class="text-2xl md:text-6xl font-extrabold text-white mb-2 md:mb-4 drop-shadow-2xl">' + amankanTeks(isld.judul || '') + '</h1><p class="text-sm md:text-2xl text-gray-200 mb-4 md:mb-8 max-w-3xl drop-shadow-md">' + amankanTeks(isld.subjudul || '') + '</p></div></div>';
                tTblSl += '<tr class="border-b dark:border-gray-700"><td class="p-3"><img src="' + iUrl + '" loading="lazy" class="h-10 w-16 aspect-[7/3] object-cover rounded shadow"></td><td class="p-3 font-bold">' + amankanTeks(isld.judul || '-') + '</td><td class="p-3 text-center whitespace-nowrap"><button onclick="siapkanEdit(\'slider\',\'' + isld.id + '\')" class="text-blue-500 bg-blue-100 px-3 py-1 rounded-full mr-2"><i class="fas fa-edit"></i></button><button onclick="hapusData(\'slider\',\'' + isld.id + '\')" class="text-red-500 bg-red-100 px-3 py-1 rounded-full"><i class="fas fa-trash"></i></button></td></tr>';
            }
            setHTMLAman('slider-container', tSlid); setHTMLAman('tbl-slider', tTblSl); jalankanSlider();
        } else {
            setHTMLAman('slider-container', '<div class="slide-item active bg-cover bg-center" style="background-image: url(\'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600\');"><div class="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4"><h1 class="text-3xl md:text-6xl font-extrabold text-white mb-4">Selamat Datang</h1><p class="text-lg md:text-2xl text-gray-200 mb-8">Tambahkan Slider di Admin.</p></div></div>'); setHTMLAman('tbl-slider', '<tr><td colspan="3" class="p-4 text-center">Belum ada slider</td></tr>');
        }

        var htmlExt = '', tblExt = ''; var eData = data.eksternal || [];
        for (var e = 0; e < eData.length; e++) {
            var ex = eData[e]; if (!ex.id) continue;
            var eIco = ex.icon_url ? ex.icon_url : 'https://via.placeholder.com/150';
            htmlExt += '<a href="' + amankanTeks(ex.url) + '" target="_blank" title="' + amankanTeks(ex.nama) + '" class="block hover:-translate-y-2 hover:scale-110 transition duration-300 p-2"><img src="' + eIco + '" class="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-lg mx-auto"></a>';
            tblExt += '<tr class="border-b dark:border-gray-700"><td class="p-3"><img src="' + eIco + '" class="h-10 w-10 object-contain rounded bg-white shadow"></td><td class="p-3 font-bold">' + amankanTeks(ex.nama || '-') + '</td><td class="p-3 text-blue-500 underline truncate max-w-xs">' + amankanTeks(ex.url || '-') + '</td><td class="p-3 text-center whitespace-nowrap"><button onclick="siapkanEdit(\'eksternal\',\'' + ex.id + '\')" class="text-blue-500 bg-blue-100 px-3 py-1 rounded-full mr-2"><i class="fas fa-edit"></i></button><button onclick="hapusData(\'eksternal\',\'' + ex.id + '\')" class="text-red-500 bg-red-100 px-3 py-1 rounded-full"><i class="fas fa-trash"></i></button></td></tr>';
        }
        if (htmlExt !== '') { setHTMLAman('eksternal-container', htmlExt); var wE = document.getElementById('widget-eksternal'); if(wE) wE.classList.remove('hidden'); } else { var wE = document.getElementById('widget-eksternal'); if(wE) wE.classList.add('hidden'); }
        setHTMLAman('tbl-eksternal', tblExt || '<tr><td colspan="4" class="p-4 text-center">Belum ada tautan.</td></tr>');

        var tSis = '', tAlm = '', tTSis = '', cSiswa = 0, cAlumni = 0; var sL = 0, sP = 0, aL = 0, aP = 0;
        for (var x = 0; x < (data.siswa || []).length; x++) {
            var s = data.siswa[x]; if (!s.kategori) continue;
            var l = parseInt(s.jumlah_l) || 0; var p = parseInt(s.jumlah_p) || 0; var tot = parseInt(s.jumlah) || 0;
            var pdfIco = s.dokumen_url ? ' <a href="' + amankanTeks(s.dokumen_url) + '" target="_blank" class="text-red-500 hover:text-red-700 ml-3 bg-red-100 px-2 py-1 rounded shadow-sm text-sm" title="Lihat Dokumen PDF"><i class="fas fa-file-pdf"></i></a>' : '';

            tTSis += '<tr class="border-b dark:border-gray-700"><td class="p-3">' + amankanTeks(s.kategori || '-') + '</td><td class="p-3 font-bold">' + amankanTeks(s.label || '-') + pdfIco + '</td><td class="p-3 text-center text-blue-500 font-bold">' + l + '</td><td class="p-3 text-center text-pink-500 font-bold">' + p + '</td><td class="p-3 text-center font-black">' + tot + '</td><td class="p-3 text-center whitespace-nowrap"><button onclick="siapkanEdit(\'siswa\',\'' + s.id + '\')" class="text-blue-500 bg-blue-100 px-3 py-1 rounded-full mr-1"><i class="fas fa-edit"></i></button><button onclick="hapusData(\'siswa\',\'' + s.id + '\')" class="text-red-500 bg-red-100 px-3 py-1 rounded-full"><i class="fas fa-trash"></i></button></td></tr>';
            if (s.kategori === 'Siswa Aktif') { cSiswa += tot; sL += l; sP += p; tSis += '<tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"><td class="p-4 font-bold text-primary dark:text-white">' + amankanTeks(s.label) + pdfIco + '</td><td class="p-4 text-center text-blue-500 font-bold">' + l + '</td><td class="p-4 text-center text-pink-500 font-bold">' + p + '</td><td class="p-4 text-center font-black">' + tot + '</td></tr>'; }
            else if (s.kategori === 'Alumni') { cAlumni += tot; aL += l; aP += p; tAlm += '<tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"><td class="p-4 font-bold text-secondary">' + amankanTeks(s.label) + pdfIco + '</td><td class="p-4 text-center text-blue-500 font-bold">' + l + '</td><td class="p-4 text-center text-pink-500 font-bold">' + p + '</td><td class="p-4 text-center font-black">' + tot + '</td></tr>'; }
        }
        setTextAman('stat-siswa', cSiswa); setTextAman('stat-alumni', cAlumni); setTextAman('stat-siswa-dash', cSiswa);
        setHTMLAman('tbl-siswa-aktif', tSis || '<tr><td colspan="4" class="p-4 text-center">Data kosong</td></tr>'); setHTMLAman('foot-siswa-aktif', '<tr><td class="p-4 text-right">TOTAL KESELURUHAN:</td><td class="p-4 text-center text-blue-600">' + sL + '</td><td class="p-4 text-center text-pink-600">' + sP + '</td><td class="p-4 text-center text-xl">' + cSiswa + '</td></tr>');
        setHTMLAman('tbl-alumni', tAlm || '<tr><td colspan="4" class="p-4 text-center">Data kosong</td></tr>'); setHTMLAman('foot-alumni', '<tr><td class="p-4 text-right">TOTAL KESELURUHAN:</td><td class="p-4 text-center text-blue-600">' + aL + '</td><td class="p-4 text-center text-pink-600">' + aP + '</td><td class="p-4 text-center text-xl">' + cAlumni + '</td></tr>');
        setHTMLAman('tbl-admin-siswa', tTSis);

        function renderPerson(arr, cId, tblId, mdl) {
            var th = '', tbl = '';
            for (var p = 0; p < (arr || []).length; p++) {
                var ig = arr[p]; if (!ig.id) continue;
                var nmAm = amankanTeks(ig.nama || '-');
                var fUrl = getValidImg(ig.foto_url, 'https://ui-avatars.com/api/?name=' + nmAm + '&background=random');
                var subTeks = amankanTeks((mdl === 'tu') ? ig.bagian : ig.mapel);

                th += '<div onclick="bukaProfilPegawai(\'' + mdl + '\', \'' + ig.id + '\')" class="cursor-pointer bg-white dark:bg-gray-800 p-0 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-2 transition flex flex-col"><img src="' + fUrl + '" loading="lazy" class="w-full aspect-[3/4] object-cover"><div class="p-6 text-center flex-1 flex flex-col justify-center"><h3 class="font-black text-lg md:text-xl text-gray-800 dark:text-white mb-1 line-clamp-2">' + nmAm + '</h3><p class="font-bold text-xs md:text-sm text-secondary uppercase tracking-widest">' + (subTeks || '-') + '</p><p class="text-xs text-gray-500 mt-2 line-clamp-1">' + amankanTeks(ig.jabatan || '-') + '</p><p class="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-full px-2 py-1 mt-3 mx-auto w-max">' + amankanTeks(ig.status_pegawai || 'Pegawai') + '</p></div></div>';

                var stKlp = (ig.nama && ig.foto_url && ig.tempat_lahir) ? '<span class="text-green-500 font-bold"><i class="fas fa-check-circle"></i> Lengkap</span>' : '<span class="text-yellow-500 font-bold"><i class="fas fa-exclamation-triangle"></i> Belum</span>';

                var toggleAkses = '';
                if (mdl === 'guru') {
                    var isAktif = (ig.akses_berita === 'Y' || ig.akses_berita === 'Aktif');
                    var btnColor = isAktif ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600';
                    var btnText = isAktif ? '<i class="fas fa-check"></i> Akses Berita ON' : '<i class="fas fa-times"></i> Akses Berita OFF';
                    toggleAkses = '<button onclick="ubahAksesBerita(\'' + ig.id + '\', \'' + (isAktif ? 'N' : 'Y') + '\')" class="text-white ' + btnColor + ' px-3 py-1 rounded-full mr-2 text-xs shadow-sm transition">' + btnText + '</button>';
                }

                tbl += '<tr class="border-b dark:border-gray-700"><td class="p-3 font-mono text-blue-600 dark:text-blue-400 font-bold">' + amankanTeks(ig.nip || '-') + '</td><td class="p-3 font-bold">' + nmAm + '</td><td class="p-3 text-center text-xs">' + stKlp + '</td><td class="p-3 text-center whitespace-nowrap">' + toggleAkses + '<button onclick="siapkanEdit(\'' + mdl + '\',\'' + ig.id + '\')" class="text-blue-500 bg-blue-100 px-3 py-1 rounded-full mr-2"><i class="fas fa-edit"></i> Edit</button><button onclick="resetPasswordPegawai(\'' + mdl + '\',\'' + ig.id + '\')" class="text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full mr-2" title="Reset ke 123456"><i class="fas fa-key"></i></button><button onclick="hapusData(\'' + mdl + '\',\'' + ig.id + '\')" class="text-red-500 bg-red-100 px-3 py-1 rounded-full"><i class="fas fa-trash"></i> Hapus</button></td></tr>';
            }
            var eC = document.getElementById(cId); if (eC) eC.innerHTML = th || '<p class="col-span-full text-center text-gray-500">Tidak ada data.</p>';
            var eT = document.getElementById(tblId); if (eT) eT.innerHTML = tbl;
        }
        renderPerson(data.guru, 'guru-container', 'tbl-guru-admin', 'guru'); renderPerson(data.tu, 'tu-container', 'tbl-admin-tu', 'tu');

        var htmlBerita = '', htmlPengumuman = '', tTblBerita = '', tTblPengumuman = '';
        var gabungRev = (data.berita || []).slice().reverse();
        var nowWaktu = new Date().getTime(); // Ambil waktu sekarang

        for (var v = 0; v < gabungRev.length; v++) {
            var ib = gabungRev[v]; if (!ib.id) continue;
            var isP = ((ib.kategori || '').toString().toLowerCase().indexOf('pengumuman') !== -1);
            var badgeJadwal = '';
            
            var tglPost = new Date(ib.tanggal).getTime();
            var belumWaktunya = (!isNaN(tglPost) && tglPost > nowWaktu);

            var tglFormat = ib.tanggal;
            if (!isNaN(tglPost)) {
                var d = new Date(tglPost);
                tglFormat = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            }

            var tmp = document.createElement("DIV"); tmp.innerHTML = ib.konten; var plainText = tmp.textContent || tmp.innerText || "";
            var penulisInfo = ib.penulis ? '<span class="text-xs text-gray-500 ml-2 font-bold"><i class="fas fa-user-edit text-primary"></i> ' + amankanTeks(ib.penulis) + '</span>' : '';
            
            // Tampilkan semua di Tabel Admin, beri badge "Terjadwal" jika belum waktunya
            var badgeJadwal = belumWaktunya ? '<br><span class="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-bold">Terjadwal</span>' : '';
            
            var btnAksi = '<td class="p-3 text-center whitespace-nowrap"><button onclick="bukaBerita(\'' + ib.id + '\')" class="text-green-500 bg-green-100 px-3 py-1 rounded-full mr-2"><i class="fas fa-eye"></i></button><button onclick="siapkanEdit(\'berita\',\'' + ib.id + '\')" class="text-blue-500 bg-blue-100 px-3 py-1 rounded-full mr-2"><i class="fas fa-edit"></i></button><button onclick="hapusData(\'berita\',\'' + ib.id + '\')" class="text-red-500 bg-red-100 px-3 py-1 rounded-full"><i class="fas fa-trash"></i></button></td></tr>';
            var trData = '<tr class="border-b dark:border-gray-700"><td class="p-3"><span class="px-2 py-1 ' + (isP ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-primary') + ' rounded text-xs font-bold">' + (isP ? 'Pengumuman' : 'Berita') + '</span></td><td class="p-3"><img src="' + getValidImg(ib.gambar_url, '') + '" loading="lazy" class="h-10 w-16 aspect-[5/3] object-cover rounded shadow"></td><td class="p-3 font-bold">' + amankanTeks(ib.judul || '-') + badgeJadwal + '</td>' + btnAksi;
            
            if (isP) tTblPengumuman += trData;
            else tTblBerita += trData;
            
            var cardHTML = '<div onclick="bukaBerita(\'' + ib.id + '\')" class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden cursor-pointer hover:-translate-y-1 border border-gray-100 dark:border-gray-700"><img src="' + getValidImg(ib.gambar_url, '') + '" loading="lazy" class="w-full aspect-[5/3] object-cover"><div class="p-6 md:p-8">' + (isP ? '<span class="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-[10px] md:text-xs font-bold mb-4">Pengumuman</span>' : '<span class="inline-block px-3 py-1 bg-blue-100 text-primary rounded-full text-[10px] md:text-xs font-bold mb-4">Berita</span>') + '<span class="inline-block px-3 py-1 text-gray-500 text-xs font-bold mb-4 ml-2">' + tglFormat + '</span>' + penulisInfo + '<h3 class="text-xl md:text-2xl font-black mb-3 text-gray-800 dark:text-white leading-tight line-clamp-2">' + amankanTeks(ib.judul || '-') + '</h3><p class="text-sm text-gray-500 line-clamp-2 leading-relaxed">' + plainText + '</p></div></div>';
            
            // Jangan render ke publik jika waktunya belum tiba
            if (!belumWaktunya) {
                if (isP) htmlPengumuman += cardHTML; else htmlBerita += cardHTML;
            }
        }
        setHTMLAman('tbl-berita', tTblBerita);
        setHTMLAman('tbl-pengumuman', tTblPengumuman);
        setHTMLAman('berita-utama-container', htmlBerita || '<p class="col-span-3 text-center">Belum ada berita.</p>');
        setHTMLAman('pengumuman-utama-container', htmlPengumuman || '<p class="col-span-3 text-center">Belum ada pengumuman.</p>');

        // --- FILTER JUGA UNTUK HALAMAN BERANDA/HOME ---
        var lBerita = [], lPengumuman = [];
        for (var i = 0; i < (data.berita || []).length; i++) {
            var itm = data.berita[i];
            var tglPost = new Date(itm.tanggal).getTime();

            // Jika waktu publish masih di masa depan, lewati!
            if (!isNaN(tglPost) && tglPost > nowWaktu) continue;

            var kateg = ((itm.kategori || '').toString().toLowerCase().indexOf('pengumuman') !== -1) ? 'Pengumuman' : 'Berita';
            if (kateg === 'Pengumuman') lPengumuman.push(itm);
            else lBerita.push(itm);
        }

        // Balik urutan agar yang paling baru tampil di atas
        lBerita = lBerita.reverse();
        lPengumuman = lPengumuman.reverse();

        var tHomeB = '', tHomeP = '';
        for (var w = 0; w < Math.min(5, lBerita.length); w++) {
            var hb = lBerita[w]; var tmp = document.createElement("DIV"); tmp.innerHTML = hb.konten; var plainText = tmp.textContent || tmp.innerText || "";
            tHomeB += '<div onclick="bukaBerita(\'' + hb.id + '\')" class="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden cursor-pointer hover:-translate-y-1 border border-gray-100 dark:border-gray-700"><div class="md:w-1/3 h-48 md:h-auto relative"><img src="' + getValidImg(hb.gambar_url, '') + '" loading="lazy" class="w-full h-full object-cover absolute inset-0"></div><div class="md:w-2/3 p-6 flex flex-col justify-center"><span class="inline-block px-3 py-1 bg-blue-100 text-primary rounded-full text-[10px] md:text-xs font-bold w-max mb-3">' + amankanTeks(hb.tanggal || '-') + '</span><h3 class="text-lg md:text-xl font-black mb-2 text-gray-800 dark:text-white line-clamp-2">' + amankanTeks(hb.judul || '-') + '</h3><p class="text-sm text-gray-500 line-clamp-2 leading-relaxed">' + plainText + '</p></div></div>';
        }
        document.getElementById('home-berita-list').innerHTML = tHomeB || '<p class="text-gray-500">Belum ada berita.</p>';
        for (var p = 0; p < Math.min(3, lPengumuman.length); p++) {
            var hp = lPengumuman[p]; tHomeP += '<div onclick="bukaBerita(\'' + hp.id + '\')" class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden cursor-pointer hover:-translate-y-1 border border-gray-100 dark:border-gray-700"><img src="' + getValidImg(hp.gambar_url, '') + '" loading="lazy" class="w-full aspect-[5/3] object-cover"><div class="p-6"><span class="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-[10px] md:text-xs font-bold mb-4">' + amankanTeks(hp.tanggal || '-') + '</span><h3 class="text-base md:text-lg font-black text-gray-800 dark:text-white leading-tight line-clamp-2">' + amankanTeks(hp.judul || '-') + '</h3></div></div>';
        }
        setHTMLAman('home-pengumuman-list', tHomeP || '<p class="col-span-3 text-center text-gray-500">Tidak ada pengumuman.</p>');

        var tGaleriFoto = '', tGaleriVideo = '', tTblGaleri = '', tTblVideo = ''; var gRev = (data.galeri || []).slice().reverse();
        for (var k = 0; k < gRev.length; k++) {
            var igl = gRev[k]; if (!igl.id) continue; var kateg = amankanTeks(igl.kategori) || 'Foto'; var jdlAman = amankanTeks(igl.judul); var descAman = amankanTeks(igl.deskripsi); var vidUrl = amankanTeks(igl.video_url); var iUrlGal = getValidImg(igl.gambar_url, '');

            var uploaderInfo = '<p class="text-xs text-yellow-400 mt-2 font-bold"><i class="fas fa-user mr-1"></i> ' + amankanTeks(igl.uploader || 'Admin') + '  ' + amankanTeks(igl.tanggal || '-') + '</p>';

            if (kateg === 'Video') { 
                tGaleriVideo += '<div class="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition"><div class="aspect-video w-full bg-black"><iframe src="' + vidUrl + '" loading="lazy" class="w-full h-full" frameborder="0" allowfullscreen></iframe></div><div class="p-6"><h4 class="font-bold text-lg md:text-xl text-gray-800 dark:text-white mb-2 line-clamp-2">' + jdlAman + '</h4><p class="text-sm text-gray-500 line-clamp-2">' + descAman + '</p>' + uploaderInfo + '</div></div>'; 
            } else { 
                tGaleriFoto += '<div class="rounded-3xl overflow-hidden shadow-xl group relative border border-gray-100 dark:border-gray-800"><img src="' + iUrlGal + '" loading="lazy" class="w-full aspect-[5/3] object-cover group-hover:scale-110 transition duration-700"><div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-6"><h4 class="text-white font-bold text-lg md:text-xl drop-shadow-md line-clamp-1">' + jdlAman + '</h4><p class="text-gray-300 text-sm mt-1 line-clamp-2">' + descAman + '</p>' + uploaderInfo + '</div></div>'; 
            }

            var mediaIcon = (kateg === 'Video') ? '<div class="w-16 h-10 flex items-center justify-center bg-gray-200 rounded shadow"><i class="fab fa-youtube text-red-600 text-xl"></i></div>' : '<img src="' + iUrlGal + '" loading="lazy" class="h-10 w-16 aspect-[5/3] object-cover rounded shadow">'; var badgeStyle = (kateg === 'Video') ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600';
            var trGal = '<tr class="border-b dark:border-gray-700"><td class="p-3 flex justify-center">' + mediaIcon + '</td><td class="p-3"><span class="px-2 py-1 ' + badgeStyle + ' rounded text-xs font-bold">' + kateg + '</span></td><td class="p-3 font-bold">' + jdlAman + '</td><td class="p-3 text-center whitespace-nowrap"><button onclick="siapkanEdit(\'galeri\',\'' + igl.id + '\')" class="text-blue-500 bg-blue-100 px-3 py-1 rounded-full mr-2"><i class="fas fa-edit"></i></button><button onclick="hapusData(\'galeri\',\'' + igl.id + '\')" class="text-red-500 bg-red-100 px-3 py-1 rounded-full"><i class="fas fa-trash"></i></button></td></tr>';
            
            if (kateg === 'Video') tTblVideo += trGal;
            else tTblGaleri += trGal;
        }
        setHTMLAman('galeri-foto-container', tGaleriFoto || '<p class="col-span-full text-center text-gray-500">Belum ada koleksi foto.</p>'); setHTMLAman('galeri-video-container', tGaleriVideo || '<p class="col-span-full text-center text-gray-500">Belum ada video kegiatan.</p>'); 
        setHTMLAman('tbl-galeri', tTblGaleri || '<tr><td colspan="4" class="p-4 text-center">Data galeri foto kosong</td></tr>');
        setHTMLAman('tbl-video', tTblVideo || '<tr><td colspan="4" class="p-4 text-center">Data galeri video kosong</td></tr>');


        var gabungPegawai = (data.guru || []).concat(data.tu || []); var wPegawai = document.getElementById('widget-pegawai');
        if (gabungPegawai.length > 0 && wPegawai) {
            var pIdx = 0;
            function jalankanSlidePegawai() {
                if (!gabungPegawai[pIdx]) { pIdx = 0; } var pg = gabungPegawai[pIdx]; var nmAm = amankanTeks(pg.nama); var img = getValidImg(pg.foto_url, 'https://ui-avatars.com/api/?name=' + nmAm + '&background=random'); var role = pg.mapel ? pg.mapel : (pg.bagian ? pg.bagian : pg.jabatan);
                wPegawai.innerHTML = '<div class="absolute inset-0 flex flex-col items-center justify-center p-4 animate-[fadeIn_0.5s_ease-in-out]"><img src="' + img + '" loading="lazy" class="w-20 h-24 object-cover rounded-xl shadow-md mb-3 border-2 border-white dark:border-gray-700"><h4 class="font-bold text-gray-800 dark:text-white text-sm line-clamp-1">' + nmAm + '</h4><p class="text-[10px] text-secondary font-black uppercase tracking-wider mt-1">' + amankanTeks(role) + '</p></div>';
                pIdx = (pIdx + 1) % gabungPegawai.length;
            }
            jalankanSlidePegawai(); if (window.wPegawaiInt) clearInterval(window.wPegawaiInt); window.wPegawaiInt = setInterval(jalankanSlidePegawai, 3500);
        } else if (wPegawai) { wPegawai.innerHTML = '<p class="text-sm text-gray-500">Belum ada pegawai.</p>'; }
        
        if ((curRole === 'guru' || curRole === 'tu') && typeof siapkanFormPegawai === 'function') {
            siapkanFormPegawai();
        }

    } catch (e) { console.error(e); setTimeout(function() { var l = document.getElementById('loader'); if(l) l.style.display = 'none'; var lt = document.getElementById('loader-text'); if(lt) lt.innerText = 'Terjadi Kesalahan di Render. Cek Console.'; if(typeof stopTimer !== 'undefined') stopTimer(); }, 500); }
}

function bukaBerita(id) {
    var dt = null;
    for (var i = 0; i < dbGlobal.berita.length; i++) { if (dbGlobal.berita[i].id == id) { dt = dbGlobal.berita[i]; break; } }
    if (dt) {
        curShareId = id; curShareTitle = dt.judul;
        document.getElementById('detail-judul').innerText = dt.judul;

        // --- TAMBAH NAMA PENULIS DI BAWAH ---
        var nmPenulis = dt.penulis ? dt.penulis : 'Admin';
        var infoPenulis = '<div class="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700"><p class="font-bold text-gray-500 text-sm md:text-base"><i class="fas fa-pencil-alt text-primary mr-2"></i> Post by : <span class="text-gray-800 dark:text-white">' + amankanTeks(nmPenulis) + '</span></p></div>';
        document.getElementById('detail-konten').innerHTML = dt.konten + infoPenulis;

        // --- FORMAT TANGGAL & JAM ---
        var tglTampil = dt.tanggal;
        try {
            var d = new Date(dt.tanggal);
            if (!isNaN(d.getTime())) { tglTampil = d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
        } catch (e) { }

        document.getElementById('detail-tgl').innerText = tglTampil;
        document.getElementById('detail-cat').innerText = ((dt.kategori || '').toString().toLowerCase() === 'pengumuman') ? 'Pengumuman' : 'Berita';
        document.getElementById('detail-img').src = getValidImg(dt.gambar_url, '');
        try { window.history.replaceState(null, null, "?article=" + id); } catch (e) { }
        navigate('detail-berita');
    }
}

function bukaProfilPegawai(modul, id) {
    var dt = null; for (var i = 0; i < dbGlobal[modul].length; i++) { if (dbGlobal[modul][i].id == id) { dt = dbGlobal[modul][i]; break; } }
    if (dt) {
        document.getElementById('dp-foto').src = getValidImg(dt.foto_url, 'https://ui-avatars.com/api/?name=' + amankanTeks(dt.nama) + '&background=random');
        document.getElementById('dp-status').innerText = amankanTeks(dt.status_pegawai || 'Pegawai');
        document.getElementById('dp-jabatan').innerText = amankanTeks(dt.jabatan || 'Staf');
        document.getElementById('dp-nama').innerText = amankanTeks(dt.nama || '-');
        document.getElementById('dp-nip').innerText = maskNip(amankanTeks(dt.nip || '-'));
        document.getElementById('dp-jk').innerText = amankanTeks(dt.jk || '-');
        document.getElementById('dp-gol').innerText = amankanTeks(dt.pangkat_gol || '-');
        document.getElementById('dp-tmt').innerText = formatTanggal(dt.tmt_pgw) || '-';
        if (modul === 'guru') { document.getElementById('dp-lbl-tugas').innerText = 'Mata Pelajaran Diampu'; document.getElementById('dp-tugas').innerText = amankanTeks(dt.mapel || '-'); }
        else { document.getElementById('dp-lbl-tugas').innerText = 'Bagian / Divisi'; document.getElementById('dp-tugas').innerText = amankanTeks(dt.bagian || '-'); }

        var nohp = amankanTeks(dt.no_hp || '-'); document.getElementById('dp-nohp').innerText = nohp;
        if (nohp !== '-') { document.getElementById('dp-nohp').href = 'https://wa.me/' + nohp.replace(/[^0-9]/g, ''); }
        else { document.getElementById('dp-nohp').removeAttribute('href'); }
        document.getElementById('dp-email').innerText = amankanTeks(dt.email || '-');

        var btnBack = document.getElementById('btn-back-pegawai'); if (btnBack) btnBack.setAttribute('onclick', "navigate('" + modul + "')");
        navigate('detail-pegawai');
    }
}

function bagikanBerita(platform) {
    var baseShareUrl = dbGlobal.domainResmi ? dbGlobal.domainResmi.replace(/\/$/, "") : window.location.href.split('?')[0];
    var shareUrl = baseShareUrl + "?article=" + curShareId; var teks = "Baca informasi selengkapnya: " + curShareTitle + "\n\n" + shareUrl;
    if (platform === 'wa') { window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(teks), '_blank'); } else if (platform === 'fb') { window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl), '_blank'); } else if (platform === 'x') { window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(teks), '_blank'); } else if (platform === 'copy') { navigator.clipboard.writeText(shareUrl).then(function () { Swal.fire({ title: 'Berhasil!', text: 'Link berita telah disalin.', icon: 'success', timer: 2000, showConfirmButton: false }); }).catch(function () { Swal.fire('Gagal Menyalin', 'Silakan block dan copy URL ini manual:\n' + shareUrl, 'info'); }); }
}
