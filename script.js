// ===== CONFIGURACIÓN =====
const START_ISO = '2020-09-08T00:00:00-05:00';

// ===== FOTOS DEL CARRUSEL =====
// Edita este arreglo; cada objeto es una foto con su leyenda.
const photos = [
  { src: 'img/primera-cita.jpg', caption: 'Tuvimos nuestra primera cita 👩‍❤️‍💋‍👨' },
  { src: 'img/viaje1.jpg', caption: 'Tuvimos nuestro primer viaje corto juntos 🏔️' },
  { src: 'img/meme1.jpg', caption: 'Nos tomamos fotos chistosas 🤡' },
  { src: 'img/cumple1.jpg', caption: 'Celebramos muchos cumpleaños juntos 💃🕺' },
  { src: 'img/meses.jpg', caption: 'Celebramos MUCHOS meses de relación 💖' },
  { src: 'img/meme2.jpg', caption: 'Nos tomamos más fotos chistosas 😅' },
  { src: 'img/grado.jpg', caption: '¡Nos graduamos juntos! 👩‍🎓👨‍🎓' },
  { src: 'img/viaje2.jpg', caption: 'Fuimos juntos a la playa 🌊' },
  { src: 'img/comida.jpg', caption: 'Comimos delicioso muchas veces 🤤' },
  { src: 'img/meme3.jpg', caption: 'Nos seguimos tomando fotos chistosas 😝' },
  { src: 'img/amor.JPG', caption: 'Pero sobre todo, nos amamos mucho 💕' },
  { src: 'img/final.jpg', caption: 'Y así seguirá siendo hasta el final 🥰' },
];

// ===== CONTADOR =====
function initCounter() {
  // Mostrar fecha legible
  const startDateEl = document.getElementById('start-date');
  const startDate = new Date(START_ISO);
  startDateEl.textContent = startDate.toLocaleString('es-CO', { dateStyle: 'long' });

  // Elementos del contador
  const el = id => document.getElementById(id);
  const yearsEl = el('years'), monthsEl = el('months'), daysEl = el('days'), 
        hoursEl = el('hours'), minutesEl = el('minutes'), secondsEl = el('seconds'),
        years2El = el('years2');
  
  const pad = n => String(n).padStart(2,'0');
  
  function diffYMDHMS(from, to){
    let y = to.getFullYear() - from.getFullYear();
    let m = to.getMonth() - from.getMonth();
    let d = to.getDate() - from.getDate();
    if (d < 0) { const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0); d += prevMonth.getDate(); m -= 1; }
    if (m < 0) { m += 12; y -= 1; }
    const anchor = new Date(to.getFullYear(), to.getMonth(), to.getDate(), from.getHours(), from.getMinutes(), from.getSeconds());
    let diffMs = to - anchor;
    if (diffMs < 0) { const anchor2 = new Date(anchor.getTime() - 86400000); diffMs = to - anchor2; d -= 1; if (d < 0) { d += 30; m -= 1; if (m < 0) { m += 12; y -= 1; } } }
    const H = Math.floor(diffMs / 3600000);
    const M = Math.floor((diffMs % 3600000) / 60000);
    const S = Math.floor((diffMs % 60000) / 1000);
    return { y, m, d, H, M, S };
  }
  
  function tick(){
    const now = new Date();
    const {y,m,d,H,M,S} = diffYMDHMS(startDate, now);
    yearsEl.textContent = pad(y); monthsEl.textContent = pad(m); daysEl.textContent = pad(d);
    hoursEl.textContent = pad(H); minutesEl.textContent = pad(M); secondsEl.textContent = pad(S);
    years2El.textContent = y;
  }
  
  tick(); 
  setInterval(tick, 1000);
}

// ===== CARRUSEL =====
function initCarousel() {
  const root = document.getElementById('carousel');
  if(!root || !photos.length) return;
  
  const total = photos.length;
  let currentIndex = 0;

  // Crear las tarjetas
  photos.forEach((p,i)=>{
    const a = document.createElement('a');
    a.href = p.src; 
    a.className = 'card'; 
    a.setAttribute('role','button'); 
    a.setAttribute('aria-label', p.caption || `Foto ${i+1}`);
    const img = document.createElement('img'); 
    img.src = p.src; 
    img.alt = p.caption || `Foto ${i+1}`; 
    img.loading = 'lazy';
    const cap = document.createElement('div'); 
    cap.className = 'caption'; 
    cap.textContent = p.caption || '';
    a.appendChild(img); 
    a.appendChild(cap); 
    root.appendChild(a);
  });

  // Función para actualizar las clases de las tarjetas
  function updateCards() {
    const cards = root.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.className = 'card';
      if (index === currentIndex) {
        card.classList.add('active');
      } else if (index === currentIndex - 1) {
        card.classList.add('prev');
      } else if (index === currentIndex + 1) {
        card.classList.add('next');
      }
    });
  }

  // Inicializar con la primera foto activa
  updateCards();

  // Lightbox
  const dlg = document.getElementById('lightbox'); 
  const dlgImg = document.getElementById('lightbox-img');
  
  root.addEventListener('click', e=>{ 
    const card = e.target.closest('.card'); 
    if(!card) return; 
    e.preventDefault(); 
    const src = card.querySelector('img')?.src; 
    if(src){ 
      dlgImg.src = src; 
      dlg.showModal(); 
    } 
  });
  
  dlg?.addEventListener('click', e=>{ 
    const r = dlgImg.getBoundingClientRect(); 
    const out = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom; 
    if(out) dlg.close(); 
  });

  // Control de navegación con botones
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === total - 1;
  }
  
  function goToPhoto(direction) {
    if (direction === 'next' && currentIndex < total - 1) {
      currentIndex++;
    } else if (direction === 'prev' && currentIndex > 0) {
      currentIndex--;
    } else {
      return; // No hacer nada si está en los límites
    }
    
    // Actualizar las tarjetas y botones
    updateCards();
    updateButtons();
  }
  
  prevBtn.addEventListener('click', () => goToPhoto('prev'));
  nextBtn.addEventListener('click', () => goToPhoto('next'));
  
  // Estado inicial de los botones
  updateButtons();
}

// ===== TEXTO ANIMADO =====
function initTyping() {
  const text = `"No te amo como si fueras rosa de sal, topacio
o flecha de claveles que propagan el fuego:
te amo como se aman ciertas cosas oscuras,
secretamente, entre la sombra y el alma.

Te amo como la planta que no florece y lleva
dentro de sí, escondida, la luz de aquellas flores,
y gracias a tu amor vive oscuro en mi cuerpo
el apretado aroma que ascendió de la tierra.

Te amo sin saber cómo, ni cuándo, ni de dónde,
te amo directamente sin problemas ni orgullo:
así te amo porque no sé amar de otra manera,

sino así de este modo en que no soy ni eres,
tan cerca que tu mano sobre mi pecho es mía,
tan cerca que se cierran tus ojos con mi sueño."
-Pablo Neruda (Soneto XVII, Cien sonetos de amor)`;
  const typingEl = document.getElementById('typing');
  let i = 0; 
  
  function type(){ 
    if(i <= text.length){ 
      typingEl.textContent = text.slice(0, i++); 
      setTimeout(type, 28); 
    } 
  }
  
  type();
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
  initCounter();
  initCarousel();
  initTyping();
});