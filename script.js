const COLORS = ["#ff2bd6", "#b14dff", "#4dc4ff", "#5fff8a", "#ffd84d"];

function activarInvitacion() {
    const video = document.getElementById('videoSobre');
    const intro = document.getElementById('contenedor-principal');
    
    // Bloqueamos clics adicionales
    intro.style.pointerEvents = 'none';
    
    video.play().then(() => {
        video.onended = () => transicionAFinal(intro);
    }).catch(() => transicionAFinal(intro));

    // Fail-safe por si el video no carga
    setTimeout(() => { 
        if (intro && !intro.classList.contains('oculto')) transicionAFinal(intro); 
    }, 4500);
}

function transicionAFinal(intro) {
    intro.style.transition = "opacity 0.8s ease";
    intro.style.opacity = '0';
    setTimeout(() => {
        intro.style.display = 'none';
        document.getElementById('seccion-final').classList.remove('oculto');
        window.scrollTo(0, 0);
        iniciarRascado();
        setInterval(actualizarContador, 1000);
    }, 800);
}

function iniciarRascado() {
    const ids = ['c1', 'c2', 'c3'];
    let completados = 0;
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

        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 15; i++) {
            ctx.beginPath(); ctx.moveTo(Math.random()*size, 0); ctx.lineTo(Math.random()*size, size); ctx.stroke();
        }

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
                completados++;
                if (completados === 3) dispararFuegosLovable();
            }
        }
        canvas.addEventListener('mousemove', (e) => e.buttons === 1 && raspar(e));
        canvas.addEventListener('touchmove', raspar, {passive: false});
    });
}

function dispararFuegosLovable() {
    const container = document.getElementById('fireworks-container');
    const bursts = [{ x: 25, y: 35, delay: 0 }, { x: 75, y: 30, delay: 250 }, { x: 50, y: 60, delay: 500 }];
    bursts.forEach((b, bi) => {
        setTimeout(() => {
            const flash = document.createElement('span');
            flash.className = 'firework-flash';
            flash.style.left = b.x + '%'; flash.style.top = b.y + '%';
            container.appendChild(flash);
            setTimeout(() => flash.remove(), 600);
            for (let i = 0; i < 18; i++) {
                const p = document.createElement('span');
                p.className = 'firework-particle';
                const angle = (i / 18) * Math.PI * 2;
                const dist = 80 + Math.random() * 60;
                const color = COLORS[(i + bi) % COLORS.length];
                Object.assign(p.style, {
                    left: b.x + '%', top: b.y + '%', background: color,
                    boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
                    '--tx': `${Math.cos(angle)*dist}px`, '--ty': `${Math.sin(angle)*dist}px`
                });
                container.appendChild(p);
                setTimeout(() => p.remove(), 1500);
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