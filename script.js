const COLORS = ["#ff2bd6", "#b14dff", "#4dc4ff", "#5fff8a", "#ffd84d", "#fff", "#f5d67e"];

function activarInvitacion() {
    try {
        const video = document.getElementById('videoSobre');
        const intro = document.getElementById('contenedor-principal');
        const musica = document.getElementById('musicaInvitacion');
        const musicIcon = document.getElementById('music-toggle');
        const btnTexto = document.getElementById('btn-toca-abrir');

        if (intro) intro.style.pointerEvents = 'none';
        
        if (btnTexto) {
            btnTexto.innerHTML = "ABRIENDO...";
            btnTexto.style.background = "var(--fuchsia)";
        }

        if (musica) {
            let p = musica.play();
            if (p !== undefined) p.catch(e => console.log("Audio block:", e));
        }
        
        if (musicIcon) musicIcon.style.display = 'flex';

        let yaAbrio = false;
        const abrir = () => {
            if (!yaAbrio) {
                yaAbrio = true;
                transicionAFinal(intro);
            }
        };

        if (video) {
            let v = video.play();
            if (v !== undefined) {
                v.then(() => {
                    video.onended = abrir;
                }).catch(() => abrir());
            } else {
                video.onended = abrir;
            }
        } else {
            abrir();
        }

        setTimeout(abrir, 3500);
        
    } catch (err) {
        console.error("Error:", err);
        const intro = document.getElementById('contenedor-principal');
        if (intro) transicionAFinal(intro);
    }
}

function toggleMusic() {
    const musica = document.getElementById('musicaInvitacion');
    const icon = document.getElementById('music-toggle');
    if(!musica || !icon) return;
    
    if (musica.paused) {
        musica.play();
        icon.classList.remove('music-off');
        icon.classList.add('music-on');
        icon.innerHTML = '<i class="fa-solid fa-music"></i>';
    } else {
        musica.pause();
        icon.classList.remove('music-on');
        icon.classList.add('music-off');
        icon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
}

function transicionAFinal(intro) {
   if (intro) {
       intro.style.transition = "opacity 0.8s ease";
       intro.style.opacity = '0';
   }
   setTimeout(() => {
       if (intro) intro.style.display = 'none';
       const seccionFinal = document.getElementById('seccion-final');
       if (seccionFinal) seccionFinal.classList.remove('oculto');
       window.scrollTo(0, 0);
       iniciarRascado();
       setInterval(actualizarContador, 1000);
       iniciarAnimacionesScroll();
   }, 800);
}

function iniciarAnimacionesScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function iniciarRascado() {
   const ids = ['c1', 'c2', 'c3'];
   let completados = 0;
   let finalizadosGlobal = false;
   const size = 95;

   ids.forEach(id => {
       const canvas = document.getElementById(id);
       if(!canvas) return;
       const ctx = canvas.getContext('2d', { willReadFrequently: true });
       let finalizado = false;

       const grad = ctx.createRadialGradient(size*0.35, size*0.35, 5, size/2, size/2, size/2);
       grad.addColorStop(0, "#fff5b8");
       grad.addColorStop(0.4, "#d4af37");
       grad.addColorStop(1, "#7a5c10");
       ctx.fillStyle = grad;
       ctx.beginPath(); ctx.arc(size/2, size/2, size/2, 0, Math.PI*2); ctx.fill();

       function raspar(e) {
           e.preventDefault();
           const rect = canvas.getBoundingClientRect();
           const clientX = e.touches ? e.touches[0].clientX : e.clientX;
           const clientY = e.touches ? e.touches[0].clientY : e.clientY;
           const x = clientX - rect.left;
           const y = clientY - rect.top;
           ctx.globalCompositeOperation = 'destination-out';
           ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
           const pixels = ctx.getImageData(0, 0, size, size).data;
           let clear = 0;
           for (let i = 3; i < pixels.length; i += 64) { if (pixels[i] === 0) clear++; }
           if (clear > (pixels.length / 64) * 0.55 && !finalizado) {
               finalizado = true;
               canvas.style.transition = "opacity 0.6s";
               canvas.style.opacity = "0";
               canvas.style.pointerEvents = "none";
               completados++;
               if (completados === 3 && !finalizadosGlobal) {
                   finalizadosGlobal = true;
                   dispararFuegosMegabrillantes();
               }
           }
       }
       canvas.addEventListener('mousemove', (e) => e.buttons === 1 && raspar(e));
       canvas.addEventListener('touchmove', raspar, {passive: false});
   });
}

function dispararFuegosMegabrillantes() {
   const container = document.getElementById('fireworks-container');
   if(!container) return;
   
   const bursts = [
       { x: 16, y: 50, delay: 0 },   
       { x: 50, y: 50, delay: 200 },  
       { x: 84, y: 50, delay: 400 }   
   ];
   
   bursts.forEach((b, bi) => {
       setTimeout(() => {
           const flash = document.createElement('span');
           flash.className = 'firework-flash';
           flash.style.left = b.x + '%'; flash.style.top = b.y + '%';
           flash.style.background = (bi === 1) ? "var(--fuchsia)" : "var(--cyan)";
           container.appendChild(flash);
           setTimeout(() => flash.remove(), 800);

           const particleCount = 80; 
           for (let i = 0; i < particleCount; i++) {
               const p = document.createElement('span');
               p.className = 'firework-particle';
               
               const angle = Math.random() * Math.PI * 2;
               const dist = 100 + Math.random() * 250; 
               const duration = 1.5 + Math.random() * 1;
               const color = COLORS[Math.floor(Math.random() * COLORS.length)];
               
               Object.assign(p.style, {
                   left: b.x + '%',
                   top: b.y + '%',
                   background: color,
                   boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
                   '--tx': `${Math.cos(angle) * dist}px`,
                   '--ty': `${Math.sin(angle) * dist}px`,
                   animationDuration: `${duration}s`
               });
               
               container.appendChild(p);
               setTimeout(() => p.remove(), duration * 1000);
           }
       }, b.delay);
   });
}

function actualizarContador() {
   const meta = new Date("2026-06-13T21:00:00").getTime();
   const dif = meta - new Date().getTime();
   if (dif > 0) {
       document.getElementById('days').innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
       document.getElementById('hours').innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
       document.getElementById('minutes').innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
       document.getElementById('seconds').innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
   }
}