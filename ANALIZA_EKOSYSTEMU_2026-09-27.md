# CFAB 4D Hub + TIMEFLOW — analiza treści strony

Stan źródeł: CFAB 4D Hub BETA 0.58, bridge Cinema 4D ALPHA 0.86, TIMEFLOW 0.1.5776. Analiza kodu i pomocy aplikacji; bez zmian w repozytoriach produktów. Ustalenia użytkownika mają pierwszeństwo przed starszym briefem i listami pomysłów.

## Rola aplikacji i główne obszary

| Obszar | Co daje użytkownikowi | Podstawa w repozytoriach |
|---|---|---|
| Biblioteka Huba | Organizacja dużych bibliotek modeli, materiałów i tekstur; wyszukiwanie, parowanie i przygotowanie zasobów | Hub: `modules/browser/module.py`, `modules/browser/core/`, `modules/browser/core/workers/` |
| Inspektor i zasoby | Odczyt scen .c4d/.max, transfer modeli, audyt zależności i naprawa ścieżek | Hub: `modules/scenes/module.py`, `modules/scenes/parser/`, `modules/scenes/send_to.py`, `modules/assets/module.py` |
| Mosty DCC | Wymiana danych między programami i narzędzia dostępne w aplikacjach 3D | Hub: `bridges/`, `shared/cfab_core/transfer.py`; analiza nowych narzędzi C4D w `ZMIANY_2026-09-26.md` |
| Render i wyniki | Kolejka, nadzór, historia renderów oraz przegląd wielokanałowych EXR i sekwencji | Hub: `modules/render/`, `modules/results/module.py`, `modules/results/exruster/` |
| Organizacja zleceń | Klienci, projekty, numeracja, budżet i termin, tworzenie folderów z szablonu, porównanie z czasem pracy | TIMEFLOW: `dashboard/src/pages/PM.tsx`, `dashboard/src-tauri/src/commands/pm_manager.rs`, `dashboard/src/components/help/sections/HelpSimpleSections.tsx` |
| Zadania | Zakres globalny, klient lub projekt; priorytety, zakresy dat, kalendarz, terminy na pulpicie i synchronizacja | TIMEFLOW: `dashboard/src/pages/Todo.tsx`, `dashboard/src-tauri/src/commands/todos.rs`, `dashboard/src/locales/pl/common.json` (`todo.help_*`) |
| Czas pracy | Automatyczny pomiar, wykrywanie bezczynności, sesje ręczne i korekty, obsługa nakładającego się czasu | TIMEFLOW: `src/tracker.rs`, `dashboard/src/pages/Sessions.tsx`, `dashboard/src-tauri/src/commands/time_algorithm.rs`, `commands/manual_sessions.rs` |
| Przypisanie czasu | Ścieżki plików i lokalny model, priorytet faktów, tryby sugestii i automatycznego przypisywania | TIMEFLOW: `dashboard/src-tauri/src/commands/assignment_model/`, sekcja pomocy AI |
| Finanse | Stawki, limity godzin, koszty dodatkowe, wyceny, raporty i analiza rentowności | TIMEFLOW: `dashboard/src-tauri/src/commands/estimates.rs`, `commands/costs.rs`, `commands/project_limits.rs`, strony raportów |
| Wspólne dane | Przypisanie sesji po pliku DCC, render jako koszt projektu, import .cfabx i zatwierdzanie przypisań | Hub: `modules/render/ledger.py`, `shared/cfab_core/cfabx.py`, `shared/cfab_core/timeflow_bridge.py`; TIMEFLOW: `commands/cfab_render.rs`, `commands/cfab_offline.rs`, `dashboard/src/pages/Renders.tsx` |
| Kontrola danych | Lokalne bazy, kopie, cofanie zmian, opcjonalna synchronizacja, dwa serwery MCP | Hub: `shared/cfab_core/`; TIMEFLOW: `dashboard/src-tauri/src/mcp/`, `commands/delta_export.rs`, `src/sync_encryption.rs` |

Ścieżki `commands/…` w tabeli odnoszą się do `dashboard/src-tauri/src/commands/` TIMEFLOW. Źródła pojedynczych funkcji są zapisane także w wewnętrznym `src/generated/features_data.json`. Samo istnienie pliku nie dowodzi wszystkich deklaracji marketingowych; stąd poniższe korekty zakresu.

## Wnioski zastosowane na stronie

1. Przewagi opisują cały ekosystem: pełny proces, ograniczenie ręcznej obsługi, kontrolę realizacji, własne dane oraz rentowność. Wszystkie pięć grup odsyła do funkcji Huba i TIMEFLOW.
2. Organizacja projektów i klientów, zadania, PM, edycja sesji, bezczynność, limity oraz analiza czasu uzupełniają dowody przewag. TIMEFLOW nie jest przedstawiany jako dodatek do rozliczania renderów.
3. Nowe funkcje Shader Browsera pozostają w module **Połączenia**: przegląd shaderów, selekcje i warstwy, konwersja bitmap, Corona Color Correct, schematy nazw materiałów, metadane tekstur. Usunięto pasek nadający im rangę głównych narzędzi całego ekosystemu.
4. Czas renderowania służy wewnętrznej analizie kosztów i rentowności. Ujęcie kosztu w wycenie jest osobną decyzją, a nie podstawową korzyścią dla klienta.
5. Usunięto `hub.bridges.rizom_hub` i `hub.shell.login_autostart`: katalog zawierał dla nich puste źródła implementacji. Działający C4D ↔ RizomUV oraz wspólne uruchamianie Huba i TIMEFLOW pozostają.
6. `syn.proposals` opisuje zatwierdzanie przypisań renderów. Usunięto dwa niepotwierdzone przepływy: propozycje → PM i audyt scen → propozycje. Zależność zapisu renderów bez TIMEFLOW od Render Ledger pozostaje: `watch.py` wywołuje `ledger.record_finished`, a implementacja rejestru nie sprawdza obecności TIMEFLOW. Poprawiono jej błędny status roadmapy. Obsługa typu danych w kontrakcie nie dowodzi, że Hub wysyła taki rodzaj danych.
7. Usunięto prezentację statusów odbioru i gotowości we wszystkich widokach, kartach oraz dymkach. Wersja ALPHA/BETA pakietu pozostaje informacją o wersji, nie licznikiem funkcji nieobecnych w kodzie.
8. Liczniki mają rozłączne kategorie: **143 funkcje aplikacji**, **7 integracji**, **30 modułów**, **2 aplikacje**. Razem 182 węzły i 55 relacji. To zakres katalogu strony, nie deklaracja pełnej liczby wszystkich operacji w produktach. Spadek 145 → 143 wynika z usunięcia dwóch niepotwierdzonych wpisów; wszystkie sześć nowych funkcji C4D pozostają.
9. Usunięto twierdzenie „0% danych w chmurze”: aplikacje działają lokalnie, ale TIMEFLOW ma opcjonalną szyfrowaną synchronizację online.
10. Opis dzielenia czasu odpowiada implementacji: w trybie unikalnego czasu wspólny odcinek dzieli się między aktywne projekty i ich sesje. Nie przypisujemy algorytmowi pomiaru intensywności zaangażowania.

Walidacja blokuje ponowne dodanie roadmapy oraz funkcji lub integracji bez źródła implementacji. Publiczny JSON zawiera opisy modułów zamiast ścieżek źródłowych.

## Weryfikacja

- `npm run build:vercel`: walidacja danych, TypeScript i build Vite zakończone powodzeniem.
- Chrome / Playwright: PL i EN, 1440 px i 390 px; pięć grup przewag, spójne liczniki, brak paska gotowości, etykiet roadmapy, przekreśleń i poziomego przepełnienia strony przewag.
- Karty wszystkich sześciu nowych funkcji C4D, nawigacja z przewag na mapę oraz otwieranie dymka w chmurze działają; brak błędów JavaScript.
- React Doctor: porównanie tego samego zakresu 10 plików przed i po zmianie — 59/100 w obu przypadkach, te same 7 istniejących diagnoz. Bez regresji; skan nie jest całkowicie czysty.
- Publiczny JSON: 182 węzły, sześć nowych funkcji C4D, brak ścieżek repozytoriów w polu `sources`.

Zmiany dotyczą strony lokalnej. Nie wykonano wdrożenia.
