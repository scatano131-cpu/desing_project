/* MiportalU – comportamiento compartido: menú desplegable del logo */
(function () {
  const brand = document.getElementById('brand'), btn = document.getElementById('brandBtn');
  if (!brand || !btn) return;
  const items = () => [...brand.querySelectorAll('.menu a')];
  const set = open => { brand.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
  btn.addEventListener('click', e => { e.stopPropagation(); set(!brand.classList.contains('open')); });
  document.addEventListener('click', e => { if (!brand.contains(e.target)) set(false); });   // clic afuera cierra
  document.addEventListener('keydown', e => {
    const open = brand.classList.contains('open');
    if (e.key === 'Escape' && open) { set(false); btn.focus(); }
    if (open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault(); const l = items(), i = l.indexOf(document.activeElement);
      l[(i + (e.key === 'ArrowDown' ? 1 : -1) + l.length) % l.length].focus();
    }
  });
  btn.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); set(true); items()[0].focus(); } });
})();

/* Acordeón y modal compartidos */
(function () {
  document.addEventListener('click', e => {
    const b = e.target.closest('.acc-btn'); if (!b) return;
    const p = document.getElementById(b.getAttribute('aria-controls')), o = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', !o); p.hidden = o;
  });
  window.Portal = {
    modal(title, html) {
      const prev = document.activeElement, m = document.createElement('div');
      m.className = 'mdl'; m.innerHTML = '<div class="mdl-box" role="dialog" aria-modal="true" aria-label="' + title + '"><div class="mdl-h"><span>' + title + '</span><button type="button" aria-label="Cerrar">&times;</button></div><div class="mdl-b">' + html + '</div></div>';
      const close = () => { m.remove(); document.removeEventListener('keydown', esc); if (prev && prev.focus) prev.focus(); };
      const esc = e => { if (e.key === 'Escape') close(); };
      m.addEventListener('click', e => { if (e.target === m || e.target.closest('.mdl-h button')) close(); });
      document.addEventListener('keydown', esc); document.body.appendChild(m); m.querySelector('.mdl-h button').focus(); return m;
    }
  };
})();

/* Formularios simulados */
(function () {
  Portal.form = function (title, intro, fields, done) {
    const h = fields.map(f => '<div class="fld"><b>' + f.label + '</b>' + (f.type === 'select' ? '<select aria-label="' + f.label + '" data-k="' + f.id + '">' + f.opts.map(o => '<option>' + o + '</option>').join('') + '</select>' : f.type === 'textarea' ? '<textarea rows="3" aria-label="' + f.label + '" data-k="' + f.id + '"></textarea>' : '<input type="' + (f.type || 'text') + '" aria-label="' + f.label + '" data-k="' + f.id + '">') + '</div>').join('');
    const m = Portal.modal(title, (intro ? '<p>' + intro + '</p>' : '') + h + '<button class="btn btn-p" type="button" data-send>Enviar</button><p class="fres" role="status" style="font-weight:700"></p>');
    m.querySelector('[data-send]').onclick = () => {
      const v = {}; let ok = true;
      m.querySelectorAll('[data-k]').forEach(i => { v[i.dataset.k] = i.value.trim(); if (!v[i.dataset.k]) ok = false; });
      const r = m.querySelector('.fres');
      if (!ok) { r.style.color = '#b3261e'; r.textContent = 'Completa todos los campos.'; return; }
      r.style.color = '#2f8a2c'; r.textContent = done(v);
    };
    return m;
  };
})();
