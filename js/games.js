// Joguinhos. Cada jogo: run(box, ctx, done) -> função de limpeza.
// done({ score: 0..3, resumo: 'texto' })
window.MP = window.MP || {};

(function () {
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function vibrate(ms) {
    try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* sem vibração */ }
  }

  // ---------- 1. Buquê ----------
  function bouquet(box, ctx, done) {
    const DUR = 20;
    const GOOD = ['🌹', '🌷', '🌻', '🌸', '💐', '🌼'];
    const BAD = ['🌵', '🐝'];
    let t = DUR, over = false, bad = 0;
    const picked = [];
    const timers = [];

    box.innerHTML = `
      <div class="g-top"><b id="gt">${DUR}s</b><span>Buquê pra ${esc(ctx.ela)}</span><b id="gc">0 🌹</b></div>
      <div class="field" id="fld"></div>
      <div class="bouquet" id="bq"><span class="muted">O buquê começa vazio…</span></div>`;
    const fld = box.querySelector('#fld');
    const bq = box.querySelector('#bq');
    const gt = box.querySelector('#gt');
    const gc = box.querySelector('#gc');

    function spawn() {
      if (over || fld.children.length > 6) return;
      const isBad = Math.random() < 0.25;
      const el = document.createElement('button');
      el.className = 'pick' + (isBad ? ' bad' : '');
      el.textContent = pick(isBad ? BAD : GOOD);
      el.setAttribute('aria-label', isBad ? 'espinho' : 'flor');
      el.style.left = rnd(3, 78) + '%';
      el.style.top = rnd(3, 76) + '%';
      const life = setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 200); }, 1500);
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        clearTimeout(life);
        el.remove();
        if (isBad) {
          bad++;
          fld.classList.remove('hurt'); void fld.offsetWidth; fld.classList.add('hurt');
          vibrate(60);
        } else {
          picked.push(el.textContent);
          bq.textContent = picked.join('');
          gc.textContent = picked.length + ' 🌹';
          vibrate(15);
        }
      });
      fld.appendChild(el);
    }

    function end() {
      if (over) return;
      over = true;
      clean();
      const net = picked.length - bad * 2;
      const score = net >= 8 ? 3 : net >= 5 ? 2 : net >= 2 ? 1 : 0;
      done({ score, resumo: `${picked.length} flores e ${bad} espinho${bad === 1 ? '' : 's'}` });
    }

    function clean() { timers.forEach((id) => { clearInterval(id); clearTimeout(id); }); }

    timers.push(setInterval(spawn, 520));
    timers.push(setInterval(() => {
      t--;
      gt.textContent = t + 's';
      if (t <= 0) end();
    }, 1000));
    spawn();
    return () => { over = true; clean(); };
  }

  // ---------- 2. Palavras que caem ----------
  function words(box, ctx, done) {
    const DUR = 25;
    const GOOD = ['Elogio', 'Escutar', 'Abraço', 'Bom dia', 'Obrigado', 'Bilhete', 'Carinho', 'Olhar nos olhos'];
    const BAD = ['Celular', 'Ignorar', 'Gritar', 'Desculpa de sempre', 'Ficar quieto', 'Comparar', 'Ironia', 'Cobrar'];
    let t = DUR, over = false, good = 0, bad = 0, acc = 0, raf = 0;
    const items = [];
    const timers = [];

    box.innerHTML = `
      <div class="g-top"><b id="gt">${DUR}s</b><span>Pega o que aproxima</span><b id="gc">0</b></div>
      <div class="field tall" id="fld"></div>
      <p class="muted center small">Toque no que aproxima. Evite o que afasta.</p>`;
    const fld = box.querySelector('#fld');
    const gt = box.querySelector('#gt');
    const gc = box.querySelector('#gc');

    function spawn() {
      const isBad = Math.random() < 0.45;
      const el = document.createElement('button');
      el.className = 'word' + (isBad ? ' bad' : '');
      el.textContent = pick(isBad ? BAD : GOOD);
      fld.appendChild(el);
      const it = { el, bad: isBad, x: rnd(0, Math.max(0, fld.clientWidth - el.offsetWidth)), y: -44, v: rnd(70, 120) };
      el.style.transform = `translate(${it.x}px, ${it.y}px)`;
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (over) return;
        const idx = items.indexOf(it);
        if (idx >= 0) items.splice(idx, 1);
        el.classList.add(isBad ? 'hit-bad' : 'hit-good');
        setTimeout(() => el.remove(), 180);
        if (isBad) { bad++; vibrate(60); } else { good++; vibrate(15); }
        gc.textContent = Math.max(0, good - bad * 2);
      });
      items.push(it);
    }

    let last = performance.now();
    function frame(now) {
      if (over) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      acc += dt;
      if (acc > 0.7) { acc = 0; spawn(); }
      const h = fld.clientHeight;
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.v * dt;
        it.el.style.transform = `translate(${it.x}px, ${it.y}px)`;
        if (it.y > h) { it.el.remove(); items.splice(i, 1); }
      }
      raf = requestAnimationFrame(frame);
    }

    function clean() { cancelAnimationFrame(raf); timers.forEach(clearInterval); }

    function end() {
      if (over) return;
      over = true;
      clean();
      const net = good - bad * 2;
      const score = net >= 10 ? 3 : net >= 6 ? 2 : net >= 2 ? 1 : 0;
      done({ score, resumo: `${good} acertos e ${bad} erro${bad === 1 ? '' : 's'}` });
    }

    raf = requestAnimationFrame(frame);
    timers.push(setInterval(() => {
      t--;
      gt.textContent = t + 's';
      if (t <= 0) end();
    }, 1000));
    return () => { over = true; clean(); };
  }

  // ---------- 3. Bandeja do café da manhã ----------
  function tray(box, ctx, done) {
    const DUR = 15, MAX = 6;
    const ITENS = [
      { e: '☕', n: 'Café', ok: true },
      { e: '🥐', n: 'Pão quente', ok: true },
      { e: '📱', n: 'Celular', ok: false },
      { e: '🍓', n: 'Frutas', ok: true },
      { e: '🧃', n: 'Suco', ok: true },
      { e: '📺', n: 'Controle', ok: false },
      { e: '🌸', n: 'Flor', ok: true },
      { e: '💌', n: 'Bilhete', ok: true, nota: true },
      { e: '🧦', n: 'Meia suja', ok: false },
    ];
    let t = DUR, over = false;
    const sel = new Set();
    const timers = [];

    box.innerHTML = `
      <div class="g-top"><b id="gt">${DUR}s</b><span>Café da manhã da ${esc(ctx.ela)}</span><b id="gc">0/${MAX}</b></div>
      <div class="items" id="items">${ITENS.map((it, i) =>
        `<button class="item" data-i="${i}"><span class="em">${it.e}</span><small>${it.n}</small></button>`).join('')}</div>
      <div class="bouquet" id="tr"><span class="muted">Bandeja vazia…</span></div>
      <button class="btn" id="entregar">Entregar a bandeja</button>`;
    const gt = box.querySelector('#gt');
    const gc = box.querySelector('#gc');
    const tr = box.querySelector('#tr');

    function render() {
      const arr = [...sel];
      tr.textContent = arr.length ? arr.map((i) => ITENS[i].e).join(' ') : 'Bandeja vazia…';
      gc.textContent = `${arr.length}/${MAX}`;
    }

    box.querySelector('#items').addEventListener('click', (e) => {
      const b = e.target.closest('.item');
      if (!b || over) return;
      const i = Number(b.dataset.i);
      if (sel.has(i)) { sel.delete(i); b.classList.remove('on'); }
      else if (sel.size < MAX) { sel.add(i); b.classList.add('on'); vibrate(15); }
      render();
    });

    function clean() { timers.forEach(clearInterval); }

    function end() {
      if (over) return;
      over = true;
      clean();
      let good = 0, bad = 0, nota = false;
      sel.forEach((i) => {
        const it = ITENS[i];
        if (it.ok) good++; else bad++;
        if (it.nota) nota = true;
      });
      const pts = good + (nota ? 1 : 0) - bad * 2;
      const score = pts >= 6 ? 3 : pts >= 4 ? 2 : pts >= 2 ? 1 : 0;
      done({ score, resumo: `${good} itens certos${bad ? `, ${bad} errado${bad === 1 ? '' : 's'}` : ''}${nota ? ', com bilhete' : ', sem bilhete'}` });
    }

    box.querySelector('#entregar').addEventListener('click', end);
    timers.push(setInterval(() => {
      t--;
      gt.textContent = t + 's';
      if (t <= 0) end();
    }, 1000));
    return () => { over = true; clean(); };
  }

  // ---------- 4. Memória ----------
  function memory(box, ctx, done) {
    const EMOJIS = ['🌹', '☕', '💌', '🎁', '🎶', '📸'];
    const deck = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
    let first = null, lock = false, moves = 0, found = 0, over = false;
    const timers = [];

    box.innerHTML = `
      <div class="g-top"><b>Jogadas: <span id="gm">0</span></b><span>O que {ela} gosta</span><b id="gc">0/6</b></div>
      <div class="mem" id="mem">${deck.map((e, i) =>
        `<button class="mcard" data-i="${i}" aria-label="carta"><span class="back">?</span><span class="front">${e}</span></button>`).join('')}</div>`
      .replace('{ela}', esc(ctx.ela));
    const gm = box.querySelector('#gm');
    const gc = box.querySelector('#gc');

    box.querySelector('#mem').addEventListener('click', (e) => {
      const c = e.target.closest('.mcard');
      if (!c || lock || over || c.classList.contains('open') || c.classList.contains('done')) return;
      c.classList.add('open');
      vibrate(10);
      if (!first) { first = c; return; }
      moves++;
      gm.textContent = moves;
      const a = first, b = c;
      first = null;
      if (deck[a.dataset.i] === deck[b.dataset.i]) {
        a.classList.add('done'); b.classList.add('done');
        found++;
        gc.textContent = found + '/6';
        if (found === 6) finish();
      } else {
        lock = true;
        timers.push(setTimeout(() => { a.classList.remove('open'); b.classList.remove('open'); lock = false; }, 700));
      }
    });

    function finish() {
      over = true;
      timers.push(setTimeout(() => {
        const score = moves <= 9 ? 3 : moves <= 13 ? 2 : moves <= 18 ? 1 : 0;
        done({ score, resumo: `${moves} jogadas pra achar os 6 pares` });
      }, 600));
    }

    return () => { over = true; timers.forEach((id) => { clearTimeout(id); clearInterval(id); }); };
  }

  MP.games = {
    bouquet: {
      titulo: 'Colha as flores',
      icone: '💐',
      img: 'jogo-buque',
      regra: 'Toque nas flores antes que sumam. Cuidado com os espinhos: eles descontam. Você tem 20 segundos pra montar o buquê dela.',
      fb: MP.gameFb.bouquet,
      run: bouquet,
    },
    words: {
      titulo: 'O que aproxima, o que afasta',
      icone: '🫶',
      img: 'jogo-palavras',
      regra: 'Palavras vão caindo. Toque só nas que aproximam vocês e evite as que afastam. 25 segundos.',
      fb: MP.gameFb.words,
      run: words,
    },
    tray: {
      titulo: 'Monte o café da manhã',
      icone: '☕',
      img: 'jogo-bandeja',
      regra: 'Escolha até 6 itens pra bandeja dela. Você tem 15 segundos. Tem coisa que não deve ir, e tem um item que ela mais vai lembrar.',
      fb: MP.gameFb.tray,
      run: tray,
    },
    memory: {
      titulo: 'Lembra do que ela gosta?',
      icone: '🃏',
      img: 'jogo-memoria',
      regra: 'Vire as cartas e ache os 6 pares com o menor número de jogadas.',
      fb: MP.gameFb.memory,
      run: memory,
    },
  };
})();
