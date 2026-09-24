# Brief: pokazanie realnych przewag na mapie funkcjonalności

Dla modelu, który wykona zadanie w repozytorium `/Users/micz/__DEV__/__cfab_map`.
Stan na 2026-09-24. Przeczytaj całość przed pierwszą zmianą.

## 1. Zadanie w jednym akapicie

Mapa pokazuje dziś **zakres** (133 funkcje w chmurze i w siatce etapów), ale nie mówi,
**co z tego jest trudne do skopiowania**. Inwestor musi to wyczytać sam z akapitów w karcie
funkcji. Dodaj warstwę **przewag**: pięć nazwanych tez, każda poparta listą działających
funkcji, oraz widok, który otwiera się jako pierwszy i prowadzi od tezy do dowodu na mapie.
Treść tez jest gotowa w rozdziale 4 tego briefu — nie wymyślaj własnych.

## 2. Co musisz wiedzieć o repozytorium

- Aplikacja: Vite + React 19 + TypeScript, bez backendu. Dane: `data/source.mjs` →
  `npm run data` (`scripts/build-data.mjs`) → `src/generated/features_data.json` i
  `public/features_data.json` → `npm run validate` (`scripts/validate.mjs`).
- Specyfikacja: `wytyczne_interaktywna_mapa_funkcjonalnosci.md`. Obowiązują reguły R1–R9
  z rozdz. 0.3 — przeczytaj je. Najważniejsze tu: R1 (nie wymyślaj funkcji), R2 (nie
  zaokrąglaj liczb), R3 (nie ukrywaj statusów), R4 (kolory tylko ze zmiennych CSS),
  R5 (bez ścieżek i nazw plików w interfejsie), R8 (konkret zamiast superlatywów),
  R9 (każdy tekst PL i EN).
- Widoki dziś: **Chmura** (`src/Cloud.tsx`, `src/NodeBubble.tsx`, `src/graphModel.ts`,
  domyślny) i **Etapy pracy** (siatka w `src/App.tsx`, `src/layout.ts`). Karta funkcji to
  komponent `Card` w `src/App.tsx`. Chmura przyjmuje już `highlightIds: Set<string> | null`
  i wygasza resztę — użyj tego, nie pisz drugiego mechanizmu.
- **W drzewie roboczym są niezacommitowane zmiany właściciela** (`src/App.tsx`,
  `src/Cloud.tsx`, `src/NodeBubble.tsx`, `src/styles.css`, `scripts/verify-popout.mjs`,
  pliki danych). Buduj na nich. Nie rób `git checkout`, `git stash` ani `git reset`.
  Nie commituj, jeśli nikt cię o to nie poprosi.
- Statusy w danych (funkcje + elementy pomostu): 137 `production`, 2 `beta`
  (`syn.proof`, `syn.proposals`), 2 `roadmap` (`hub.bridges.rizom_hub`,
  `hub.shell.login_autostart`). Wszystkie funkcje-dowody niżej są `production`.
- Reguła 6 z rozdz. 0.3 wytycznych mówi, że chmura węzłów jest poza zakresem, ale właściciel
  świadomie ją zbudował i jest widokiem domyślnym. Nie usuwaj jej i nie zmieniaj jej układu.
  Konflikt zgłoś w podsumowaniu, nie rozstrzygaj go sam.

## 3. Dlaczego te przewagi, a nie inne

Przewaga trafia na listę tylko wtedy, gdy spełnia wszystkie cztery warunki:

1. **Bariera** — trudna do powtórzenia: zamknięty format odtworzony inżynierią wsteczną,
   kod działający wewnątrz programu 3D albo dane, które powstają dopiero z połączenia
   dwóch aplikacji.
2. **Dowód w kodzie** — co najmniej 5 funkcji o statusie `production`, sprawdzonych na kodzie
   2026-09-24.
3. **Pieniądz albo czas klienta** — zastępuje płatne narzędzie albo odzyskuje przychód.
4. **Da się to powiedzieć jednym zdaniem** bez słów „jedyny”, „rewolucyjny”, „najlepszy”.

Obecna flaga `techMoat` (pole `m` w `source.mjs`) jest na 21 funkcjach i miesza przewagi
rynkowe z detalami inżynierskimi (np. „izolacja modułów” w rdzeniu). Przewaga to nie flaga
na funkcji, tylko teza z listą dowodów. Flaga `m` zostaje jako tekst „dlaczego trudno to
skopiować” w karcie funkcji.

## 4. Pięć przewag — treść do wstawienia

Kolejność jest rankingiem: 1 to przewaga, której nie ma żaden pojedynczy produkt, bo powstaje
z połączenia Huba i TIMEFLOW. Teksty są gotowe. Wolno je skrócić, nie wolno dopisać twierdzeń.

### 1 · `render_cost` — Czas renderu trafia do wyceny

- **Tytuł:** PL „Czas renderu trafia do wyceny” · EN „Render time lands in the quote”
- **Teza:** PL „Hub zapisuje każdy zakończony render z maszyną i sekundami, a TIMEFLOW
  przypisuje go do projektu i dolicza koszt maszyny do wyceny i raportu PDF — po włączeniu
  przez artystę.” · EN „Hub logs every finished render with its machine and seconds;
  TIMEFLOW assigns it to a project and adds the machine cost to the quote and the PDF
  report once the artist switches it on.”
- **Dlaczego trudno skopiować:** PL „Potrzebny jest stan renderu z wnętrza programu 3D i
  aplikacja rozliczeniowa po drugiej stronie. Trackery czasu nie widzą renderu, a menedżery
  renderu nie robią wycen.” · EN „It needs render state from inside the 3D app and a billing
  app on the other side. Time trackers can't see renders; render managers don't do quotes.”
- **Zastępuje:** ręczne liczenie czasu renderu / manual render-time tracking; Excel
- **Wartość:** założenie `A-ODZYSK` (10–25 % odzysku przychodu) — zawsze z etykietą
  „założenie” / „assumption”.
- **Przepływ (4 kroki do narysowania):** Render w Hubie → Księga renderów → Przypisanie
  w TIMEFLOW → Koszt w wycenie i PDF.
  EN: Render in Hub → Render log → Assignment in TIMEFLOW → Cost in quote and PDF.
- **Dowody (12):** `syn.machine_time`, `hub.render.ledger`, `hub.render.ledger_always`,
  `syn.ledger`, `tf.renders.ingest`, `tf.renders.assign`, `tf.renders.cost`, `syn.cfabx`,
  `tf.renders.offline`, `tf.renders.render_sync`, `tf.reports.profitability`, `tf.reports.pdf`

### 2 · `closed_formats` — Pliki .c4d i .max bez programu i licencji

- **Tytuł:** PL „Pliki .c4d i .max bez programu i licencji” · EN „.c4d and .max files
  without the app or a licence”
- **Teza:** PL „Inspektor czyta geometrię, hierarchię i materiały z plików Cinema 4D i
  3ds Max, porównuje sceny, zmienia silnik renderu w pliku i przenosi scenę z Maxa do C4D —
  bez uruchamiania tych programów.” · EN „The Inspector reads geometry, hierarchy and
  materials from Cinema 4D and 3ds Max files, compares scenes, swaps the render engine in the
  file and moves a Max scene into C4D — without launching either app.”
- **Dlaczego trudno skopiować:** PL „Oba formaty są zamknięte. Strukturę .c4d odtworzono
  inżynierią wsteczną, a .max jest czytany ze struktur OLE bez API Autodesku.” · EN „Both
  formats are closed. The .c4d layout was reverse-engineered; .max is read from OLE
  structures without Autodesk's API.”
- **Zastępuje:** licencja Cinema 4D; licencja 3ds Max; Connecter; konwertery chmurowe
- **Wartość:** założenie `A-INSPEKCJA` (8 h / artystę / mies.)
- **Dowody (9):** `hub.scenes.c4d_parser`, `hub.scenes.max_reader`, `hub.scenes.max_import`,
  `hub.scenes.max_space`, `hub.scenes.diag_tools`, `hub.scenes.max_tools`,
  `hub.scenes.export`, `hub.scenes.materials`, `hub.scenes.tree`

### 3 · `night_render` — Nocny render kończy się klatkami

- **Tytuł:** PL „Nocny render kończy się klatkami” · EN „An overnight render ends with frames”
- **Teza:** PL „Przed startem Hub sprawdza kolejkę, w trakcie pilnuje postępu i wysyła
  zadania na wolne maszyny w sieci lokalnej, a po awarii Cinema 4D restartuje program i
  renderuje tylko brakujące klatki. Rano czeka mail z miniaturami.” · EN „Before the start
  Hub checks the queue; during the night it tracks progress and sends jobs to free LAN
  machines; after a Cinema 4D crash it restarts the app and renders only the missing
  frames. A mail with thumbnails waits in the morning.”
- **Dlaczego trudno skopiować:** PL „Most działa wewnątrz procesu Cinema 4D, a Hub prowadzi
  rejestr klatek — wie, co już policzył, więc wie, co dokończyć.” · EN „The bridge runs inside
  the Cinema 4D process and Hub keeps a frame log — it knows what is done, so it knows what
  to finish.”
- **Zastępuje:** Deadline; Team Render
- **Wartość:** bez liczby (brak założenia w rozdz. 7.2 — nie dopisuj go).
- **Dowody (10):** `hub.render.precheck`, `hub.render.recovery`, `hub.render.watchdog`,
  `hub.render.lan_farm`, `hub.render.eta_log`, `hub.render.web_panel`, `hub.render.ntfy`,
  `hub.render.mail`, `hub.results.sequences`, `hub.render.shutdown`

### 4 · `honest_time` — Czas pracy liczy się sam i uczciwie

- **Tytuł:** PL „Czas pracy liczy się sam i uczciwie” · EN „Work time counts itself, fairly”
- **Teza:** PL „Demon mierzy pracę ze zdarzeń systemu, bez stopera. Nie liczy podwójnie
  przy przełączaniu okien ani pracy maszyny w tle, a lokalny model przypisuje sesje do
  projektów — także po ścieżce pliku otwartego w programie 3D, którą podaje Hub.” · EN „The
  daemon measures work from system events, with no stopwatch. It doesn't double-count window
  switching or background machine work, and a local model assigns sessions to projects —
  including by the path of the file open in the 3D app, supplied by Hub.”
- **Dlaczego trudno skopiować:** PL „Haki zdarzeń Win32 i Quartz w Rust, Algorytm Uczciwego
  Czasu i model uczący się lokalnie. Ścieżkę pliku z wnętrza programu 3D ma tylko para Hub i
  TIMEFLOW.” · EN „Win32 and Quartz event hooks in Rust, the Fair Time Algorithm and a model
  that learns locally. Only the Hub–TIMEFLOW pair has the file path from inside the 3D app.”
- **Zastępuje:** Toggl; Harvest; Clockify
- **Wartość:** bez liczby.
- **Dowody (11):** `tf.daemon.events`, `tf.daemon.title_parser`, `tf.daemon.idle`,
  `tf.daemon.background`, `tf.sessions.no_double`, `tf.sessions.split`, `syn.dcc_activity`,
  `tf.ai.layer_paths`, `tf.ai.facts_first`, `tf.ai.auto_safe`, `tf.ai.ai_screen`

### 5 · `local_first` — Dane i AI zostają na komputerze

- **Tytuł:** PL „Dane i AI zostają na komputerze” · EN „Data and AI stay on the machine”
- **Teza:** PL „Dwa lokalne serwery MCP dla agentów AI, wyszukiwanie po obrazie na lokalnym
  modelu, synchronizacja w sieci lokalnej bez chmury i szyfrowana synchronizacja online,
  w której serwer widzi tylko rewizje i sumy kontrolne.” · EN „Two local MCP servers for AI
  agents, image search on a local model, LAN sync with no cloud, and encrypted online sync
  where the server sees only revisions and checksums.”
- **Dlaczego trudno skopiować:** PL „Cały stos działa lokalnie: serwery MCP tylko na pętli
  zwrotnej, model DINOv2 lub CLIP na maszynie, AES-256-GCM z kluczem, którego serwer nie
  zna.” · EN „The whole stack is local: MCP servers on loopback only, a DINOv2 or CLIP model
  on the machine, AES-256-GCM with a key the server never sees.”
- **Zastępuje:** chmury SaaS / SaaS clouds
- **Wartość:** bez liczby.
- **Dowody (9):** `hub.core.mcp`, `tf.mcp_arch`, `tf.mcp_tools`, `tf.mcp_backup`,
  `hub.browser.visual_search`, `tf.data.lan_sync`, `tf.data.cloud_sync`, `syn.beacons`,
  `tf.webserver`

### Drugi rząd — mocne, ale łatwiejsze do skopiowania

Pokaż jako jedną linię pod pięcioma przewagami („Także: …” / „Also: …”), chipy klikalne,
bez własnej tezy: `hub.results.exruster`, `hub.results.passes`, `hub.results.thumb_cache`,
`hub.assets.relink`, `hub.bridges.c4d`, `hub.bridges.blender_mats`, `hub.bridges.max`,
`hub.bridges.modo`, `hub.browser.jit`.

### Czego nie pokazywać jako przewagi

- `syn.proof` (miniatury w PDF) i `syn.proposals` — status `beta`. Zostają na mapie
  z notą, ale nie są dowodem żadnej przewagi.
- Pozycje `roadmap` i wszystko z rozdz. 13 wytycznych oznaczone ⚪.
- Twierdzenia o konkurencji w formie „nikt tego nie ma”. Wolno: „zastępuje X”.

## 5. Dane

1. W `data/source.mjs` dodaj `export const advantages = [...]`, pola jak reszta pliku:
   `id`, `rank`, `t` [pl, en], `d` (teza) [pl, en], `why` [pl, en], `rep` (lista),
   `assumptionId` (albo `null`), `flow` (tylko przewaga 1: lista kroków [pl, en]),
   `ids` (dowody). Drugi rząd jako osobny eksport `alsoStrong`.
2. W `scripts/build-data.mjs` przenieś je do JSON-a jako `advantages[]` i `alsoStrong[]`,
   a każdemu węzłowi dopisz `advantageId: string | null`. Zaktualizuj `src/types.ts`.
3. W `scripts/validate.mjs` dodaj reguły (błąd = kod wyjścia 1):
   - 3–6 przewag, `rank` unikalny, wszystkie teksty PL i EN niepuste;
   - każdy id w `ids` i `alsoStrong` istnieje;
   - każda przewaga ma ≥ 5 dowodów, wszystkie `production`;
   - żaden węzeł nie należy do dwóch przewag;
   - `assumptionId`, jeśli jest, istnieje w `assumptions`.
4. Kuracja flagi `m`: usuń `m` z `hub.core.core` (detal inżynierski, nie przewaga rynkowa).
   Pozostałych tekstów `m` nie zmieniaj.
5. `npm run data && npm run validate` muszą przejść. Plik publiczny budujesz tylko wtedy,
   gdy ktoś o to poprosi (`--public` nadpisuje też plik wewnętrzny poziomem inwestorskim).

## 6. Jak to pokazać

### 6.1. Nowy widok „Przewagi” — pierwszy i domyślny

Kolejność zakładek: **Przewagi · Chmura · Etapy pracy**. Bez `?view=` otwiera się Przewagi.
`?view=cloud` i `?view=grid` działają jak dotąd. Inwestor dostaje link i w pierwszej sekundzie
widzi tezę, a nie 133 punkty.

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ CFAB 4D Hub × TIMEFLOW  [Przewagi][Chmura][Etapy pracy]   2 · 30 · 133   PL|EN        │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ 1  Czas renderu trafia do wyceny                                     12 funkcji ●    │
│    Hub zapisuje każdy zakończony render…                                              │
│    [Render w Hubie] → [Księga renderów] → [Przypisanie w TIMEFLOW] → [Koszt w PDF]    │
│    Dlaczego trudno skopiować: …      Zastępuje: ręczne liczenie · Excel               │
│    Założenie: 10–25 % odzysku przychodu                         [Pokaż na mapie →]    │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ 2  Pliki .c4d i .max bez programu i licencji                          9 funkcji ●    │
│    teza w jednej linii · zastępuje: licencja C4D · licencja 3ds Max · Connecter       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ 3 …   4 …   5 …   (te same wiersze, zwinięte do tezy i „zastępuje”)                    │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Także: EXRuster · Warstwy EXR · Relink Win↔Mac · Mosty C4D/Blender/Max/MODO · …        │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

- Pierwsza przewaga jest rozwinięta i wyższa. Pozostałe cztery są zwinięte do tytułu, tezy
  i „zastępuje”; klik rozwija jedną naraz (akordeon), bez przesuwania nagłówka.
- Rozwinięty wiersz pokazuje dowody jako te same chipy co siatka (znacznik statusu + krótki
  tytuł). Klik w chip otwiera istniejącą kartę `Card`.
- Przepływ w przewadze 1 to cztery pola połączone strzałkami, w kolorach programu (Hub,
  pomost, TIMEFLOW) ze zmiennych CSS. Najechanie na krok podświetla jego dowody.
- Licznik „12 funkcji ●” liczy się z danych. Pokazuje status, więc gdyby któryś dowód
  przestał być `production`, walidacja i tak zatrzyma build.
- Liczby wartości tylko z `assumptions`, zawsze z etykietą „założenie” / „assumption”.
- Całość mieści się w 1440 × 900 bez przewijania przy jednym rozwiniętym wierszu.

### 6.2. „Pokaż na mapie”

- Przycisk przełącza na Chmurę (albo na Etapy pracy, jeśli użytkownik był tam wcześniej)
  i ustawia `highlightIds` na dowody przewagi. Reszta wygasa, nic się nie przesuwa.
- U góry mapy pojawia się pasek: „Przewaga 1 z 5 · Czas renderu trafia do wyceny ← → ✕”.
  Strzałki przechodzą między przewagami, Esc i ✕ czyszczą podświetlenie.
- Stan w URL: `?view=cloud&adv=render_cost`, żeby dało się wysłać link do konkretnej tezy.
- W siatce Etapy pracy wygaszaj chipy tak samo (klasa `dimmed`, krycie jak dla filtra
  z rozdz. 5.3 wytycznych, ~20 %).

### 6.3. Karta funkcji

Jeśli węzeł ma `advantageId`, karta dostaje na górze linię „Część przewagi 3 · Nocny render
kończy się klatkami ↗” — klik wraca do widoku Przewagi z tym wierszem rozwiniętym.

### 6.4. Legenda statusów

Legenda jest dziś nieaktualna: pokazuje trzy równorzędne stany, choć dwa mają po dwie
pozycje. Dopisz liczby z danych: „● gotowe 137 · ◐ w odbiorze 2 · ○ planowane 2”
(EN „ready · in sign-off · planned”). Nie ukrywaj pustych ani rzadkich stanów (R3).
Liczby licz z węzłów typu `feature` i `bridge`, tak jak licznik funkcji.

### 6.5. Czego nie robić

- Żadnych nowych kolorów poza zmiennymi z `src/generated/tokens.css` / `styles.css` (R4).
- Żadnych animacji ciągłych, karuzel ani autoodtwarzania.
- Nie zmieniaj układu Chmury ani siatki, nie dodawaj osobnego oznaczenia „przewaga” na każdym
  chipie w mapie — podświetlenie na żądanie wystarcza.
- Nie wstawiaj ścieżek plików ani nazw źródeł do interfejsu (R5).

## 7. Dokumentacja

W `wytyczne_interaktywna_mapa_funkcjonalnosci.md`:

- 5.1: widoki są cztery w kolejności Przewagi, Chmura, Etapy pracy (+ spacer po etapach).
  Opisz widok Przewagi krótko, zgodnie z 6.1–6.3 tego briefu.
- 5.1.3 „Matryca przewag”: zastąp opisem widoku Przewagi; tabela z rozdz. 8 zostaje
  materiałem dla komitetu inwestycyjnego, nie osobnym widokiem.
- Rozdz. 8: dodaj na początku „8.0 Pięć przewag” — tabelę rank · tytuł · teza · dowody (liczba)
  · zastępuje, zgodną z danymi.
- 6.1 i 6.5: opisz `advantages[]`, `alsoStrong[]`, `advantageId` i nowe reguły walidacji.

## 8. Definicja ukończenia

- [ ] `npm run build` przechodzi (tokeny → dane → walidacja → typy → vite).
- [ ] Widok Przewagi otwiera się bez parametrów, PL i EN, oba motywy (Papier, Grafit).
- [ ] Zrzuty 1440 × 900 PL i EN: widok Przewagi bez przewijania, żadna etykieta ucięta.
      Playwright nie ma pobranej przeglądarki — uruchom z
      `chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" })`
      albo najpierw `npx playwright install chromium`. Obejrzyj zrzuty, nie tylko wynik
      pomiaru.
- [ ] „Pokaż na mapie” działa w obu widokach mapy, ← → przechodzą przez 5 przewag,
      Esc czyści, `?adv=` odtwarza stan po przeładowaniu.
- [ ] Walidacja łapie przypadek testowy: tymczasowo ustaw jeden dowód na `beta` i sprawdź,
      że `npm run validate` kończy się błędem; potem przywróć.
- [ ] Legenda pokazuje liczby statusów z danych.
- [ ] Wytyczne zaktualizowane zgodnie z rozdz. 7.
- [ ] Podsumowanie dla właściciela: co zmieniono, zrzuty, konflikt z regułą R6 (chmura),
      rzeczy niezrobione. Bez commitu.
