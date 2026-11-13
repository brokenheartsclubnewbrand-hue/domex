# DOMEX

Lekka, polskojęzyczna strona typu one page dla firmy remontowo-wykończeniowej z Pułtuska. HTML, CSS i JavaScript, bez kompilacji, zależności instalacyjnych, serwera aplikacyjnego ani bazy danych.

## Podgląd lokalny

W katalogu repozytorium uruchom:

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Otwórz port 3000 w podglądzie swojego środowiska. Lokalne serwowanie plików nie obsługuje Netlify Forms; wysłanie formularza lokalnie powinno zakończyć się komunikatem o błędzie, a nie pozornym sukcesem.

## Publikacja na Netlify

1. Zapisz i prześlij pliki projektu do repozytorium `brokenheartsclubnewbrand-hue/domex` na GitHubie.
2. W Netlify wybierz **Add new project → Import an existing project → GitHub**, a następnie repozytorium i gałąź z kodem.
3. Projekt nie potrzebuje komendy budowania. Katalog publikacji: `.` (konfiguracja jest już w `netlify.toml`).
4. W ustawieniach **Forms** włącz wykrywanie formularzy, jeżeli nie jest aktywne, i ponownie wdroż stronę. Po wdrożeniu sprawdź, czy pojawił się formularz `wycena`.
5. W **Forms → Form notifications** dodaj powiadomienia e-mail na rzeczywisty adres właściciela. Adres odbiorcy jest ustawieniem Netlify, nie polem formularza ani sekretem w kodzie.
6. Wyślij rzeczywiste zgłoszenie testowe na wdrożonej stronie. Sprawdź zapis w Forms, folder spamu i odbiór powiadomienia. Tego testu nie zastępują testy lokalne ani symulowana odpowiedź HTTP.
7. Opcjonalnie podłącz domenę w Netlify, skonfiguruj DNS i HTTPS. Po poznaniu domeny dodaj docelowy `canonical`, pełny URL grafiki Open Graph oraz sitemapę z prawdziwym adresem. Strona nie blokuje indeksowania.

Alternatywa: prześlij zawartość katalogu bez `.git` przez Netlify Drop. Integracja z GitHubem ułatwia późniejsze automatyczne wdrożenia.

## Dane do uzupełnienia przed publiczną premierą

Nie ma wymyślonego telefonu, e-maila, profilu Facebook ani dokumentów prawnych. Przyciski dla brakujących danych są ukryte.

W `company.js` można podać potwierdzone: `phone` (najlepiej z +48), `email`, `facebook` (pełny HTTPS URL) i `privacyUrl` (adres dokumentu dostarczonego przez właściciela). Linki kontaktowe i do polityki pokażą się automatycznie; zmiana kodu HTML nie jest potrzebna do ich dodania. Nie wpisuj tam kluczy API ani haseł.

Do uruchomienia zbierania prawdziwych zgłoszeń właściciel powinien dostarczyć pełne dane identyfikacyjne usługodawcy oraz informację o przetwarzaniu danych, w tym dane administratora, podstawę i okres przetwarzania, odbiorców i prawa osoby. Krótki tekst przy formularzu nie zastępuje pełnego obowiązku informacyjnego. Dodaj dostarczony dokument jako plik strony lub użyj jego adresu w `privacyUrl`. Nie wygenerowano fikcyjnej polityki prawnej. Właściciel powinien również skonfigurować e-mail odbiorcy w panelu Netlify.

## Formularz

- Formularz `wycena` znajduje się bezpośrednio w HTML i zawiera `data-netlify="true"`, pole `form-name` oraz honeypot `company-website`.
- Imię, usługa, miejscowość i opis (minimum 10 znaków) są wymagane. Telefon lub e-mail: co najmniej jeden; podany e-mail i telefon podlegają walidacji.
- JavaScript wysyła URL-encoded POST do `/`. Sukces pojawia się po odpowiedzi HTTP 2xx. Przy błędzie lub przekroczeniu 20 sekund formularz zachowuje dane, odblokowuje przycisk i pozwala ponowić próbę.
- Bez JavaScript formularz zachowuje natywną wysyłkę Netlify i stronę `dziekujemy.html`; walidacja „telefon lub e-mail” wymaga JavaScript. Netlify nie jest serwerem walidującym reguły biznesowe, dlatego administrator powinien traktować otrzymane dane jako niezaufane.
- Nie ma lokalnego fałszywego API ani wpisywania wiadomości do localStorage.

## Zdjęcia i identyfikacja

Fotografie zostały wygenerowane jako materiały poglądowe i nie są realizacjami DOMEX. Oznaczenie jest widoczne w galerii i powiększeniu. Zdjęcia mają lokalny format WebP. Własne zdjęcia można podstawić w `assets/`, zmieniając opisy alternatywne i podpisy w `index.html`; dopiero wtedy należy zmienić komunikat o ich pochodzeniu.

Font Manrope jest przechowywany lokalnie; licencja SIL Open Font License znajduje się w `assets/FONT-LICENSE.txt`. Logotyp jest tekstem HTML z prostym znakiem domu SVG. Nie ma zewnętrznych skryptów śledzących, osadzonej mapy ani fontów pobieranych od zewnętrznego dostawcy.

## Sprawdzone lokalnie

Chromium / Playwright: widoki desktopowe i mobilne, brak przewijania poziomego, nawigacja i menu mobilne, galeria (powiększenie, następne zdjęcie i Escape), wybór usługi, walidacja, błąd wysyłania z zachowaniem wpisów oraz obsługa kontrolowanej odpowiedzi sukcesu. Odpowiedzi POST w teście sukcesu i błędu były symulowane. Faktyczny odbiór Netlify wymaga wdrożenia i testu według instrukcji powyżej.
