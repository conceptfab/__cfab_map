const data = window.CFAB_CONCEPT_DATA;
const byId = new Map(data.nodes.map(node => [node.id, node]));
const root = document.getElementById('sketch-root');
const state = { mode: 'trace', route: 0, focus: 'start', stage: 3 };
const routes = [
  { id: 'syn.ledger', start: [450, 340], middle: [630, 273], end: [1050, 340] },
  { id: 'syn.machine_time', start: [450, 340], middle: [752, 273], end: [935, 378] },
  { id: 'syn.proof', start: [436, 413], middle: [630, 472], end: [984, 454] },
];
const stages = [
  { id: 'assets', label: 'Zasoby', x: '29%', y: '62%', hint: 'Funkcje biblioteki i materiałów.' },
  { id: 'scene', label: 'Scena', x: '31%', y: '38%', hint: 'Scena i połączenia z programami 3D.' },
  { id: 'inspection', label: 'Inspekcja', x: '31%', y: '69%', hint: 'Sprawdzanie i naprawa scen.' },
  { id: 'render', label: 'Render', x: '40%', y: '48%', hint: 'Render, kolejka i przekazywanie wyników.' },
  { id: 'results', label: 'Wyniki', x: '35%', y: '64%', hint: 'Powrót wyników do projektu.' },
  { id: 'tracking', label: 'Czas pracy', x: '72%', y: '51%', hint: 'Sesje i rozdzielenie pracy od czasu maszyny.' },
  { id: 'billing', label: 'Wycena', x: '78%', y: '42%', hint: 'Koszty przypisane do projektu.' },
  { id: 'report', label: 'Raport', x: '75%', y: '62%', hint: 'Dowody pracy w raporcie dla klienta.' },
];
function esc(text) { return String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function image(frame) { return `<img class="map-image" src="../shots/${frame}" alt="Zrzut istniejącej mapy funkcjonalności CFAB 4D Hub i TIMEFLOW" />`; }
function linked(route) {
  const nodes = data.edges.filter(e => e.from === route.id || e.to === route.id).map(e => byId.get(e.from === route.id ? e.to : e.from)).filter(Boolean);
  return { hub: nodes.find(n => n.app === 'cfab_hub'), tf: nodes.find(n => n.app === 'timeflow') };
}
function setExplanation(title, copy, outcome) {
  document.getElementById('explain-title').textContent = title;
  document.getElementById('explain-copy').textContent = copy;
  document.getElementById('explain-outcome').textContent = outcome;
}
function trace() {
  const route = routes[state.route], bridge = byId.get(route.id), { hub, tf } = linked(route);
  const curve = `M ${route.start[0]} ${route.start[1]} C ${route.start[0]+130} ${route.start[1]-80}, ${route.middle[0]-120} ${route.middle[1]}, ${route.middle[0]} ${route.middle[1]} S ${route.end[0]-155} ${route.end[1]}, ${route.end[0]} ${route.end[1]}`;
  setExplanation('Ślad relacji', 'Po wyborze pomostu istniejące linie mapy dostają wyraźny przebieg, lekki impuls i czytelne zakończenie. Pozostałe punkty zostają na swoich miejscach.', 'Efekt: użytkownik od razu widzi sens połączenia, a ruch ma konkretny powód.');
  return `<section class="map-window" aria-label="Szkic podświetlenia relacji">${image('1-initial-cloud.png')}<div class="map-ui">
    <svg class="trace-svg" viewBox="0 0 1384 718" preserveAspectRatio="none" aria-hidden="true"><path class="trace-glow" d="${curve}"/><path id="route-curve" class="trace-main" d="${curve}"/>${[route.start,route.middle,route.end].map(([x,y]) => `<circle class="trace-halo" cx="${x}" cy="${y}" r="19"/><circle class="trace-point" cx="${x}" cy="${y}" r="7"/>`).join('')}<circle class="trace-particle" r="5"><animateMotion dur="4.2s" repeatCount="indefinite"><mpath href="#route-curve"/></animateMotion></circle></svg>
    <div class="map-caption"><span class="kicker">ŚLAD RELACJI · ${String(state.route+1).padStart(2,'0')}/03</span><strong>${esc(bridge.title)}</strong><p>${esc(bridge.summary)}</p></div>
    <div class="route-dock"><div class="route-step"><span>CFAB 4D HUB</span><strong>${esc(hub?.short || 'Hub')}</strong></div><div class="route-arrow">→</div><div class="route-step bridge"><span>POMOST</span><strong>${esc(bridge.short)}</strong></div><div class="route-arrow">→</div><div class="route-step"><span>TIMEFLOW</span><strong>${esc(tf?.short || 'TIMEFLOW')}</strong></div></div>
    <div class="route-controls" aria-label="Wybierz ślad">${routes.map((r,i) => `<button type="button" data-route="${i}" aria-current="${i===state.route}" aria-label="Ślad ${i+1}: ${esc(byId.get(r.id).title)}">0${i+1}</button>`).join('')}</div>
  </div></section>`;
}
function focus() {
  const start = state.focus === 'start';
  setExplanation('Pamięć odkrywania', 'Obecna animacja zbliżenia i karta węzła zostają. Dodana jest mała pamięć ścieżki: skąd użytkownik przyszedł i do którego poziomu mapy może wrócić.', 'Efekt: eksploracja nie urywa się po kliknięciu, tylko buduje ciąg odkryć.');
  return `<section class="map-window" aria-label="Szkic pamięci odkrywania">${image(start?'2-node-popped-bubble.png':'3-after-connection-nav.png')}<div class="map-ui"><div class="focus-tag"><span class="kicker">OBECNY WĘZEŁ</span><strong>${start?'Start':'CFAB 4D Hub'}</strong></div><div class="focus-rail"><span class="kicker">TWOJA ŚCIEŻKA</span><h2>${start?'Od systemu do konkretnej funkcji.':'Widok całego systemu.'}</h2><div class="trail"><button type="button" data-focus="hub" aria-current="${!start}">CFAB 4D Hub</button><span>›</span><button type="button" data-focus="start" aria-current="${start}">Start</button></div><p>Kliknij nazwę na ścieżce, aby wrócić do poprzedniego poziomu.</p></div></div></section>`;
}
function stage() {
  const item = stages[state.stage];
  const count = data.nodes.filter(n => n.stage === item.id).length;
  setExplanation('Soczewka etapu', 'Ta sama chmura dostaje chwilowy punkt skupienia. Wybór etapu wygasza resztę mapy i podpowiada, gdzie patrzeć, bez przestawiania węzłów.', 'Efekt: gęsta mapa staje się spokojniejsza, a użytkownik nadal zachowuje orientację przestrzenną.');
  return `<section class="map-window" aria-label="Szkic skupienia na etapie">${image('1-initial-cloud.png')}<div class="map-ui" style="--sx:${item.x};--sy:${item.y}"><div class="stage-veil"></div><div class="stage-halo"></div><div class="stage-toolbar" aria-label="Wybierz etap">${stages.map((s,i) => `<button type="button" data-stage="${i}" aria-current="${i===state.stage}"><span>${String(i+1).padStart(2,'0')}</span>${esc(s.label)}</button>`).join('')}</div><div class="stage-card"><span class="kicker">SOCZEWKA ETAPU · ${String(state.stage+1).padStart(2,'0')}/08</span><h2>${esc(item.label)}</h2><p>${esc(item.hint)}</p><strong>${count} ELEMENTÓW W DANYCH</strong></div></div></section>`;
}
function render() {
  document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-current',String(b.dataset.mode===state.mode)));
  root.innerHTML = state.mode==='trace'?trace():state.mode==='focus'?focus():stage();
}
document.addEventListener('click',event => {
  const button = event.target.closest('button'); if(!button) return;
  if(button.dataset.mode){state.mode=button.dataset.mode;render();}
  if(button.dataset.route!==undefined){state.route=Number(button.dataset.route);render();}
  if(button.dataset.focus){state.focus=button.dataset.focus;render();}
  if(button.dataset.stage!==undefined){state.stage=Number(button.dataset.stage);render();}
});
render();
