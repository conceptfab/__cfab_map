# Mapa funkcjonalności CFAB 4D Hub × TIMEFLOW

Statyczna strona z mapą funkcjonalności dla inwestorów. Specyfikacja:
`wytyczne_interaktywna_mapa_funkcjonalnosci.md`.

## Dane

- `data/source.mjs` — treść (PL/EN) wyłącznie z rozdz. 2–4 wytycznych.
  Aktualizacja C4D z 2026-09-26 obejmuje sześć funkcji Shader Browsera,
  ustawienia zapisywane w C4D i poprawiony przepływ TX. Analiza źródeł:
  `ZMIANY_2026-09-26.md`.
- `npm run data` — składa `features_data.json` i dopisuje wersje z repozytoriów
  (`CFAB_HUB_ROOT`, domyślnie `../__c4d`; `CFAB_TIMEFLOW_ROOT`, domyślnie
  `../__TIMEFLOW/__cfab_demon`). `node scripts/build-data.mjs --public` — poziom
  inwestorski, bez ścieżek.
- Funkcja z polem `part` pobiera wersję bezpośrednio z odpowiadającej części
  `RELEASE.json` Huba (np. `bridges/c4d_bridge`), pozostałe dziedziczą wersję modułu.
- `npm run validate` — reguły z rozdz. 6.5; czerwona walidacja blokuje build.
- `npm run tokens` — kolory i fonty z `shared/cfab_ui/tokens.json` do zmiennych CSS.

## Budowa i kontrola

```
npm run build          # tokeny → dane → walidacja → typy → vite
npm run shot -- pl     # zrzut 1440×900 + pomiar: ucięte etykiety, wysokość strony
```

## Deploy (Vercel)

Vercel nie ma dostępu do repozytoriów Huba i TIMEFLOW, więc buduje z
zacommitowanych plików `src/generated/` (`vercel.json` → `npm run build:vercel`:
walidacja → typy → vite, bez `tokens`/`data`). Walidacja pomija wtedy sprawdzanie
ścieżek źródeł i wersji. Przed pushem: `npm run build` lokalnie i commit
`src/generated/`.
