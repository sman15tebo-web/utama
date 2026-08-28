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

            document.getElementById('nav-publik').classList.add('hidden'); document.getElementById('log-pass').value = '';

            if (isAdmin) {
                document.getElementById('nav-admin').classList.remove('hidden');
                document.getElementById('bottom-nav-publik').classList.add('hidden');
                document.getElementById('bottom-nav-admin').classList.remove('hidden');
                Swal.fire({ title: 'Selamat Datang Admin', icon: 'success', timer: 1500, showConfirmButton: false });
                navigate('admin-dashboard');
            } else {
                document.getElementById('nav-pegawai').classList.remove('hidden');
                document.getElementById('bottom-nav-publik').classList.add('hidden');
                document.getElementById('bottom-nav-pegawai').classList.remove('hidden');
                Swal.fire({ title: 'Selamat Datang, ' + res.nama, icon: 'success', timer: 1500, showConfirmButton: false });
                siapkanFormPegawai();
                navigate('pegawai-dashboard');
            }
        } else { Swal.fire('Gagal Login', res.message, 'error'); }
    }).catch(gagalSimpan);
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
            document.getElementById('bottom-nav-publik').classList.remove('hidden'); navigate('home');
        }
    });
}