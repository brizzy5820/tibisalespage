document.addEventListener('DOMContentLoaded', () => {

  /* ---------- ICONS ---------- */
  if (window.lucide) lucide.createIcons();

  /* ---------- HEADER SCROLL STATE ---------- */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  });

  /* ---------- MOBILE NAV ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    lucide.createIcons();
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.innerHTML = '<i data-lucide="menu"></i>';
    lucide.createIcons();
  }));

  /* ---------- TICKER ---------- */
  const tickerTrack = document.getElementById('tickerTrack');
  const tickerMsg = ['NEXT LIVE TRAINING SESSION', 'RESERVE YOUR SEAT'];
  let tickerHTML = '';
  for (let r = 0; r < 2; r++) {
    tickerMsg.forEach(msg => {
      tickerHTML += `<span class="ticker__item"><i data-lucide="dot"></i> ${msg}</span>`;
    });
  }
  // duplicate the whole block once more for a seamless loop
  tickerTrack.innerHTML = tickerHTML + tickerHTML;

  /* ---------- COUNTDOWN ---------- */
  const target = new Date().getTime() + (18 * 60 * 60 * 1000) + (24 * 60 * 1000); // demo countdown
  const countdownValues = {
    hours: document.getElementById('cd-h'),
    minutes: document.getElementById('cd-m'),
    seconds: document.getElementById('cd-s')
  };
  const previousCountdown = {};

  function updateCountdownValue(unit, value) {
    const element = countdownValues[unit];
    if (!element) return;
    if (previousCountdown[unit] === value) return;

    element.classList.remove('is-flipping');
    void element.offsetWidth;
    element.textContent = value;
    element.classList.add('is-flipping');
    previousCountdown[unit] = value;
  }

  function tickCountdown() {
    const now = new Date().getTime();
    let diff = target - now;
    if (diff <= 0) diff = 24 * 60 * 60 * 1000; // loop for placeholder purposes
    const h = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const m = Math.floor(diff / (1000 * 60)) % 60;
    const s = Math.floor(diff / 1000) % 60;
    updateCountdownValue('hours', String(h).padStart(2, '0'));
    updateCountdownValue('minutes', String(m).padStart(2, '0'));
    updateCountdownValue('seconds', String(s).padStart(2, '0'));
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------- LIGHTBOX ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('open');
  }
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });

  /* ---------- WISTIA VIDEO ---------- */
  const wistiaVideo = document.getElementById('wistiaVideo');
  const wistiaUrl = wistiaVideo?.dataset.wistiaUrl?.trim();
  if (wistiaVideo && wistiaUrl) {
    try {
      const url = new URL(wistiaUrl);
      const videoId = url.pathname.match(/\/(?:medias|embed\/iframe)\/([^/?#]+)/)?.[1];
      if (videoId) {
        const player = document.createElement('wistia-player');
        player.setAttribute('media-id', videoId);
        player.setAttribute('fit-strategy', 'contain');
        player.setAttribute('aspect', '1.7778');
        player.setAttribute('fullscreen-control', 'true');
        wistiaVideo.replaceChildren(player);
      }
    } catch (error) {
      console.warn('Use a valid Wistia video URL for the hero video.', error);
    }
  }

  /* ---------- ACHIEVEMENT IMAGE ---------- */
  const achievementImg = document.querySelector('#achievementTrigger img');
  if (achievementImg && window.IMG) {
    achievementImg.src = IMG['achievement'];
    achievementImg.addEventListener('click', () => openLightbox(IMG['achievement']));
  }

  /* ---------- BEFORE / AFTER SLIDESHOWS (synchronized, opposite directions) ---------- */
  function buildTrack(trackId, keys) {
    const track = document.getElementById(trackId);
    if (!track || !window.IMG) return null;
    keys.forEach(k => {
      const img = document.createElement('img');
      img.src = IMG[k];
      img.alt = k;
      track.appendChild(img);
    });
    return { track, len: keys.length, index: 0 };
  }
  function setPos(state, idx) {
    state.index = idx;
    state.track.style.transform = `translateY(-${idx * 100}%)`;
  }

  const beforeState = buildTrack('beforeTrack', ['before1', 'before2', 'before3']);
  const afterState = buildTrack('afterTrack', ['after1', 'after2', 'after3', 'after4', 'after5']);

  if (beforeState) setPos(beforeState, 0);
  if (afterState) setPos(afterState, afterState.len - 1); // starts high so it enters from above on the first tick

  setInterval(() => {
    // both slides advance in the same tick, so they change at the exact same moment
    if (beforeState) {
      const next = (beforeState.index + 1) % beforeState.len; // enters from below
      setPos(beforeState, next);
    }
    if (afterState) {
      const next = (afterState.index - 1 + afterState.len) % afterState.len; // enters from above
      setPos(afterState, next);
    }
  }, 3000);

  /* ---------- TESTIMONIAL CAROUSEL ---------- */
  const testTrack = document.getElementById('testTrack');
  const testDots = document.getElementById('testDots');
  const testimonialKeys = ['testimonial1','testimonial2','testimonial3','testimonial4','testimonial5','testimonial6','testimonial7','testimonial8','testimonial9'];

  if (testTrack && window.IMG) {
    testimonialKeys.forEach(k => {
      const slide = document.createElement('div');
      slide.className = 'testimonial-slide';
      const img = document.createElement('img');
      img.src = IMG[k];
      img.alt = 'Student result screenshot';
      img.loading = 'lazy';
      img.addEventListener('click', () => openLightbox(IMG[k]));

      const enlargeButton = document.createElement('button');
      enlargeButton.className = 'testimonial-enlarge';
      enlargeButton.type = 'button';
      enlargeButton.setAttribute('aria-label', 'Enlarge testimonial image');
      enlargeButton.innerHTML = '<i data-lucide="maximize-2"></i>';
      enlargeButton.addEventListener('click', () => openLightbox(IMG[k]));

      slide.append(img, enlargeButton);
      testTrack.appendChild(slide);
    });
    lucide.createIcons();

    testimonialKeys.forEach((k, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToTestimonial(i));
      testDots.appendChild(dot);
    });

    let testIndex = 0;
    const total = testimonialKeys.length;

    function goToTestimonial(i) {
      testIndex = (i + total) % total;
      testTrack.style.transform = `translateX(-${testIndex * 100}%)`;
      testDots.querySelectorAll('span').forEach((d, di) => d.classList.toggle('active', di === testIndex));
    }

    document.getElementById('testPrev').addEventListener('click', () => goToTestimonial(testIndex - 1));
    document.getElementById('testNext').addEventListener('click', () => goToTestimonial(testIndex + 1));

    let autoplayPaused = false;
    const autoplay = setInterval(() => {
      if (!autoplayPaused) goToTestimonial(testIndex + 1);
    }, 4000);
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    testimonialCarousel.addEventListener('mouseenter', () => { autoplayPaused = true; });
    testimonialCarousel.addEventListener('mouseleave', () => { autoplayPaused = false; });

    // swipe support
    let startX = 0;
    let isDragging = false;
    const testWindow = document.getElementById('testWindow');
    testWindow.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      autoplayPaused = true;
    }, { passive: true });
    testWindow.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      autoplayPaused = false;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 40) {
        diff < 0 ? goToTestimonial(testIndex + 1) : goToTestimonial(testIndex - 1);
      }
    }, { passive: true });
  }

  /* ---------- FAQ ---------- */
  const faqData = [
    { q: 'Do I need a laptop to start?', a: 'No. Everything inside the Beginners Income Guide is built to be followed from a smartphone — the same one you already own.' },
    { q: 'How soon can I start earning?', a: 'It depends on how consistently you apply the steps, but most students start seeing their first real movement within the first two to three weeks of the bootcamp.' },
    { q: 'Do I need followers or to already be a content creator?', a: 'Not at all. This program is built for complete beginners — no audience, no personal brand and no prior online experience required.' },
    { q: "I'm a student or I work a 9–5. Will I have time for this?", a: 'Yes. The lessons and weekly action steps are designed around short, focused sessions so you can fit them around school or work.' },
    { q: "I've bought courses before and they didn't work. How is this different?", a: 'This isn\'t a course you watch alone. You get a live 4-week bootcamp, direct access to Coach Tibi, and a community holding you accountable the whole way.' },
    { q: 'Will I need to spend extra money after paying?', a: 'No hidden fees. Your one-time payment covers the full guide, the bootcamp and community access.' },
    { q: "I'm shy and don't like posting myself online. Can I still do this?", a: 'Yes. The skill taught inside doesn\'t require showing your face or personality on camera to get results.' },
    { q: 'What happens if I miss this training round?', a: 'Your access to the guide and community stays active, so you can catch up on replays and keep moving with the next live session.' },
    { q: 'Is the market already saturated?', a: 'No — new buyers and new opportunities show up online every single day. What matters is knowing the right approach, which is exactly what you\'ll learn.' },
    { q: 'Do you offer refunds?', a: 'Because this is a digital program with instant access, all sales are final. We\'re fully committed to supporting you through the material instead.' }
  ];
  const accordion = document.getElementById('accordion');
  faqData.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'faq-item';
    el.innerHTML = `
      <div class="faq-item__q"><span>${item.q}</span><i data-lucide="plus"></i></div>
      <div class="faq-item__a"><div>${item.a}</div></div>
    `;
    accordion.appendChild(el);
    const qEl = el.querySelector('.faq-item__q');
    const aEl = el.querySelector('.faq-item__a');
    qEl.addEventListener('click', () => {
      const isOpen = el.classList.contains('open');
      accordion.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-item__a').style.maxHeight = null;
      });
      if (!isOpen) {
        el.classList.add('open');
        aEl.style.maxHeight = aEl.scrollHeight + 'px';
      }
    });
  });
  lucide.createIcons();

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

});
