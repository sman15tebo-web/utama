function prosesLogin() {
    var u = document.getElementById('log-user').value; var p = document.getElementById('log-pass').value;
    if (!u || !p) { Swal.fire('Peringatan', 'Username/NIP dan Password wajib diisi!', 'warning'); return; }

    document.getElementById('loader-text').innerText = 'Otentikasi...'; document.getElementById('loader').style.display = 'flex'; startTimer();
    callAPI('authLogin', { username: u, password: p }).then(function (res) {
        document.getElementById('loader').style.display = 'none'; stopTimer();
        if (res.status === 'success') {
            isAdmin = (res.role === 'admin'); curRole = res.role; curUsername = u; curToken = res.token; curUserId = res.id || ''; curNama = res.nama || '';
            sessionStorage.setItem('edupro_token', res.token);
            sessionStorage.setItem('edupro_role', res.role);
            sessionStorage.setItem('edupro_user', u);
            sessionStorage.setItem('edupro_id', res.id || '');
            sessionStorage.setItem('edupro_nama', res.nama || '');
            sessionStorage.setItem('edupro_akses_berita', res.akses_berita || 'N');
            sessionStorage.setItem('edupro_email', res.email || '');

            document.getElementById('nav-publik').classList.add('hidden'); document.getElementById('log-pass').value = '';

            if (isAdmin) {
                document.getElementById('nav-admin').classList.remove('hidden');
                document.getElementById('bottom-nav-publik').classList.add('hidden');
                document.getElementById('bottom-nav-admin').classList.remove('hidden');
                Swal.fire({ title: 'Selamat Datang Admin', icon: 'success', timer: 1500, showConfirmButton: false });
                Promise.resolve(navigate('admin-dashboard')).then(function() {
                    if (dbGlobal && Object.keys(dbGlobal).length > 0) {
                        renderSemuaData(dbGlobal);
                    } else {
                        muatDataServer();
                    }
                });
            } else {
                document.getElementById('nav-pegawai').classList.remove('hidden');
                document.getElementById('bottom-nav-publik').classList.add('hidden');
                document.getElementById('bottom-nav-pegawai').classList.remove('hidden');
                
                Promise.resolve(navigate('pegawai-dash')).then(function() {
                    if (dbGlobal && Object.keys(dbGlobal).length > 0) {
                        renderSemuaData(dbGlobal);
                    }
                    siapkanFormPegawai();
                    
                    // Cek apakah harus ganti password
                    if (res.must_change_password) {
                        setTimeout(function() {
                            var emailPre = res.email || '';
                            var fp = document.getElementById('fp-email');
                            if (fp && emailPre) fp.value = emailPre;
                            bukaModal('modal-forced-pass');
                        }, 500);
                    } else {
                        Swal.fire({ title: 'Selamat Datang, ' + res.nama, icon: 'success', timer: 1500, showConfirmButton: false });
                    }
                });
            }
        } else { Swal.fire('Gagal Login', res.message, 'error'); }
    }).catch(gagalSimpan);
}

function prosesGantiForcedPassword() {
    if (window.isSavingPassword) return;
    var newP  = document.getElementById('fp-baru').value;
    var confP = document.getElementById('fp-konfirm').value;
    var email = document.getElementById('fp-email').value;
    if (!newP || !confP) return Swal.fire('Peringatan', 'Password baru dan konfirmasi wajib diisi!', 'warning');
    if (newP !== confP)  return Swal.fire('Peringatan', 'Password baru tidak sama!', 'warning');
    if (newP.length < 6) return Swal.fire('Peringatan', 'Password minimal 6 karakter!', 'warning');

    window.isSavingPassword = true;

    // Gunakan loading state di DALAM tombol modal (bukan loader global yang tertutup modal)
    var btn = document.querySelector('#modal-forced-pass button[onclick="prosesGantiForcedPassword()"]');
    var btnOrigHTML = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan...'; }

    callAPI('gantiForcedPassword', { token: curToken, role: curRole, id: curUserId, newPass: newP, email: email })
    .then(function(res) {
        window.isSavingPassword = false;
        if (btn) { btn.disabled = false; btn.innerHTML = btnOrigHTML; }
        if (res.status === 'success') {
            tutupModal('modal-forced-pass');
            // Simpan email ke sessionStorage agar bisa dipakai di tempat lain
            if (email) sessionStorage.setItem('edupro_email', email);
            // Hapus cache lama dan reload data agar email baru tampil di profil
            localStorage.removeItem('edupro_cache_v4');
            Swal.fire({ title: '✅ Password Diperbarui!', text: 'Selamat datang, ' + curNama + '. Gunakan password baru Anda untuk login berikutnya.', icon: 'success', timer: 2500, showConfirmButton: false })
                .then(function() { muatDataServer(); });
        } else {
            Swal.fire('Gagal', res.message || 'Gagal menyimpan password.', 'error');
        }
    }).catch(function(err) {
        window.isSavingPassword = false;
        if (btn) { btn.disabled = false; btn.innerHTML = btnOrigHTML; }
        Swal.fire('Error', err.message || err.toString(), 'error');
    });
}


function prosesUbahPassword() {
    if (!curUsername) return Swal.fire('Error', 'Sesi tidak ditemukan.', 'error');
    var oldP = document.getElementById('pass-lama').value;
    var newP = document.getElementById('pass-baru').value;
    var confP = document.getElementById('pass-konfirm').value;

    if (!oldP || !newP || !confP) return Swal.fire('Peringatan', 'Semua kolom password wajib diisi!', 'warning');
    if (newP !== confP) return Swal.fire('Peringatan', 'Password baru tidak sama!', 'warning');
    if (newP.length < 6) return Swal.fire('Peringatan', 'Password baru minimal 6 karakter!', 'warning');

    // PERBAIKAN: Gunakan curUserId || curUsername untuk targetId
    var targetAman = curUserId || curUsername;

    callAPI('ubahPasswordUser', { token: curToken, role: curRole, targetId: targetAman, oldPass: oldP, newPass: newP }).then(function (res) {
        document.getElementById('loader').style.display = 'none'; stopTimer();
        if (res.status === 'success') {
            Swal.fire('Berhasil!', 'Password diubah.', 'success');
            document.getElementById('pass-lama').value = '';
            document.getElementById('pass-baru').value = '';
            document.getElementById('pass-konfirm').value = '';
        }
        else { Swal.fire('Gagal', res.message, 'error'); }
    }).catch(gagalSimpan);
}

function logout() {
    Swal.fire({ title: 'Akhiri sesi ini?', icon: 'question', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Ya' }).then((result) => {
        if (result.isConfirmed) {
            isAdmin = false; curRole = ''; curUsername = ''; curUserId = ''; curToken = ''; curNama = '';
            sessionStorage.removeItem('edupro_token');
            sessionStorage.removeItem('edupro_role');
            sessionStorage.removeItem('edupro_user');
            sessionStorage.removeItem('edupro_id');
            sessionStorage.removeItem('edupro_nama');
            document.getElementById('nav-admin').classList.add('hidden'); document.getElementById('nav-pegawai').classList.add('hidden'); document.getElementById('nav-publik').classList.remove('hidden'); document.getElementById('bottom-nav-admin').classList.add('hidden');
            document.getElementById('bottom-nav-pegawai').classList.add('hidden');
            document.getElementById('bottom-nav-publik').classList.remove('hidden');
            Promise.resolve(navigate('home')).then(function() {
                if (dbGlobal && Object.keys(dbGlobal).length > 0) {
                    renderSemuaData(dbGlobal);
                } else {
                    muatDataServer();
                }
            });
        }
    });
}

async function prosesLupaPassword() {
    var nip   = document.getElementById('req-nip').value.trim();
    var email = document.getElementById('req-email').value.trim();
    if (!nip || !email) { return Swal.fire('Error', 'NIP dan Email wajib diisi!', 'error'); }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { return Swal.fire('Error', 'Format email tidak valid!', 'error'); }

    var appUrl = window.location.href.split('?')[0];

    // Loading state di tombol
    var btn = document.querySelector('#modal-lupa-pass button[onclick="prosesLupaPassword()"]');
    var btnOrig = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Mengirim...'; }

    try {
        var res = await callAPI('mintaResetPassword', { nip: nip, email: email, appUrl: appUrl });
        if (btn) { btn.disabled = false; btn.innerHTML = btnOrig; }

        if (res && res.status === 'success') {
            tutupModal('modal-lupa-pass');
            document.getElementById('req-nip').value = '';
            document.getElementById('req-email').value = '';
            Swal.fire({
                title: '📧 Email Terkirim!',
                html: (res.message || 'Link reset password berhasil dikirim ke email Anda.') +
                      '<br><br><small class="text-gray-400">Cek folder <b>Spam/Junk</b> jika tidak muncul di Inbox.</small>',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            var errMsg = (res && res.message) || 'NIP/NIK atau Email tidak terdaftar atau tidak cocok.';
            Swal.fire('Gagal Mengirim', errMsg, 'error');
        }
    } catch (err) {
        if (btn) { btn.disabled = false; btn.innerHTML = btnOrig; }
        console.error('[LupaPassword] Error:', err);
        Swal.fire('Gagal', 'Terjadi kesalahan koneksi. Coba lagi beberapa saat.', 'error');
    }
}



async function prosesResetPassToken() {
    var passBaru = document.getElementById('rp-baru').value;
    var konfirm  = document.getElementById('rp-konfirm').value;
    if (!passBaru || passBaru.length < 6) return Swal.fire('Error', 'Password baru minimal 6 karakter.', 'error');
    if (passBaru !== konfirm) return Swal.fire('Error', 'Konfirmasi password tidak cocok!', 'error');

    var urlParams = new URLSearchParams(window.location.search);
    var token = urlParams.get('reset_token');
    if (!token) return Swal.fire('Error', 'Token tidak ditemukan.', 'error');

    // Loading state di dalam tombol modal (tidak pakai loader global yang tertutup modal)
    var btn = document.querySelector('#modal-reset-pass button[onclick="prosesResetPassToken()"]');
    var btnOrig = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Menyimpan...'; }

    try {
        var res = await callAPI('eksekusiResetPassword', { token_reset: token, newPass: passBaru });
        if (btn) { btn.disabled = false; btn.innerHTML = btnOrig; }

        if (res && res.status === 'success') {
            tutupModal('modal-reset-pass');
            document.getElementById('rp-baru').value = '';
            document.getElementById('rp-konfirm').value = '';
            window.history.replaceState({}, document.title, window.location.pathname);
            Swal.fire('✅ Berhasil!', (res.message || 'Password berhasil diubah.') + '<br>Silakan login kembali.', 'success').then(() => {
                navigate('login');
            });
        } else {
            Swal.fire('Gagal', (res && res.message) || 'Link pemulihan tidak valid atau sudah kadaluarsa.', 'error');
        }
    } catch (err) {
        if (btn) { btn.disabled = false; btn.innerHTML = btnOrig; }
        console.error('[ResetPass] Error:', err);
        Swal.fire('Gagal', 'Terjadi kesalahan saat memperbarui password.', 'error');
    }
}
