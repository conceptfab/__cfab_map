# CFAB 4D Hub × TIMEFLOW — propozycje poprawy prezentacji danych

Przegląd: https://cfabhubtimeflow.vercel.app (1440×900 i 390×844, widoki Przewagi / Chmura / Etapy pracy), kod `src/` i specyfikacja `wytyczne_…md` rozdz. 5.
Stan na 2026-09-25.

**Wniosek w jednym zdaniu:** dane są solidne, ale najmocniejsze argumenty (97% gotowości, 8 mostów DCC, 0% danych w chmurze, 10–25% odzysku) są dziś schowane albo pokazane czcionką 11 px, a pierwszy ekran to nieopisana „chmura” — inwestor musi szukać tego, co powinien zobaczyć od razu.

Zmiany posortowane wg priorytetu (wpływ ÷ nakład). Każda ma: problem → propozycję → kod.

---

## Priorytet 1 — pierwszy ekran (największy efekt, mało pracy)

### 1.1. Domyślny widok to Chmura w trybie immersyjnym — bez tytułu, legendy i liczb

**Problem.** Wejście na stronę bez parametrów pokazuje 173 kropki i linie bez nagłówka, bez legendy i bez informacji, na co patrzymy (UI pojawia się dopiero po kliknięciu). Brief `BRIEF_PRZEWAGI.md` §1 mówi wprost: widok Przewag „otwiera się jako pierwszy”. Spec 5.5.2: „legenda stale widoczna”.

**Propozycja.** Start = Przewagi. Chmura bez trybu immersyjnego (albo immersyjna tylko po wejściu przyciskiem „pełny ekran”).

**Plik `src/App.tsx`, komponent `App`, inicjalizacja stanu:**

```tsx
// było: ... ? value : "cloud"
const [view, setView] = useState<View>(() => {
  const value = new URLSearchParams(location.search).get("view");
  return value === "cloud" || value === "grid" ? value : "advantages";
});
// było: Boolean(...get("adv"))
const [cloudUiVisible, setCloudUiVisible] = useState(true);
```

### 1.2. Pasek kluczowych liczb — 3 z 6 kafelków są ukryte

**Problem.** `tiles` definiuje 6 metryk, ale CSS je ucina: `.page .metric:nth-child(n+4) { display: none; }` (styles.css, l. 154 i 354). Znikają akurat najbardziej „inwestorskie”: **Mosty do programów 3D**, **Serwery MCP**, **Dane w chmurze: 0 %**. Widoczne trzy mają 14 px / 11 px.

**Propozycja.** Na widoku Przewagi — pas „hero” z dużymi liczbami (display 32–40 px) nad listą tez. W Chmurze/Etapach zostaje wersja kompaktowa w nagłówku. Gotowość pokazać jako **137 z 141** (reguła R2 — bez zaokrąglania do %), z paskiem.

**Plik `src/Advantages.tsx`, nowy komponent `KpiStrip` (render nad `.adv-rows`):**

```tsx
function KpiStrip({ data, lang }: { data: FeaturesData; lang: LangKey }) {
  const pl = lang === "pl";
  const items = data.nodes.filter(n => n.nodeType === "feature" || n.nodeType === "bridge");
  const ready = items.filter(n => n.status === "production").length;
  const m = metrics(data); // import { metrics } from "./layout"
  const kpis: [string | number, string][] = [
    [m.features, pl ? "udokumentowanych funkcji" : "documented features"],
    [m.bridges, pl ? "mostów do programów 3D" : "3D app bridges"],
    [m.mcp, pl ? "serwery MCP dla agentów AI" : "MCP servers for AI agents"],
    ["0 %", pl ? "danych w chmurze" : "data in the cloud"],
  ];
  return (
    <section className="kpi-strip" aria-label={pl ? "Najważniejsze liczby" : "Key numbers"}>
      {kpis.map(([v, l]) => <div key={l} className="kpi"><b>{v}</b><span>{l}</span></div>)}
      <div className="kpi kpi-ready">
        <b>{ready}<small> / {items.length}</small></b>
        <span>{pl ? "funkcji gotowych w kodzie" : "features shipped in code"}</span>
        <i className="kpi-bar" style={{ ["--p" as string]: `${(ready / items.length) * 100}%` }} />
      </div>
    </section>
  );
}
```

**Plik `src/styles.css`, nowe reguły:**

```css
.kpi-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px;
  background: var(--line-subtle); border: 1px solid var(--line-subtle); margin: 16px 0 24px; }
.kpi { background: var(--bg-surface); padding: 18px 20px; display: flex; flex-direction: column; gap: 6px; }
.kpi b { font-size: 36px; font-weight: 600; letter-spacing: -0.03em; color: var(--text-strong);
  font-variant-numeric: tabular-nums; line-height: 1; }
.kpi b small { font-size: 18px; color: var(--text-muted); font-weight: 500; }
.kpi span { font-size: 13px; color: var(--text-muted); }
.kpi-bar { display: block; height: 4px; background: var(--line-subtle); position: relative; }
.kpi-bar::after { content: ""; position: absolute; inset: 0 auto 0 0; width: var(--p); background: var(--text-accent); }
@media (max-width: 720px) { .kpi-strip { grid-template-columns: 1fr 1fr; } .kpi b { font-size: 28px; } }
```

Dodatkowo usunąć ukrywanie kafelków w nagłówku (`.metric:nth-child(n+4) { display:none }`) albo zostawić je tylko w Chmurze.

### 1.3. Typografia za mała na rzutnik i zrzut do maila

**Problem.** W `styles.css` dominuje 11–12 px (≈40 deklaracji 10–12 px). Spec 5.5: „czytelna z 3 m na rzutniku i ze zrzutu w mailu”. Na zrzutach Przewag teza i „Dlaczego trudno skopiować” mają ~12 px, chipy dowodów ~11 px.

**Propozycja — minimalne rozmiary:**

| Element | teraz | proponowane |
|---|---|---|
| Teza (rozwinięta) | ~13 px | 17–18 px, max 68 znaków szer. |
| Tytuł przewagi | ~16 px | 20 px |
| Opisy „Dlaczego / Zastępuje” | ~12 px | 14 px |
| Chipy dowodów, pozycje siatki | 11–12 px | 13 px |
| Legenda, podpisy | 11 px | 12–13 px |

**Plik `src/styles.css`, sekcja `.advantages`:**

```css
.adv-row-head strong { font-size: 20px; letter-spacing: -0.015em; }
.adv-thesis { font-size: 18px; line-height: 1.5; max-width: 68ch; color: var(--text-strong); }
.adv-explain p { font-size: 14px; line-height: 1.55; }
.adv-proof, .adv-also button { font-size: 13px; }
.legend { font-size: 12.5px; }
```

---

## Priorytet 2 — widok Przewagi (to on „sprzedaje”)

### 2.1. Jedyna liczba pieniężna jest w małej ramce na boku

**Problem.** „Założenie: 10–25 % odzysku przychodu” — najmocniejszy argument biznesowy — ma rozmiar opisu i wygląda jak przypis.

**Propozycja.** Liczba jako duży element po prawej stronie rozwiniętej tezy, z jawną etykietą „założenie” (R8 — konkret, R2 — zakres bez zaokrąglania).

**Plik `src/Advantages.tsx`, funkcja `assumptionText` → zwraca osobno wartość i jednostkę:**

```tsx
function assumptionParts(data: FeaturesData, advantage: Advantage, lang: LangKey) {
  const a = data.assumptions.find(i => i.id === advantage.assumptionId);
  if (!a) return null;
  if (a.id === "A-ODZYSK")
    return { value: `${a.value}–${a.maxValue} %`, unit: lang === "pl" ? "odzysku przychodu" : "revenue recovered" };
  return { value: `${a.value} h`, unit: lang === "pl" ? "na artystę miesięcznie" : "per artist per month" };
}
```

**Tamże, w `.adv-explain` zamiast `<p className="adv-assumption">`:**

```tsx
{parts && <div className="adv-figure">
  <span className="adv-figure-label">{label ? "Założenie" : "Assumption"}</span>
  <b>{parts.value}</b><span>{parts.unit}</span>
</div>}
```

```css
.adv-figure { border-left: 3px solid var(--text-accent); padding: 4px 0 4px 16px; }
.adv-figure b { display: block; font-size: 40px; font-weight: 600; letter-spacing: -0.03em; color: var(--text-strong); line-height: 1.05; }
.adv-figure-label { font: 500 11px/1 var(--font-mono); text-transform: uppercase; letter-spacing: .08em; color: var(--text-muted); }
```

### 2.2. Dowody jako jedna ściana chipów — nie widać, że przewaga wymaga OBU aplikacji

**Problem.** Teza 1 ma 14 chipów w 2 rzędach, pokolorowanych wg etapu. A sedno „Dlaczego trudno skopiować” brzmi: *potrzebny jest Hub po jednej stronie i aplikacja rozliczeniowa po drugiej*. Tego nie widać.

**Propozycja.** Trzy kolumny: **CFAB 4D Hub | Połączenie | TIMEFLOW** — z licznikiem nad każdą. Widać od razu, że dowody leżą po obu stronach i w pomoście.

**Plik `src/Advantages.tsx`, w miejscu `<div className="adv-proofs">`:**

```tsx
const APPS = [
  { id: "cfab_hub", pl: "CFAB 4D Hub", en: "CFAB 4D Hub" },
  { id: "synergy", pl: "Połączenie", en: "Integration" },
  { id: "timeflow", pl: "TIMEFLOW", en: "TIMEFLOW" },
] as const;

<div className="adv-proofs-by-app">
  {APPS.map(app => {
    const list = nodes.filter(n => n.app === app.id);
    if (!list.length) return null;
    return <div key={app.id} className={`proof-col app-${app.id}`}>
      <h4>{app[lang]} <span>{list.length}</span></h4>
      <div className="adv-proofs">{list.map(n => proof(n, flowStep))}</div>
    </div>;
  })}
</div>
```

```css
.adv-proofs-by-app { display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; }
.proof-col h4 { font-size: 12px; font-weight: 600; margin: 0 0 8px; display: flex; gap: 6px; }
.proof-col h4 span { color: var(--text-muted); font-weight: 500; }
.proof-col.app-synergy { border-inline: 1px dashed var(--line-strong); padding-inline: 16px; }
@media (max-width: 720px) { .adv-proofs-by-app { grid-template-columns: 1fr; } .proof-col.app-synergy { border-inline: 0; padding: 0; } }
```

### 2.3. Kroki przepływu 01–04 — szare, jednakowe pudełka

**Problem.** Przepływ „Render w Hubie → Księga → Przypisanie w TIMEFLOW → Koszt w PDF” to najlepszy element storytellingu, ale wygląda jak formularz: 4 szare pola, ta sama waga.

**Propozycja.** Oznaczyć, po której stronie dzieje się krok (Hub / TIMEFLOW — kolorowa krawędź i mała etykieta programu), a w ostatnim kroku pokazać wynik („koszt w wycenie”) mocniej — wypełnienie akcentem. Przy hoverze już dziś wygasza się część dowodów — to zostaje.

**Plik `src/Advantages.tsx`, stała obok `FLOW_PROOFS`:**

```tsx
const FLOW_APP = ["cfab_hub", "cfab_hub", "timeflow", "timeflow"] as const;
// w mapowaniu kroków:
<button className={`flow-step app-${FLOW_APP[index]} ${index === advantage.flow!.length - 1 ? "is-outcome" : ""} ...`}>
  <span>{String(index + 1).padStart(2, "0")}</span>
  <small className="flow-app">{FLOW_APP[index] === "cfab_hub" ? "Hub" : "TIMEFLOW"}</small>
  {step[lang]}
</button>
```

```css
.flow-step { border-left-width: 3px; }
.flow-step.app-cfab_hub { border-left-color: var(--app-hub); }
.flow-step.app-timeflow { border-left-color: var(--app-timeflow); }
.flow-step.is-outcome { background: var(--text-accent); color: var(--bg-surface); border-color: var(--text-accent); }
.flow-app { display: block; font: 500 10px/1 var(--font-mono); text-transform: uppercase; opacity: .7; }
```

(`--app-hub`, `--app-timeflow` — patrz 3.1.)

### 2.4. Zwinięte tezy to ściana tekstu

**Problem.** Wiersze 02–05 pokazują pełną tezę (2 linie) + „Zastępuje” w kolorze akcentu → 5 akapitów podobnej wagi, oko nie ma gdzie się zatrzymać.

**Propozycja.** Zostawić treść (spec 5.1.3), ale: teza przycięta do 1 linii (`line-clamp`), „Zastępuje” jako szare tagi (przekreślone narzędzia — Toggl, Harvest… — to czytelny, lubiany przez inwestorów motyw „co wypieramy”), liczba funkcji jako cyfra, nie tekst.

```css
.adv-row-head small { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.adv-collapsed-meta { color: var(--text-muted); }
.adv-collapsed-meta .tool { text-decoration: line-through; text-decoration-color: var(--text-accent); margin-right: 8px; }
```

```tsx
// src/Advantages.tsx — zamiast {toolNames(advantage)} w wierszu zwiniętym:
{advantage.replacesTools.map(t => <span key={t.pl} className="tool">{t[lang]}</span>)}
```

---

## Priorytet 3 — Chmura (widok efektowny, ale najtrudniejszy do czytania)

### 3.1. Osiem pastelowych kolorów etapów zamiast trzech kolorów programów

**Problem.**
- Spec 5.5.1: **„Kolor = program”, trzy kolory, „tyle ma zostać”**. Implementacja koloruje węzły wg 8 etapów.
- Pastele (`--stage-*`) mają kontrast **1,32–1,56 : 1** do tła `#efeeea` (zmierzone). WCAG 1.4.11 wymaga 3 : 1 dla elementów graficznych. Na rzutniku kropki zlewają się z tłem, a 8 odcieni nie da się odróżnić bez legendy.
- Legenda jest rozbita: „Obszary pracy” u góry, „Węzły / Stan” na dole.

**Propozycja.** Domyślnie kolor = program (Hub / Połączenie / TIMEFLOW) w nasyconych tonach „ink”. Etapy jako przełącznik **„Koloruj wg: Program | Etap”** — spacer po etapach i tak podświetla je po kolei.

**Plik `src/styles.css`, blok `.page`:**

```css
.page {
  --app-hub: #3e617c;       /* ≥ 5:1 na #efeeea */
  --app-synergy: #8b513c;
  --app-timeflow: #356961;
}
.page[data-graph-theme="charcoal"] {
  --app-hub: #9cc0e0; --app-synergy: #edac88; --app-timeflow: #9fd4c9;
}
.page[data-color-by="app"] .app-cfab_hub  { --group-color: var(--app-hub);      --group-ink: var(--app-hub); }
.page[data-color-by="app"] .app-synergy   { --group-color: var(--app-synergy);  --group-ink: var(--app-synergy); }
.page[data-color-by="app"] .app-timeflow  { --group-color: var(--app-timeflow); --group-ink: var(--app-timeflow); }
```

**Plik `src/App.tsx`, komponent `App`:**

```tsx
const [colorBy, setColorBy] = useState<"app" | "stage">("app");
// <div className={`page ...`} data-color-by={colorBy} ...>
// w .map-key zamiast samej listy etapów:
<div className="seg" role="group" aria-label={lang === "pl" ? "Koloruj według" : "Colour by"}>
  <button aria-pressed={colorBy === "app"} onClick={() => setColorBy("app")}>{lang === "pl" ? "Program" : "App"}</button>
  <button aria-pressed={colorBy === "stage"} onClick={() => setColorBy("stage")}>{lang === "pl" ? "Etap" : "Stage"}</button>
</div>
```

W `src/Cloud.tsx` węzły muszą dostać klasę `app-${node.app}` obok obecnej `group-${…}` (tam, gdzie dziś nadawana jest klasa grupy).

### 3.2. Wszystkie krawędzie narysowane w spoczynku

**Problem.** Spec 5.5.4: „krawędzie nie są rysowane w stanie spoczynku”. Teraz ~200 linii hierarchii (szprychy do każdej funkcji) + kropkowane + łuki pomostu tworzą szum; ważne połączenia Hub↔TIMEFLOW giną.

**Propozycja.** W spoczynku: tylko orbity + **8 łuków pomostu** (grubsze, w kolorze `--app-synergy`). Szprychy hierarchii: opacity 0.12. Pozostałe relacje dopiero przy hover/klik.

**Plik `src/styles.css`:**

```css
.cloud .edge-hierarchy { stroke-opacity: .12; }
.cloud .edge:not(.edge-integration) { opacity: 0; transition: opacity .18s; }
.cloud.has-focus .edge.is-related { opacity: 1; }
.cloud .edge-integration { stroke: var(--app-synergy); stroke-width: var(--edge-integration); stroke-opacity: .7; }
@media (prefers-reduced-motion: reduce) { .cloud .edge { transition: none; } }
```

(Nazwy klas dopasować do tych, które faktycznie nadaje `Cloud.tsx` — logika podświetlania `highlightIds` już istnieje.)

### 3.3. Etykiety w kolumnie pomostu przecinane liniami

**Problem.** Środkowa kolumna (Wykrywanie aplikacji, Render → koszt projektu…) to kluczowa część mapy, ale linie przechodzą przez tekst.

**Propozycja.** Podkład pod etykietą (halo w kolorze tła) — tanio i skutecznie:

```css
.cloud text.node-label { paint-order: stroke; stroke: var(--bg-canvas); stroke-width: 4px; stroke-linejoin: round; }
```

### 3.4. Chmura na telefonie jest nieczytelna

**Problem.** Przy 390 px etykiety nachodzą na siebie, pomost „wisi” między dwoma okręgami bez kontekstu (zrzut `cloud-m`).

**Propozycja.** Poniżej 720 px: ukryć zakładkę Chmura (albo pokazywać statyczny, uproszczony obraz z CTA „otwórz na komputerze”), a `?view=cloud` przekierować na Przewagi.

**Plik `src/App.tsx`, inicjalizacja `view`:**

```tsx
const narrow = matchMedia("(max-width: 720px)").matches;
// ...
return (value === "cloud" && !narrow) || value === "grid" ? value : "advantages";
```

### 3.5. Drobne

- Podpowiedź „Poświata oznacza wskazany węzeł…” jest ucięta na dole ekranu 1440×900 — przenieść do pierwszej linii legendy albo do tooltipa przycisku „?”.
- Przełącznik Papier/Grafit zajmuje miejsce w nagłówku obok liczb — dla inwestora to szum. Przenieść do małej ikony (☾) przy PL/EN.

---

## Priorytet 4 — Etapy pracy (siatka)

### 4.1. Strona ma 3316 px wysokości, spec wymaga 1 ekranu

**Problem.** Spec 5.5.6: „cała mapa zakresu mieści się na 1440×900 bez przewijania”. Dziś 8 kolumn jest łamanych na 2 rzędy po 4, a każda funkcja to wiersz listy ~36 px (spec: chip 22 px).

**Propozycja.** 8 kolumn w jednym rzędzie (≈165 px każda przy 1440), pozycje jako gęste wiersze 24 px, długie kolumny (Czas pracy 26, Render 20) w 2 podkolumnach bloku. Fundament zwinięty do jednego paska „Fundament · 63 elementy ▸”.

**Plik `src/styles.css`, sekcja `.map`:**

```css
.view-grid .columns { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 12px; }
.view-grid .chips li button { min-height: 24px; padding: 3px 6px; font-size: 12.5px; line-height: 1.25; border-bottom: 0; }
.view-grid .block { margin-bottom: 10px; }
.view-grid .block:has(.chips > li:nth-child(9)) .chips { columns: 2; column-gap: 8px; }
@media (max-width: 1280px) { .view-grid .columns { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
```

**Plik `src/App.tsx`, sekcja `.foundation` — zwijana:**

```tsx
<details className="foundation group-foundation">
  <summary className="column-title"><span className="graph-dot" />{t("foundation", lang)}
    <span className="count">{foundation.reduce((s, b) => s + b.items.length, 0)}</span>
    <span className="hint">{lang === "pl" ? "warstwa niewidoczna dla użytkownika — rdzeń, usługa, MCP, synchronizacja" : "invisible layer — core, service, MCP, sync"}</span>
  </summary>
  <div className="foundation-blocks">…</div>
</details>
```

### 4.2. W siatce nie widać, który program ma daną funkcję

**Problem.** Kolumna „Czas pracy” zawiera bloki Hub-a, Pomostu i TIMEFLOW, ale nic ich nie odróżnia poza kolejnością. To jest dokładnie ta informacja, której inwestor szuka („co robi który produkt?”).

**Propozycja.** Lewa krawędź bloku w kolorze programu (spec 5.5.1: „kolor niesie pasek bloku i lewą krawędź chipu”) + mały skrót programu przy tytule bloku. W nagłówku kolumny — pasek proporcji Hub / Pomost / TIMEFLOW.

**Plik `src/App.tsx`, funkcja `BlockView`:**

```tsx
const APP_SHORT = { cfab_hub: "HUB", synergy: "⇄", timeflow: "TF" } as const;
<section className={`block app-${block.app}`}>
  <h3 className="block-title">
    <span className="app-tag">{APP_SHORT[block.app]}</span>
    {title} <span className="count">· {block.items.length}</span>
  </h3>
```

**Tamże, nagłówek kolumny w `App` (mini-pasek udziału):**

```tsx
const share = (["cfab_hub", "synergy", "timeflow"] as const).map(a => blocks.filter(b => b.app === a).reduce((s, b) => s + b.items.length, 0));
<h2 className="column-title">…
  <span className="app-share" aria-hidden="true">{share.map((n, i) => <i key={i} style={{ flexGrow: n }} className={`app-${["cfab_hub","synergy","timeflow"][i]}`} />)}</span>
</h2>
```

```css
.block { border-left: 3px solid var(--app-color, var(--line-subtle)); padding-left: 8px; }
.block.app-cfab_hub { --app-color: var(--app-hub); }
.block.app-synergy  { --app-color: var(--app-synergy); }
.block.app-timeflow { --app-color: var(--app-timeflow); }
.app-tag { font: 600 9.5px/1 var(--font-mono); color: var(--app-color); margin-right: 6px; letter-spacing: .06em; }
.app-share { display: flex; height: 3px; width: 100%; margin-top: 6px; gap: 1px; }
.app-share i { background: var(--app-color); }
.app-share .app-cfab_hub { --app-color: var(--app-hub); }
.app-share .app-synergy  { --app-color: var(--app-synergy); }
.app-share .app-timeflow { --app-color: var(--app-timeflow); }
```

### 4.3. Znacznik statusu nie niesie informacji

**Problem.** 137 z 141 pozycji ma ● w kolorze etapu — marker jest dekoracją. Te 4 wyjątki (2 × ◐, 2 × ○) giną, a R3 zabrania ukrywania statusów.

**Propozycja.** Gotowe = mała neutralna kropka; ◐/○ w kolorze akcentu + dopisek przy tytule; roadmap z przerywanym obrysem i tekstem muted (spec 5.5.2).

```css
.chip.status-production .marker { color: var(--line-strong); font-size: 8px; }
.chip.status-beta .marker, .chip.status-roadmap .marker { color: var(--text-accent); }
.chip.status-roadmap { color: var(--text-muted); outline: 1px dashed var(--line-subtle); outline-offset: -2px; }
.chip.status-beta .label::after { content: " · beta"; color: var(--text-accent); font-size: .85em; }
```

---

## Priorytet 5 — porządki techniczne (przed dalszymi zmianami)

### 5.1. `src/styles.css` nadpisuje sam siebie

**Problem.** 1267 linii; te same selektory zdefiniowane kilka razy z różnymi wartościami (np. `.page .metrics` w l. 352 i 482, `.view-cloud .metrics` w l. 152 i 261, ukrywanie kafelków w l. 154 i 354). Każda poprawka z tego dokumentu może zostać „zjedzona” przez późniejszą regułę.

**Propozycja.** Przed wdrożeniem zmian wizualnych — scalić duplikaty i podzielić plik na warstwy:

```css
/* src/styles.css — na początku pliku */
@layer tokens, base, layout, views, overrides;
/* tokens: zmienne .page / charcoal / --app-* / --stage-*
   base: typografia, przyciski
   layout: .top, .map-key, .legend
   views: .advantages, .cloud-wrap, .map
   overrides: media queries, reduced-motion */
```

### 5.2. Kolory tylko ze zmiennych (R4)

Nowe kolory `--app-*` dodać do `shared/cfab_ui/tokens.json` i generować przez `npm run tokens`, a nie wpisywać ręcznie w `styles.css` — inaczej walidacja R4 prędzej czy później to zgłosi.

---

## Kolejność wdrożenia (sugerowana)

1. **5.1** porządek w CSS (żeby kolejne zmiany działały przewidywalnie)
2. **1.1 + 1.2 + 1.3** — pierwszy ekran: Przewagi, pas liczb, większa typografia
3. **2.1 + 2.2** — duża liczba założenia, dowody w 3 kolumnach programów
4. **3.1** kolor = program (+ tokeny 5.2) — przenosi się automatycznie na siatkę (4.2) i przepływ (2.3)
5. **3.2 + 3.3** — odszumienie chmury
6. **4.1 + 4.3** — siatka na jeden ekran, statusy
7. **3.4** mobile

Po każdym kroku: `npm run shot -- pl` i `npm run shot -- en` (etykiety EN są dłuższe — sprawdzić KPI i kroki przepływu).
