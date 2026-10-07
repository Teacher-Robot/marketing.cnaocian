const deck = document.getElementById('deck');
const progress = document.getElementById('progress');
const counter = document.getElementById('counter');
const dots = document.getElementById('dots');
let index = 0;
let touchStartX = null;

function bulletsHtml(items = []) {
  return items.map(item => `<div class="bullet">◉ ${item}</div>`).join('');
}

function renderSlides() {
  slides.forEach((s, i) => {
    const section = document.createElement('section');
    section.className = `slide${i === 0 ? ' active' : ''}${s.final ? ' final-slide' : ''}${s.compact ? ' compact-slide' : ''}`;
    section.dataset.index = i;

    if (s.final) {
      section.innerHTML = `
        <div class="content">
          <div class="final-kicker">CNA OCIAN • MARKETING DIGITAL</div>
          <h1 class="title final-title">GRANDES<br>RESULTADOS</h1>
          <p class="final-quote">Não acontecem por acaso.</p>
          <p class="final-promise">Eles são planejados.</p>
          <p class="final-support">${s.subtitle}</p>
          <p class="body">${s.body}</p>
          <div class="final-sign"><span></span><div>CNA Ocian • Marketing que gera matrículas</div></div>
        </div>
        <div class="visual final-visual">
          <img src="${s.image}" alt="${s.alt}">
        </div>`;
    } else {
      section.innerHTML = `
        <div class="content">
          <span class="num">${String(i + 1).padStart(2, '0')}</span>
          ${s.tag ? `<div><span class="badge">${s.tag}</span></div>` : ''}
          <h1 class="title">${s.title}</h1>
          <div class="subtitle">${s.subtitle}</div>
          <p class="body">${s.body}</p>
          <div class="bullets">${bulletsHtml(s.bullets)}</div>
        </div>
        <div class="visual">
          <img src="${s.image}" alt="${s.alt}" loading="eager">
        </div>`;
    }
    deck.appendChild(section);

    const dot = document.createElement('button');
    dot.className = `dot${i === 0 ? ' active' : ''}`;
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
    dot.addEventListener('click', () => show(i));
    dots.appendChild(dot);
  });
}

function show(nextIndex) {
  index = (nextIndex + slides.length) % slides.length;
  document.querySelectorAll('.slide').forEach((slide, i) => slide.classList.toggle('active', i === index));
  document.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
  progress.style.width = `${((index + 1) / slides.length) * 100}%`;
  counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
}

function next() { show(index + 1); }
function prev() { show(index - 1); }

document.getElementById('next').addEventListener('click', next);
document.getElementById('prev').addEventListener('click', prev);

document.addEventListener('keydown', event => {
  if (['ArrowRight', ' ', 'PageDown'].includes(event.key)) { event.preventDefault(); next(); }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); prev(); }
  if (event.key === 'Home') { event.preventDefault(); show(0); }
  if (event.key === 'End') { event.preventDefault(); show(slides.length - 1); }
});

document.addEventListener('touchstart', event => { touchStartX = event.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', event => {
  if (touchStartX === null) return;
  const dx = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 45) (dx < 0 ? next : prev)();
  touchStartX = null;
}, { passive: true });

document.getElementById('fullscreen').addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch (_) {}
});

renderSlides();
show(0);
