/* ════════════════════════════════════════════════════════════
   script.js — FZR PRODUCTION Portfolio
   ────────────────────────────────────────────────────────────
   DAFTAR ISI:
   1. Portfolio Config — atur link portfolio dari file config
   2. Navbar — scroll effect + hamburger mobile
   3. EQ Bar Animation — visualizer di hero
   4. Tab Switching — portfolio Song / Animation / Instrumental
   5. Reveal Animation — elemen muncul saat scroll
   6. Stat Counter — angka animasi di hero
   7. Contact Form — simulasi submit

   CATATAN UNTUK PEMULA:
   - Jangan ubah nama fungsi atau variabel.
   - Bagian yang BOLEH diubah sudah ditandai.
   - Bagian yang JANGAN diubah sudah ditandai.
════════════════════════════════════════════════════════════ */

// Tunggu sampai seluruh HTML selesai di-load sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {


  /* ══════════════════════════════════════════
     1. PORTFOLIO CONFIG
     ──────────────────────────────────────────
     Atur semua link card portfolio dari file
     `portfolio.config.js`.
  ══════════════════════════════════════════ */

  const portfolioConfig = window.PORTFOLIO_CONFIG || {};
  const portfolioDefaultUrl = portfolioConfig.defaultUrl || '#';
  const portfolioCards = document.querySelectorAll('.work-card');

  portfolioCards.forEach((card) => {
    card.href = portfolioDefaultUrl;
  });


  /* ══════════════════════════════════════════
     2. NAVBAR
     ──────────────────────────────────────────
     - Tambah class .scrolled saat halaman di-scroll
     - Toggle menu hamburger di mobile
     JANGAN DIUBAH
  ══════════════════════════════════════════ */

  // Ambil elemen-elemen navbar
  const nav      = document.getElementById('nav');
  const ham      = document.getElementById('ham');
  const navLinks = document.getElementById('navLinks');
  const nlinks   = document.querySelectorAll('.nlink');

  // Tambahkan/hapus class .scrolled saat user scroll
  // { passive: true } = optimasi performa scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // Toggle menu mobile saat tombol hamburger diklik
  ham.addEventListener('click', () => {
    const isOpen = ham.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    // Update aksesibilitas
    ham.setAttribute('aria-expanded', isOpen);
  });

  // Tutup menu mobile saat link navigasi diklik
  nlinks.forEach(link => {
    link.addEventListener('click', () => {
      ham.classList.remove('open');
      navLinks.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    });
  });

  // Tutup menu mobile saat klik di luar area menu
  document.addEventListener('click', (e) => {
    const isInsideNav = nav.contains(e.target);
    if (!isInsideNav && navLinks.classList.contains('open')) {
      ham.classList.remove('open');
      navLinks.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    }
  });


  /* ══════════════════════════════════════════
     3. EQ BAR ANIMATION
     ──────────────────────────────────────────
     Membuat batang-batang visualizer secara otomatis.
     BOLEH DIUBAH: BAR_COUNT (jumlah batang)
  ══════════════════════════════════════════ */

  const eqWrap = document.getElementById('eqWrap');

  // ======================================
  // BOLEH DIUBAH: jumlah batang EQ
  // Lebih banyak = lebih padat
  // ======================================
  const BAR_COUNT = 80;

  // Buat batang EQ sebanyak BAR_COUNT
  const eqFragment = document.createDocumentFragment(); // lebih efisien daripada loop appendChild

  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'eq-bar';

    // Tinggi, durasi, dan delay diacak agar terlihat hidup
    const maxH  = (30 + Math.random() * 70).toFixed(0) + '%';
    const dur   = (0.8 + Math.random() * 1.2).toFixed(2) + 's';
    const delay = (Math.random() * 1.5).toFixed(2) + 's';

    // Variabel CSS di-inject langsung ke elemen
    bar.style.cssText = `--h:${maxH}; --dur:${dur}; --delay:${delay};`;

    eqFragment.appendChild(bar);
  }

  eqWrap.appendChild(eqFragment); // satu operasi DOM = lebih cepat


  /* ══════════════════════════════════════════
     4. TAB SWITCHING — PORTFOLIO
     ──────────────────────────────────────────
     Klik tab → panel sesuai tampil, lainnya sembunyi.
     JANGAN DIUBAH
  ══════════════════════════════════════════ */

  const tabBtns   = document.querySelectorAll('.ptab');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab; // ambil nilai data-tab="song" dll.

      // Jika tab yang diklik sudah aktif, tidak perlu lakukan apa-apa
      if (btn.classList.contains('active')) return;

      // ─── Reset semua tab button ───
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      // ─── Aktifkan tab button yang diklik ───
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // ─── Reset semua panel ───
      tabPanels.forEach(panel => panel.classList.remove('active'));

      // ─── Tampilkan panel yang sesuai ───
      const targetPanel = document.getElementById(`tab-${targetId}`);
      if (targetPanel) {
        targetPanel.classList.add('active');

        // Jalankan animasi reveal untuk card di tab baru
        // Delay bertingkat: setiap card muncul sedikit setelah card sebelumnya
        targetPanel.querySelectorAll('[data-reveal]').forEach((el, i) => {
          el.classList.remove('visible');
          // setTimeout memberi jeda kecil agar animasi terasa berurutan
          setTimeout(() => el.classList.add('visible'), i * 60);
        });
      }
    });
  });


  /* ══════════════════════════════════════════
     5. REVEAL ANIMATION — SCROLL OBSERVER
     ──────────────────────────────────────────
     Elemen dengan [data-reveal] akan muncul
     perlahan saat masuk viewport.
     JANGAN DIUBAH
  ══════════════════════════════════════════ */

  const revealEls = document.querySelectorAll('[data-reveal]');

  // IntersectionObserver: lebih efisien daripada event scroll biasa
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Hentikan pengamatan setelah muncul sekali (lebih hemat resource)
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,               // muncul saat 10% elemen terlihat
    rootMargin: '0px 0px -40px 0px' // buffer 40px dari bawah viewport
  });

  // Tambahkan delay bertingkat agar card muncul berurutan
  revealEls.forEach((el, i) => {
    // (i % 4) mengulang delay setiap 4 elemen: 0, 1, 2, 3, 0, 1, 2, 3...
    el.style.transitionDelay = (i % 4) * 0.07 + 's';
    revealObserver.observe(el);
  });


  /* ══════════════════════════════════════════
     6. STAT COUNTERS — ANIMASI ANGKA
     ──────────────────────────────────────────
     Angka di hero akan beranimasi dari 1 ke target
     saat masuk viewport. Mengulang jika di-scroll kembali.
     JANGAN DIUBAH
  ══════════════════════════════════════════ */

  const statCounters = document.querySelectorAll('.stat-counter');

  /**
   * Animasikan angka dari 1 ke target dalam durasi tertentu.
   * @param {HTMLElement} el      - elemen yang akan dianimasikan
   * @param {number}      target  - angka tujuan
   * @param {number}      duration - durasi dalam milidetik
   */
  const animateStat = (el, target, duration = 1000) => {
    const suffix    = el.dataset.countSuffix || '';
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed  = Math.min(now - startTime, duration);
      const progress = elapsed / duration;
      // Efek "ease-out": cepat di awal, melambat di akhir
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.max(1, Math.ceil(target * eased));

      el.textContent = `${value}${suffix}`;

      // Lanjutkan animasi jika belum selesai
      if (elapsed < duration) {
        el._statRaf = requestAnimationFrame(tick);
      }
    };

    // Batalkan animasi sebelumnya jika masih berjalan
    if (el._statRaf) cancelAnimationFrame(el._statRaf);
    el._statRaf = requestAnimationFrame(tick);
  };

  // Observer untuk memulai animasi angka saat masuk viewport
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el     = entry.target;
      const target = Number(el.dataset.countTarget) || 0;
      const suffix = el.dataset.countSuffix || '';

      if (entry.isIntersecting && target > 0) {
        // Mulai animasi
        animateStat(el, target, 1000);
      } else {
        // Reset ke 1 agar animasi bisa diulang saat di-scroll kembali
        if (el._statRaf) cancelAnimationFrame(el._statRaf);
        el.textContent = `1${suffix}`;
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px -20px 0px'
  });

  // Inisialisasi semua counter
  statCounters.forEach(el => {
    // Jika data-count-target belum ada, coba ambil dari teks elemen
    if (!el.dataset.countTarget) {
      const match = el.textContent.trim().match(/^(\d+)/);
      if (match) el.dataset.countTarget = match[1];
    }

    // Reset ke nilai awal sebelum mulai observe
    const suffix = el.dataset.countSuffix || '';
    el.textContent = `1${suffix}`;
    counterObserver.observe(el);
  });


  /* ══════════════════════════════════════════
     6. CONTACT FORM — SUBMIT
     ──────────────────────────────────────────
     Saat ini hanya simulasi (tidak dikirim ke server).
     Untuk menghubungkan ke backend nyata,
     ganti bagian setTimeout di bawah dengan
     fetch() ke API Anda.
     BOLEH DIUBAH (bagian fetch/API)
  ══════════════════════════════════════════ */

  const ctForm = document.getElementById('ctForm');
  const cfOk   = document.getElementById('cfOk');

  ctForm.addEventListener('submit', (e) => {
    e.preventDefault(); // cegah reload halaman

    // Ambil nilai form
    const name  = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const msg   = document.getElementById('cf-msg').value.trim();

    // Validasi sederhana
    if (!name || !email || !msg) {
      alert('Mohon isi semua kolom yang diperlukan.');
      return;
    }

    const submitBtn = ctForm.querySelector('button[type="submit"]');

    // ─── Loading state ───
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Mengirim...';

    // ======================================
    // BOLEH DIUBAH: ganti setTimeout ini
    // dengan fetch() ke API Anda jika ingin
    // form benar-benar mengirim data.
    //
    // Contoh dengan fetch:
    // fetch('https://api-anda.com/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, msg })
    // })
    //   .then(res => res.json())
    //   .then(data => { /* tampilkan sukses */ })
    //   .catch(err => { /* tampilkan error */ });
    // ======================================
    setTimeout(() => {
      // Tampilkan pesan sukses
      cfOk.classList.add('show');
      ctForm.reset();

      // Reset tombol ke kondisi semula
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
        Kirim Pesan
      `;

      // ======================================
      // BOLEH DIUBAH: durasi pesan sukses tampil (ms)
      // ======================================
      setTimeout(() => cfOk.classList.remove('show'), 4000);

    }, 1200); // simulasi delay jaringan 1.2 detik
  });


}); // ── End DOMContentLoaded ──
