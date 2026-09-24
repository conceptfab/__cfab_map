# WYTYCZNE WYKONAWCZE: STRONA WWW Z INTERAKTYWNĄ MAPĄ FUNKCJONALNOŚCI CFAB 4D HUB & TIMEFLOW (DLA INWESTORÓW)

> **Dokument strategiczno-techniczny i specyfikacja wdrożeniowa**
> **Adresat:** wykonawca (model lub człowiek) budujący finalną aplikację mapy — brief w rozdziale 0
> **Produkt końcowy:** **czytelna mapa funkcjonalności** — uporządkowana, a nie efektowna (rozdz. 5)
> **Język produktu końcowego:** polski i angielski (obowiązkowo oba — rozdz. 5.7)
> **Status:** gotowy do realizacji aplikacji interaktywnej
> **Data:** 2026-09-22 · **Stan zweryfikowany na kodzie:** 2026-09-22
> **Repozytoria bazowe:**
> - CFAB 4D Hub — `/Users/micz/__DEV__/__c4d` (pakiet **BETA 0.43**, 20 części, gałąź `main`)
> - TIMEFLOW — `/Users/micz/__DEV__/__TIMEFLOW`: klient i demon w `__cfab_demon` (**0.1.5776**), serwer koordynacji w `__cfab_server`
>
> **Zmiana kierunku wobec wersji z 2026-09-19:** widokiem głównym nie jest już chmura węzłów
> w stylu grafu Obsidiana, tylko **mapa zakresu**: siatka etapów pipeline'u z blokami modułów
> i funkcjami podpisanymi pełnym tekstem (rozdz. 5.1). Chmura przy ~170 elementach zawsze
> wymagała albo ukrywania etykiet, albo zgadywania, co jest czym. Mapa pokazuje ten sam
> zakres, ale czyta się ją bez klikania.
>
> **Cel:** Pokazać inwestorom, funduszom VC i partnerom technologicznym **jak szeroki zakres pracy
> ogarnia ekosystem CFAB 4D Hub + TIMEFLOW** — w czytelny, interaktywny sposób, w kontekście
> realnego odbiorcy: **freelancera i małego studia 3D**. Dokument wykazuje bariery technologiczne
> (Tech Moats), synergię produktową oraz przewagę rynkową eliminującą potrzebę korzystania
> z 5–7 oddzielnych narzędzi SaaS.
>
> **Główny przekaz wizualny:** jedna osoba obsługuje cały pipeline — od zasobu, przez scenę, render
> i analizę wyników, po czas, wycenę i fakturę. Mapa ma pokazać **rozmiar tego zakresu na jednym
> ekranie**, zanim padnie pierwsze zdanie wyjaśnienia.
>
> **Zasada dokumentu:** każda funkcja w rozdziałach 2–4 ma **status** (`production` / `beta` / `roadmap`) zgodny z [docs/BETA.md](docs/BETA.md) i historią [CHANGELOG.md](CHANGELOG.md). Mapa dla inwestora nie pokazuje planów jako gotowych rzeczy — statusy są częścią przekazu, nie jego osłabieniem.

---

# 0. BRIEF — PRZECZYTAJ TO NAJPIERW

**Ten plik jest kompletnym zleceniem dla modelu (lub człowieka), który zbuduje finalną aplikację.**
Jest samowystarczalny: zawiera cel, odbiorcę, pełną treść merytoryczną, specyfikację wizualną,
schemat danych i kryteria odbioru. Nie wymaga dostępu do repozytoriów ani do wcześniejszych rozmów.
Jeśli czegoś w nim nie ma — to jest pytanie do zleceniodawcy (rozdz. 15), a **nie zaproszenie
do wymyślenia tego samodzielnie**.

## 0.1. Co masz zbudować

**Stronę internetową** — jednostronicową, statyczną, dostępną pod adresem URL — której sercem
jest interaktywna **mapa funkcjonalności**: jeden ekran, na którym każda funkcja obu programów
ma swoje miejsce, podpis i status. Strona pokazuje inwestorowi **jak szeroki zakres pracy
ogarniają dwa programy: CFAB 4D Hub i TIMEFLOW**, w kontekście pracy freelancera i małego
studia 3D.

> **To nie jest plik do wysłania mailem, tylko link do wysłania mailem.** Inwestor dostaje adres,
> otwiera go na laptopie i od razu widzi chmurę — bez pobierania, instalowania
> i rozpakowywania. Strona jest statyczna (bez backendu i bez bazy), więc da się ją postawić
> na dowolnym hostingu i zarchiwizować jako kopię offline na prezentację (rozdz. 9.6).

- **Widok główny — Mapa zakresu:** osiem kolumn etapów pracy (od zasobu do raportu dla klienta),
  w każdej kolumnie bloki modułów w kolorze programu (Hub / Pomost Synergii / TIMEFLOW),
  w blokach funkcje jako podpisane „chipy” ze statusem. Pod kolumnami pas **Fundament** —
  warstwa, na której stoi całość. Relacje między funkcjami rysują się **dopiero po najechaniu
  lub kliknięciu**, nigdy wszystkie naraz (rozdz. 5.1, 5.5).
- **Dwa widoki uzupełniające:** widok modułów (ta sama treść pogrupowana program → moduł)
  i matryca przewag z filtrowaniem (rozdz. 5.1).
- **Treść węzłów:** wyłącznie z rozdziałów 2, 3 i 4 tego dokumentu.
- **Wygląd:** paleta i typografia z rozdz. 9.2 — bez wymyślania własnych kolorów.
- **Dwujęzyczność:** cała strona działa w **polskim i angielskim**, z przełącznikiem widocznym od pierwszego ekranu (szczegóły w rozdz. 5.7).
- **Ekran docelowy:** laptop i monitor. Strona jest **projektowana na duży ekran** — nie ma wersji mobilnej i nie traci się na nią czasu (rozdz. 12.2).
- **Efekt końcowy:** działający adres URL gotowy do wysłania, plus kopia offline na wypadek złego Wi-Fi na spotkaniu.

## 0.2. Kryterium sukcesu w jednym zdaniu

> Inwestor, który nic nie wie o grafice 3D, po **pięciu sekundach** patrzenia na ekran rozumie,
> że to jest duży, spójny system — a po **pięciu minutach** klikania potrafi wskazać, czym ten
> system zarabia pieniądze i dlaczego trudno go skopiować.
>
> **Test czytelności:** na zrzucie mapy bez żadnej interakcji da się przeczytać nazwę każdej
> funkcji, wskazać, do którego programu należy, na którym etapie pracy działa i czy jest gotowa.

## 0.3. Czego nie wolno (twarde reguły)

| # | Reguła | Dlaczego |
|---|---|---|
| R1 | **Nie wymyślaj funkcji.** Każdy węzeł pochodzi z rozdz. 2–4. Brak funkcji na liście = nie ma jej na mapie. | Dokument był weryfikowany na kodzie. Dopisana „dla efektu” funkcja podważa wiarygodność całości na pierwszym pytaniu inwestora. |
| R2 | **Nie zaokrąglaj liczb w górę.** Licznik bierze wartości z danych (tabela 5.0), nie z odczucia. | „140+” da się obronić, „200+” nie. |
| R3 | **Nie ukrywaj statusów.** Funkcje 🟡 i ⚪ są widoczne i oznaczone. | Wiarygodna roadmapa jest aktywem; funkcja udająca gotową i zdemaskowana na demo jest kosztem. |
| R4 | **Nie wpisuj kolorów na sztywno.** Wartości wyłącznie z tabeli 9.2, podane jako zmienne CSS. | Jedno źródło prawdy dla systemu projektowego. |
| R5 | **Nie pokazuj ścieżek lokalnych, adresów IP ani nazw plików źródłowych w interfejsie.** | Zgodność z NDA jest argumentem sprzedażowym produktu — dokument o niej nie może łamać własnej obietnicy (rozdz. 11). |
| R6 | **Czytelność przed efektem.** Żadnej etykiety ukrytej „do zbliżenia”, żadnej nachodzącej na inną, żadnych linii rysowanych wszystkie naraz, żadnego układu zmieniającego się między otwarciami. Fizyka, dryf i chmura węzłów są poza zakresem. | Mapa jest dowodem zakresu — dowód, którego nie da się przeczytać, nic nie dowodzi. Patrz rozdz. 5.5, najważniejsza sekcja wykonawcza. |
| R7 | **Nie dodawaj backendu ani zapytań sieciowych.** | Prezentacja musi działać bez internetu (rozdz. 12.3). |
| R8 | **Nie zmieniaj wymowy tekstów z rozdz. 2–4.** Możesz je skracać do karty węzła, nie przepisywać na marketingowe. | Ich ton — konkret zamiast superlatywów — jest świadomy. |
| R9 | **Nie wypuszczaj strony jednojęzycznej.** Każdy tekst widoczny dla użytkownika ma wersję polską i angielską — również etykiety filtrów, statusów, legendy, kafelków metryk i komunikatów błędów. Brak tłumaczenia to błąd walidacji, nie „do uzupełnienia później”. | Inwestor zagraniczny dostaje ten sam link co krajowy. Dokładanie angielskiego po fakcie do gotowego interfejsu zawsze kończy się mieszanką dwóch języków na jednym ekranie. |

## 0.4. Mapa tego dokumentu

| Rozdział | Co w nim jest | Do czego użyjesz |
|---|---|---|
| 1 | Teza inwestycyjna, problem rynkowy, perspektywa freelancera | teksty poziomu 1, ekran startowy |
| 2–4 | **Pełny inwentarz funkcji Huba, TIMEFLOW i pomostu, ze statusami** | treść wszystkich węzłów i krawędzi |
| 5 | Widoki, poziomy szczegółu, filtry, **język wizualny mapy (5.5)** | wygląd i zachowanie aplikacji |
| 6 | Schemat danych `features_data.json` + walidacja | struktura pliku danych |
| 7 | Model ROI z jawnymi założeniami | kalkulator poziomu 4 |
| 8 | Matryca przewag konkurencyjnych | widok matrycy |
| 9 | Stack, **paleta i typografia**, umiejscowienie w repo | wykonanie |
| 10–12 | Proces aktualizacji danych, poufność, wymagania i kryteria odbioru | definicja ukończenia |
| 13–15 | Statusy, wersje, otwarte pytania do zleceniodawcy | kontekst i rzeczy do zapytania |

---

**Legenda statusów używana w całym dokumencie:**

| Znak | Status w schemacie | Znaczenie |
|---|---|---|
| 🟢 | `production` | działa i zostało odebrane przez użytkownika na żywym środowisku |
| 🟡 | `beta` | kod jest w pakiecie, testy zielone, **odbiór na żywym DCC jeszcze trwa** |
| ⚪ | `roadmap` | zaplanowane, nierozpoczęte lub świadomie odłożone |
## 0.5. Kolejność pracy (rekomendowana)

Mapa psuje się wtedy, gdy powstaje „od ładnego widoku”, a dane dokłada się na końcu. Kolejność:

1. **Dane przed grafiką.** Zbuduj `features_data.json` z rozdziałów 2–4 (schemat: rozdz. 6) i przepuść go przez walidację z 6.5. Każda funkcja dostaje etap (`stage`) i krótki tytuł (`shortTitle`) — bez nich mapy nie da się ułożyć.
2. **Siatka bez stylu.** Osiem kolumn etapów, pas Fundamentu, bloki modułów, chipy jako goły tekst (5.1.1). Sprawdź, czy całość mieści się na ekranie 1440 × 900 (5.5.6).
3. **Język wizualny.** Kolor programu, oznaczenie statusu, typy elementów (5.5.1–5.5.3), tokeny z 9.2.
4. **Relacje na żądanie.** Podświetlenie powiązanych funkcji i linie rysowane po najechaniu lub kliknięciu (5.5.4).
5. **Interakcje i filtry.** Hover, klik, filtry, wyszukiwarka, spacer po etapach (5.5.5, 5.3).
6. **Poziom 2 i 3.** Panel boczny modułu i karta funkcji (5.2).
7. **Pozostałe widoki.** Widok modułów i matryca (5.1.2, 5.1.3) — na tych samych danych, bez drugiego pliku.
8. **Kalkulator ROI** (rozdz. 7) z widocznymi, edytowalnymi założeniami.
9. **Domknięcie.** Tryb offline, dwujęzyczność, checklista odbioru z 12.4.

**Po każdym z kroków 1–3 pokaż zleceniodawcy zrzut.** Szybciej skorygować układ po pierwszym
obrazku niż po gotowej aplikacji. Zrzut po kroku 2 przechodzi test czytelności z 0.2 albo
nie idzie dalej.

---

## 1. WIZJA STRATEGICZNA: EKOSYSTEM DWÓCH POTĘG (EXECUTIVE SUMMARY)

Tradycyjne studia graficzne, agencje 3D/VFX, studia architektoniczne (Archviz) oraz zaawansowani twórcy cyfrowi mierzą się z dwoma krytycznymi problemami branżowymi:

1. **Chaos produkcyjny (Pipeline & Asset Friction):**
   - Rozproszenie terabajtów zasobów (modele 3D, tekstury, shadery, archiwa ZIP/RAR).
   - Współistnienie wielu wersji narzędzi DCC (Cinema 4D R21..2025, Blender 3.x..5.x, 3ds Max 2022+, MODO, RizomUV) i brak centralnego sterowania.
   - Biblioteki liczone w dziesiątkach tysięcy modeli, w których nie da się znaleźć „czegoś podobnego do tego” bez pamiętania nazwy pliku.
   - Brak możliwości inspekcji plików `.c4d` i `.max` bez drogich, dedykowanych licencji komercyjnych.
   - Ryzyko zrywania ścieżek zasobów (Missing Assets) przy przenoszeniu scen między systemami Windows i macOS.
   - Płynność i stabilność kolejek renderowania, brak natychmiastowego wglądu w wielokanałowe pliki OpenEXR.

2. **Utrata zysków i brak transparentności (Financial & Operational Leakage):**
   - Ręczne, niedokładne mierzenie czasu pracy (start/stop) lub inwazyjne trackery szpiegujące pracownika zrzutami ekranu (brak akceptacji artystów).
   - Pomijanie w rozliczeniach kosztu **czasu maszynowego** – stacje robocze liczą rendery godzinami w nocy, zużywając prąd i sprzęt, a klient płaci wyłącznie za „roboczogodziny człowieka”.
   - Podwójne naliczanie czasu przy multitaskingu i fałszowanie statystyk, gdy w tle działa proces renderujący.
   - Wymóg zgodności z NDA (umowy o poufności): studia nie mogą wysyłać nazw projektów, ścieżek ani zrzutów do zewnętrznych chmur SaaS (Toggl, Clockify, Harvest).

### Perspektywa freelancera — najtrudniejszy przypadek, główny bohater mapy

Studio o 20 osobach ma pipeline TD, który spina narzędzia. **Freelancer i studio 2–5-osobowe
nie mają nikogo takiego** — a mierzą się z dokładnie tymi samymi problemami, tylko bez etatu
na ich rozwiązanie. To jest realny odbiorca ekosystemu i to jego dzień pracy pokazuje mapa:

| Rola, którą freelancer pełni jednocześnie | Czym zwykle to robi | Co daje ekosystem CFAB |
|---|---|---|
| Bibliotekarz zasobów | foldery + pamięć + płatny katalog | Biblioteka z `.asset`, parowaniem archiwów, dekompresją w locie i wyszukiwaniem po obrazie (lokalny model AI) |
| Technik pipeline'u | ręczne kopiowanie plików między C4D, Blenderem, Maxem i MODO | cztery mosty TCP i przepływy transferu przez `staging/` |
| Osoba od „dlaczego znowu brakuje tekstury” | szukanie po dyskach | audyt zależności + relink Win/Mac z oceną pewności |
| Render wrangler | pilnowanie kolejki i telefon przy łóżku | kolejka, panel WWW w LAN, ntfy, raport e-mail, auto-shutdown |
| Kontroler jakości ujęć | otwieranie EXR w Photoshopie | EXRuster (Rust + SIMD), dekompozycja passów, wykrywanie dziur w sekwencji |
| Księgowy własnego czasu | Toggl i pamięć | cichy demon, Algorytm Uczciwego Czasu, model ML offline |
| Handlowiec i fakturzysta | Excel | wyceny, limity godzin, raport PDF z dowodem pracy |
| Osoba, która i tak nie policzy czasu maszyny | nie liczy go wcale | Render Ledger → koszt maszyny w wycenie |

**Teza inwestycyjna w jednym zdaniu:** ekosystem zamienia jedną osobę w pracownię, która rozlicza
się jak duże studio — bez chmury, bez abonamentów i bez wysyłania czegokolwiek poza własny komputer.

Dlatego mapa nie jest katalogiem funkcji. Jest **dowodem zakresu**: na jednym ekranie widać,
ile ról obsługuje jeden człowiek przy pomocy tych dwóch programów — i na którym etapie jego
pracy każda z nich wchodzi do gry.

### Odpowiedź: Synergiczny Ekosystem CFAB

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              EKOSYSTEM CFAB (3D & BUSINESS)                            │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│               CFAB 4D HUB                 │                  TIMEFLOW                  │
│       (3D Pipeline Operating System)      │      (AI Time & Financial Intelligence)    │
│       Repo: __c4d · BETA 0.43             │       Repo: __TIMEFLOW · 0.1.5776          │
│       PyQt6 + Rust + Slint · 9 modułów    │       Tauri 2 + React + Rust · 14 obszarów │
│                                           │                                            │
│  • Odwrócona inżynieria plików .c4d/.max  │  • Cichy demon telemetryczny w Rust        │
│  • Orkiestrator renderu, farma LAN, panel │  • Algorytm Uczciwego Czasu (Fair Time)    │
│  • Menadżer multi-terabajtowych bibliotek │  • 4-warstwowy lokalny model AI / ML       │
│  • Wyszukiwanie po obrazie (lokalne AI)   │  • Serwer MCP (44 narzędzia dla agentów)   │
│  • Mosty DCC: C4D, Blender, 3ds Max, MODO │  • P2P LAN Sync (Zero-Cloud)               │
│  • Silnik EXRuster w Rust/SIMD + Slint    │  • Szyfrowany E2E Cloud Delta Sync         │
│  • Scratch Disk Manager (ochrona SSD C:)  │  • Wyceny, estymacje, limity, proof-of-work│
│  • Katalog wtyczek i skryptów produkcyjny │  • Analiza czasu, rentowność, raporty PDF  │
│  • Serwer MCP tylko-do-odczytu (port 8423)│                                            │
├───────────────────────────────────────────┴────────────────────────────────────────────┤
│                    POMOST SYNERGII (INTEGRATION BEACONS & RENDER LEDGER)               │
│  • Wzajemne latarnie procesów JSON (hub.json <-> timeflow.json w CFAB/integration)     │
│  • Rozdział czasu maszyny od czasu człowieka (Machine Time != Human Time)              │
│  • Render Ledger (kontrakt cfab_render 3): przesył czasu renderu do budżetu projektu   │
│  • Czas renderów przypisanych do projektów wędruje między maszynami (LAN i online)     │
│  • Rejestr aktywności DCC (dcc_activity 1) i indeks projektów (cfab_project_index 1)   │
│  • Paczka offline .cfabx: stacja renderująca bez TIMEFLOW wciąż rozlicza czas maszyny  │
│  • Przelicznik kosztu maszyny: Współczynnik RBH x Stawka x Czas Renderu w wycenach     │
│  • Wizualny Dowód Pracy (Proof of Work): miniatury EXRuster prosto na fakturze / PDF   │
│  • Skoordynowany autostart, wspólny raport diagnostyczny, wzajemne wskaźniki obecności │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

**Zasada nadrzędna architektury (obowiązuje w obu programach):** każdy program pisze wyłącznie do
własnej bazy SQLite, cudzą otwiera tylko w trybie READONLY (`query_only=ON`), a **brak drugiego
programu niczego nie psuje**. Między programami nie ma HTTP — wymiana idzie przez pliki-latarnie
i bazy. To jest fundament zgodności z NDA i odporności na awarie.

---

## 2. KOMPLETNY INWENTARZ FUNKCJONALNOŚCI: CFAB 4D HUB
*(Repozytorium: `/Users/micz/__DEV__/__c4d`, pakiet **BETA 0.43**)*

CFAB 4D Hub to desktopowy system operacyjny dla pipeline'u 3D, zorganizowany w architekturę
zorientowaną na moduły (PyQt6 Shell), bezwzględną izolację importów, system kontraktów
(`cfab_contracts`), komunikację IPC oraz akcelerowane moduły natywne w języku Rust.

**Struktura pakietu — 20 części z własnym numerem wersji** (`RELEASE.json`):

| Warstwa | Części | Rola |
|---|---|---|
| Moduły (rail aplikacji) | `start`, `browser`, `render`, `results`, `assets`, `scenes`, `scratch`, `plugins`, `bridges` | 9 samodzielnych modułów, każdy uruchamialny też we własnym oknie |
| Powłoka i usługa | `shell/cfab_shell`, `service/cfab_service` | integrator UI oraz bezgłowa usługa odpytująca mosty |
| Biblioteki wspólne | `shared/cfab_core`, `cfab_ui`, `cfab_contracts`, `cfab_bridge`, `cfab_native` | rdzeń, system projektowy, kontrakty, protokół mostów, krate'y Rust |
| Wtyczki DCC | `bridges/c4d_bridge`, `bridges/blender_bridge`, `bridges/max_bridge`, `bridges/modo_bridge` | kod działający wewnątrz Cinema 4D, Blendera, 3ds Maxa i MODO |

**Nazwy modułów w interfejsie (kolejność w railu, PL / EN):** Start / Start · Biblioteka / Library ·
Render / Render · Wyniki / Results · Zasoby / Assets · Inspektor / Inspector · Robocze / Scratch ·
Wtyczki / Plug-ins · Połączenia / Connections.

### 2.1. Moduł: Start & Launcher DCC (`modules/start`, ALPHA 0.211)
*Brama wejściowa do środowiska pracy artysty 3D.*
- 🟢 **Automatyczna detekcja instalacji 3D:** Dynamiczne wykrywanie wersji Cinema 4D (wraz z profilami użytkownika), Blendera (w tym bibliotek Blender Launchera: `stable`, `daily`, `lts`, `custom`), 3ds Maxa, MODO, Houdini, RizomUV, F3D oraz dedykowanych aplikacji zewnętrznych; ścieżka F3D i Assimp wykrywana także z Homebrew na macOS.
- 🟢 **Karta wbudowanego EXRustera:** przeglądarka EXR dołączona do pakietu ma własną kartę na ekranie Start, pod programami użytkownika — na macOS i Windows.
- 🟢 **Wieloplatformowość systemowa:** Bezproblemowa obsługa rejestru i folderów Windows (`Program Files`, AppData) oraz struktur macOS (`/Applications`, pakiety `.app/`).
- 🟢 **Wizualne karty programów:** Prezentacja programów w formie kafelków z oryginalnymi ikonami wysokiej rozdzielczości, wskaźnikiem stanu mostu integracyjnego (aktywny / niezainstalowany / nieaktualny) oraz statusem obecności na dysku. Nazwy techniczne tłumaczone na czytelne (`3dsmax` → 3ds Max, `rizomuv` → RizomUV).
- 🟢 **Zarządzanie środowiskiem startowym:** Dodawanie niestandardowych programów, skryptów i narzędzi z predefiniowanymi flagami uruchomieniowymi; organizacja w grupy; zmiana kolejności metodą Drag & Drop; bezpieczne ukrywanie z opcją natychmiastowego cofnięcia (Undo).
- 🟢 **Kontekst ostatnich prac:** Lista ostatnio otwieranych scen i projektów, zasilana globalną magistralą zdarzeń (`scene.opened`); szybkie przypinanie kluczowych folderów roboczych.
- 🟢 **Wskaźnik aktywności projektowej (synergia TIMEFLOW):** Plakietki „w realizacji” na folderach **aktywnych** projektów TIMEFLOW; wyłączenie opcji integracji gasi znaczniki, nie gasi zbioru danych.

### 2.2. Moduł: Inspektor scen offline (`modules/scenes`, ALPHA 0.621)
*Głęboka analiza, inspekcja i konwersja plików 3D bez uruchamiania ociężałych programów DCC i bez posiadania licencji.*
- 🟢 **Autorski parser binarny `.c4d` (`c4dgrab`):**
  - Odtworzona w drodze inżynierii wstecznej struktura binarnego nieskompresowanego formatu Cinema 4D (`QC4DC4D6`, Big-Endian).
  - Ekstrakcja geometrii: odczyt tablic punktów (float64: $X, Y, Z$), poligonów i czworokątów (quads), koordynatów UV (float32, 8 wartości/wielokąt), normalnych wierzchołkowych (int16 ze skalowaniem 32000) oraz wag map wierzchołków (Vertex Maps).
  - Rekonstrukcja hierarchii sceny: wyliczanie globalnych macierzy transformacji wzdłuż drzewa `parent_uid` z uwzględnieniem rotacji HPB ($R_y(-H) \cdot R_x(-P) \cdot R_z(-B)$).
  - Identyfikacja generatorów proceduralnych: wykrywanie obiektów Cloner, Instance, deformerów i powiadamianie o braku siatki bezpośredniej w pliku.
  - Rdzeń parsera **bez zależności zewnętrznych** — czysty Python 3.9+ (zasada projektu, potwierdzona w [audyt.md](audyt.md)).
- 🟢 **Czytnik formatu 3ds Max (`MaxAsset`):** bezemisyjny odczyt plików `.max` opartych na strukturach OLE Compound Document; ekstrakcja drzewa węzłów, stosu modyfikatorów, właściwości materiałowych, świateł i kamer z parametrami, ustawień renderu, wtyczek zapisanych w scenie i twardych ścieżek zasobów.
- 🟢 **Narzędzia diagnostyczne i inspekcyjne:**
  - `c4ddiff` ([modules/scenes/parser/c4ddiff.py](modules/scenes/parser/c4ddiff.py)): binarne porównywanie dwóch scen i natychmiastowa identyfikacja zmienionych parametrów.
  - `c4dpatch` ([modules/scenes/parser/c4dpatch.py](modules/scenes/parser/c4dpatch.py)): bezpieczna, 4-bajtowa podmiana identyfikatora aktywnego silnika renderującego (np. Corona ↔ Standard) bezpośrednio w pliku, bez otwierania C4D.
  - `c4dparams` / katalog typów wtyczek (`plugin_catalog.json`, `plugin_types.json`): rozpoznawanie identyfikatorów obiektów i wtyczek producentów.
- 🟢 **Kreator importu 3ds Max → Cinema 4D:** Inspektor nie tylko czyta `.max`, ale **przenosi scenę do Cinema 4D bez uruchamiania Maxa** — buduje pakiet wymiany (`scene.json` opisujący hierarchię i transformacje + jeden plik OBJ na unikalną geometrię, bez duplikatów dla instancji) i wprowadza go przez most C4D.
- 🟢 **Przeliczenie układu współrzędnych i jednostek Max → C4D:** 3ds Max pracuje w układzie prawoskrętnym z osią Z w górę i własnymi jednostkami systemowymi sceny, Cinema 4D — w Y-up i centymetrach. Konwersja jest wykonywana jawnie, na poziomie macierzy, a nie „na oko” przy eksporcie. To miejsce, w którym typowe konwertery gubią skalę i obrót obiektów.
- 🟢 **Narzędzia 3ds Max w Inspektorze:** zrzut zawartości sceny do pliku tekstowego (inwentarz węzłów, modyfikatorów i zasobów do wysłania klientowi lub do archiwum) oraz **kopia zapisana w starszej wersji formatu** — odpowiedź na codzienne „klient ma starszego Maxa”. Obie operacje wyłącznie tworzą nowe pliki; czytnik odmawia nadpisania pliku źródłowego.
- 🟢 **Eksport geometrii offline:** Konwersja odczytanej geometrii do uniwersalnych formatów OBJ, FBX oraz glTF/GLB bez użycia licencji komercyjnych.
- 🟢 **Domyślny format wymiany i automatyczna naprawa siatki:** jedno ustawienie decydujące, czym moduły wymieniają geometrię (GLB / OBJ / FBX / USD) oraz czy siatka przechodzi naprawę przy transferze.
- 🟢 **Inspekcja materiałów i tekstur:** Podgląd zaszytych w pliku miniatur materiałów, inwentaryzacja zależności bitmapowych, mapowanie kanałów, weryfikacja brakujących zasobów.
- 🟢 **Drzewo obiektów o wysokiej ergonomii:** Szybkie rozwijanie/zwijanie gałęzi, zaawansowane wyszukiwanie z zachowaniem kontekstu hierarchii, filtry widoczności (edytor/render z dziedziczeniem po rodzicach — wskaźniki kropkowe zgodne z C4D Object Manager).

### 2.3. Moduł: Render & Orkiestracja (`modules/render`, ALPHA 0.72)
*Centrala dowodzenia renderem studyjnym, kolejkowaniem, monitoringiem zdalnym i rozliczeniami.*
- 🟢 **Sterowanie kolejką renderowania C4D:** Odczyt i kontrola kolejki Cinema 4D (Render Queue), włączanie/wyłączanie zadań, reordering, priorytetyzacja.
- 🟢 **Wielosilnikowy monitoring:** Wsparcie dla silników Standard, Physical, Corona Renderer, Redshift oraz V-Ray; nazwa aktywnego renderera widoczna w karcie zadania.
- 🟢 **Podgląd postępu na żywo:** Automatyczne pobieranie ostatnio wyrenderowanej klatki lub miniatury zaszytej w pliku `.c4d` przed startem zadania.
- 🟢 **Postęp, ETA i odczyt logu zadania:** czas ukończenia liczony z rzeczywistej liczby klatek podanej przez C4D, a nie szacowany z zegarka; log kolejki dostarcza nazwę ujęcia (take), użytą kamerę oraz każdą zapisaną klatkę z czasem i ścieżką — historia zadania jest odtwarzalna po fakcie.
- 🟢 **Ustawienia zadania bez zamrażania C4D:** ścieżka zapisu, renderer i zakres klatek zadania z kolejki są czytane najtańszym filtrem wczytania sceny (same ustawienia renderu, bez obiektów i materiałów), a po zapisie sceny most oddaje ostatnie znane wartości z oznaczeniem „nieaktualne” zamiast wczytywać plik od nowa.
- 🟢 **Monitoring renderów pojedynczych (bez kolejki):** Śledzenie renderów wykonywanych bezpośrednio w Picture Viewerze lub edytorze C4D (`rendering_external`, `rendering_editor`); zliczanie rzeczywistego czasu renderowania (`render_seconds` z `render_time` C4D, a przy Picture Viewerze — czas zegara od `live_started` do `live_finished`).
- 🟢 **Rozproszony render w sieci lokalnej — Węzły LAN (Farma renderująca)** ([modules/render/coordinator.py](modules/render/coordinator.py), panel w module Połączenia):
  - Rejestr zdalnych maszyn z uruchomioną Cinema 4D i wtyczką mostu: dodawanie węzła (nazwa, host, port), włączanie i wyłączanie, usuwanie, ręczne sprawdzenie wszystkich naraz.
  - Stan klastra w jednym widoku: który węzeł jest online, który właśnie renderuje, a który jest wolny; pingi co 15 s w osobnym wątku zdrowia, widok podaje ostatni znany stan bez blokowania interfejsu.
  - **Wysyłka zadania na pierwszy wolny węzeł** albo na wskazany z listy — dystrybucja kolejki po maszynach studia **bez Team Render i bez licencji menadżera farmy**.
- 🟢 **Samonaprawa po awarii Cinema 4D (Crash Recovery & Auto-Resume):** wykrycie niespodziewanego zniknięcia procesu C4D w trakcie renderowania, przeskanowanie katalogu wyjściowego pod kątem klatek gotowych i brakujących, ponowne uruchomienie Cinema 4D i **wznowienie renderu wyłącznie brakującego zakresu** — z raportem, co zostało odzyskane. Nocny render nie przepada przez jedną awarię.
- 🟢 **Strażnik zamykania Cinema 4D (exit watchdog):** gdy silnik renderujący (np. Corona, Team Render) zakleszczy się przy zamykaniu programu, wtyczka kończy proces bezpiecznie zamiast zostawić wiszącą C4D, która blokowałaby wyłączenie komputera po kolejce.
- 🟢 **Kontrola przed renderem (Precheck) — „co w tej kolejce się nie uda”:** zanim ruszy kolejka, moduł sprawdza istnienie katalogu wyjściowego i prawo zapisu, wolne miejsce na dysku wobec oczekiwanej liczby klatek, obecność zainstalowanego silnika renderującego, kolizje nazw plików między zadaniami oraz klatki już policzone. Wynik ma trzy poziomy: **błąd** („to zadanie nie da wyniku”), **ostrzeżenie** („sprawdź, czy o to chodziło”) i informacja dla zadań wyłączonych. Raport jest dostępny w aplikacji, w panelu WWW i z wiersza poleceń.
- 🟢 **Autonomiczny Panel Web (WWW / Mobile)** ([service/cfab_service/web_panel.py](service/cfab_service/web_panel.py)):
  - Wbudowany serwer HTTP udostępniający responsywny panel kontrolny w sieci lokalnej (LAN), zabezpieczony tokenem uwierzytelniającym.
  - Podgląd klatek, statusu procentowego i szacowanego czasu ukończenia na smartfonie lub tablecie bez instalacji dodatkowego oprogramowania.
  - **Przeglądanie dysków maszyny renderującej z telefonu:** panel działa na tym samym komputerze co Cinema 4D, więc widzi jego dyski — można z drugiego pokoju sprawdzić, co faktycznie wylądowało w katalogu wyjściowym, zamiast wierzyć licznikowi.
  - Raport kontroli przed renderem dostępny wprost z panelu.
  - Dynamiczny fallback portów w razie kolizji sieciowych.
- **Automatyzacja po zakończeniu prac:**
  - 🟢 Bezpieczne wyłączanie komputera (Shutdown) z procedurą odliczania i możliwością natychmiastowego anulowania; na Windows zamknięcie aplikacji jest wymuszane, a nieudane wyłączenie trafia do dziennika i powiadomienia.
  - 🟢 Raporty e-mail (SMTP): podsumowanie kolejki z załączonymi miniaturami wyrenderowanych ujęć (kompresja WebP/JPEG, algorytm próbkowania klatek z animacji, szyfrowane hasła w `mail-secrets.json`).
  - 🟢 Powiadomienia Webhook (`ntfy`): powiadomienia push na urządzenia mobilne z wbudowanym testem konfiguracji serwera (`Wyślij test` → `ntfy_test`).
  - 🟢 Sygnały dźwiękowe: alerty po skończeniu renderu (`afplay` Glass na macOS, `MessageBeep` na Windows).
- 🟢 **Księga Renderów (Render Ledger — kontrakt `cfab_render` 3):**
  - Trwały rejestr ukończonych zadań w lokalnej bazie SQLite (`history.db`, kontrakt `history_db` 2).
  - Rejestracja `hub_instance_id`, `machine_name`, pełnej ścieżki projektu, liczby klatek i rzeczywistych sekund obliczeniowych dla integracji z TIMEFLOW.
  - Miniatura ostatniej klatki (PNG z EXRustera) dopinana do wiersza rejestru — Proof of Work w raporcie TIMEFLOW.
- 🟢 **Zakładka TIMEFLOW w module Render:** stan integracji (wersja drugiej strony, zgodność kontraktu, „działa / brak sygnału od …”), lista maszyn i instancji, ręczna segregacja renderów (`project_hint`), filtr aktywnych projektów.
- 🟢 **Historia renderowania:** zapisane przebiegi kolejki z podsumowaniem (`summary.py`); te same liczby trafiają do powiadomień i maila, więc panel i raport nie rozjeżdżają się ze sobą.
- 🟢 **Zapis do ledgera także wtedy, gdy TIMEFLOW nie stoi:** każdy zakończony render trafia do rejestru bez sprawdzania, czy TIMEFLOW istnieje na tej maszynie (`ledger.record_finished`).

### 2.4. Moduł: Wyniki & Analiza EXR (`modules/results`, 0.8.7)
*Zintegrowana, natywna przeglądarka i analizator sekwencji klatek oraz wielokanałowych plików EXR, oparta na Rust i Slint.*
- 🟢 **Silnik EXRuster (Rust + Slint UI):**
  - Rust z optymalizacjami wektorowymi SIMD do błyskawicznego dekodowania plików OpenEXR i HDR.
  - Elastyczny tone mapping w czasie rzeczywistym (reinhard, exposure, gamma) i obliczanie histogramu luminancji poza głównym wątkiem UI.
  - Interfejs EXRustera (paski, przyciski, suwaki, typografia, tło podglądu, belka okna na macOS) korzysta z tych samych tokenów co Hub — okno natywne w Slincie wygląda jak reszta aplikacji.
- 🟢 **Analiza warstw i passów (Multi-layer / Multipass):** podgląd i dekompozycja kanałów Beauty, Cryptomatte, Z-Depth, Normals, Albedo, Diffuse, Raw Component i dalszych (grupowanie kanałów w `channel_groups.json`).
- 🟢 **Weryfikacja sekwencji animacji:**
  - Skaner numeracji klatek (frame sequence checker), automatyczne wykrywanie brakujących lub uszkodzonych klatek.
  - Funkcja *„Generuj zadanie na brakujące klatki”* ([modules/results/missing.py](modules/results/missing.py)) — każdy brakujący zakres staje się osobną kopią sceny `scena__missing_<od>_<do>.c4d` w kolejce modułu Render.
- 🟢 **Wysokowydajny bufor miniatur (Thumbnail Cache)** — *punkt 0.1-B, odebrany:*
  - Pamięć podręczna miniatur PNG oparta na haszach `mtime` i rozmiaru pliku; EXRuster uruchamia się wyłącznie dla plików realnie zmienionych.
  - Ograniczenie współbieżnych procesów dekodujących (maks. 4 wątki robocze) eliminujące zacinanie interfejsu przy katalogach z tysiącami ujęć.
  - Automatyczne czyszczenie osieroconych plików tymczasowych (`.part.png`) i starych kluczy poza wątkiem GUI.
  - Nagłówek EXR i podgląd 1080 poza wątkiem GUI; odtwarzanie sekwencji trzyma jedno ładowanie naraz.

### 2.5. Moduł: Zasoby Sceny & Relink (`modules/assets`, ALPHA 0.22)
*Audytor spójności sceny 3D i automatyczny naprawiacz brakujących ścieżek.*
- 🟢 **Kompleksowy audyt zależności:** Skanowanie otwartej sceny w C4D lub pliku offline pod kątem obecności tekstur, plików IES, obiektów proxy (Corona/V-Ray Proxy), wolumenów OpenVDB oraz animacji Alembic.
- 🟢 **Inteligentny Relink wieloplatformowy (Cross-Platform Relinking):**
  - Translacja ścieżek między formatami Windows (`Z:\3D_LIB\...`) a macOS (`/Volumes/3D_LIB/...`) według zdefiniowanych reguł translacji.
  - Automatyczne przeszukiwanie katalogów projektu, podpiętych bibliotek zasobów i pamięci podręcznej w poszukiwaniu brakujących plików z oceną prawdopodobieństwa dopasowania (confidence score).
  - Zastosowanie zmian w otwartej scenie jednym kliknięciem przez most IPC.
- 🟢 **Operacje i standaryzacja tekstur:**
  - Wypakowywanie zasobów z wewnętrznej bazy Maxon Asset Browser bezpośrednio do lokalnego folderu `tex/` projektu.
  - Skalowanie rozdzielczości, konwersja na formaty zoptymalizowane (WebP/TIFF) oraz porównywanie różnicowe.
  - Masowa zmiana nazw plików zgodnie ze standardami nazewnictwa PBR (np. `[NazwaObiektu]_[Kanał].png`).
- 🟢 **Zarządzanie bibliotekami zasobów:** edytowalna tabela folderów bibliotek w Ustawieniach (dodawanie, usuwanie, zmiana nazwy) z synchronizacją do modułu Biblioteka.
- 🟢 **Gwarancja bezpieczeństwa:** Każda operacja modyfikująca strukturę plików tworzy manifest cofnięcia (Undo Manifest) umożliwiający powrót do pierwotnego układu.

### 2.6. Moduł: Biblioteka Zasobów (`modules/browser`, 1.7.2)
*Scentralizowany menadżer modeli 3D, materiałów, tekstur i plików SBSAR.*
- 🟢 **Obsługa bibliotek wieloterabajtowych:** Praca na wielu folderach roboczych jednocześnie (`work_folder1..9`, dyski sieciowe NAS / SMB).
- 🟢 **Format metadanych `.asset`:** Niezależne od formatu 3D pliki metadanych zawierające tagi, ocenę gwiazdkową, kolorystykę, opisy oraz techniczne parametry siatek.
- 🟢 **Automatyczne parowanie zasobów:** Inteligentne łączenie plików archiwów (`.zip`, `.rar`, `.7z`), plików scen (`.c4d`, `.max`, `.blend`) oraz plików graficznych podglądu (`.jpg`, `.png`).
- 🟢 **Dekompresja Just-in-Time:** Skopiowanie nazwy zasobu do schowka automatycznie w tle rozpakowuje archiwum do wydzielonego folderu tymczasowego (`temp/browser/uncompressed/`), przygotowując model do importu bez zaśmiecania folderu źródłowego. ZIP obsługuje `zipfile`, RAR i 7z — systemowy `tar` (bsdtar/libarchive).
- 🟢 **Narzędzia biblioteczne:** Wbudowane wykrywanie duplikatów po sumach kontrolnych (krata Rust `hash_utils`), masowa konwersja miniatur do formatu WebP (krata `image_tools`), szybki podgląd techniczny, skaner bibliotek (krata `scanner`).
- 🟢 **Wyszukiwanie wizualne po obrazie (lokalny model AI, zakładka „AI i Modele”):**
  - Wskazanie obrazu referencyjnego zwraca najbardziej podobne modele z biblioteki — bez tagów i bez pamiętania nazw plików. Wyniki jako kafelki z miniaturami, obok podgląd referencji.
  - Model obrazowy **Meta DINOv2** (wektory 768-D, domyślny) albo CLIP ViT-L/14 w formacie ONNX, uruchamiany **w całości lokalnie**; na Windows akceleracja DirectML z powrotem do CPU, na macOS CPU w tle (CoreML świadomie wyłączony — wywracał proces).
  - Lokalna baza wektorowa (kontrakt `ai_vector_db` 1) z bezpiecznym dostępem równoległym; indeksowanie całej biblioteki albo pojedynczego folderu z menu kontekstowego, wykrywanie brakujących miniatur, wymuszona synchronizacja, znacznik AI dziedziczony przez podfoldery.
  - Panel statystyk: rozmiar bazy wektorowej i pokrycie biblioteki indeksem; usuwanie baz AI przy przebudowie zasobów.
- 🟢 **Zakładka Błędy — audyt spójności biblioteki:** wykrywa pliki `.asset` bez pary (model, archiwum, podgląd) i naprawia je; reguła spójności pary usuwa osierocone `.asset` i odsyła pliki do zakładki **Parowanie**, zamiast zostawiać w bibliotece martwe wpisy.

### 2.7. Moduł: Mosty DCC & Komunikacja (`modules/bridges`, ALPHA 0.71)
*Dwukierunkowa magistrala komunikacyjna łącząca hub z zewnętrznym oprogramowaniem DCC.*

| Most | Część | Port | Kontrakt | Status |
|---|---|---|---|---|
| Cinema 4D (`C4Dcfabbridge`) | `bridges/c4d_bridge` ALPHA 0.77 | 4444 | `bridge_protocol` 6 | 🟢 |
| Blender (`cfab_bridge_blender`) | `bridges/blender_bridge` ALPHA 0.231 | 8920 | `blender_bridge_protocol` 2 | 🟢 |
| 3ds Max (`CFABBridge.bundle`) | `bridges/max_bridge` ALPHA 0.22 | 8930 | `max_bridge_protocol` 1 | 🟢 |
| MODO (`cfab_bridge_modo`) | `bridges/modo_bridge` ALPHA 0.11 | 8940 | `modo_bridge_protocol` 1 | 🟢 |
| RizomUV | bez osobnej części — okno **CFAB Bridge** we wtyczce C4D | — | wymiana plikowa (FBX) | 🟢 |

- 🟢 **Wtyczka Cinema 4D (`C4Dcfabbridge`):**
  - Działa bezpośrednio w procesie C4D (Python API), nasłuchuje na dedykowanym porcie TCP z autoryzacją tokenem (`hmac.compare_digest`).
  - Wykonywanie zadań w wątku głównym C4D przez mechanizm `Timer` / `CoreMessage`, co gwarantuje stabilność i brak awarii interfejsu Maxona.
  - Obsługa **wielu zainstalowanych wersji C4D naraz** — Hub przechodzi tokeny wszystkich wtyczek zamiast ufać zapamiętanej ścieżce.
  - Generowanie materiałów Corona Physical z tekstur (*TexMat*): automatyczne rozpoznawanie kanałów (BaseColor, Roughness, Metalness, Normal, Height, AO, Bump, Mixture) po pełnej tabeli identyfikatorów Corony i tworzenie materiałów z 1-krokowym cofnięciem (Undo).
  - Narzędzie pieczenia geometrii (`bake_geometry`): spłaszczanie generatorów proceduralnych do formatów GLB/USD (CSTO).
  - Zarządzanie systemem ujęć (Take System): lista ujęć, tworzenie ujęć z macierzy kamer i wariantów packshotowych.
  - Polecenia **Wyślij do 3ds Maxa** i **Pobierz z 3ds Maxa** oraz komendy MODO z własnymi ikonami w menu i palecie wtyczki.
- 🟢 **Most do Blendera (`cfab_bridge_blender`):**
  - Wtyczka dla Blendera 4.x/5.x udostępniająca dwukierunkowy import/eksport siatek (GLB, USD, Alembic).
  - Wbudowane narzędzia diagnostyki i naprawy siatek (`cfab_mesh`), integracja profili renderu Cycles oraz spłaszczanie scen linkowanych (`CFAB Localizer`).
- 🟢 **Materiały i instancje z Blendera do Cinema 4D:**
  - Most czyta tekstury z drzewa węzłów Blendera razem z grupami (np. biblioteka roślin botaniq) i zapisuje kanały koloru, alfy, szorstkości i normalnych w manifeście transferu; wtyczka C4D dokłada je do materiałów powstałych przy imporcie — domyślnie jako **Corona Physical**, bez Corony jako Standard z ostrzeżeniem.
  - Instancje kolekcji są rozwijane tymczasowo przy eksporcie, a materiały siadają na swoich selekcjach poligonów; wycinanki liści (kanał alfa z PNG) działają w Standardzie i w Coronie.
  - Transfer nie zasypuje obiektu tagami: selekcje i dodatkowe kanały UV jadą tylko po włączeniu w panelu, ponowny transfer tego samego modelu używa istniejącego materiału zamiast mnożyć kopie.
- 🟢 **Most do 3ds Maxa (`CFAB Bridge for 3ds Max`)** — [docs/MOST_3DSMAX.md](docs/MOST_3DSMAX.md):
  - Wtyczka jako pakiet `ApplicationPlugins` (`CFABBridge.bundle` w `%APPDATA%`) wspólny dla wszystkich wersji Maxa, instalowany z Huba jednym przyciskiem, **bez praw administratora**; dodatkowy hak startowy MaxScript w `scripts/startup` każdej wersji (Max bywa pomija pakiety ApplicationPlugins).
  - Kod wtyczki zgodny z Pythonem 3.7.9 (tyle ma Max 2022), pompa wątku głównego na `QTimer` co 50 ms (`pymxs` wolno wołać wyłącznie z wątku głównego), `bridge_info` omija kolejkę i odpowiada nawet przy otwartym oknie modalnym.
  - Polecenia: `bridge_info`, `status` (plik, liczba obiektów, zaznaczenie, jednostki, renderer), `export_selection`, `import_file`.
  - Wymiana siatek w **FBX i OBJ** (Max 2022 nie ma wtyczki glTF — most mówi to wprost zamiast udawać), wymuszone centymetry przy FBX, manifest `.cfab.json`, jeden krok Undo, zaznaczenie użytkownika wraca na miejsce.
  - Przepływy `max_to_c4d` i `c4d_to_max` w [shared/cfab_core/transfer.py](shared/cfab_core/transfer.py) z pingiem obu mostów przed startem.
  - `macroScript CFAB_SendToC4D` w kategorii „CFAB Bridge” — wysyłka wprost z paska narzędzi Maxa.
- 🟢 **Most do Foundry MODO (`cfab_bridge_modo`)** — [docs/MOST_MODO.md](docs/MOST_MODO.md):
  - Wtyczka w standardzie MODO Kit (katalog kitów użytkownika), instalowana i aktualizowana z Huba; pasek i menu **CFAB Bridge** w MODO oraz osobny panel Qt z przyciskami mostu.
  - Polecenia: `bridge_info`, `status`, `objects`, `select`, `export_selection`, `import_file`; operacje na scenie wykonywane w wątku aplikacji MODO, każda w jednym bloku Undo.
  - Przepływy `modo_to_c4d` i `c4d_to_modo` przez `staging/` (FBX + manifest `.cfab.json`) z przeliczeniem jednostek (metry MODO ↔ centymetry C4D); z Cinema 4D do MODO jadą wyłącznie modele i bryły.
  - Wskaźnik MODO w pasku górnym Huba, karta na ekranie Start, komendy MODO w palecie Cinema 4D.
- 🟢 **Most do RizomUV:** okno **CFAB Bridge** we wtyczce C4D z zakładkami Blender / Rizom UV (Export / Import, lista map UV, zmiana nazwy, ustawienia, ikony). Ścieżka do RizomUV pochodzi z Programów Huba albo z autowykrycia — nie ze sztywnego `S:\`. C4D nie zamarza: opcja „Czekaj na zamknięcie i importuj” działa w wątku roboczym z Timerem.
  - ⚪ Przepływ uruchamiany **z poziomu Huba** (Sceny → Rizom → siatka z UV z powrotem) pozostaje otwarty (punkt 0.1-E); osobna część `bridges/rizom_bridge/` wymagałaby zatwierdzenia jako nowy obszar.
- 🟢 **Zarządzanie instalacjami:** Panel weryfikacji zainstalowanych wtyczek w profilach C4D, Blendera, Maxa i MODO; kolumna z wersją zainstalowanej wtyczki; instalacja, aktualizacja, przywracanie z kopii zapasowej i usuwanie jednym kliknięciem; powiadomienie o nieaktualnej wtyczce z nazwami konkretnych instalacji i przejściem do instalatora; wykrycie skasowanego haka startowego i pliku makra.

### 2.8. Moduł: Przestrzeń Robocza & Temp Storage (`modules/scratch`, ALPHA 0.133)
*Kontroler operacji dyskowych I/O chroniący dyski systemowe przed zapchaniem.*
- 🟢 **Izolacja dysku Scratch:** Możliwość przeniesienia folderu roboczego z małego dysku systemowego C: na duży, szybki dysk roboczy (np. `D:\CFAB_Scratch` lub `/Volumes/Scratch`).
- 🟢 **Kategoryzacja stref tymczasowych** ([shared/cfab_core/storage.py](shared/cfab_core/storage.py)):
  - `staging/`: Izolowane pliki wymiany mostów (GLB, OBJ, FBX, USD) z unikalnymi identyfikatorami zadań (UUID); katalog jest **sandboksem** — most przyjmuje ścieżki tylko z jego wnętrza.
  - `exports/`: Domyślny, ujednolicony folder na wszystkie pliki wyjściowe generowane przez hub.
  - `browser/`: Bufor rozpakowanych modeli i konwersji tekstur.
  - `render/`: Klatki podglądu i logi procesów renderujących.
  - `cache/`: Długoterminowa pamięć miniatur i histogramów z mechanizmem LRU (Least Recently Used).
- 🟢 **Zarządzanie retencją i czyszczeniem:** Automatyczne usuwanie plików sesyjnych po zamknięciu aplikacji, czyszczenie starych zadań stagingu, telemetria wolnego miejsca w czasie rzeczywistym na pasku stanu z ostrzeżeniami o przekroczeniu limitu bezpieczeństwa (np. <15 GB).
- 🟢 **Podglądy plików w przestrzeni roboczej:** miniatury tekstur (Qt), plików EXR i HDR (EXRuster) oraz geometrii dla plików, które same ich nie niosą — wykrywanie zainstalowanego F3D i generowanie kopii wyłącznie z geometrią dla starszych FBX-ów, a konwersje podglądu wykonywane **w świeżym procesie Blendera w tle**, który nigdy nie zapisuje niczego na pliku źródłowym.
- 🟢 **Zintegrowana przeglądarka Robocze (Scratch Navigator):** Drzewo plików i katalogów przestrzeni roboczej umożliwiające natychmiastowe otwarcie znalezionych plików w odpowiednim module (sceny `.c4d`/`.max` w Inspektorze, `.exr` w Wynikach, archiwa w Bibliotece).

### 2.9. Moduł: Katalog Skryptów i Wtyczek (`modules/plugins`, BETA 0.114)
*Wewnętrzny, bezpieczny sklep z narzędziami usprawniającymi pracę w C4D i Blenderze — punkt 0.1-C, odebrany 2026-09-15.*
- 🟢 **Zarządzanie skryptami produkcyjnymi:** wyselekcjonowane, przetestowane narzędzia w [catalog/](catalog/README.md): **31 skryptów Python dla Cinema 4D** w 8 grupach (corona-bitmapy, corona-override, materiały, proxy-corona, proxy-vray, scena-obiekty, scena-struktura, tekstury) oraz **3 dodatki do Blendera** (CFAB Mesh Tool, LiquiFeel, NodePreview) — stan wg `catalog/catalog.json`. Pula źródłowa poza repozytorium liczy ~300 plików — do pakietu wchodzi wyłącznie część po audycie.
- 🟢 **Bezpieczeństwo i audyt:** narzędzia przeszły audyt ([docs/audits/2026-09-15/cfab-tools.md](docs/audits/2026-09-15/cfab-tools.md)) pod kątem wycieków pamięci, bezpieczeństwa kodu i kompatybilności wersji; szkice, testy i materiały obce (keygeny, archiwa RAR, sekrety SMTP, zasoby Quixel) świadomie **nie wchodzą** do pakietu.
- 🟢 **Instalacja profilowa:** osobne zakładki Cinema 4D / Blender, liczba skryptów, oceny i opisy, ikony z systemu projektowego, akcje zainstaluj / aktualizuj / cofnij / usuń w konkretnych wersjach środowisk graficznych z poziomu jednego okna Huba; rozpoznawanie już wgranych dodatków po plikach, nie tylko po rejestrze JSON Huba.

### 2.10. Powłoka, usługa i rdzeń współdzielony *(warstwa niewidoczna dla użytkownika, kluczowa dla inwestora)*
*Ta warstwa nie ma własnej zakładki w railu, ale to ona sprawia, że 9 modułów zachowuje się jak jeden produkt.*
- 🟢 **Powłoka `cfab_shell` (ALPHA 0.703):** rail modułów, jedna instancja aplikacji (`single_instance`), globalne okno Ustawień z zakładką dla każdego modułu (punkt 0.1-G: nawigacja i `create_settings()` gotowe, odbiór ergonomii trwa), wskaźniki połączeń DCC w pasku górnym (C4D, Blender, 3ds Max, MODO), launcher modułów w trybie samodzielnym; zminimalizowane okno schodzi do paska menu macOS / zasobnika Windows, a monitoring pracuje dalej.
- 🟢 **Uruchamianie i przenoszenie instalacji:** aplikacja z ikoną (`CFAB 4D Hub.app` na macOS, `CFAB 4D Hub.exe` na Windows), polecenie `update.py` odświeżające zależności oraz `package_windows.py` pakujący kompletną instalację (z modelami AI albo bez) do przeniesienia na inny komputer z Windows.
- 🟢 **Usługa `cfab_service` (ALPHA 0.721, kontrakt `service_api` 5):** bezgłowy proces odpytujący mosty (`poll_c4d`, `poll_blender`, `poll_max`, `poll_modo`), utrzymujący panel WWW, cykl ACK z TIMEFLOW, kolejkę powiadomień; działa niezależnie od otwartego okna Huba.
- 🟢 **Rdzeń `cfab_core` (ALPHA 0.95):** magistrala zdarzeń (`events`), rejestr akcji międzymodułowych bez importów krzyżowych (`actions`), zadania w tle bez zależności od Qt (`tasks`), rotujące logi per rola procesu (`logs`), i18n PL/EN (`i18n`), wykrywanie DCC (`dcc`, `programs`, `tools`), odczyt EXR (`exr`), numeracja klatek (`frames`), archiwa (`archives`), transfer między DCC (`transfer`), magazyn scratch (`storage`), ustawienia (`settings`), wersjonowanie (`version`).
- 🟢 **Kontrakty `cfab_contracts` (ALPHA 0.53):** jedno miejsce z numerami kontraktów; zmiana kontraktu wymusza testy wszystkich części, które go czytają.
- 🟢 **System projektowy `cfab_ui` (ALPHA 0.663):** tokeny (`tokens.json`), generator stylów QSS, komponenty, galeria zrzutów PL/EN, generator motywu dla Slinta (`colors.slint`). **Zero literałów kolorów w modułach** — pilnuje tego `tests/test_design_system.py`.
- 🟢 **Natywne krate'y Rust `cfab_native` (0.2.0):** `scanner` (skan bibliotek), `image_tools` (konwersje i miniatury), `hash_utils` (sumy kontrolne, wykrywanie duplikatów).
- 🟢 **Serwer MCP Huba** ([shared/cfab_core/mcp_server.py](shared/cfab_core/mcp_server.py)): lokalny serwer Model Context Protocol (`cfab-hub-mcp`, port 8423, **wyłącznie loopback, wyłącznie odczyt**, hardened headers) wystawiający agentom AI: `list_render_jobs`, `get_render_ledger`, `get_active_documents`, `get_integration_status`, `get_project_summary`. Włączany w Ustawienia → Integracja.
- 🟢 **Raport diagnostyczny integracji** ([shared/cfab_core/diagnostic.py](shared/cfab_core/diagnostic.py)): stan obu latarni, wyniki prób połączenia z bazami, numery kontraktów po obu stronach — jeden przycisk zamiast zgadywania, gdzie pękła integracja.
- 🟢 **Skoordynowany autostart** ([shared/cfab_core/autostart.py](shared/cfab_core/autostart.py)): opcja „Uruchamiaj TIMEFLOW razem z CFAB Hub” oraz autostart serwera MCP.
- ⚪ **Systemowy autostart przy logowaniu (Login Items / Startup)** — otwarta pozycja fali 0.15. Ikona aplikacji i zejście do zasobnika są już w powłoce (wyżej).

---

## 3. KOMPLETNY INWENTARZ FUNKCJONALNOŚCI: TIMEFLOW
*(Repozytorium: `/Users/micz/__DEV__/__TIMEFLOW`, wersja **0.1.5776**)*

TIMEFLOW to zaawansowany system śledzenia czasu, wycen i analityki biznesowej dla freelancerów oraz
małych zespołów projektowych. Składa się z trzech części:

| Część | Ścieżka | Stack |
|---|---|---|
| Demon telemetryczny | `__TIMEFLOW/__cfab_demon/src` | Rust (proces w tle, bez GUI) |
| Aplikacja kliencka (dashboard) | `__TIMEFLOW/__cfab_demon/dashboard` + `dashboard/src-tauri` | Tauri 2 + React + TypeScript, backend w Rust |
| Serwer koordynacji synchronizacji | `__TIMEFLOW/__cfab_server` | Next.js + Prisma |

**Obszary w nawigacji aplikacji (14):** Dashboard · Sesje · Projekty · Wyceny · Klienci · Aplikacje ·
Analiza czasu · AI i model · Dane · Raporty · PM · Demon · Zadania · Renderingi.
Poza nawigacją: Ustawienia, Pomoc, Quick Start, Import.

### 3.1. Niewidzialny Demon Telemetryczny (`timeflow-demon` w Rust)
- 🟢 **Monitoring sterowany zdarzeniami (Event-Driven Detection):** Zamiast obciążającego odpytywania procesora co sekundę, demon nasłuchuje zdarzeń systemowych (Win32 event hooks & macOS Quartz taps) dotyczących zmiany aktywnego okna, fokusu procesu i aktywności wejścia (`monitor.rs`, `monitor_macos.rs`).
- 🟢 **Precyzyjne parsowanie nagłówków okien (`title_parser.rs`):** Zaawansowane silniki ekstrakcji nazw projektów, ścieżek plików i stanów dokumentu z pasków tytułowych programów graficznych, edytorów kodu, pakietów biurowych i przeglądarek.
- 🟢 **Inteligentny Idle Guard (`tracker.rs`):** Wykrywanie rzeczywistej bezczynności użytkownika (brak interakcji myszą/klawiaturą) z konfigurowalnym progiem czasu; sesje zamykane na przejściu w bezczynność; ochrona przed sztucznym nabijaniem godzin.
- 🟢 **Rozpoznanie pracy w tle:** proces zużywający CPU przy bezczynnym użytkowniku nie jest liczony jako praca człowieka — to podstawa rozdziału czasu maszyny od czasu artysty.
- 🟢 **Pamięć podręczna procesów (PID Cache):** Natychmiastowa identyfikacja aplikacji bez narzutu na rejestr systemowy czy zapytania WMI.
- 🟢 **Sterowanie demonem z aplikacji (ekran „Demon”):** status działania, wersja, zgodność wersji demon ↔ dashboard, lista sesji nieprzypisanych, start/stop.
- 🟢 **Dodawanie programów przeciągnięciem:** upuszczenie `.app` (macOS) lub `.exe` (Windows) na okno TIMEFLOW dodaje program do monitorowanych z dokładnym dopasowaniem; na macOS demon rozpoznaje go po identyfikatorze pakietu, co naprawia śledzenie aplikacji zbudowanych na Electronie.

### 3.2. Algorytm Uczciwego Czasu (Fair Time Algorithm)
*Kluczowy wyróżnik technologiczny eliminujący patologie tradycyjnych trackerów.*
- 🟢 **Koniec z podwójnym naliczaniem czasu:** W przypadku jednoczesnej pracy nad kilkoma zadaniami, przełączania okien w poszukiwaniu referencji lub działania procesów w tle, czas nie jest sztucznie podwajany.
- 🟢 **Matematyczna precyzja podziału sesji (`time_algorithm.rs`):** Algorytm proporcjonalnie i sprawiedliwie alokuje minuty pomiędzy projekty na podstawie rzeczywistego zaangażowania i fokusu użytkownika.
- 🟢 **Pełna transparentność dowodowa:** Klient otrzymuje rozliczenie odzwierciedlające faktyczny wysiłek twórczy, budując zaufanie do wycen studia.

### 3.3. 4-Warstwowy Lokalny Silnik Sugestii AI / ML (`commands/assignment_model/`)
*Wbudowany model uczenia maszynowego działający w 100% offline w procesie Rust.*
- 🟢 **Warstwa 1: Analiza ścieżek plików** (`folder_scan.rs`): Dopasowywanie wzorców ścieżek otwartych dokumentów do zdefiniowanych struktur katalogów projektowych.
- 🟢 **Warstwa 2: Historia aplikacji** (`context.rs`): Uczenie się preferencji użytkownika — które narzędzia i w jakich konfiguracjach służą do realizacji konkretnych zleceń.
- 🟢 **Warstwa 3: Wzorce czasowe:** Rozpoznawanie cykli dobowych i tygodniowych przypisanych do danych klientów.
- 🟢 **Warstwa 4: Tokenizacja semantyczna** (`scoring.rs`): Rozbijanie tytułów okien i kart na tokeny semantyczne i dopasowywanie do słowników projektowych.
- 🟢 **Fakty przed pamięcią:** ścieżka pliku leżąca w folderze projektu wygrywa z wyuczoną historią; model nie uczy się już na własnych automatycznych przypisaniach (koniec z utrwalaniem błędów), tokeny ważone IDF, nazwa aplikacji czyszczona z tytułów okien.
- 🟢 **Tryb `auto_safe` z procedurą wycofania** (`auto_safe.rs`): Automatyczne przypisywanie sesji do projektów tylko powyżej określonego progu pewności (confidence threshold), z możliwością 1-kliknięciowego cofnięcia wszystkich automatycznych decyzji (Rollback).
- 🟢 **Ekran „AI i model”:** metryki skuteczności modelu, status wytrenowanej wiedzy, ponowne trenowanie (`training.rs`) oraz **reset wiedzy AI** (usunięcie modelu i historii) — pełna kontrola użytkownika nad tym, czego system się o nim nauczył.

### 3.4. Wbudowany Serwer MCP (Model Context Protocol Server w Rust)
*Integracja pozwalająca asystentom AI (Claude Code, Codex, agenci LLM) na bezpośrednią współpracę z TIMEFLOW — lokalnie, bez wysyłania danych do chmury.*
- 🟢 **Architektura MCP (`dashboard/src-tauri/src/mcp`):** wbudowany serwer zgodny ze standardem MCP (`tools.rs`, `protocol.rs`, `config.rs`, `backup.rs`), z unikalnymi nazwami sesji, bez blokowania `initialize`, nasłuch wyłącznie na pętli zwrotnej.
- 🟢 **44 narzędzia RPC wystawione dla AI**, w pięciu grupach:

| Grupa | Narzędzia |
|---|---|
| Projekty | `list_projects`, `list_projects_with_client`, `get_project`, `create_project`, `create_project_from_folder`, `delete_project`, `restore_project`, `set_project_status`, `set_project_client`, `freeze_project`, `unfreeze_project`, `merge_project`, `unmerge_project`, `list_merged_projects`, `exclude_project`, `list_excluded_projects`, `update_project_color`, `update_project_hourly_rate`, `update_project_limit`, `get_project_limit_status`, `get_project_estimates`, `get_project_extra_info` |
| Foldery projektów | `list_project_folders`, `add_project_folder`, `remove_project_folder`, `update_project_folder_meta`, `list_folder_project_candidates` |
| Klienci | `list_clients`, `create_client`, `update_client`, `get_clients_summary` |
| Sesje | `list_sessions`, `assign_session_to_project`, `update_session_comment`, `create_manual_session`, `get_manual_session`, `list_manual_sessions`, `update_manual_session`, `delete_manual_session`, `delete_manual_sessions`, `set_manual_session_time`, `set_manual_session_title`, `set_manual_session_type` |
| Aplikacje | `assign_app_to_project` |

- 🟢 **Kopie bezpieczeństwa przed zapisem (`backup.rs`):** każda operacja modyfikująca bazę przez agenta AI zostawia punkt powrotu.
- 🟢 **Ekran Pomoc → „Serwer MCP (agenci AI)”:** opis dla użytkownika, co agent może odczytać, a co zmienić za jego zgodą.

### 3.5. Dedykowany Moduł: Renderingi (`Renders.tsx` & `cfab_render.rs`)
*Kompletny podsystem integrujący renderingi 3D w panelu finansowym TIMEFLOW.*
- 🟢 **Pochłanianie Księgi Renderów (Ingest):** odczyt bazy `history.db` CFAB Huba **na żądanie** (przycisk na stronie projektu i w widoku Renderingi) i rejestracja zadań z podziałem na przypisane i nieprzypisane (`unassigned`).
- 🟢 **Automatyczne i ręczne przypisywanie:** dopasowanie do projektów po prefiksie ścieżki (Longest-Prefix Path Match) lub ręczne przypisanie wsadowe z możliwością odpięcia (`detachCfabRender`); **ręczne zawsze wygrywa z automatem**.
- 🟢 **Obsługa renderów ze stacji offline (`cfab_offline.rs`):** import danych renderów z zewnętrznych stacji roboczych / farm renderujących nieposiadających bezpośredniego połączenia — przez paczkę `.cfabx`.
- 🟢 **Szczegółowa kalkulacja kosztu renderu (`CfabRenderCostDetail`):** wyliczenie kosztu maszynowego na podstawie stawek, limitów i współczynników RBH; doliczane do wyceny **dopiero po włączeniu przełącznika** przez artystę.
- 🟢 **Czas renderów wędruje między maszynami:** przypisane rendery są objęte synchronizacją LAN i online. Przez sieć idzie wyłącznie czas renderu, tożsamość wpisu i nazwa projektu — kwoty każda maszyna liczy ze swoich stawek. Konflikt przypisania rozstrzyga nowszy zapis, a odpięcie renderu propaguje się na pozostałe maszyny.
- 🟢 **Sekcja Stan integracji:** wersja Huba po drugiej stronie, numer kontraktu, „działa / brak sygnału od …”, lista maszyn i instancji, ACK zamykający wysyłkę.

### 3.6. Organizacja Sesji, Projekty, Klienci i Zadania (PM / Todo)
- 🟢 **Wielopoziomowe widoki osi czasu (`Sessions.tsx`):** przegląd dzienny, tygodniowy, miesięczny i all-time; oś czasu dnia projektu.
- 🟢 **Pipeline edycji sesji:** dzielenie (split), łączenie, grupowe przenoszenie i sesje manualne (spotkania offline, telefony, praca koncepcyjna), komentarze do sesji, mnożnik stawki dla wybranych sesji (domyślnie ×2).
- 🟢 **Zarządzanie projektami (`Projects.tsx`, `ProjectPageView.tsx`):** kolorystyka, mapowanie folderów, stawki godzinowe, zamrażanie, wykluczanie, archiwizacja i przywracanie.
- 🟢 **Limit godzin w okresie rozliczeniowym (`project_limits.rs`):** budżet godzin na okres z dniem startu cyklu, pasek zużycia liczony tym samym czasem co reszta aplikacji, nadgodziny rozliczane mnożnikiem; w raporcie sekcje „Limit godzin” i lista sesji z mnożnikiem.
- 🟢 **Scalanie etapów w projekt nadrzędny:** projekty-etapy łączą się logicznie w jeden projekt — czas dzieci sumuje się u rodzica, karta projektu pokazuje rozbicie na etapy, scalenie można cofnąć, a znacznik przechodzi przez synchronizację LAN bez ryzyka wyzerowania przez starszą maszynę.
- 🟢 **Zarządzanie klientami (`Clients.tsx`, `ClientPage.tsx`):** dane rozliczeniowe, waluty, zagregowane podsumowania finansowe, cykl rozliczeniowy.
- 🟢 **Menedżer projektów PM (`PM.tsx`, `pm_manager.rs`):** nowy projekt z klientem, opisem, budżetem i terminem; numer podpowiadany jako najwyższy w roku + 1 (z listy i ze skanu dysku), drzewo folderów z szablonu (własne szablony, `{name}`), status, filtry z zapisem domyślnego widoku, rozmiar folderu na dysku i dopasowanie do projektów TIMEFLOW (śledzony czas obok budżetu). Format `projects_list.json` zgodny z dawnym PM w Pythonie.
- 🟢 **Lista zadań (`Todo.tsx`, `todos.rs`):** zadania globalne, klienta albo projektu z terminem, godziną, priorytetem i notatkami; grupy „zaległe / dziś / ten tydzień / później / bez terminu”, wyszukiwarka i filtr zakresu.

### 3.7. Aplikacje, Analiza Czasu i Dashboard
- 🟢 **Aplikacje (`Applications.tsx`):** rejestr wszystkich programów wykrytych przez demona, wyszukiwarka, licznik aplikacji, oznaczanie monitorowanych i ignorowanych, przypisanie aplikacji do projektu jedną akcją (także przez MCP).
- 🟢 **Analiza czasu (`TimeAnalysis.tsx`):** rozkład czasu wg projektów i klientów, grupowanie, porównanie okres do okresu (poprzedni / następny okres), wykresy dystrybucji.
- 🟢 **Dashboard (`Dashboard.tsx`):** ekran otwarcia z bieżącymi wskaźnikami dnia, tygodnia i miesiąca oraz wskaźnikiem synchronizacji online.
- 🟢 **Dane (`Data.tsx`):** statystyki bazy, panel importu i eksportu, historia operacji, zarządzanie bazą danych (kopie, czyszczenie, reset).
- 🟢 **Import (`ImportPage.tsx`):** wczytywanie danych z plików, archiwum zaimportowanych plików z możliwością usunięcia wpisu; archiwum eksportu niesie nazwę projektu każdej sesji i szczegóły aktywności plików, więc po przeniesieniu na inny komputer sesje trafiają do właściwych projektów, a dane dla modelu AI przeżywają przenosiny.
- 🟢 **Quick Start i Pomoc:** przewodnik konfiguracji krok po kroku oraz dokumentacja w aplikacji (w tym rozdział o serwerze MCP), oba w pełnej wersji PL/EN.
- 🟢 **Serwer WWW TIMEFLOW z parowaniem urządzeń (`webserver.rs`, `webui_host_ctl.rs`):** wbudowany serwer udostępniający dane TIMEFLOW na innym urządzeniu w sieci lokalnej. Dostęp otwiera **6-cyfrowy kod parowania** wygenerowany w Ustawieniach na komputerze głównym; właściciel widzi listę aktywnych sesji dostępu i **może każdą odwołać jednym kliknięciem**. Odpowiednik panelu WWW Huba po stronie finansowej — i kolejny dowód, że „dostęp zdalny” nie musi znaczyć „dane w cudzej chmurze”.
- 🟢 **Zarządzanie logami aplikacji (`log_management.rs`):** poziom szczegółowości, podgląd plików logu w aplikacji, czyszczenie, otwarcie katalogu logów — diagnostyka u użytkownika bez grzebania w systemie plików.
- 🟢 **Zgłaszanie błędów z poziomu aplikacji (`bughunter.rs`):** raport wysyłany bez zbierania zrzutów ekranu i bez wynoszenia treści projektów.
- 🟢 **Dwujęzyczność PL/EN i dostępność:** słowniki `locales/pl` i `locales/en`, etykiety ARIA nawigacji, zwijany pasek boczny.

### 3.8. Wyceny, Estymacje i Raporty PDF (Proof of Work)
- 🟢 **Rejestr kosztów dodatkowych projektu (`costs.rs`):** osobna, pełna ewidencja kosztów spoza czasu pracy — licencje, materiały, podwykonawcy, koszt maszyny — z dodawaniem, edycją i usuwaniem pozycji. Koszty wchodzą do wyceny i do raportu dla klienta obok roboczogodzin.
- 🟢 **Kalkulator wartości pracy (`Estimates.tsx`):** przeliczanie czasu rzeczywistego na kwoty na podstawie stawek bazowych, mnożników trudności i kosztów maszynowych.
- 🟢 **Generator profesjonalnych raportów PDF (`ReportView.tsx`, `Reports.tsx`):**
  - Eleganckie zestawienia dla klienta z podziałem na etapy, wykresami i statystykami, z konfigurowalnym okresem raportu.
  - Dołączanie dowodu pracy (Proof of Work) w postaci miniatur wykonanych renderów pochodzących z EXRustera po stronie Huba; galeria renderów w raporcie pokazuje przy każdej pozycji RBH i wartość, a pod galerią sumy.
- 🟢 **Raport estymacji (`EstimateReport.tsx`):** projekty z czasem i wartością dla jednego albo wszystkich klientów w wybranym zakresie dat, z rozbiciem na dni, gotowy do PDF.
- 🟢 **Edytor szablonów raportów (`Reports.tsx`):** własne szablony z wybranymi i uporządkowanymi sekcjami, fontem bazowym, rozmiarem i logo TIMEFLOW; podgląd na żywo, zapis automatyczny, gotowe szablony estymacji.
- 🟢 **Okres, zaokrąglanie i scalanie w raporcie:** raport zawężony do okresu rozliczeniowego (presety miesięczne albo własny zakres), czas pełny albo zaokrąglony do interwału (suma, każda sesja, pełne godziny dziennie) i scalanie powtarzających się wpisów — bez zmiany danych źródłowych.
- 🟢 **Analiza rentowności w raporcie:** zestawienie składników projektu (czas pracy z sesji, czas maszyny, koszty dodatkowe) z ilością i wartością — odpowiedź na pytanie „czy ten projekt zarobił”, a nie tylko „ile trwał”.

### 3.9. Bezpieczna Synchronizacja: P2P LAN & Szyfrowany Cloud
- 🟢 **Darmowy P2P LAN Sync (Zero-Cloud):**
  - Bezpośrednia synchronizacja baz danych między komputerami w sieci lokalnej (biuro ↔ dom) bez udziału jakiejkolwiek chmury.
  - **13-krokowy protokół** w maszynie stanów (`lan_sync_orchestrator.rs`, kroki od preflight i negocjacji mastera, przez zamrożenie obu baz, pobranie, backup, scalenie, weryfikację, odesłanie i import po stronie slave'a, po odmrożenie i sprzątanie) z auto-discovery (`lan_discovery.rs`), parowaniem (`lan_pairing.rs`, `lan_pair_throttle.rs`) i bramką zgodności wersji.
  - Deterministyczne łączenie SQLite z haszowym rozwiązywaniem konfliktów i mechanizmem tombstone (`tombstone_triggers.rs`).
  - Automatyczny backup bazy przed każdym scaleniem (krok 8) oraz **circuit breaker** wstrzymujący synchronizację po serii błędów, z możliwością wymuszenia ręcznego.
  - Awaria po stronie peera nie cofa zweryfikowanego scalenia lokalnego — peer dosynchronizuje się przy następnej próbie.
- 🟢 **Szyfrowany Online Sync (Cloud Delta Storage):**
  - Koordynacja przez dedykowany serwer Next.js + Prisma na Postgresie (Neon), wdrażany bezserwerowo (Vercel + Vercel Cron): trzy punkty końcowe `sync/status`, `sync/push`, `sync/pull`, autoryzacja tokenem `Bearer`, walidacja i limity rozmiaru ładunku, ograniczanie liczby żądań, logi w formacie JSON z identyfikatorem żądania oraz `healthcheck`.
  - Serwer widzi wyłącznie metadane synchronizacji (rewizje, sha256), **nigdy treści baz danych**.
  - **Poświadczenia trzymane w bezpiecznym magazynie systemowym** (`secure_store.rs`), nie w pliku konfiguracyjnym obok bazy.
  - Paczki różnicowe budowane lokalnie (`delta_export.rs`) — przez sieć idzie różnica, nie cała baza.
  - Transfer zabezpieczony symetrycznym szyfrowaniem **AES-256-GCM** z jednorazowymi poświadczeniami per sesja (`sync_encryption.rs`).
  - Asynchroniczny store-and-forward (`online_store_forward.rs`, `online_async_delta.rs`, `online_ftp_transport.rs`) — działa także przy niestabilnym łączu.

---

## 4. INTEGRACJA I SYNERGIA: POMOST CFAB HUB × TIMEFLOW

Połączenie CFAB 4D Hub z TIMEFLOW tworzy zamkniętą pętlę produkcyjno-finansową, której nie posiada
żadne inne rozwiązanie na rynku. Pomost jest **wdrażany etapami A → D**; poniższa mapa pokazuje,
co już działa, a co jest w kolejce.

```
┌────────────────────────┐                   ┌────────────────────────┐
│      CFAB 4D HUB       │                   │        TIMEFLOW        │
│                        │                   │                        │
│  [Zakończenie renderu] │                   │   [Projekt klienta]    │
│           │            │                   │           ▲            │
│           ▼            │                   │           │            │
│   Zapis do Ledger DB   │                   │   Odczyt przez most    │
│   (ścieżka + sekundy)  │                   │   (przypisanie do kat.)│
│           │            │                   │           │            │
│           ▼            │   Latarnia stanu  │           ▼            │
│     hub.json ──────────┼───────────────────┼──> timeflow.json       │
│  (port, ścieżka bazy,  │  (aktywne bazy    │  (stan demona, projekty│
│   wersja kontraktu)    │   i heartbeat)    │   stawki, limity)      │
│           │            │                   │           │            │
│           ▼            │   Paczka .cfabx   │           ▼            │
│  Stacja bez TIMEFLOW ──┼──── (offline) ────┼──> Import + ACK        │
│                        │                   │           │            │
│                        │                   │           ▼            │
│                        │                   │  Doliczenie kosztu     │
│                        │                   │  maszyny do wyceny     │
│                        │                   │  (RBH * mnożnik * PLN) │
└────────────────────────┘                   └────────────────────────┘
```

### 4.1. Architektura Latarni (`Integration Beacons`) 🟢
- Bezstanowa wymiana informacji o obecności procesów za pośrednictwem ustandaryzowanych plików JSON (`hub.json` oraz `timeflow.json`) we wspólnym katalogu systemowym (`~/Library/Application Support/CFAB/integration/`, `%APPDATA%\CFAB\integration\`) — osobny plik dla każdego programu.
- Rejestracja parametrów: identyfikator instancji, PID procesu, ścieżka do bazy SQLite, obsługiwane wersje kontraktów, timestamp heartbeat.
- Ochrona przed blokowaniem: aplikacje otwierają nawzajem swoje bazy wyłącznie w trybie **SQLite READONLY (URI z `query_only=ON`)**, co eliminuje ryzyko uszkodzenia danych.
- Przyrostowa synchronizacja (`TimeflowSync`): tick bez zmian w bazie drugiej strony **nie otwiera połączenia** — koniec z odpytywaniem pełnej bazy co 60 s.
- Wskaźnik sondy integracji w interfejsie obu programów + wspólny raport diagnostyczny.

### 4.2. Rozdział Czasu Maszynowego od Ludzkiego (Machine vs. Human Time) 🟢
- Tradycyjne trackery traktują wielogodzinny render 3D jako „aktywność użytkownika” w Cinema 4D lub Blenderze, fałszując statystyki czasu pracy twórczej.
- Hub raportuje stan renderingu (`rendering_external`, `rendering_editor`) w snapshotcie statusu; TIMEFLOW oddziela czas spędzony przez artystę przed monitorem od czasu, w którym stacja robocza samodzielnie liczyła piksele.

### 4.3. Zautomatyzowany Render Ledger & Wyceny Maszynowe 🟢
- Zakończony render w Hubie generuje wpis w księdze renderów z **kluczem kompozytowym** `(hub_instance_id, ledger_id)` — druga maszyna lub nowa baza Huba nie powoduje kolizji ACK (kontrakt `cfab_render` 3).
- TIMEFLOW odczytuje wpisy, przypisuje je do projektów na podstawie najdłuższego wspólnego prefiksu ścieżki (Longest-Prefix Path Match), a po zatwierdzeniu przez artystę dolicza koszt renderu maszynowego do wyceny i raportu końcowego wg wzoru:
$$\text{Koszt Dodatkowy} = \text{Sekundy Renderu} \times \text{Współczynnik RBH} \times \text{Stawka Godzinowa}$$
- Po przetworzeniu TIMEFLOW generuje potwierdzenie ACK, a Hub archiwizuje rekord wysyłki (historia Renderu zostaje), zapobiegając duplikatom.
- Hub odświeża listę projektów i ACK w tle w wybranym interwale (domyślnie 60 s); TIMEFLOW nie ma własnego ticka ingestu — wczytuje na żądanie użytkownika.
- 🟢 Czas przypisanych renderów przechodzi synchronizacją TIMEFLOW na pozostałe maszyny użytkownika (LAN i online) — render policzony w biurze widać w wycenie na laptopie w domu (rozdz. 3.5).
- 🟢 Zapis do ledgera **zawsze**, także gdy TIMEFLOW nigdy nie był uruchomiony na tej maszynie (rozdz. 2.3).

### 4.4. Rejestr aktywności DCC i indeks projektów 🟢
- **`dcc_activity` (kontrakt 1):** Hub zapisuje, który plik jest w danej chwili aktywny w Cinema 4D, Blenderze i 3ds Maxie. TIMEFLOW przypisuje sesje **po pełnej ścieżce pliku**, a nie po tytule okna — to skokowa poprawa trafności przypisań w programach, które w tytule pokazują samą nazwę dokumentu. Model przypisań TIMEFLOW daje już faktom ze ścieżki pierwszeństwo przed wyuczoną historią (rozdz. 3.3).
- **`cfab_project_index` (kontrakt 1):** dopasowanie ścieżka → projekt robi **wyłącznie TIMEFLOW** i publikuje wynik jako indeks; Hub tylko go czyta (decyzja D-S2). Jedno źródło prawdy zamiast dwóch rozjeżdżających się heurystyk.

### 4.5. Paczka offline `.cfabx` — stacja renderująca bez TIMEFLOW 🟢
- Format paczki ([shared/cfab_core/cfabx.py](shared/cfab_core/cfabx.py)) pozwala maszynie renderującej **bez zainstalowanego TIMEFLOW** wyeksportować rendery do pliku, przenieść go dowolnym kanałem i zaimportować w TIMEFLOW razem z potwierdzeniem.
- Rendery robocze C4D (poza kolejką) także trafiają do paczki.
- To odpowiedź na realia farm renderujących i maszyn w innej sieci — czas maszyny nie przepada tylko dlatego, że stacja nie ma dostępu do bazy studia.

### 4.6. Ogólny mechanizm „propozycja → ACK” 🟡
- Jeden kontrakt (`cfab_proposals` 1) dla rzeczy, które Hub **proponuje**, a TIMEFLOW **zatwierdza** (decyzja D-S6: jeden mechanizm, wiele rodzajów).
- Działa: Hub proponuje projekt dla renderu (`project_hint`), TIMEFLOW pokazuje „Propozycja: …” w sekcji Nieprzypisane i zatwierdza jednym kliknięciem albo kilka naraz; paczka `.cfabx` niesie `proposals.jsonl`, a import w TIMEFLOW obsługuje rodzaje `render` i `cost`.
- Otwarte: Hub nie wysyła jeszcze propozycji kosztów, znalezisk audytu sceny (brakujące tekstury jako zadania projektu) ani prognoz kosztu przed kolejką.

### 4.7. Wizualny Dowód Pracy w Raportach 🟡
- Hub zapisuje w rejestrze renderów miniaturę ostatniej klatki (PNG z EXRustera), a TIMEFLOW przenosi ją do galerii renderów w raporcie PDF dla klienta.
- Do 2026-09-24 obraz nie wyświetlał się w raporcie (webview bez protokołu `asset`, CSP bez takich źródeł). Poprawka w TIMEFLOW osadza miniaturę jako `data:` URL po stronie backendu raportu — niewydana, odbiór na żywym raporcie trwa.
- Oś czasu projektu w TIMEFLOW **nie** pokazuje miniatur.

### 4.8. Jedna obecność w systemie 🟢
- Skoordynowany autostart (opcja „Uruchamiaj TIMEFLOW razem z CFAB Hub”), autostart serwera MCP, wzajemne wskaźniki obecności w interfejsach, wspólny raport diagnostyczny integracji, zdarzenia Huba przekazywane do TIMEFLOW (render, eksport i wczytanie paczki offline).
- ⚪ Otwarte: systemowy autostart przy logowaniu. Hub ma już własną ikonę i zejście do zasobnika; wspólnej ikony obu programów nie ma.

### 4.9. Mapa etapów synergii

| Etap | Cel | Stan |
|---|---|---|
| **A — Fundament** | Integracja nie gubi danych, sama znajduje drugą stronę, nie rośnie kosztem z historią | 🟢 wdrożony (kontrakt 2/3, latarnie, READONLY, `TimeflowSync`, zakładki w obu programach) |
| **B — Kontekst i trafność** | Czas pracy i rendery trafiają do właściwego projektu; render nie udaje pracy człowieka | 🟢 wdrożony (`dcc_activity`, indeks projektów, znacznik aktywnego projektu, rozdział czasu maszyny) |
| **C — Wartość biznesowa** | Hub pokazuje koszt i limit **przed** renderem, raport pokazuje efekty | ⚪ prognoza kosztu przed kolejką i limity w Hubie — otwarte; galeria renderów z RBH i wartością 🟢, miniatury w raporcie 🟡 |
| **D — Pakiet** | Oba programy działają jak jeden produkt | 🟡 MCP (odczyt), diagnostyka, autostart, `.cfabx`, raport rentowności i synchronizacja czasu renderów między maszynami 🟢; propozycje → ACK 🟡 (rendery); znaleziska → zadania ⚪ |

---

## 5. WYTYCZNE BUDOWY INTERAKTYWNEJ MAPY FUNKCJONALNOŚCI (DLA INWESTORÓW)

Aplikacja ma być **mapą, którą się czyta**, a nie grafiką, którą się ogląda. Rozmiar ekosystemu
ma być widoczny od razu, ale przez liczbę **podpisanych** funkcji ułożonych w zrozumiałym
porządku, a nie przez gęstość świecących punktów.

> **Dlaczego nie chmura grafu.** Poprzednia wersja tego dokumentu zakładała widok w stylu grafu
> Obsidiana. Przy ~170 węzłach taki widok ma trzy wady, których nie da się usunąć stylem:
> etykiety trzeba ukrywać do zbliżenia (więc zrzut ekranu nie mówi, co jest na mapie), układ
> zależy od symulacji (więc położenie niczego nie znaczy), a połączenia rysowane naraz tworzą
> plamę. Mapa zakresu rozwiązuje wszystkie trzy: każdy element ma stałe miejsce wynikające
> z danych, każdy jest podpisany, a połączenia pojawiają się tylko na żądanie.

### 5.0. Budżet elementów — skąd bierze się liczba na liczniku

Liczby na liczniku muszą wynikać z pliku danych, nie z odczucia. Rozdziały 2–4 tego dokumentu
dają następujący rozkład (stan 2026-09-24):

| Typ elementu (`nodeType`) | Liczba | Skąd |
|---|---|---|
| `ecosystem` — programy | 2 | CFAB 4D Hub, TIMEFLOW |
| `module` — moduły Huba | 9 | rail aplikacji (rozdz. 2.1–2.9) |
| `module` — części warstwy wspólnej Huba | 7 | shell, service, cfab_core, cfab_ui, cfab_contracts, cfab_bridge, cfab_native (rozdz. 2.10) |
| `module` — obszary TIMEFLOW | 14 | nawigacja aplikacji (rozdz. 3) |
| `bridge` — elementy pomostu synergii | 8 | rozdz. 4.1–4.8 (4.9 to tabela etapów, nie element) |
| `feature` — funkcje | **133** | wypunktowania ze statusem w rozdz. 2–3: Hub 79, TIMEFLOW 54 |
| **Razem** | **173 elementy** | |

Metoda liczenia `feature`: każde wypunktowanie oznaczone 🟢 / 🟡 / ⚪ w rozdziałach 2–4 to
jedna funkcja; podpunkty bez własnego znacznika statusu są treścią karty tej funkcji, nie
osobnymi elementami. Trzy wypunktowania w rozdz. 4 (4.3: czas renderów między maszynami
i ledger bez TIMEFLOW, 4.8: autostart przy logowaniu) powtarzają funkcje z rozdz. 2–3 —
liczą się raz, jako funkcje swojego modułu. Generator (rozdz. 10) liczy tak samo — jeśli jego wynik różni się od
tabeli, poprawia się tabelę, nie generator.

Komunikat dla inwestora: **„2 systemy · 30 modułów · 133 udokumentowane funkcje · 4 mosty DCC
+ most UV · 2 serwery MCP · lokalne wyszukiwanie AI · farma renderująca w LAN · 100% local-first”**.
Każda z tych liczb ma pokrycie w tabeli wyżej i w pliku danych — nie wolno ich zaokrąglać
w górę „na oko”.

### 5.1. Widoki

Aplikacja ma cztery sposoby przeglądania **tych samych danych**: trzy zakładki w kolejności
**Przewagi · Chmura · Etapy pracy** oraz ręczny spacer po ośmiu etapach w Chmurze.
Domyślnie otwiera się pełnoekranowa Chmura. Jej interfejs pojawia się po pierwszym kliknięciu
lub przejściu klawiaturą do elementu mapy, bez zmiany położenia węzłów. Link do konkretnej
przewagi odsłania interfejs od razu, aby pokazać kontekst podświetlenia.

#### 5.1.1. Mapa zakresu — widok „Etapy pracy”

Siatka, w której **kolumny to etapy pracy**, a **kolory to programy**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Jedna osoba. Cały pipeline.        [2 systemy][30 modułów][133 funkcje][4 mosty][2 MCP][0 %] │
│ [Mapa zakresu] [Moduły] [Matryca]      Filtry: Program · Status · Moaty · Odbiorca   [PL|EN] │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬─────────────────┤
│1 Zasoby  │2 Scena   │3 Inspek- │4 Render  │5 Wyniki  │6 Czas    │7 Wycena  │8 Raport         │
│          │          │  cja     │          │          │  pracy   │          │                 │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼─────────────────┤
│▌Biblio-  │▌Połącze- │▌Inspek-  │▌Render   │▌Wyniki   │▌Demon    │▌Wyceny   │▌Raporty         │
│ teka · 8 │ nia · 9  │ tor · 11 │  · 18    │  · 5     │  · 7     │  · 3     │  · 3            │
│ ● chip   │ ● chip   │ ● chip   │ ● chip   │ ● chip   │ ● chip   │ ● chip   │ ● chip          │
│ ◐ chip   │ ◐ chip   │ ● chip   │ ◐ chip   │ ● chip   │ ● chip   │ ◆ Ledger │ ◆ Dowód pracy   │
│ …        │ …        │ …        │ …        │ …        │ …        │ …        │ …               │
│▌Zasoby   │▌Robocze  │          │◆ Latarnie│          │▌Sesje    │▌Klienci  │                 │
│ …        │ …        │          │ …        │          │ …        │ …        │                 │
├──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴─────────────────┤
│ FUNDAMENT  ▌Powłoka ▌Usługa ▌Rdzeń ▌Kontrakty ▌System projektowy ▌Rust ▌MCP Huba             │
│            ▌Sync LAN/Cloud ▌MCP TIMEFLOW ▌Dane ▌Serwer WWW      ◆ Jedna obecność w systemie  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
  ● gotowe   ◐ w odbiorze   ○ planowane      ▌Hub  ▌Pomost  ▌TIMEFLOW         (legenda stała)
```

*(Szkic pokazuje układ, nie treść — nazwy i liczby bierze się z danych.)*

- **Kolumny = etapy pipeline'u** z pola `stage` (rozdz. 6.3), zawsze w tej kolejności:
  Zasoby → Scena → Inspekcja → Render → Wyniki → Czas pracy → Wycena → Raport. Nagłówek
  kolumny ma numer, nazwę i liczbę funkcji na tym etapie. Czytanie od lewej do prawej to
  dzień pracy freelancera — **układ sam opowiada historię produktu**: Hub dominuje po lewej,
  TIMEFLOW po prawej, pomost pojawia się tam, gdzie jeden program oddaje pracę drugiemu.
- **Bloki modułów** w kolumnie: karta z paskiem w kolorze programu, nazwą modułu i liczbą
  funkcji; w bloku — funkcje tego modułu przypisane do tego etapu. Moduł, którego funkcje
  leżą na kilku etapach, ma blok w każdej z tych kolumn; drugi i kolejny blok ma ten sam
  nagłówek, więc moduł da się śledzić wzrokiem wzdłuż mapy.
- **Chip funkcji** = znacznik statusu + krótki tytuł (`shortTitle`, rozdz. 6.1). Tytuł jest
  **zawsze widoczny**, pełnym tekstem, bez wielokropka i bez zależności od zoomu.
- **Pas Fundament** pod siatką, na całą szerokość: funkcje bez etapu (`stage: null`) —
  warstwa wspólna Huba, synchronizacja i MCP TIMEFLOW, latarnie. Fundament jest częścią
  przekazu („na czym to stoi”), nie przypisem: ma ten sam styl chipów co siatka.
- **Elementy pomostu** (`bridge`) stoją w kolumnie etapu, na którym działają, jako chip
  z rombem ◆ i w kolorze pomostu; pomost bez etapu trafia do Fundamentu.
- **Kolejność w kolumnie:** najpierw bloki Huba, potem pomost, potem TIMEFLOW; w obrębie
  programu wg kolejności modułów z railu / nawigacji; w bloku wg pola `order`. Układ jest
  **deterministyczny** — ta sama wersja danych daje zawsze ten sam obraz, więc mapę da się
  omawiać jak slajd.

#### 5.1.2. Chmura — widok relacji

Istniejąca chmura pokazuje dwa ekosystemy i pomost między nimi. Zachowuje obecny układ.
Kliknięcie w węzeł otwiera kartę, a ścieżka ostatnich wyborów pozwala wrócić do odwiedzonych
elementów. Ręczny spacer po etapach wygasza pozostałe węzły na miejscu. Link z Przewag
podświetla tylko dowody wybranej tezy; istniejące relacje między nimi pojawiają się na żądanie.

#### 5.1.3. Przewagi — widok tez i dowodów

Pięć tez z sekcji 8.0 ma stały ranking. Po wejściu do tego widoku pierwsza jest rozwinięta, a pozostałe
pokazują tytuł, skrót tezy i zastępowane narzędzia. Można rozwinąć jedną tezę naraz. Rozwinięcie
pokazuje powód trudności skopiowania, założenie wartości z jawną etykietą, status i liczbę
gotowych funkcji oraz klikalne dowody. Pierwsza teza pokazuje cztery kroki od renderu do PDF.
„Pokaż na mapie” przechodzi do Chmury lub ostatnio używanych Etapów pracy, wygasza inne węzły
bez zmiany układu i zapisuje `?view=cloud&adv=<id>` (albo `view=grid`). Pasek nad mapą pozwala
przejść do sąsiedniej przewagi lub wyczyścić podświetlenie; Esc robi to samo. Karta funkcji
prowadzi z powrotem do tezy. Matryca poniżej pozostaje materiałem analitycznym, a nie osobną
zakładką.

#### 5.1.4. Spacer po etapach

Przycisk „Spacer po etapach” w Chmurze podświetla kolejno elementy etapów 1–8; reszta
mapy wygasa na miejscu. Użytkownik przechodzi strzałkami ← → i kończy przyciskiem × lub Esc.
To nie jest osobna zakładka ani autoodtwarzanie.

### 5.2. Warstwy Prezentacji Informacji (Progressive Disclosure)

- **Poziom 1 (Mapa):** tytuł, teza inwestycyjna, kafelki metryk z tabeli 5.0 i cała mapa zakresu. Wspierane DCC (Cinema 4D, Blender, 3ds Max, MODO, RizomUV), systemy (Windows & macOS) i architektura (Rust + Python/PyQt6 + React/Tauri + Slint) — w stopce mapy, jedną linią.
- **Poziom 2 (Moduł):** kliknięcie w nagłówek bloku otwiera panel boczny (drawer, prawa strona) z podsumowaniem problemu rynkowego, rozwiązaniem, stosem technologicznym, numerem wersji części, rozkładem statusów funkcji (np. „11 gotowe · 3 w odbiorze · 1 planowane”) i listą etapów, na których moduł działa.
- **Poziom 3 (Funkcja):** kliknięcie w chip otwiera kartę w tym samym panelu:
  - pełna nazwa funkcji i zwięzły opis biznesowy,
  - *Dlaczego to trudne do skopiowania? (Tech Moat)*,
  - stos technologiczny (np. `Rust + SIMD`, `PyQt6 / QSS`, `Tauri 2 / React`, `SQLite WAL`, `ONNX Runtime`, `Local MCP Server`),
  - zastępowane narzędzie rynkowe (np. licencja Deadline, plugin Connecter, subskrypcja Toggl, serwer ftrack),
  - status + krótka nota „co dokładnie znaczy ten status” (dla 🟡: czego brakuje do odbioru),
  - lista powiązanych funkcji (te same, które podświetla hover) — klik przenosi do nich,
  - odsyłacz do pliku źródłowego (pole `sources`) — tylko w poziomie wewnętrznym (rozdz. 11).
- **Poziom 4 (Kalkulator ROI dla Studia):** interaktywny widget symulacyjny — model liczbowy w rozdziale 7.

Mapa pod panelem **zostaje widoczna i nie przesuwa się**: panel zajmuje prawą część ekranu,
a mapa zwęża się albo przewija w poziomie tylko w obszarze siatki. Czytelnik nie traci
orientacji, gdzie jest.

### 5.3. Interaktywne Filtry i Presety Inwestorskie

W górnym pasku aplikacji należy umieścić filtry. **Filtr nigdy nie przestawia mapy** —
odfiltrowane chipy wygasają do ~20 % krycia, ale zostają na swoim miejscu. Dzięki temu widać,
ile zostaje z całości, a oko nie musi szukać elementów od nowa.

- **Filtr: „Pokaż Bariery Technologiczne (Tech Moats)”** — wygasza standardowe funkcje, zostawia pełne wyłącznie elementy unikalne (`techMoat.isUniqueMoat === true`): parser binarny `.c4d`, czytnik OLE `.max`, silnik EXR w Rust/SIMD, lokalne wyszukiwanie wizualne AI, 13-krokowy sync P2P LAN, dwa lokalne serwery MCP, Algorytm Uczciwego Czasu, model ML offline, latarnie integracji, paczka `.cfabx`.
- **Filtr: „Program”** — Hub / Pomost / TIMEFLOW (klik w legendę kolorów działa tak samo).
- **Filtr: „Stos Technologiczny”** — wg pozycji w `techStack`: `Rust`, `Python / Qt`, `React / TypeScript`, `SQLite`, `Slint`, `ONNX`, `MCP`.
- **Filtr: „Dojrzałość”** — `production` / `beta` / `roadmap`; domyślnie **wszystkie włączone**, z legendą. Wygaszenie `roadmap` jest dozwolone, ale nigdy nie może być stanem domyślnym bez etykiety.
- **Filtr: „Perspektywa Odbiorcy”** — wg pola `audiences`: *Właściciel Agencji 3D*, *Artysta / Freelancer*, *Dyrektor Techniczny (TD / Pipeline Manager)*, *Inwestor / Analityk*.
- **Wyszukiwarka (Ctrl+K):** wpisanie frazy podświetla pasujące chipy na mapie i powiązania między nimi (np. „Render” podświetla: most C4D, moduł Render Huba, Render Ledger, EXRuster, stronę Renderingi w TIMEFLOW, estymacje kosztów RBH, paczkę `.cfabx`). Lista wyników pod polem pozwala przejść do karty.
- Aktywne filtry widać jako etykiety pod paskiem z przyciskiem „wyczyść”; licznik w nagłówkach kolumn pokazuje wtedy „pasujące / wszystkie”.

### 5.4. Zachowania obowiązkowe (definicja ukończenia widoku)

- Każdy widok ma **stan URL** (deep link) — link do konkretnej funkcji i filtru da się wkleić w e-mailu do inwestora.
- Powrót z poziomu 3 do poziomu 1 jest zawsze jednym ruchem (Esc / breadcrumb / klik w tło).
- Mapa działa **bez internetu** (patrz 12.3) — prezentacja na spotkaniu nie może zależeć od Wi-Fi gościa.
- Żaden widok nie pokazuje elementu bez `status`, `shortTitle` i `summary` — brak danych to błąd walidacji, nie pusty panel.

### 5.5. Język wizualny mapy (specyfikacja czytelności)

To jest najważniejsza sekcja wykonawcza dokumentu. Mapa ma dać się czytać z odległości
trzech metrów na rzutniku i ze zrzutu ekranu wklejonego do maila. Poniższe reguły są obowiązkowe.

#### 5.5.1. Kolor = program (jedno spojrzenie, trzy obszary)

| Obszar | Kolor (token) | Czytany jako |
|---|---|---|
| CFAB 4D Hub | `accent` `#7aa2f7` (lawendowo-błękitny) | „produkcja 3D” |
| TIMEFLOW | `success` `#9ece6a` (zieleń) *lub* `brand_timeflow`, jeśli zapadnie decyzja M2 | „czas i pieniądze” |
| Pomost Synergii | `info` `#7dcfff` (cyjan) | „to, co łączy” |

Kolor niesie **pasek bloku** i **lewą krawędź chipu** — nie tło całego chipu. Tekst jest
zawsze w `text_strong` / `text_primary` na tle `bg_surface`, więc kontrast nie zależy od
koloru programu. Kolorów programów są trzy i tyle ma zostać: kategoria funkcji (`category`)
nie dostaje czwartego koloru, tylko ikonę w karcie.

#### 5.5.2. Status = kształt znacznika, nie tylko kolor

| `status` | Znacznik w chipie | Tekst chipu | Obrys chipu |
|---|---|---|---|
| `production` | ● pełne koło | `text_strong` | pełny, `line_strong` |
| `beta` | ◐ półkole | `text_primary` | pełny, `line_strong` |
| `roadmap` | ○ pusty okrąg | `text_muted` | przerywany, `line_subtle` |

Status musi być czytelny **bez koloru** (wydruk czarno-biały, daltonizm) — stąd kształt
znacznika i styl obrysu. Legenda statusów i programów jest stale widoczna pod mapą, bez
przewijania.

#### 5.5.3. Typy elementów

| `nodeType` | Postać na mapie | Gdzie |
|---|---|---|
| `ecosystem` | nazwa programu w legendzie i w nagłówku sekcji widoku modułów | nie ma własnego elementu na siatce — program to kolor |
| `module` | blok: pasek koloru, nazwa (label 11/600), liczba funkcji | w kolumnie etapu albo w Fundamencie |
| `bridge` | chip z rombem ◆ w kolorze pomostu | w kolumnie etapu albo w Fundamencie |
| `feature` | chip: znacznik statusu + `shortTitle` (body 11) | w bloku swojego modułu |

#### 5.5.4. Relacje — tylko na żądanie

Krawędzie z `edges[]` (rozdz. 6.2) **nie są rysowane w stanie spoczynku**. Pojawiają się:

- po najechaniu na chip — linie do wszystkich powiązanych chipów; powiązane chipy pełne, reszta mapy wygasa do ~25 %;
- po kliknięciu — to samo, utrwalone do czasu Esc / kliknięcia w tło;
- w wyszukiwarce i w spacerze po etapach — dla podświetlonego zbioru.

Linie są łukami rysowanymi nad siatką (warstwa SVG), zawsze za chipami, nigdy przez tekst.
Rodzaj połączenia rozróżnia styl:

| `type` | Styl | Animacja (tylko gdy widoczna) |
|---|---|---|
| `hierarchy` | nie rysowana — hierarchię pokazuje sam blok modułu | — |
| `data_flow` | 1,5 px, `info` `#7dcfff` | impuls płynący od → do, pętla 3 s |
| `ipc` | 1 px przerywana, `accent` | brak |
| `file_exchange` | 1 px kropkowana, `warning` `#e0af68` | impuls wolniejszy (paczki, nie strumień) |
| `depends_on` | 1 px, `text_muted` | brak |
| `replaces` | nie rysowana na mapie — tylko w matrycy | — |

Przy linii `data_flow` i `file_exchange` z niepustym `label` etykieta pokazuje się na środku
łuku, na podkładzie `bg_surface`.

#### 5.5.5. Interakcja

| Gest | Efekt |
|---|---|
| Hover na chipie | chip i powiązane pełne, reszta 25 %; linie relacji; podpowiedź z pełną nazwą i statusem |
| Klik na chipie | karta poziomu 3 w panelu po prawej; relacje zostają podświetlone |
| Klik na nagłówku bloku | panel poziomu 2; wszystkie chipy modułu (także w innych kolumnach) podświetlone |
| Klik na nagłówku kolumny | podświetlenie etapu, jak w spacerze po etapach |
| Esc / klik w tło | powrót do mapy bez podświetleń; filtry zostają |
| Tab / strzałki | fokus przechodzi po chipach w kolejności czytania (kolumna po kolumnie); Enter otwiera kartę |
| Filtr (5.3) | odfiltrowane chipy wygasają na swoim miejscu, liczniki kolumn pokazują „pasujące / wszystkie” |

Animacje przejść (wygaszanie, otwarcie panelu) trwają 150–200 ms i respektują
`prefers-reduced-motion` — wtedy zmiany są natychmiastowe, impulsy na liniach wyłączone.

#### 5.5.6. Etykiety, gęstość i jeden ekran

- `shortTitle` ma **maks. 28 znaków** w obu językach (walidacja 6.5). Pełny `title` jest w karcie i podpowiedzi. Chip nie skraca tekstu wielokropkiem — za długi tytuł to błąd danych, nie problem układu.
- Chip: wysokość 22 px, font `Geist` body 11 (skala z `tokens.json`), odstęp między chipami 4 px, znacznik statusu 8 px. Nagłówek bloku: label 11/600. Nagłówek kolumny: title 13/600. Tytuł strony: display 16/600.
- **Cała mapa zakresu mieści się na ekranie 1440 × 900 bez przewijania** przy obecnych 173 elementach. Jeśli kolumna przerośnie wysokość, jej bloki układają chipy w dwóch podkolumnach; jeśli i to nie wystarczy, strona przewija się w pionie z przyklejonymi nagłówkami kolumn. **Font nigdy nie spada poniżej 10 px** i żaden tekst nie jest ukrywany, żeby zmieścić mapę.
- Nic nie nachodzi na nic: siatka CSS układa elementy bez kolizji z definicji, bez detekcji kolizji w kodzie.

#### 5.5.7. Wydajność i technika

Mapa to zwykły układ DOM (CSS Grid) plus jedna warstwa SVG na linie relacji. Bez symulacji
fizycznej, bez Canvas/WebGL i bez biblioteki grafów — przy ~170 elementach DOM jest szybszy
w budowie, dostępny dla czytników ekranu i ostry przy każdym powiększeniu przeglądarki.
Linie relacji są liczone z pozycji chipów w chwili podświetlenia; w spoczynku strona nie
wykonuje żadnej pracy w tle.

### 5.6. Gotowe teksty ekranu startowego (użyj tych, nie wymyślaj własnych)

**Nagłówek (PL):** Jedna osoba. Cały pipeline.
**Nagłówek (EN):** One person. The whole pipeline.

**Podtytuł (PL):** CFAB 4D Hub i TIMEFLOW — dwa programy, które zamieniają freelancera
w pracownię rozliczającą się jak duże studio. Bez chmury, bez abonamentów, bez wysyłania
czegokolwiek poza własny komputer.
**Podtytuł (EN):** CFAB 4D Hub and TIMEFLOW — two programs that turn a freelancer into a studio
that bills like a big one. No cloud, no subscriptions, nothing leaves your own machine.

**Kafelki metryk** (wartości liczone z danych, nie wpisane na stałe):

| Etykieta PL | Etykieta EN | Źródło wartości |
|---|---|---|
| Systemy | Systems | liczba elementów `ecosystem` |
| Moduły | Modules | liczba elementów `module` |
| Udokumentowane funkcje | Documented features | liczba elementów `feature` |
| Mosty do programów 3D | 3D app bridges | wiersze tabeli mostów w rozdz. 2.7 ze statusem innym niż `roadmap`, bez RizomUV (dziś 4: C4D, Blender, 3ds Max, MODO) |
| Serwery MCP dla agentów AI | MCP servers for AI agents | stała: 2 |
| Dane w chmurze | Data in the cloud | stała: 0 % |

Ostatni kafelek jest celowo prowokacyjny — „0 %” mówi o suwerenności danych więcej
niż akapit o zgodności z NDA.

**Wezwanie do eksploracji (PL):** Czytaj od lewej do prawej — tak wygląda dzień pracy. Najedź na funkcję, żeby zobaczyć, z czym się łączy.
**Wezwanie do eksploracji (EN):** Read left to right — that's a working day. Hover any feature to see what it connects to.

**Nazwy etapów (nagłówki kolumn):**

| # | `stage` | PL | EN |
|---|---|---|---|
| 1 | `assets` | Zasoby | Assets |
| 2 | `scene` | Scena | Scene |
| 3 | `inspection` | Inspekcja i naprawa | Inspect & fix |
| 4 | `render` | Render | Render |
| 5 | `results` | Wyniki | Results |
| 6 | `tracking` | Czas pracy | Time tracking |
| 7 | `billing` | Wycena | Billing |
| 8 | `report` | Raport dla klienta | Client report |
| — | `null` | Fundament | Foundation |

### 5.7. Dwujęzyczność PL / EN

Strona jest **w całości dwujęzyczna**. Nie chodzi o tłumaczenie „tytułów funkcji”, tylko o to,
że po przełączeniu języka nie zostaje na ekranie ani jedno polskie słowo — i odwrotnie.

**Co podlega tłumaczeniu:**

| Warstwa | Źródło tekstu |
|---|---|
| Nazwy i opisy funkcji | pola `title`, `shortTitle` i `summary` ze schematu (rozdz. 6.1) — oba języki obowiązkowe |
| Opisy barier technologicznych | `techMoat.description` — oba języki |
| Noty statusu | `statusNote` — oba języki |
| Nazwy programów, modułów, etapów pipeline'u, perspektyw odbiorcy | słowniki interfejsu (rozdz. 5.6, 6.3 + pliki tłumaczeń aplikacji) |
| Etykiety filtrów, legendy, kafelków metryk, przycisków, podpowiedzi | pliki tłumaczeń aplikacji |
| Teksty ekranu startowego | gotowe w rozdz. 5.6, w obu wersjach |
| Komunikaty błędów i stanów pustych | pliki tłumaczeń aplikacji |
| Tabela założeń kalkulatora ROI (rozdz. 7.2) | oba języki, razem z jednostkami |

**Zasady wykonawcze:**

- **Przełącznik języka widoczny od pierwszego ekranu** (prawy górny róg), przełączenie **bez przeładowania strony** i **bez utraty stanu**: widok, wybrana funkcja, otwarta karta i ustawione filtry zostają na miejscu.
- **Układ mapy wytrzymuje oba języki:** limit 28 znaków `shortTitle` obowiązuje osobno dla PL i EN, więc przełączenie języka nie zmienia liczby linii w chipach ani wysokości kolumn.
- Wybór języka zapamiętywany w przeglądarce; przy pierwszej wizycie ustawiany z języka przeglądarki, z polskim jako wartością domyślną.
- Język jest **częścią adresu** (np. `?lang=en`) — link wysłany inwestorowi zagranicznemu otwiera się od razu po angielsku.
- **Nie tłumaczy się nazw własnych:** CFAB 4D Hub, TIMEFLOW, EXRuster, Cinema 4D, Blender, 3ds Max, RizomUV, Corona, Redshift, V-Ray, MCP, nazwy formatów i kontraktów zostają bez zmian w obu wersjach.
- Terminy branżowe w wersji angielskiej używają słownictwa z pipeline'u 3D, a nie tłumaczenia słowo w słowo: *render queue*, *asset library*, *relink*, *scene inspection*, *proof of work*, *machine time*.
- Teksty angielskie z rozdz. 2–4 są **już przygotowane** przy nazwach modułów i w rozdz. 5.6; resztę tłumaczy wykonawca, zachowując ten sam rzeczowy ton (konkret zamiast superlatywów).
- Walidacja danych (rozdz. 6.5, reguła 2) **blokuje build**, jeśli w którymkolwiek elemencie brakuje wersji `pl` albo `en`.

---

## 6. SCHEMAT DANYCH DLA MAPY (JSON SPECIFICATION)

Struktura danych zasilająca interaktywną mapę jest w pełni zadeklarowana w `features_data.json`,
co umożliwia aktualizację i rozbudowę bez modyfikacji kodu wizualizacji.

### 6.1. Węzeł

```typescript
type Lang = { pl: string; en: string };

interface FeatureNode {
  id: string;                    // konwencja: <app>.<module>.<slug>, np. "hub.scenes.c4d_parser"
  nodeType: "ecosystem" | "module" | "bridge" | "feature";
  app: "cfab_hub" | "timeflow" | "synergy";
  module: string;                // id modułu nadrzędnego; "" dla "ecosystem" i "bridge"
  parentId: string | null;       // hierarchia: funkcja → moduł → program; null dla "ecosystem" i "bridge"
  title: Lang;                   // pełna nazwa — karta i podpowiedź
  shortTitle: Lang;              // napis na chipie mapy; maks. 28 znaków w każdym języku
  summary: Lang;
  category: "core" | "automation" | "analysis" | "integration" | "security" | "finance" | "ai" | "ui";
  stage: PipelineStage | null;   // kolumna mapy zakresu; null = pas Fundament
  order: number;                 // kolejność w bloku modułu (rosnąco); dla modułów — kolejność z railu / nawigacji
  audiences: Audience[];         // filtr "Perspektywa Odbiorcy"; pusta tablica = widoczne zawsze
  techMoat: {
    isUniqueMoat: boolean;
    description: Lang;           // wymagane, gdy isUniqueMoat === true
  };
  techStack: string[];           // ["Rust", "SIMD", "PyQt6", "SQLite", "Tauri 2", "React", "MCP", "Slint", "ONNX"]
  replacesTools: string[];       // ["Toggl", "Deadline", "Connecter", "PDPlayer", "ShotGrid", "ftrack"]
  businessValue: {
    timeSavedHoursMonth: number;         // godziny na artystę miesięcznie; 0 = nie dotyczy
    costAvoidedPerSeatMonthUSD: number;  // wyeliminowana subskrypcja / licencja
    revenueRecoveryPct: number;          // odzysk przychodu (np. rozliczenie czasu maszyny)
    financialGainType: "cost_reduction" | "revenue_recovery" | "risk_mitigation";
    assumptionId: string;                // odsyłacz do założenia z rozdz. 7.2 — liczba bez założenia jest nieważna
  };
  status: "production" | "beta" | "roadmap";
  statusNote: Lang | null;       // dla "beta": czego brakuje do odbioru
  version: string | null;        // wersja części, np. "ALPHA 0.71" — z RELEASE.json
  contract: string | null;       // np. "cfab_render 3", "bridge_protocol 6"
  sources: string[];             // ścieżki w repo; dowód istnienia funkcji
  keywords: string[];            // zasilenie Omniboxa (PL i EN razem)
  advantageId: string | null;     // teza z advantages[], jeśli węzeł jest jej dowodem
}
```

### 6.2. Krawędź

Relacje są **osobną listą**, nie polem w elemencie — mapa musi znać kierunek i rodzaj
przepływu, żeby po najechaniu narysować właściwą linię i puścić impuls we właściwą stronę
(rozdz. 5.5.4). Krawędzi `hierarchy` nie trzeba zapisywać — wynikają z `parentId`.

```typescript
interface FeatureEdge {
  id: string;
  from: string;                  // FeatureNode.id
  to: string;                    // FeatureNode.id
  type:
    | "hierarchy"                // moduł → funkcja (na mapie nie rysowana; wynika z parentId)
    | "data_flow"                // przepływ danych, np. ledger → wycena (impuls animowany)
    | "ipc"                      // most IPC / gniazdo TCP
    | "file_exchange"            // wymiana przez pliki (latarnie, .cfabx, staging)
    | "depends_on"               // zależność wdrożeniowa (np. 0.15 wymaga 0.1-D)
    | "replaces";                // funkcja zastępuje narzędzie rynkowe
  label: Lang | null;
  contract: string | null;       // kontrakt niosący ten przepływ
  animated: boolean;             // impuls na linii, gdy relacja jest podświetlona
  status: "production" | "beta" | "roadmap";
}
```

### 6.3. Słowniki (enumy)

```typescript
type PipelineStage =              // kolumny mapy zakresu, w tej kolejności (nazwy PL/EN: rozdz. 5.6)
  | "assets"        // 1 Zasoby — biblioteka, wyszukiwanie, archiwa
  | "scene"         // 2 Scena — mosty DCC, transfer geometrii i materiałów
  | "inspection"    // 3 Inspekcja i naprawa — inspektor offline, audyt i relink zasobów
  | "render"        // 4 Render — kolejka, farma, monitoring, powiadomienia, ledger
  | "results"       // 5 Wyniki — EXR, sekwencje, brakujące klatki
  | "tracking"      // 6 Czas pracy — demon, Fair Time, model przypisań, sesje
  | "billing"       // 7 Wycena — projekty, klienci, stawki, limity, koszt maszyny
  | "report";       // 8 Raport dla klienta — PDF, dowód pracy, rentowność

type Audience =
  | "agency_owner"   // Właściciel Agencji 3D
  | "artist"         // Artysta / Freelancer
  | "tech_director"  // TD / Pipeline Manager
  | "investor";      // Inwestor / Analityk
```

### 6.4. Przykład (węzeł + krawędź)

```json
{
  "nodes": [
    {
      "id": "hub.scenes.c4d_parser",
      "nodeType": "feature",
      "app": "cfab_hub",
      "module": "hub.scenes",
      "parentId": "hub.scenes",
      "title": { "pl": "Parser binarny .c4d (c4dgrab)", "en": "Binary .c4d parser (c4dgrab)" },
      "shortTitle": { "pl": "Parser .c4d bez licencji", "en": ".c4d parser, no licence" },
      "summary": {
        "pl": "Odczyt geometrii, hierarchii i materiałów ze sceny Cinema 4D bez uruchamiania C4D i bez licencji.",
        "en": "Reads geometry, hierarchy and materials from a Cinema 4D scene with no C4D install and no licence."
      },
      "category": "core",
      "stage": "inspection",
      "order": 1,
      "audiences": ["agency_owner", "tech_director", "investor"],
      "techMoat": {
        "isUniqueMoat": true,
        "description": {
          "pl": "Format .c4d jest zamknięty. Struktura chunków, kolejność bajtów i skalowanie normalnych zostały odtworzone inżynierią wsteczną; rdzeń nie ma żadnej zależności zewnętrznej.",
          "en": "The .c4d format is closed. Chunk layout, endianness and normal scaling were reverse-engineered; the core has zero external dependencies."
        }
      },
      "techStack": ["Python 3.9+", "struct", "Reverse-engineered binary chunk parser"],
      "replacesTools": ["Cinema 4D licence", "Connecter", "konwertery chmurowe"],
      "businessValue": {
        "timeSavedHoursMonth": 8,
        "costAvoidedPerSeatMonthUSD": 75,
        "revenueRecoveryPct": 0,
        "financialGainType": "cost_reduction",
        "assumptionId": "A-INSPEKCJA"
      },
      "status": "production",
      "statusNote": null,
      "version": "ALPHA 0.621",
      "contract": null,
      "sources": ["modules/scenes/parser/c4dgrab.py", "modules/scenes/parser/c4d_types.py"],
      "keywords": ["c4d", "parser", "offline", "inspekcja", "reverse engineering", "licencja"]
    }
  ],
  "edges": [
    {
      "id": "e.ledger.to.estimate",
      "from": "hub.render.ledger",
      "to": "timeflow.renders.cost",
      "type": "data_flow",
      "label": { "pl": "sekundy renderu → koszt maszyny", "en": "render seconds → machine cost" },
      "contract": "cfab_render 3",
      "animated": true,
      "status": "production"
    }
  ]
}
```

### 6.5. Układ pliku danych i walidacja

```
features_data.json
├── meta          { generatedAt, hubVersion, timeflowVersion, contracts, sourceCommit }
├── nodes[]       FeatureNode
├── edges[]       FeatureEdge
├── assumptions[] { id, pl, en, value, maxValue?, unit, source } // model ROI, rozdz. 7.2
├── advantages[]  { id, rank, title, thesis, why, replacesTools[], assumptionId, flow, ids[] }
└── alsoStrong[]  id węzłów drugiego rzędu
```

**Reguły walidacji (test blokujący build):**
1. Każdy `parentId` i każdy `from`/`to` wskazuje na istniejący `id`.
2. Każdy węzeł ma niepuste `title.pl`, `title.en`, `summary.pl`, `summary.en` — brak tłumaczenia to błąd, nie ostrzeżenie.
3. `techMoat.isUniqueMoat === true` wymaga niepustego `description` w obu językach.
4. Każda liczba w `businessValue` różna od zera wymaga istniejącego `assumptionId`.
5. Każdy węzeł `feature` ze statusem `production` ma co najmniej jedną pozycję w `sources`, a ścieżka istnieje w repozytorium.
6. `meta.hubVersion` zgadza się z `VERSION` pakietu, a `meta.contracts` z `RELEASE.json`.
7. Każdy element ma `shortTitle` o długości 1–28 znaków w **obu** językach.
8. Każdy `feature` i `bridge` ma `stage` z listy 6.3 albo jawne `null` (Fundament); `order` jest unikalne w obrębie bloku (moduł × etap).
9. Liczba elementów każdego typu zgadza się z tabelą 5.0 — rozjazd oznacza, że dokument albo dane są nieaktualne.
10. `advantages[]` zawiera 3–6 pozycji o unikalnym `rank`; tytuł, teza, powód, zastępowane narzędzia i kroki przepływu mają niepuste wersje PL i EN.
11. Każda przewaga ma co najmniej 5 istniejących dowodów `production`; jeden węzeł należy najwyżej do jednej przewagi, a jego `advantageId` zgadza się z listą dowodów.
12. Każdy identyfikator w `alsoStrong[]` istnieje, a niepusty `assumptionId` wskazuje założenie z `assumptions[]`.

---

## 7. MODEL ROI DLA STUDIA (KALKULATOR, POZIOM 4)

### 7.1. Wzór

Dla studia o wielkości $N$ artystów, przy stawce godzinowej $S$ i miesięcznym czasie renderu $R$ godzin:

$$\text{Oszczędność}_{\text{mies.}} = \underbrace{N \times (h_{\text{relink}} + h_{\text{inspekcja}} + h_{\text{miniatury}}) \times S}_{\text{odzyskany czas}} + \underbrace{N \times C_{\text{SaaS}}}_{\text{zlikwidowane subskrypcje}} + \underbrace{R \times k_{\text{RBH}} \times S}_{\text{rozliczony czas maszyny}}$$

**Preset domyślny: `N = 1` — freelancer.** Kalkulator otwiera się na jednej osobie, bo to główny
odbiorca produktu i najmocniejszy przekaz (jedna osoba, pełny pipeline). Gotowe presety w interfejsie:
**Freelancer (1)**, **Mała pracownia (3)**, **Studio (10)**, **Duże studio (25)**.

Kalkulator przyjmuje od użytkownika: liczbę artystów $N$, stawkę $S$, walutę, miesięczny czas
renderu $R$ oraz współczynnik $k_{\text{RBH}}$. Wszystkie pozostałe wielkości pochodzą z tabeli 7.2
i **są w interfejsie edytowalne** — inwestor musi móc podstawić własne założenia.

### 7.2. Założenia (`assumptions[]`)

| id | Wielkość | Wartość domyślna | Podstawa |
|---|---|---|---|
| `A-RELINK` | $h_{\text{relink}}$ — czas na naprawę ścieżek zasobów | 12 h / artystę / mies. | ⚠ **szacunek do zatwierdzenia przez właściciela studia** — nie zmierzony |
| `A-INSPEKCJA` | $h_{\text{inspekcja}}$ — otwieranie scen wyłącznie po to, żeby je obejrzeć | 8 h / artystę / mies. | ⚠ szacunek do zatwierdzenia |
| `A-MINIATURY` | $h_{\text{miniatury}}$ — przeglądanie i selekcja ujęć EXR | 4 h / artystę / mies. | ⚠ szacunek do zatwierdzenia; pomiar możliwy na cache'u modułu Wyniki |
| `A-SAAS` | $C_{\text{SaaS}}$ — wyeliminowane subskrypcje na stanowisko | 180 USD / stanowisko / mies. | ⚠ suma cenników: tracker czasu + katalog assetów + przeglądarka EXR + menadżer renderu; **do udokumentowania linkami przed prezentacją** |
| `A-RBH` | $k_{\text{RBH}}$ — współczynnik kosztu maszyny | 0,2 | wartość robocza z [funkcje.md](funkcje.md) (fala 0.15) |
| `A-ODZYSK` | Odzysk przychodu z rozliczenia renderów | 10–25 % | ⚠ widełki do zatwierdzenia; górna granica dotyczy studiów z nocnymi renderami |

> **Zasada uczciwości liczb:** każda wartość oznaczona ⚠ jest *założeniem*, nie pomiarem.
> W interfejsie kalkulatora muszą być widoczne jako edytowalne pola z etykietą „założenie”,
> a w eksportowanym PDF — jako przypis. Inwestor, który wyłapie nieudokumentowaną liczbę,
> podważy cały dokument; inwestor, który zobaczy jawne założenie, oceni model.

### 7.3. Prezentacja wyniku

- Jedna liczba główna (oszczędność miesięczna i roczna) + rozbicie na trzy składniki wzoru.
- Wykres wrażliwości: jak wynik zmienia się przy $N$ od 1 do 25.
- Przycisk „pokaż założenia” rozwijający tabelę 7.2 w miejscu.

---

## 8. MATRYCA PRZEWAG KONKURENCYJNYCH (TECH MOATS & ROI)

### 8.0. Pięć przewag pokazywanych inwestorowi

| # | Tytuł | Teza | Gotowe dowody | Zastępuje |
|---|---|---|---:|---|
| 1 | Czas renderu trafia do wyceny | Czas maszyny z Huba zostaje przypisany do projektu i trafia do wyceny oraz PDF po włączeniu przez artystę. | 12 | Ręczne liczenie czasu renderu, Excel |
| 2 | Pliki .c4d i .max bez programu i licencji | Inspektor czyta i porównuje zamknięte formaty oraz przenosi scenę z Maxa do C4D bez uruchamiania programów. | 9 | Licencje Cinema 4D i 3ds Max, Connecter, konwertery chmurowe |
| 3 | Nocny render kończy się klatkami | Hub sprawdza kolejkę, rozdziela zadania w LAN i po awarii wznawia tylko brakujące klatki. | 10 | Deadline, Team Render |
| 4 | Czas pracy liczy się sam i uczciwie | Demon bez stopera unika podwójnego liczenia i przypisuje sesje do projektów, także z kontekstu pliku 3D. | 11 | Toggl, Harvest, Clockify |
| 5 | Dane i AI zostają na komputerze | Lokalne MCP i wyszukiwanie obrazu łączą się z synchronizacją LAN oraz szyfrowaną synchronizacją online. | 9 | Chmury SaaS |

Lista dowodów i pełna treść PL/EN pochodzą z `advantages[]`; powyższa tabela jest skrótem.
Drugi rząd `alsoStrong[]` pozostaje klikalny, ale nie stanowi osobnej tezy.

Poniższa matryca stanowi gotowy materiał analityczny dla komitetu inwestycyjnego:

| Obszar Funkcjonalny | Rozwiązania Konkurencji na Rynku | Rozwiązanie Ekosystemu CFAB | Przewaga Technologiczna (Moat) | Wartość Biznesowa dla Studia |
|---|---|---|---|---|
| **Inspekcja plików 3D** | Wymaga pełnej licencji Cinema 4D / 3ds Max lub powolnych konwerterów chmurowych. | Parser binarny `.c4d` (`c4dgrab`), czytnik OLE `.max` (`MaxAsset`), porównywarka `c4ddiff` i podmiana silnika `c4dpatch` — wszystko offline. | Inżynieria wsteczna chunków binarnych, rdzeń bez żadnej zależności zewnętrznej, brak zależności od API producenta. | Podgląd, porównanie i konwersja scen na maszynach bez licencji komercyjnych (np. u project managera). |
| **Tracking czasu pracy** | Ręczne klikanie Start/Stop (Toggl, Harvest) lub trackery robiące zrzuty ekranu. | Cichy demon w Rust analizujący zdarzenia systemowe i nagłówki okien, bez odpytywania CPU. | Algorytm Uczciwego Czasu (brak podwójnego liczenia) + 4-warstwowy lokalny model ML z trybem `auto_safe` i rollbackiem. | Obiektywny pomiar, zero tarć dla artysty, brak oporu przed inwigilacją. |
| **Rozliczanie renderów** | Czas renderowania pomijany lub liczony z zegarka. | Render Ledger (kontrakt `cfab_render` 3) z kluczem `(hub_instance_id, ledger_id)` i transferem do TIMEFLOW z mnożnikiem RBH. | Latarnie bezstanowe, odczyt cudzej bazy przez SQLite READONLY URI, paczka `.cfabx` dla stacji offline. | Odzyskanie 10–25 % przychodów z tytułu amortyzacji sprzętu i zużycia prądu (założenie `A-ODZYSK`). |
| **Integracja z AI / LLM** | Zewnętrzne wtyczki wymagające wysyłania danych projektowych do chmury. | **Dwa lokalne serwery MCP**: TIMEFLOW (44 narzędzia, zapis za zgodą) i CFAB Hub (5 narzędzi, wyłącznie odczyt, port 8423, tylko loopback). | Sterowanie projektami i raportami przez agentów AI w standardzie MCP, bez opuszczania maszyny; kopie bezpieczeństwa przed każdym zapisem agenta. | Autonomiczni asystenci rozliczeniowi i produkcyjni przy zachowaniu NDA. |
| **Przeglądanie plików EXR** | Płatne aplikacje (PDPlayer) lub powolne otwieranie w Photoshopie / After Effects. | Silnik EXRuster w Rust ze wsparciem SIMD i interfejsem Slint + cache miniatur oparty na `mtime`/rozmiarze. | Natywna dekompozycja kanałów wielowarstwowych, tone-mapping w czasie rzeczywistym, maks. 4 procesy dekodujące zamiast zamrożonego UI. | Błyskawiczna selekcja ujęć, wykrywanie dziur w numeracji i **automatyczne zadanie renderu na brakujące klatki**. |
| **Baza i synchronizacja danych** | Uzależnienie od chmur SaaS (subskrypcje per-user, ryzyko wycieku danych). | Lokalne bazy SQLite (WAL), darmowy 13-krokowy protokół P2P LAN i szyfrowany E2E cloud sync. | Pełna suwerenność danych (Privacy-First), serwer widzi wyłącznie rewizje i sha256, AES-256-GCM z poświadczeniami per sesja. | Brak stałych opłat za chmurę, zgodność z restrykcyjnymi NDA, gwarancja ochrony własności intelektualnej. |
| **Zarządzanie assetami** | Ociężałe programy katalogujące ze sztywnymi ścieżkami sieciowymi. | Biblioteka z formatem `.asset`, parowaniem archiwów i dekompresją w locie do katalogu Scratch. | StorageManager chroniący dysk systemowy, relink Win/Mac z oceną pewności, krate'y Rust do skanowania i haszowania. | Koniec z „Missing Assets” przy przenoszeniu projektów między stacjami roboczymi. |
| **Szukanie w bibliotece** | Wyszukiwanie po nazwie pliku i ręcznych tagach; wyszukiwanie wizualne tylko w chmurowych katalogach. | Wyszukiwanie po obrazie referencyjnym: model DINOv2 / CLIP w ONNX i lokalna baza wektorowa (🟡). | Model i indeks działają na maszynie użytkownika — żadna miniatura nie opuszcza dysku; indeks pilnuje spójności z biblioteką przy przebudowie. | „Znajdź coś podobnego do tego” w bibliotece liczonej w dziesiątkach tysięcy modeli, bez tagowania. |
| **Rozproszony render w studiu** | Team Render (tylko C4D, kapryśny) albo menadżer farmy na licencji (Deadline i pokrewne, koszt na węzeł). | Węzły LAN w module Połączenia: rejestr maszyn, stan klastra, wysyłka zadania na pierwszy wolny węzeł. | Sterowanie przez ten sam most, który obsługuje resztę pipeline'u — bez osobnego serwera farmy, bez licencji na węzeł. | Kilka maszyn studia pracuje jak farma; wolny komputer sam dostaje zadanie z kolejki. |
| **Ciągłość nocnego renderu** | Awaria programu w nocy = stracone godziny i poranek zaczynany od nowa. | Samonaprawa: wykrycie zniknięcia procesu, skan gotowych klatek, restart i wznowienie brakującego zakresu. Plus kontrola kolejki **przed** startem. | Połączenie mostu, rejestru klatek i reguł kontrolnych — system wie, co już policzył, więc wie, co dokończyć. | Noc renderowania kończy się wynikiem, a nie komunikatem o błędzie. |
| **Wymiana geometrii między DCC** | Ręczny eksport/import, rozjeżdżające się jednostki, utrata zaznaczeń i materiałów. | Cztery mosty TCP (C4D 4444, Blender 8920, 3ds Max 8930, MODO 8940) + przepływy `max_to_c4d` / `c4d_to_max` / `modo_to_c4d` / `c4d_to_modo` przez sandbox `staging/`; materiały z Blendera odtwarzane w C4D jako Corona Physical. | Wykonywanie poleceń w wątku głównym każdego DCC (Timer / `bpy.app.timers` / `QTimer` / kolejka MODO), token `hmac.compare_digest`, jeden krok Undo, jawne przeliczenie jednostek. | Transfer siatki i materiałów między programami w kilka sekund, bez plików porozrzucanych po dyskach. |

---

## 9. REKOMENDACJA WDROŻENIA APLIKACJI MAPY

### 9.1. Stack technologiczny aplikacji demonstracyjnej
- **Framework:** React + Vite + TypeScript (ultralekki bundle) albo Next.js w trybie statycznego eksportu.
- **Układ mapy:** CSS Grid (kolumny etapów, bloki, chipy) + jedna warstwa SVG na linie relacji (rozdz. 5.5.7). **Bez** bibliotek grafów (React Flow, D3 force, Cytoscape) i bez Canvas/WebGL — mapa zakresu nie potrzebuje symulacji ani swobodnego układu.
- **Dane:** `features_data.json` ładowany jako statyczny zasób; brak backendu, brak zapytań sieciowych w czasie prezentacji.

### 9.2. Stylistyka — **rzeczywiste** tokeny systemu projektowego CFAB

> **Uwaga — korekta wobec wcześniejszej wersji dokumentu.** Wartości `#16171f`, `#1e1f29`,
> `#717bbc`, `#8b97e5` i `#10b981` **nie występują** w [shared/cfab_ui/tokens.json](shared/cfab_ui/tokens.json).
> Poniższa tabela to faktyczna paleta pakietu.

| Token | Wartość | Zastosowanie na mapie |
|---|---|---|
| `bg_canvas` / `bg_sunken` | `#16161e` | tło strony i siatki mapy |
| `bg_surface` / `bg_raised` | `#1c1c26` | chipy, bloki modułów, panel boczny, podkład etykiet linii |
| `bg_hover` / `line_subtle` | `#26293a` | hover chipu, linie siatki kolumn, obrys chipu `roadmap` |
| `bg_selection` | `#3d4a72` | wybrany chip |
| `line_strong` | `#414868` | obrys chipów i paneli |
| `accent` / `text_accent` / `focus` | `#7aa2f7` / `#a8c1fb` | **kolor programu CFAB 4D Hub**, akcent marki, focus |
| `primary` / `primary_hover` / `primary_pressed` | `#4d6bb8` / `#4f70bc` / `#3f5aa0` | przyciski, aktywne filtry |
| `success` | `#9ece6a` | **kolor programu TIMEFLOW** |
| `warning` | `#e0af68` | linie `file_exchange` |
| `text_muted` / `vis_default` | `#8f95a3` / `#6e748a` | tekst chipu `roadmap`, linie `depends_on` |
| `danger` | `#f7768e` | błędy walidacji danych |
| `info` | `#7dcfff` | **kolor Pomostu Synergii**, linie i impulsy `data_flow` |
| `text_strong` / `text_primary` | `#d4d8e1` / `#b6bcc8` | nagłówki, tekst chipów `production` / `beta` |

Status **nie** ma własnego koloru — niesie go kształt znacznika i obrys (rozdz. 5.5.2). Dzięki
temu zieleń zostaje wyłącznie kolorem TIMEFLOW i nie myli się z „gotowe”.

- **Typografia:** `Geist` (UI) i `Geist Mono` (kod, ścieżki, nazwy kontraktów) — rodziny i pliki zadeklarowane w `tokens.json` (`fonts.ui`, `fonts.mono`); skala z `typography` (caption 10, body 11, label 11/600, title 13/600, display 16/600).
- **Reguła obowiązkowa:** aplikacja mapy **nie wpisuje wartości kolorów na sztywno**. Tokeny eksportuje się z `tokens.json` do zmiennych CSS skryptem analogicznym do [tools/generate_theme.py](tools/generate_theme.py) (który generuje `colors.slint` dla EXRustera). Jedno źródło prawdy dla Qt, Slinta i weba — zmiana tokena przechodzi przez wszystkie trzy.
- Dopuszczalny jest **jeden** kolor spoza tokenów: akcent marki TIMEFLOW, jeśli użytkownik zdecyduje, że szmaragd `#10b981` ma zostać. Wtedy trafia on do `tokens.json` jako nowy token (`brand_timeflow`), a nie do kodu mapy. **Decyzja użytkownika — do zatwierdzenia.**

### 9.3. Elementy wyróżniające (w granicach czytelności)
Efekt ma służyć czytaniu, nie konkurować z nim. Dozwolone są trzy:
- **Spacer po etapach** (rozdz. 5.1.4) — kolumny podświetlane kolejno 1 → 8, z jednym zdaniem o dniu pracy freelancera na każdym etapie. To jest główny punkt demo na spotkaniu.
- **Impulsy na liniach relacji** `data_flow` i `file_exchange` między Hubem a TIMEFLOW (latarnie, ledger, `.cfabx`, miniatury) — wyłącznie gdy relacja jest podświetlona.
- **Licznik metryk** u góry ekranu, zasilany **z pliku danych, nie z tekstu**: `2 Systemy`, `30 Modułów`, `133 Funkcje`, `4 Mosty DCC`, `2 Serwery MCP`, `0 % danych w chmurze`. Jednorazowe odliczanie od zera przy pierwszym otwarciu jest dozwolone (≤ 800 ms, wyłączone przy `prefers-reduced-motion`).

### 9.4. Materiały wspierające
- Pobranie z poziomu mapy zsyntetyzowanego raportu PDF (*One-Pager / Pitch Deck Summary*) z tabelą założeń ROI w przypisach.
- Krótkie zapętlone wideo/animacje demonstrujące realne działanie modułów (parser binarny C4D, generowanie materiałów Corony w C4D Bridge, rozbicie passów w EXRusterze, zapytania agenta AI przez MCP, transfer siatki C4D ↔ 3ds Max / MODO, wyszukiwanie po obrazie w Bibliotece). Nagranie otwiera się z karty funkcji, nigdy samo na mapie.
- **Warunek:** każde nagranie powstaje na danych zastępczych (rozdz. 11) i ma w kadrze widoczny status funkcji.

### 9.6. Publikacja: strona www, hosting i dostęp

Produktem końcowym jest **adres URL**, nie plik. Wymagania dla publikacji:

| Zagadnienie | Wymaganie |
|---|---|
| Typ strony | statyczna (pliki HTML/JS/CSS + `features_data.json`), **bez backendu, bez bazy, bez API** |
| Budowanie | jedno polecenie buildu dające katalog do wgrania; brak kroków ręcznych |
| Hosting | dowolny serwujący pliki statyczne (Vercel, Netlify, Cloudflare Pages, GitHub Pages, zwykły serwer WWW) — wybór należy do zleceniodawcy |
| Domena | subdomena własna, np. `mapa.<domena-studia>` albo adres od hostingu; do ustalenia (pytanie M6) |
| Czas ładowania | pierwszy ekran ≤ 1,5 s na zwykłym łączu; dane ładowane od razu, nagrania leniwie |
| Wizytówka linku | `<title>`, opis i obrazek Open Graph (podgląd w mailu i komunikatorze) — kadr mapy zakresu, bez danych wrażliwych |
| Kopia offline | ten sam build musi działać po otwarciu z dysku (`file://`) — plan B na prezentację bez internetu |
| Analityka | **żadnych zewnętrznych skryptów śledzących.** Jeśli zleceniodawca chce wiedzieć, czy link otwarto, robi to hosting po stronie logów, nie skrypt w stronie |

**Dostęp — decyzja przed publikacją (pytanie M6):**

| Wariant | Kiedy sensowny | Koszt |
|---|---|---|
| **Link niepubliczny** (adres nie do odgadnięcia, `noindex`) — *rekomendowany* | wysyłka do konkretnych funduszy | zero tarcia dla odbiorcy, brak indeksowania w Google |
| Hasło / prosta brama | rozmowy pod NDA, kilku odbiorców | jedno pole do wpisania; przy stronie statycznej to zabezpieczenie umowne, nie kryptograficzne |
| Strona publiczna | gdy mapa ma pracować także jako materiał marketingowy | wymaga wersji publicznej wg rozdz. 11.1 — bez nazw plików i struktury repozytoriów |

Niezależnie od wariantu obowiązuje **R5**: w kodzie strony i w danych nie ma ścieżek lokalnych,
adresów IP ani nazw plików źródłowych. Statyczna strona to pliki, które każdy odbiorca może
otworzyć i przeczytać — wszystko, co w niej jest, traktuj jak opublikowane.

### 9.5. Umiejscowienie w repozytorium i wersjonowanie

Do rozstrzygnięcia **przed startem prac** (rekomendacja pogrubiona):

| Wariant | Konsekwencje |
|---|---|
| **A. Osobne repozytorium `__cfab_map` (rekomendowany)** | Mapa jest materiałem inwestorskim, nie częścią produktu. Nie obciąża `RELEASE.json`, nie wymaga podbijania wersji pakietu, można ją udostępnić bez wydawania kodu Huba. Dane pobiera generator opisany w rozdz. 10. |
| B. Część pakietu (`tools/feature_map/`) | Wymaga własnego `VERSION`, `CHANGELOG.md`, wpisu w `RELEASE.json` i podbijania numeru przy każdej zmianie ([AGENTS.md](AGENTS.md), [docs/WERSJONOWANIE.md](docs/WERSJONOWANIE.md)). Zaleta: generator danych zawsze widzi repo. |
| C. Katalog `docs/` bez kodu | Tylko dokument, bez aplikacji — sprzeczne z celem. |

Niezależnie od wariantu: **ten dokument jest dokumentacją i jego edycja nie podbija numeru wersji**
(reguła „refaktor, testy i dokumentacja bez wpływu na działanie — bez podbicia”). Generator danych
z rozdz. 10 jest już narzędziem: jego dodanie lub zmiana **podbija numer** zgodnie z regułą.

---

## 10. DANE WEJŚCIOWE I PROCES AKTUALIZACJI

Mapa starzeje się w dniu, w którym ktoś doda moduł i zapomni o pliku JSON. Dlatego dane mają
**jedno źródło i jeden generator**.

### 10.1. Generator
Skrypt (proponowana nazwa `tools/build_feature_map.py`) składa `features_data.json` z:
- `VERSION` pakietu i `RELEASE.json` → `meta.hubVersion`, `meta.contracts`, pole `version` każdego modułu,
- `modules/*/manifest.json` → identyfikatory, nazwy PL/EN i kolejność modułów Huba,
- `__TIMEFLOW/__cfab_demon/dashboard/src/locales/{pl,en}/common.json` (`layout.nav`) → obszary TIMEFLOW,
- `dashboard/src-tauri/src/mcp/tools.rs` → lista narzędzi MCP,
- rozdziałów 2–4 **tego dokumentu** → treść liści (opisy, moaty, statusy),
- `docs/BETA.md` → statusy 🟢/🟡/⚪ i noty „czego brakuje do odbioru”.

### 10.2. Reguła aktualizacji
- Zmiana w rozdziałach 2–4 tego dokumentu **jest** zmianą danych mapy — generator uruchamia się po każdej takiej zmianie.
- Odbiór punktu w `docs/BETA.md` (🟡 → 🟢) wymaga przebiegu generatora; status w mapie nie jest przepisywany ręcznie.
- Walidacja z rozdz. 6.5 uruchamiana w tym samym poleceniu; czerwona walidacja blokuje publikację.
- **Przegląd kwartalny:** ktoś odpowiedzialny porównuje licznik z tabeli 5.0 ze stanem repozytoriów i odnotowuje datę w `meta.generatedAt`.

### 10.3. Zakres odpowiedzialności
Dokument opisuje dwa repozytoria, ale generator ma dostęp do obu tylko na maszynie użytkownika.
Jeśli mapa powstaje jako osobne repo (wariant A), dane TIMEFLOW wchodzą do niej jako **wygenerowana
migawka** z datą, a nie jako odczyt na żywo.

---

## 11. POUFNOŚĆ I WERSJA PUBLICZNA

Ten dokument i mapa z niego zbudowana zawierają informacje, których nie wolno pokazać bez decyzji:
lokalne ścieżki (`/Users/micz/...`, `S:\_software\...`), nazwy plików źródłowych, adres serwera ntfy,
strukturę katalogów klienta, nazwy zestawów skryptów i treść audytów.

**Zgodność z NDA jest jednym z głównych argumentów sprzedażowych ekosystemu — dokument o nim
nie może łamać własnej obietnicy.**

### 11.1. Trzy poziomy dystrybucji

| Poziom | Odbiorca | Co zawiera |
|---|---|---|
| **Wewnętrzny** | użytkownik, zespół | pełna treść, ścieżki, `sources`, statusy, audyty |
| **Inwestorski (NDA)** | fundusz VC po podpisaniu NDA | treść bez ścieżek lokalnych i adresów sieciowych; `sources` skrócone do nazw modułów; zrzuty na danych zastępczych |
| **Publiczny** | strona, pitch deck | wyłącznie rozdziały 1, 7, 8 i wskaźniki z 5.0; bez nazw plików, bez struktury repozytoriów |

### 11.2. Reguły dla poziomu inwestorskiego i publicznego
- Pole `sources` filtrowane przez generator (flaga `--public`) — zostaje nazwa modułu, znika ścieżka.
- Zrzuty i nagrania wyłącznie na **danych zastępczych**: fikcyjni klienci, fikcyjne nazwy projektów, kwoty przykładowe.
- Adresy sieciowe (`192.168.x.x`, porty mostów) zastąpione opisem („port lokalny, wyłącznie pętla zwrotna”).
- Żadnych nazw realnych klientów studia w przykładach wycen i raportów.
- Stopka każdej wersji poza wewnętrzną: data wygenerowania i poziom dystrybucji.

---

## 12. WYMAGANIA NIEFUNKCJONALNE I KRYTERIA ODBIORU

### 12.1. Wydajność
- Pierwsze renderowanie mapy (First Contentful Paint) **≤ 1,5 s** na laptopie prezentującym.
- Reakcja na hover i klik (podświetlenie, linie relacji, otwarcie panelu) **≤ 100 ms** przy obecnych ~170 elementach; filtr i przełączenie języka bez zauważalnego przeskoku układu.
- W spoczynku strona nie zużywa procesora (brak pętli animacji, brak symulacji).
- Rozmiar paczki (bez wideo) **≤ 5 MB**; nagrania ładowane leniwie, na żądanie.

### 12.2. Zgodność i dostępność
- Przeglądarki: dwie ostatnie wersje Chrome, Safari i Firefox; obowiązkowo Safari na macOS (maszyna prezentująca).
- **Strona jest przeznaczona na duży ekran.** Projektowana szerokość odniesienia: 1440 px, minimalna obsługiwana: 1280 px. Wersja mobilna i dotykowa **jest poza zakresem** — nie robimy jej i nie testujemy. Przy oknie węższym niż 1280 px wystarczy czytelny komunikat „otwórz na większym ekranie”.
- **Wydruk i PDF:** mapa zakresu drukuje się czytelnie na jednej stronie A4 poziomo lub A3 (arkusz stylów `@media print`: jasne tło, statusy rozpoznawalne po kształcie znacznika, bez panelu i filtrów).
- Nawigacja klawiaturą po chipach i filtrach (rozdz. 5.5.5), widoczny focus (token `focus`), kontrast tekstu do tła zgodny z WCAG AA; chipy są elementami interaktywnymi z nazwą dostępną dla czytnika ekranu („Parser .c4d bez licencji, CFAB 4D Hub, Inspektor, gotowe”).
- Pełne PL/EN w interfejsie i w danych — specyfikacja w rozdz. 5.7; brak tłumaczenia blokuje build.

### 12.3. Samowystarczalność i tryb offline
- Strona nie odwołuje się do CDN-ów, fontów z sieci ani żadnego API. Fonty Geist osadzone lokalnie (pliki wymienione w `tokens.json`), dane w `features_data.json` obok strony.
- Ten sam build musi działać po otwarciu z dysku (`file://`) — to jest plan B na spotkanie ze słabym Wi-Fi.
- Brak zewnętrznej analityki i skryptów firm trzecich (rozdz. 9.6).

### 12.4. Kryteria odbioru (definicja ukończenia)

- [ ] `features_data.json` przechodzi komplet walidacji z rozdz. 6.5.
- [ ] Liczby na liczniku zgadzają się co do sztuki z tabelą 5.0 wygenerowaną z danych.
- [ ] Każda funkcja `production` ma istniejącą ścieżkę w `sources`.
- [ ] Wszystkie trzy widoki (5.1) działają na tym samym zbiorze danych, bez osobnych plików.
- [ ] Filtry z 5.3 dają się łączyć, mają stan w URL i **nie przestawiają układu mapy**.
- [ ] Kalkulator ROI (rozdz. 7) pokazuje założenia i pozwala je zmienić.
- [ ] Kolory i fonty pochodzą wyłącznie z wyeksportowanych tokenów; brak literałów w kodzie mapy.
- [ ] **Przełączenie języka nie zostawia na ekranie ani jednego słowa w drugim języku** — sprawdzone na wszystkich trzech widokach, karcie funkcji, filtrach i kalkulatorze ROI.
- [ ] Przełączenie języka zachowuje widok, zaznaczenie i filtry; `?lang=en` otwiera stronę po angielsku.
- [ ] Wersja publiczna wygenerowana flagą `--public` nie zawiera żadnej ścieżki lokalnej ani adresu IP.
- [ ] **Test czytelności z 0.2 na zrzucie ekranu 1440 × 900:** bez żadnej interakcji da się przeczytać nazwę każdej funkcji, jej program (kolor), etap (kolumna) i status (kształt znacznika); legenda widoczna bez przewijania.
- [ ] Żaden tekst na mapie nie jest ucięty, schowany do zbliżenia ani nie nachodzi na inny; font nigdzie nie spada poniżej 10 px.
- [ ] Mapa w stanie spoczynku nie ma żadnej linii relacji; hover i klik rysują wyłącznie relacje wskazanego elementu.
- [ ] Układ jest deterministyczny — ta sama wersja danych daje zawsze ten sam obraz, także po zmianie języka.
- [ ] Statusy rozpoznawalne na wydruku czarno-białym.
- [ ] Strona działa pod adresem URL i **ten sam build** otwiera się z dysku bez sieci.
- [ ] Link ma poprawny podgląd (tytuł, opis, obrazek) w mailu i komunikatorze.
- [ ] W kodzie strony i w danych nie ma ani jednej ścieżki lokalnej, adresu IP ani nazwy pliku źródłowego.
- [ ] Odbiór na żywo: przejście ścieżki „kolumna Render → moduł Render → Render Ledger → wycena w TIMEFLOW” oraz pełny spacer po etapach 1 → 8 bez zacięcia i bez martwego panelu.

---

## 13. DODATEK A: STAN REALIZACJI — CO JEST 🟡 I CZEGO BRAKUJE DO 🟢

Źródło: [docs/BETA.md](docs/BETA.md) (fale 0.1 i 0.15), [CHANGELOG.md](CHANGELOG.md) oraz odbiory potwierdzone przez właściciela 2026-09-24 (monitoring C4D, samonaprawa i strażnik zamykania, farma LAN, ntfy i dźwięk, mosty 3ds Max / MODO / Blender → C4D / RizomUV w C4D, wyszukiwanie AI, zakładka Błędy, karta EXRustera, instalacja i przenosiny, zmiany TIMEFLOW z „Unreleased”, rozdział czasu maszyny, rejestr aktywności DCC, wspólny start). `docs/BETA.md` w repo Huba nie ma jeszcze tych odhaczeń.

| Funkcja | Status | Czego brakuje |
|---|---|---|
| Wizualny dowód pracy (miniatury w raporcie PDF) | 🟡 | wydanie TIMEFLOW z poprawką wyświetlania (`data:` URL z backendu raportu) i odbiór na żywym raporcie; oś czasu projektu nie pokazuje miniatur |
| Propozycja → ACK (`cfab_proposals`) | 🟡 | rendery działają; Hub nie wysyła propozycji kosztów, znalezisk audytu ani prognoz |
| Okno globalnych ustawień (0.1-G) | 🟡 | odbiór ergonomii: „da się znaleźć i zmienić parametr bez znajomości kodu” (na mapie część funkcji „Pasek modułów, ustawienia i zasobnik”) |
| Przepływ RizomUV uruchamiany z Huba (0.1-E) | ⚪ | Sceny → Rizom → siatka z UV z powrotem; okno Rizom w C4D odebrane |
| Prognoza kosztu renderu przed kolejką, limity w Hubie (etap C) | ⚪ | nierozpoczęte |
| Znaleziska audytu sceny → zadania TIMEFLOW (etap D) | ⚪ | nierozpoczęte; kontrakt `cfab_proposals` 1 już jest (rendery) |
| Systemowy autostart przy logowaniu | ⚪ | osobny plan poza specyfikacją renderu (ikona i zasobnik już są) |
| Wyszukiwanie tekstem w Bibliotece, prognoza kosztu renderu, diagnoza nieudanego renderu | ⚪ | propozycje z [docs/ANALIZA_AI.md](docs/ANALIZA_AI.md); nierozpoczęte — **nie pokazywać na mapie**, dopóki nie trafią do `docs/BETA.md` |
| Narzędzie PBR (C4D / Corona / V-Ray), Max → materiał → konwersja | ⚪ | fala 0.16, świadomie poza bieżącym etapem |

**Zasada prezentacji:** funkcje ⚪ pokazujemy na mapie jako roadmapę z datą docelową lub bez niej,
ale **nigdy jako działające**. Dla inwestora wiarygodna roadmapa jest aktywem; funkcja
„udająca gotową” i zdemaskowana na demo jest kosztem.

---

## 14. DODATEK B: WERSJE, CZĘŚCI I KONTRAKTY (stan 2026-09-22)

**Pakiet CFAB 4D Hub: `BETA 0.43`** · TIMEFLOW: `0.1.5776`

| Część | Wersja | | Część | Wersja |
|---|---|---|---|---|
| `modules/start` | ALPHA 0.211 | | `shell/cfab_shell` | ALPHA 0.703 |
| `modules/browser` | 1.7.2 | | `service/cfab_service` | ALPHA 0.721 |
| `modules/render` | ALPHA 0.72 | | `shared/cfab_core` | ALPHA 0.95 |
| `modules/results` | 0.8.7 | | `shared/cfab_ui` | ALPHA 0.663 |
| `modules/assets` | ALPHA 0.22 | | `shared/cfab_contracts` | ALPHA 0.53 |
| `modules/scenes` | ALPHA 0.621 | | `shared/cfab_bridge` | ALPHA 0.702 |
| `modules/scratch` | ALPHA 0.133 | | `shared/cfab_native` | 0.2.0 |
| `modules/plugins` | BETA 0.114 | | `bridges/c4d_bridge` | ALPHA 0.77 |
| `modules/bridges` | ALPHA 0.71 | | `bridges/blender_bridge` | ALPHA 0.231 |
| | | | `bridges/max_bridge` | ALPHA 0.22 |
| | | | `bridges/modo_bridge` | ALPHA 0.11 |

**Kontrakty** (`RELEASE.json`): `module` 1 · `service_api` 5 · `settings` 1 · `bridge_protocol` 6 ·
`blender_bridge_protocol` 2 · `max_bridge_protocol` 1 · `modo_bridge_protocol` 1 · `history_db` 2 ·
`cfab_render` 3 · `dcc_activity` 1 · `cfab_project_index` 1 · `ai_vector_db` 1 ·
`asset_format` (jeszcze bez numeru).

---

## 15. OTWARTE PYTANIA DO UŻYTKOWNIKA

Poniższe rozstrzygnięcia nie blokują pisania aplikacji, ale zmieniają jej kształt:

| # | Pytanie | Domyślne założenie tego dokumentu |
|---|---|---|
| M1 | Gdzie mieszka aplikacja mapy — osobne repo, część pakietu, czy `docs/`? | wariant A: osobne repozytorium (rozdz. 9.5) |
| M2 | Czy szmaragd TIMEFLOW `#10b981` wchodzi do `tokens.json` jako `brand_timeflow`, czy TIMEFLOW dostaje kolor z istniejącej palety (`success` `#9ece6a`)? | na razie `success` z palety (rozdz. 9.2) |
| M3 | Czy liczby ROI z tabeli 7.2 zatwierdzasz jako założenia prezentacyjne, czy mierzymy je na realnych danych przed prezentacją? | oznaczone ⚠ jako założenia do zatwierdzenia |
| M4 | Czy mapa ma pokazywać pozycje ⚪ (roadmapa), czy wyłącznie 🟢 i 🟡? | pokazuje wszystkie, z legendą statusów |
| M5 | Czy wersja inwestorska ma zawierać `sources` (nazwy modułów), czy całkowicie bez odniesień do kodu? | nazwy modułów zostają, ścieżki znikają (rozdz. 11.2) |
| M6 | Gdzie stoi strona i kto ma do niej dostęp: link niepubliczny, hasło, czy strona publiczna? Jaka domena? | link niepubliczny z `noindex` (rozdz. 9.6) |
| M7 | Czy chmura węzłów w stylu Obsidiana ma wrócić jako **dodatkowy** widok „efektowy” (np. na ekran powitalny), czy zostaje całkowicie poza zakresem? | poza zakresem; mapa zakresu jest jedynym widokiem graficznym (rozdz. 5) |
| M8 | Czy funkcje 🟡 dodane po 2026-09-19 (MODO, wyszukiwanie wizualne, zmiany TIMEFLOW z „Unreleased”) mają być na mapie od razu, czy dopiero po wpisie w `docs/BETA.md`? | są na mapie jako 🟡 z notą „czego brakuje” (rozdz. 13) |

---
*Dokument zweryfikowany na kodzie repozytoriów `/Users/micz/__DEV__/__c4d` (BETA 0.43) oraz
`/Users/micz/__DEV__/__TIMEFLOW` (0.1.5776) w dniu 2026-09-24. Statusy zgodne z `docs/BETA.md`, `CHANGELOG.md` i odbiorami potwierdzonymi
przez właściciela 2026-09-24 (rozdz. 13).*
