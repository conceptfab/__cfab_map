# Chmura: znaczenie w spoczynku + ruch z sensem

Data: 2026-09-29. Zakres: widok „Chmura” (`src/Cloud.tsx`, `src/graphModel.ts`, `src/styles.css`).
Widoki Przewagi i Etapy pracy bez zmian.

## Problem

W spoczynku chmura jest dekoracją: 143 kropki bez podpisów, kolory etapów rozsypane po okręgu,
obrót orbit (6 min/obrót) bez znaczenia. Dane mają 55 krawędzi, z czego 37 oznaczonych `animated`
z etykietami („sekundy renderu”, „wpisy ledgera”), a chmura rysuje je jako blade kreski.
20 funkcji z `techMoat.isUniqueMoat` wygląda jak każda inna kropka.

## A. Znaczenie w spoczynku

1. **Sektory w kolejności etapów.** W `layoutGraph` sektory modułów sortowane po etapie
   (kolejność z `STAGES`), potem po `order` modułu. Fundament zawsze ostatni i wyśrodkowany
   na dole okręgu (godzina 6). Wewnątrz modułu funkcje sortowane po etapie, potem `order`.
   Efekt: kolory etapów tworzą ciągłe pasma; pierścień czyta się jak wykres udziału.
2. **Wycinki modułów.** Pod każdym sektorem cienki pierścieniowy wycinek (r 250–500,
   szczelina ~1,2°) wypełniony `--group-color` z niską przezroczystością. Bez etykiety
   własnej: moduł ma już podpis na orbicie 220. Podpis modułu dostaje licznik „Render · 19”.
3. **Łukowe podpisy etapów.** Na zewnętrznym łuku (r ≈ 515) `textPath` z nazwą etapu
   dla każdego ciągłego pasma etapu (scalenie sąsiednich sektorów o tym samym etapie).
   Font mono, wersaliki, `--text-muted`, wielkość w jednostkach świata dobrana tak, żeby
   przy dopasowaniu 1440 px mieć ~11 px. Krótkie nazwy z `STAGE_ARC` (i18n); podpis, który
   nie mieści się w łuku, jest pomijany. Fundament dostaje podpis na dole okręgu.
4. **Znacznik fosy.** Funkcje z `isUniqueMoat` dostają dodatkowy pierścień (r+3, obrys
   `--group-ink`). Legenda: „◎ trudne do skopiowania”.

Ruch orbit zostaje usunięty (pozycje statyczne). Dzięki temu wycinki, łuki i etykiety są
stabilne, a algorytm rozkładu podpisów nie walczy z obrotem.

## B. Ruch z sensem

1. **Impulsy na przepływach.** Każda krawędź `data_flow` / `file_exchange` (z `edges[]`,
   relacja `integration`) dostaje poruszający się znacznik: SMIL `animateMotion` + `mpath`
   do ścieżki krawędzi (linie stają się `<path>` z `id`). Bez re-renderów React.
   - `data_flow`: kółko r 2,6 + poświata, prędkość ~150 j/s, ciągły strumień.
   - `file_exchange`: romb 5×5, prędkość ~80 j/s, „paczki”.
   Kolor: `--group-ink` źródła (w trybie „Program” kolor programu). Start przesunięty
   (`begin` ujemny) tak, aby impulsy nie ruszały jednocześnie. Linia przepływu zostaje
   blada (0,14), impuls ma własną przezroczystość (0,8), więc niesie przekaz sam.
   Przepływy wewnątrz jednej aplikacji są łukami wygiętymi od środka okręgu, żeby nie
   przecinały dysku aplikacji.
2. **Etykieta krawędzi.** Przy podświetleniu (hover/klik) krawędź z `label` pokazuje tekst
   w środku łuku, na podkładzie tła, w warstwie ekranowej obok podpisów węzłów.
3. **Sterowanie.** Przycisk „Zatrzymaj orbity” → „Zatrzymaj przepływ” (`pauseAnimations` /
   `unpauseAnimations` na SVG). `prefers-reduced-motion`: impulsy nie są renderowane,
   przycisk wyłączony (jak dziś).
4. **Wygaszanie.** Ścieżka i jej impuls są w jednym `<g>` z `opacity`, więc przy hover/klik
   impulsy niepowiązanych krawędzi gasną razem z linią.

## Poza zakresem

Historie prowadzone (kierunek C), zmiana metafory dwóch orbit, mobile.

## Weryfikacja

`npm run build`, `npm run shot -- pl` i `-- en` (zrzut 1440×900 + minFont ≥ 10),
`node shots/check-hover.mjs` (stabilność podpisów przy hover), ręczny przegląd zrzutu:
pasma kolorów ciągłe, łuki etapów czytelne, impulsy widoczne w Papier i Grafit.
