// Fluxo do quiz: telas, XP, feedbacks aleatórios e resultado.
(function () {
  const { config, questions, sequence, generic, levels, games } = MP;
  const $ = (s) => document.querySelector(s);
  const stage = $('#stage');
  const hud = $('#hud');

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const totalQuestions = sequence.filter((s) => s.k === 'q').length;

  let st;
  function fresh() {
    return {
      i: -1, nome: '', frase: 'aquilo que te encantou nela',
      xp: 0, nivel: 0, streak: 0,
      cats: {}, tags: {}, jogo: { got: 0, max: 0 },
      usados: new Set(), limpar: null, qn: 0, nota: null,
    };
  }

  // ---------- utilidades ----------
  function ela() { return st.nome || 'ela'; }
  function tpl(s) {
    return s
      .replace(/\{Ela\}/g, esc(st.nome || 'Ela'))
      .replace(/\{ela\}/g, esc(ela()))
      .replace(/\{frase\}/g, esc(st.frase));
  }
  function sorteia(pool) {
    const livres = pool.filter((l) => !st.usados.has(l));
    const lista = livres.length ? livres : pool;
    const l = lista[Math.floor(Math.random() * lista.length)];
    st.usados.add(l);
    return l;
  }
  function mostra(html, cls) {
    if (st.limpar) { st.limpar(); st.limpar = null; }
    stage.innerHTML = `<section class="screen ${cls || ''}">${html}</section>`;
    window.scrollTo(0, 0);
    hydrateSlots();
  }
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('on'), 2200);
  }

  // Espaço de imagem: usa o arquivo se existir, senão mostra o lugar reservado.
  function slot(chave) {
    const im = config.images[chave];
    if (!im) return '';
    return `<div class="slot" data-src="${esc(im.src)}" style="aspect-ratio:${im.ratio}">
      <span class="slot-txt"><b>${esc(im.label)}</b><small>${esc(im.src)}</small></span></div>`;
  }
  function hydrateSlots() {
    stage.querySelectorAll('.slot[data-src]').forEach((el) => {
      const img = new Image();
      img.onload = () => { el.classList.add('has'); el.innerHTML = ''; img.alt = ''; el.appendChild(img); };
      img.src = el.dataset.src;
    });
  }

  // ---------- HUD ----------
  function atualizaHud() {
    hud.hidden = false;
    $('#hudLvl').textContent = `Nv ${st.nivel + 1} · ${levels[st.nivel].nome}`;
    $('#hudXp').textContent = `⚡ ${st.xp}`;
    const s = $('#hudStreak');
    s.hidden = st.streak < 2;
    s.textContent = `🔥 ${st.streak}`;
    $('#hudBar').style.width = Math.max(0, st.i) / sequence.length * 100 + '%';
  }
  function ganhaXp(n) {
    st.xp += n;
    let sobe = false;
    while (st.nivel < levels.length - 1 && st.xp >= levels[st.nivel + 1].xp) { st.nivel++; sobe = true; }
    atualizaHud();
    if (sobe) toast(`Subiu de nível: ${levels[st.nivel].nome}`);
  }
  function bate(cat, got, max) {
    const c = st.cats[cat] || (st.cats[cat] = { got: 0, max: 0 });
    c.got += got; c.max += max;
  }

  // ---------- telas ----------
  function intro() {
    hud.hidden = true;
    mostra(`
      <img class="logo" src="${esc(config.logo)}" alt="${esc(config.produto)}">
      ${slot('hero')}
      <p class="kicker">${esc(config.produto)}</p>
      <h1>Seu casamento ainda tem jeito?</h1>
      <p class="lead">15 perguntas, 4 joguinhos e zero sermão. Feito de homem pra homem. Responde sem mentir: dura uns 5 minutos.</p>
      <button class="btn" id="go">Começar</button>
      <p class="muted center small">Sem enrolação. Sem julgamento.</p>`, 'intro');
    $('#go').addEventListener('click', () => { st = fresh(); proximo(); });
  }

  function proximo() {
    st.i++;
    if (st.i >= sequence.length) return processando();
    atualizaHud();
    const passo = sequence[st.i];
    if (passo.k === 'q') pergunta(passo.id); else jogoIntro(passo.id);
  }

  function pergunta(id) {
    const q = questions[id];
    st.qn++;
    const texto = tpl(q.texto);
    let corpo = '';
    if (q.tipo === 'texto') {
      corpo = `<input class="input" id="ans" type="text" maxlength="24" autocomplete="off" placeholder="${esc(q.placeholder)}">
        <button class="btn" id="ok">Continuar</button>`;
    } else if (q.tipo === 'escala') {
      corpo = `<div class="scale">${Array.from({ length: 11 }, (_, n) => `<button class="num" data-n="${n}">${n}</button>`).join('')}</div>
        <div class="scale-lbl"><span>Tanto faz</span><span>Quero muito</span></div>`;
    } else {
      corpo = `<div class="opts">${q.opcoes.map((o, i) => `<button class="opt" data-i="${i}">${esc(o.t)}</button>`).join('')}</div>`;
    }
    mostra(`
      <div class="qhead"><span class="chip">Pergunta ${st.qn} de ${totalQuestions}</span>${q.cat ? `<span class="chip alt">${esc(q.cat)}</span>` : ''}</div>
      <h2>${texto}</h2>
      ${q.dica ? `<p class="hint">${esc(q.dica)}</p>` : ''}
      ${corpo}
      <div id="fbArea"></div>`, 'q');

    if (q.tipo === 'texto') {
      const inp = $('#ans');
      const enviar = () => {
        const v = inp.value.trim().replace(/\s+/g, ' ');
        if (!v) { inp.classList.add('err'); inp.focus(); return; }
        st.nome = v.split(' ').map(cap).join(' ');
        resposta(q, { fb: q.fb }, 'neutral', 0);
      };
      $('#ok').addEventListener('click', enviar);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') enviar(); });
      inp.addEventListener('input', () => inp.classList.remove('err'));
      setTimeout(() => inp.focus({ preventScroll: true }), 50);
    } else if (q.tipo === 'escala') {
      stage.querySelectorAll('.num').forEach((b) => b.addEventListener('click', () => {
        const n = Number(b.dataset.n);
        st.nota = n;
        b.classList.add('sel');
        const nivel = n <= 4 ? 'low' : n <= 7 ? 'mid' : 'high';
        resposta(q, { fb: q.fb[nivel] }, 'neutral', 0);
      }));
    } else {
      stage.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
        const o = q.opcoes[Number(b.dataset.i)];
        b.classList.add('sel');
        if (o.frase) st.frase = o.frase;
        if (o.tag) st.tags[id] = o.tag;
        const nivel = o.s == null ? 'neutral' : o.s >= 3 ? 'good' : o.s === 2 ? 'mid' : 'bad';
        if (q.cat && o.s != null) bate(q.cat, o.s, 3);
        resposta(q, o, nivel, o.s);
      }));
    }
  }

  function resposta(q, o, nivel, s) {
    // trava as opções e mostra o feedback
    stage.querySelectorAll('.opt, .num, #ok, #ans').forEach((el) => { el.disabled = true; });
    let pool;
    if (Array.isArray(o.fb)) pool = o.fb;
    else if (Array.isArray(q.fb)) pool = q.fb;
    else if (q.fb && q.fb[nivel]) pool = [...q.fb[nivel], ...generic[nivel]];
    else pool = generic[nivel];

    let ganho = 10;
    if (s != null) {
      if (s >= 2) { st.streak++; } else { st.streak = 0; }
      if (s >= 3) ganho += 5;
    }
    ganhaXp(ganho);

    const area = $('#fbArea');
    area.innerHTML = `
      <div class="fb ${nivel}"><p>${tpl(sorteia(pool))}</p><span class="gain">+${ganho} XP</span></div>
      <button class="btn" id="next">Continuar</button>`;
    area.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    $('#next').addEventListener('click', proximo);
  }

  // ---------- jogos ----------
  function jogoIntro(id) {
    const g = games[id];
    mostra(`
      ${slot(g.img)}
      <div class="qhead"><span class="chip alt">Joguinho</span></div>
      <h2>${g.icone} ${esc(g.titulo)}</h2>
      <p class="lead">${esc(g.regra)}</p>
      <button class="btn" id="play">Bora</button>`, 'q');
    $('#play').addEventListener('click', () => jogar(id));
  }

  function jogar(id) {
    const g = games[id];
    mostra(`<div id="gbox"></div>`, 'game');
    st.limpar = g.run($('#gbox'), { ela: ela(), nome: st.nome }, (r) => jogoFim(id, r));
  }

  function jogoFim(id, r) {
    const g = games[id];
    const nivel = r.score >= 3 ? 'good' : r.score === 2 ? 'mid' : 'bad';
    st.jogo.got += r.score; st.jogo.max += 3;
    st.streak = r.score >= 2 ? st.streak + 1 : 0;
    const ganho = 10 + r.score * 8;
    ganhaXp(ganho);
    const estrelas = [1, 2, 3].map((n) => `<span class="${n <= r.score ? 'on' : ''}">★</span>`).join('');
    mostra(`
      <div class="stars">${estrelas}</div>
      <h2 class="center">${r.score >= 3 ? 'Mandou bem' : r.score === 2 ? 'Foi razoável' : r.score === 1 ? 'Dava pra melhor' : 'Não foi dessa vez'}</h2>
      <p class="muted center">${esc(r.resumo)}</p>
      <div class="fb ${nivel}"><p>${tpl(sorteia(g.fb[nivel]))}</p><span class="gain">+${ganho} XP</span></div>
      <button class="btn" id="next">Continuar</button>`, 'q');
    $('#next').addEventListener('click', proximo);
  }

  // ---------- resultado ----------
  function processando() {
    st.i = sequence.length;
    atualizaHud();
    const passos = [
      `Lendo as respostas de ${esc(ela())}…`,
      'Cruzando o que afasta vocês…',
      'Montando seu diagnóstico…',
    ];
    mostra(`
      <div class="loading"><div class="spinner"></div>
      <ul>${passos.map((p, n) => `<li style="animation-delay:${n * 0.9}s">${p}</li>`).join('')}</ul></div>`, 'q');
    setTimeout(resultado, 3000);
  }

  function pct(c) { return c.max ? Math.round((c.got / c.max) * 100) : 0; }

  function resultado() {
    const geral = Object.values(st.cats).reduce((a, c) => ({ got: a.got + c.got, max: a.max + c.max }), { got: st.jogo.got, max: st.jogo.max });
    const indice = pct(geral);
    const perfil = MP.perfis.find((p) => indice <= p.ate);
    const cats = { ...st.cats, Jogos: st.jogo };
    const barras = Object.entries(cats).map(([nome, c]) => {
      const p = pct(c);
      const cor = p >= 66 ? 'good' : p >= 36 ? 'mid' : 'bad';
      return `<div class="cat"><div class="cat-h"><span>${esc(nome)}</span><b>${p}%</b></div><div class="bar ${cor}"><i style="width:${p}%"></i></div></div>`;
    }).join('');
    const afasta = MP.afastaTexto[st.tags.afasta];
    const comp = MP.compromissoTexto[st.tags.compromisso];
    const cta = config.finalCta;
    const finalHtml = cta
      ? `<div class="cta"><h3>${esc(cta.titulo)}</h3><p>${esc(cta.texto)}</p><a class="btn" href="${esc(cta.url)}">${esc(cta.botao)}</a></div>`
      : `<div class="cta placeholder"><b>Final do quiz: a definir</b><p>Aqui entra a chamada final (captura, oferta ou próximo passo). Edite em <code>js/config.js</code>.</p></div>`;

    mostra(`
      ${slot('resultado')}
      <p class="kicker">Diagnóstico de ${esc(ela())}</p>
      <div class="score"><span class="score-n">${indice}<small>%</small></span><span class="score-l">Índice de presença</span></div>
      <h2 class="center">${esc(perfil.nome)}</h2>
      <p class="lead">${tpl(perfil.texto)}</p>
      <div class="cats">${barras}</div>
      ${afasta ? `<div class="note"><b>O que mais afasta vocês</b><p>${esc(afasta)}</p></div>` : ''}
      ${comp ? `<div class="note"><b>Sua decisão</b><p>${esc(comp)}</p></div>` : ''}
      ${finalHtml}
      <button class="btn ghost" id="again">Refazer o quiz</button>`, 'result');
    $('#again').addEventListener('click', intro);
  }

  st = fresh();
  intro();
})();
