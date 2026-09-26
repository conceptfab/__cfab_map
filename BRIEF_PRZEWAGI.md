# Przewagi ekosystemu CFAB 4D Hub + TIMEFLOW

Aktualizacja 2026-09-26 według korekty właściciela produktu. Ten brief zastępuje wcześniejszy ranking pojedynczych funkcji i porównania „Zastępuje”.

## Cel

Widok przedstawia korzyści całego ekosystemu: od zasobów i produkcji 3D po organizację pracy i rentowność projektów. Konkretne funkcje są uzasadnieniem przewag, a nie ich zamiennikiem.

- Pierwsza korzyść dotyczy całego procesu. Koszt renderu nie jest główną tezą ekosystemu.
- Czas maszyny służy wewnętrznej analizie kosztów i rentowności. Może być uwzględniony w wycenie w uzasadnionych przypadkach; nie oznacza automatycznego pokazywania klientowi kosztów produkcji.
- Bez przekreśleń, list „Zastępuje”, deklaracji zastępowania licencji DCC i nieudokumentowanych obietnic procentowego zwrotu.
- Bez twierdzeń „nikt tego nie ma” i bez obietnic, że wszystkie operacje są bezobsługowe.
- PL i EN mają ten sam sens i kolejność.

## Przewagi i funkcje, które je umożliwiają

### 1. Cały proces pracy 3D w jednym ekosystemie — `workflow`

**PL:** CFAB 4D Hub łączy bibliotekę zasobów, sceny, programy 3D, renderowanie i analizę wyników. TIMEFLOW dopełnia ten proces projektami, czasem pracy i finansami. Informacje o plikach i renderach przechodzą między aplikacjami i trafiają do właściwego projektu.

**EN — One ecosystem for the entire 3D workflow:** CFAB 4D Hub connects asset libraries, scenes, 3D applications, rendering and result review. TIMEFLOW completes the workflow with projects, work time and finances. File and render information moves between the applications and is linked to the right project.

**Jak to działa razem:** Wspólne połączenia z programami 3D, ścieżki projektów i wymiana danych łączą pracę twórczą z jej organizacją. Każda aplikacja ma własny zakres, a razem obejmują kolejne etapy realizacji projektu.

**How it works together:** Shared DCC connections, project paths and data exchange connect creative work with project organisation. Each application has its own role; together they cover successive stages of a project.

**Powiązane funkcje (12):** `hub.browser.multi_tb`, `hub.browser.asset_format`, `hub.bridges.c4d`, `hub.bridges.blender`, `hub.bridges.max`, `hub.bridges.modo`, `hub.render.queue`, `hub.results.exruster`, `syn.dcc_activity`, `syn.presence`, `tf.projects.projects`, `tf.projects.merge`.

### 2. Mniej ręcznej pracy między etapami — `automation`

**PL:** Wyszukanie i przygotowanie zasobu, inspekcja sceny, transfer modelu z materiałami, naprawa ścieżek oraz przypisanie czasu pracy do projektu składają się na jeden obieg pracy. Automatyzacja obejmuje zarówno pliki produkcyjne, jak i organizację pracy.

**EN — Less manual work between stages:** Finding and preparing assets, inspecting scenes, transferring models with materials, repairing paths and assigning work time to projects form one workflow. Automation covers both production files and work organisation.

**Jak to działa razem:** Hub rozumie zasoby i strukturę scen, a TIMEFLOW korzysta z informacji o plikach i aktywności. Odczyt scen .c4d i .max bez uruchamiania programów, mosty DCC oraz lokalne przypisywanie sesji ograniczają powtarzalną obsługę danych.

**How it works together:** Hub understands assets and scene structure; TIMEFLOW uses file and activity context. Reading .c4d and .max scenes without launching the applications, DCC bridges and local session assignment reduce repetitive data handling.

**Powiązane funkcje (14):** `hub.browser.pairing`, `hub.browser.jit`, `hub.scenes.c4d_parser`, `hub.scenes.max_reader`, `hub.scenes.max_import`, `hub.scenes.max_space`, `hub.scenes.export`, `hub.bridges.blender_mats`, `hub.assets.relink`, `hub.assets.textures`, `tf.daemon.events`, `tf.ai.layer_paths`, `tf.ai.facts_first`, `tf.ai.auto_safe`.

### 3. Kontrola od przygotowania sceny do odbioru pracy — `production`

**PL:** Audyt zasobów i kontrola przed renderem pomagają wykryć problemy wcześniej. Kolejka, farma LAN, monitoring i wznowienie po awarii wspierają realizację. Przegląd wyników, wykrywanie brakujących klatek oraz raporty pozwalają sprawdzić i podsumować wykonaną pracę.

**EN — Control from scene preparation to delivery:** Asset audits and render prechecks help catch problems early. The queue, LAN farm, monitoring and crash recovery support production. Result review, missing-frame detection and reports help verify and summarise completed work.

**Jak to działa razem:** Przygotowanie sceny, wykonanie renderu, kontrola plików wynikowych i dokumentacja projektu są dostępne w jednym ekosystemie. Brakujące klatki mogą wrócić do kolejki, a historia renderów i sesji zachowuje przebieg pracy.

**How it works together:** Scene preparation, render execution, output validation and project documentation are available within one ecosystem. Missing frames can return to the queue, while render and session histories preserve the work record.

**Powiązane funkcje (15):** `hub.assets.audit`, `hub.render.precheck`, `hub.render.recovery`, `hub.render.watchdog`, `hub.render.lan_farm`, `hub.render.eta_log`, `hub.render.web_panel`, `hub.render.ntfy`, `hub.render.mail`, `hub.render.history`, `hub.results.passes`, `hub.results.sequences`, `tf.sessions.timeline`, `tf.reports.pdf`, `tf.reports.templates`.

### 4. Dane i automatyzacja pod własną kontrolą — `local_first`

**PL:** Biblioteki, dane projektów i modele przypisujące czas pracy działają lokalnie. Ekosystem oferuje lokalne wyszukiwanie wizualne, synchronizację w LAN, opcjonalną szyfrowaną synchronizację online i dwa serwery MCP do integracji z agentami AI.

**EN — Keep control of data and automation:** Libraries, project data and work-time assignment models run locally. The ecosystem provides local visual search, LAN sync, optional encrypted online sync and two MCP servers for integration with AI agents.

**Jak to działa razem:** Hub i TIMEFLOW mają własne lokalne bazy i mogą działać samodzielnie. Wymiana danych, kopie zapasowe i cofanie zmian wspierają kontrolę nad pracą, a szyfrowana synchronizacja pozwala przenosić dane między komputerami.

**How it works together:** Hub and TIMEFLOW maintain their own local databases and can run independently. Data exchange, backups and undo support control over work; encrypted sync carries data between computers.

**Powiązane funkcje (10):** `hub.core.mcp`, `tf.mcp_arch`, `tf.mcp_tools`, `tf.mcp_backup`, `hub.browser.visual_search`, `tf.ai.ai_screen`, `tf.data.lan_sync`, `tf.data.cloud_sync`, `syn.beacons`, `hub.assets.undo`.

### 5. Wiesz, ile kosztuje praca i które projekty zarabiają — `render_cost`

**PL:** TIMEFLOW zestawia czas pracy i koszty dodatkowe, a Hub dostarcza czas renderowania. Rozdzielenie pracy artysty od pracy maszyny pozwala ocenić faktyczne koszty i rentowność projektu oraz lepiej planować kolejne zlecenia.

**EN — Know what work costs and which projects pay off:** TIMEFLOW brings together work time and extra costs; Hub supplies render time. Separating the artist’s work from machine time helps assess actual project costs and profitability and plan future projects.

**Jak to działa razem:** To wiedza dla artysty lub studia o własnej działalności. Czas maszyny trafia do analizy kosztów projektu. Uwzględnienie kosztu renderu w wycenie jest osobną, opcjonalną decyzją, uzasadnioną sposobem rozliczenia zlecenia.

**How it works together:** This gives artists and studios insight into their own business. Machine time contributes to project cost analysis. Including render cost in an estimate is a separate, optional decision based on how a job is priced.

**Powiązane funkcje (15):** `syn.machine_time`, `hub.render.ledger`, `hub.render.ledger_always`, `syn.ledger`, `tf.renders.ingest`, `tf.renders.assign`, `tf.renders.cost`, `syn.cfabx`, `tf.renders.offline`, `tf.renders.render_sync`, `tf.sessions.no_double`, `tf.sessions.split`, `tf.estimates.costs`, `tf.estimates.estimates`, `tf.reports.profitability`.

## Prezentacja

- Nagłówek: „Co daje cały ekosystem” / „What the ecosystem delivers”.
- Wiersze w powyższej kolejności; pierwszy rozwinięty. Jeden wiersz rozwinięty naraz.
- Tytuł mówi o korzyści. Opis wyjaśnia wspólne działanie, a „Jak to działa razem” pokazuje jego podstawę.
- Powiązane funkcje są klikalne, pogrupowane na Hub / Połączenie / TIMEFLOW. „Pokaż na mapie” prowadzi do istniejącej mapy i podświetla właściwe węzły.
- Bez schematu sprowadzającego cały ekosystem do „render → wycena → PDF”.
- Skróty „Narzędzia w ekosystemie” obejmują nowy Shader Browser: `hub.bridges.c4d_shader_browser`, `hub.bridges.c4d_shader_layers`, `hub.bridges.c4d_bitmap_conversion`, `hub.bridges.c4d_color_correct`, `hub.bridges.c4d_material_names`, `hub.bridges.c4d_texture_metadata`.
- Domyślny widok strony i mechanika mapy pozostają zgodne z obecną implementacją. Bezpośredni link do przewag: `?view=advantages`.

## Dane i weryfikacja

Źródłem jest `data/source.mjs`. Generator buduje wewnętrzny i publiczny JSON. Każda przewaga ma co najmniej pięć istniejących funkcji produkcyjnych; dowody nie powtarzają się między przewagami. Liczby pochodzą z danych.

Walidacja, build i kontrola przeglądarkowa obejmują PL/EN, komputer i telefon, rozwijanie przewag, otwieranie funkcji oraz przejście na mapę. React Doctor służy kontroli zmian w komponentach.
