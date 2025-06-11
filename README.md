Game Concept
Een snelle, verslavende reflex-game waarin spelers 60 seconden hebben om zo veel mogelijk punten te scoren door alleen op groene vakjes te klikken in een 4x4 grid. Perfect voor studiezoekers van 16-20 jaar, met subtiele groene Aeres branding.
Basis Gameplay

Grid: 4x4 raster van vierkante knoppen (64x64px per knop)
Duur: 60 seconden countdown
Doel: Klik alleen op groene vakjes, negeer alle andere kleuren

Spelverloop
Start: Alle vakjes zijn grijs/neutraal
Activatie: Random vakjes lichten op in verschillende kleuren:

Groene vakjes = +10 punten (klik deze!)
Rode vakjes = -5 punten (niet klikken!)
Blauwe/gele vakjes = 0 punten (afleidingsmanoeuvre)

Timing:

Vakje blijft 1.5 seconden actief
Na klik of timeout wordt vakje weer grijs
Nieuwe vakjes lichten random op (1-3 tegelijk)
Snelheid verhoogt elke 10 seconden

Score Systeem

Groene vakje correct: +10 punten
Groene vakje gemist: -2 punten
Rode vakje geklikt: -5 punten
Combo multiplier: 3+ groene achter elkaar = 1.5x punten

Visuele Stijl

Kleuren: Natuurlijke groentinten (#4CAF50), zachte rood (#FF6B6B), sky blue (#74B9FF)
Animaties: Smooth fade-in/out van kleuren, subtle glow effect op actieve vakjes
Font: Modern, clean (bijv. Inter of Poppins)
Achtergrond: Subtiele gradient (lichtgroen naar wit)

Interface Layout
Hoofdscherm (Menu)
    Aeres Hogeschool 🌱
    
┌─ TOP 10 HIGHSCORES ─┐
│ 1. Lisa      - 450  │
│ 2. Mark      - 420  │
│ 3. Emma      - 390  │
│ 4. Tom       - 375  │
│ 5. Sophie    - 360  │
│ 6. Daan      - 340  │
│ 7. Mira      - 320  │
│ 8. Lars      - 300  │
│ 9. Noa       - 285  │
│10. Jesse     - 270  │
└─────────────────────┘

      [SPEEL NU!]
Tijdens Gameplay
[SCORE: 0]     [TIJD: 60]
┌─────────────────────┐
│ [□] [□] [□] [□]     │
│ [□] [□] [□] [□]     │  <- 4x4 Grid
│ [□] [□] [□] [□]     │
│ [□] [□] [□] [□]     │
└─────────────────────┘
Game Over Scherm
    GAME OVER!
    
  Jouw Score: 385
  
┌─── SCORE OPSLAAN ───┐
│ Voornaam:           │
│ [_______________]   │
│                     │
│ E-mailadres:        │
│ [_______________]   │
│                     │
│      [OPSLAAN]      │
└─────────────────────┘

   [SPEEL OPNIEUW]
Google Sheets Integratie
Sheet Structuur
Kolommen in Google Sheet:

A: Timestamp (automatisch)
B: Voornaam
C: E-mailadres
D: Score
E: IP/Browser info (optioneel voor analytics)

API Calls Benodigdheden
Voor ophalen highscores:

Google Sheets API GET request
Sorteer data op Score (kolom D) DESC
Return top 10: Voornaam + Score

Voor opslaan nieuwe score:

Google Sheets API POST request
Voeg toe: Timestamp, Voornaam, Email, Score

Implementatie Vereisten
javascript// Voorbeeld API configuratie die jij moet instellen:
const SHEET_ID = 'jouw-google-sheet-id';
const API_KEY = 'jouw-google-api-key';
const RANGE_READ = 'A:D';  // Lees alle data
const RANGE_WRITE = 'A:D'; // Schrijf nieuwe row

// Service Account of OAuth2 voor write-access
Profanity Filter Systeem
Verboden Woorden Lijst
javascriptconst BANNED_NAMES = [
  // Nederlandse scheldwoorden
  'kut', 'k0t', 'kut3', 'k_ut', 'kutt',
  'lul', 'l0l', 'lul3', 'l_ul', 'lull',
  'pik', 'p1k', 'pik3', 'p_ik', 'pikk',
  'kloot', 'klote', 'kl0te', 'kl_te',
  'hoer', 'h0er', 'ho3r', 'h_er', 'hoor',
  'teef', 'te3f', 't33f', 't_ef', 'teeff',
  'kanker', 'k4nker', 'kanc3r', 'k_nker', 'kankr',
  'tyfus', 'tyf0s', 'tyf_s', 't1fus',
  'tering', 'ter1ng', 't3ring', 't_ring',
  'godver', 'g0dver', 'godv3r', 'g_dver',
  
  // Engelse scheldwoorden
  'fuck', 'fuk', 'f0ck', 'f_ck', 'phuck',
  'shit', 'sh1t', 'sh_t', 'sht', 'sh17',
  'bitch', 'b1tch', 'b_tch', 'bytch',
  'damn', 'd4mn', 'd_mn', 'dam',
  'hell', 'h3ll', 'h_ll', 'hel',
  'crap', 'cr4p', 'cr_p', 'krap',
  'piss', 'p1ss', 'p_ss', 'pis',
  'ass', '4ss', '_ss', 'ars',
  'gay', 'g4y', 'g_y', 'gai',
  'homo', 'h0mo', 'h_mo', 'hom0',
  'retard', 'ret4rd', 'ret_rd', 'rtard',
  'spast', 'sp4st', 'sp_st', 'spastic',
  
  // Ziektes/medisch misbruik
  'aids', '4ids', '_ids', 'aides',
  'hiv', 'h1v', 'h_v',
  'corona', 'c0rona', 'cor0na', 'c_rona',
  'covid', 'c0vid', 'cov1d', 'c_vid',
  'autisme', '4utisme', '_utisme', 'autism',
  'downie', 'd0wnie', 'd_wnie', 'down',
  'mongool', 'm0ngool', 'm_ngool', 'mongo',
  
  // Racistische termen
  'neger', 'n3ger', 'n_ger', 'negr',
  'nikker', 'n1kker', 'n_kker', 'nikr',
  'allochtoon', '4llochtoon', '_llochtoon',
  
  // Leet speak patronen
  'b00bs', 'b0obs', 'b_obs',
  'd1ck', 'd_ck', 'dik',
  'c0ck', 'c_ck', 'kok',
  'p0rn', 'p_rn', 'pr0n',
  's3x', 's_x', 'seks',
  
  // Website/spam woorden
  'www', 'http', 'https', '.com', '.nl',
  'spam', 'sp4m', 'sp_m',
  'bot', 'b0t', 'b_t',
  'hack', 'h4ck', 'h_ck', 'hax',
];
Filter Logica
javascriptfunction isNameAllowed(name) {
  const cleanName = name.toLowerCase()
    .replace(/[0-9]/g, (match) => {
      // Leet speak conversie
      const leetMap = {'0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't'};
      return leetMap[match] || match;
    })
    .replace(/[^a-z]/g, ''); // Verwijder speciale tekens
  
  // Check exacte matches
  if (BANNED_NAMES.includes(cleanName)) {
    return false;
  }
  
  // Check of banned woord in naam zit
  for (let banned of BANNED_NAMES) {
    if (cleanName.includes(banned)) {
      return false;
    }
  }
  
  // Check repetitieve karakters (spam)
  if (/(.)\1{3,}/.test(cleanName)) { // 4+ herhalingen
    return false;
  }
  
  return true;
}
Data Validatie

Voornaam: Minimaal 2 tekens, maximaal 15 tekens, alleen letters
Email: Basis email validatie (@ en . aanwezig)
Score: Moet numeriek zijn, tussen 0-1000
Spam preventie: Rate limiting (max 1 submission per 30 seconden per IP)

Validatie Flow
javascript// In het invoerformulier
function validateForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  
  // Naam validatie
  if (name.length < 2) {
    showError('Voornaam moet minimaal 2 letters zijn');
    return false;
  }
  
  if (name.length > 15) {
    showError('Voornaam mag maximaal 15 letters zijn');
    return false;
  }
  
  if (!/^[a-zA-ZÀ-ÿ\s-']+$/.test(name)) {
    showError('Voornaam mag alleen letters bevatten');
    return false;
  }
  
  if (!isNameAllowed(name)) {
    showError('Deze naam is niet toegestaan. Kies een andere voornaam.');
    return false;
  }
  
  // Email validatie
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('Voer een geldig e-mailadres in');
    return false;
  }
  
  return true;
}
Error Handling

API failure: Toon fallback bericht: "Scores worden binnenkort bijgewerkt"
Network error: "Controleer je internetverbinding"
Validation error: Specifieke foutmeldingen per veld
Profanity block: Generieke boodschap "Deze naam is niet toegestaan. Kies een andere voornaam."

Game States

Menu: Welkomstscherm met TOP 10 (geladen van Google Sheets)
Countdown: "3, 2, 1, GO!" animatie
Playing: Actieve gameplay 60 seconden
Game Over: Score + invoerformulier voor naam/email
Saving: Loading state tijdens API call
Success: Bevestiging + bijgewerkte highscore lijst

Lead Generation Integration

Na game: "Jouw reactiesnelheid is top! Net zoals onze groene opleidingen bij Aeres 🌱"
Highscore invoer: Vereist email voor opslag scores
CTA: "Ontdek meer over onze praktijkgerichte opleidingen"
Follow-up: Email data beschikbaar voor marketing campagnes

Privacy & GDPR

Consent: Checkbox "Ik ga akkoord met opslag van mijn gegevens voor de highscore lijst"
Purpose: "Voor highscore lijst en optionele Aeres informatie"
Retention: Vermeld hoelang data bewaard wordt
Opt-out: Mogelijkheid tot verwijdering gegevens

Technische Requirements

Platform: Web-based (HTML5/CSS/JavaScript)
Responsive: Werkt op desktop en mobiel
Performance: 60fps, geen lag bij snelle input
Storage: Google Sheets voor highscore persistentie
Analytics: Track clicks, accuracy, completion rate
Cross-browser: Chrome, Firefox, Safari, Edge support

Google Sheets Setup Benodigdheden
Voorbereiding:

Maak Google Sheet met kolommen: Timestamp, Voornaam, Email, Score
Enable Google Sheets API in Google Cloud Console
Maak Service Account of OAuth2 credentials
Deel sheet met Service Account email (edit rights)
Noteer Sheet ID en API credentials

Frontend Requirements:

Fetch API voor GET/POST requests
Error handling voor network failures
Loading states tijdens API calls
Form validatie voor naam/email
Real-time profanity filtering tijdens typen

User Experience Details

Loading states: Spinners tijdens API calls
Smooth animations: CSS transitions voor alle state changes
Mobile optimization: Touch-friendly buttons, responsive layout
Accessibility: Keyboard navigation, screen reader support
Performance: Lazy loading, optimized assets