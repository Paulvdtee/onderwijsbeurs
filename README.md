# 🌱 Aeres Hogeschool Swipe-Quiz: "Wat past bij jou?"

Een interactieve swipe-quiz speciaal ontwikkeld voor de Onderwijsbeurs, waarmee bezoekers binnen 1,5 minuut ontdekken welke opleidingen van Aeres Hogeschool bij hun interesses passen.

## ✨ Features

- **Touch-vriendelijk**: Optimaal voor touchscreens en tablets op beurzen
- **Snelle interactie**: 6 eenvoudige swipe-vragen, volledig binnen 1,5 minuut
- **Nederlandse interface**: Volledig in het Nederlands voor de doelgroep
- **Responsief design**: Werkt op alle schermformaten
- **Swipe-functionaliteit**: Veeg links voor "Nee", rechts voor "Ja" (zoals Tinder)
- **Touch buttons**: Alternatieve knoppen voor gebruiksgemak
- **Persoonlijke resultaten**: Op maat gemaakte opleidingsadviezen
- **E-mail conversie**: Verzamelt contactgegevens voor follow-up
- **Progress indicator**: Visuele voortgangsbalk
- **Aeres branding**: Officiële kleuren en stijl

## 🎯 Doelgroep

- **Leeftijd**: 16-20 jaar
- **Opleidingsniveau**: havo-5 en mbo-4
- **Gebruik**: Beurskiosks, tablets, touchscreens
- **Context**: Lawaaiige beursomgeving met vluchtige aandacht

## 📱 Quiz Flow

1. **Intro** (5 sec): Welkomstscherm met startknop
2. **6 Swipe-vragen**: Associatieve vragen over interesses
3. **Persoonlijke resultaten**: 1-3 passende opleidingen
4. **E-mail capture**: Contactgegevens voor goodie + nieuwsbrief
5. **Bedankscherm**: Bevestiging met optie om opnieuw te beginnen

## 🚀 Installatie & Gebruik

### Lokaal gebruik
1. Download alle bestanden naar een map
2. Open `index.html` in een webbrowser
3. De quiz is direct klaar voor gebruik!

### Voor beurs/productie gebruik
1. Upload bestanden naar een webserver
2. Zorg dat de website via HTTPS bereikbaar is
3. Test de touch-functionaliteit op het doeltoestel

### Vereisten
- Moderne webbrowser (Chrome, Safari, Firefox, Edge)
- JavaScript enabled
- Voor optimale ervaring: touchscreen ondersteuning

## 🎨 Aanpassingen

### Vragen aanpassen
Bewerk in `script.js` het `questions` array:
```javascript
const questions = [
    {
        id: 1,
        text: "Jouw vraag hier",
        category: "jouw_categorie"
    }
    // ...meer vragen
];
```

### Opleidingen aanpassen
Bewerk in `script.js` het `programs` object:
```javascript
const programs = {
    jouw_categorie: {
        emoji: "🎓",
        name: "Opleiding Naam",
        location: "Stad",
        description: "Korte beschrijving"
    }
    // ...meer opleidingen
};
```

### Styling aanpassen
- Hoofdkleuren: Bewerk CSS variabelen in `styles.css`
- Logo: Vervang de emoji in de HTML door een afbeelding
- Lettertypen: Pas de font-family aan in de CSS

## 📊 Data Verzameling

De quiz verzamelt:
- **Voornaam** en **e-mailadres**
- **Nieuwsbrief toestemming** (opt-in checkbox)
- **Quiz antwoorden** (voor analyse)
- **Timestamp** van voltooiing

Data wordt lokaal opgeslagen in `localStorage`. Voor productie gebruik:
- Koppel aan je CRM (Mailchimp, Spotler, etc.)
- Voeg server-side verwerking toe
- Implementeer privacy-compliance (GDPR)

## 🔧 Technische Details

- **Frontend**: Vanilla HTML5, CSS3, JavaScript ES6+
- **Responsive**: Mobile-first design
- **Touch Events**: Ondersteuning voor swipe-gebaren
- **Browser ondersteuning**: Alle moderne browsers
- **Performance**: Lightweight, snelle laadtijd
- **Offline**: Werkt zonder internetverbinding na eerste load

## 📱 Beurs Setup Tips

1. **Schermgrootte**: Test op tablet/touchscreen van 10-15 inch
2. **Hoogte**: Plaats scherm op ooghoogte van doelgroep
3. **Bewegingsruimte**: Zorg voor voldoende ruimte rond het toestel
4. **Backup**: Houd een tweede toestel gereed
5. **Wifi**: Zorg voor stabiele internetverbinding voor e-mail verzending

## 🎯 Conversie Optimalisatie

- **Korte quiz**: Maximaal 1,5 minuut voor volledige flow
- **Duidelijke CTA**: "Krijg mijn studiekeuzetips" in plaats van "Verstuur"
- **Incentive**: Goodiebag verloting als motivatie
- **Personalisatie**: Resultaten op maat verhogen engagement
- **Mobile UX**: Grote knoppen, duidelijke visuele feedback

## 🐛 Troubleshooting

**Quiz laadt niet**: Controleer of JavaScript enabled is
**Touch werkt niet**: Test in een andere browser
**E-mail verzending**: Implementeer server-side handling voor productie
**Styling problemen**: Cache legen en pagina verversen

## 📈 Analytics & Tracking

Voor uitgebreide analytics kun je toevoegen:
- Google Analytics events
- Conversion tracking
- A/B testing voor verschillende versies
- Heatmap tracking (Hotjar, Crazy Egg)

## 📞 Support

Voor vragen over implementatie of aanpassingen, neem contact op met het ontwikkelteam.

---

**Ontwikkeld voor Aeres Hogeschool** 🌱
*Versie 1.0 - Optimaal voor Onderwijsbeurs gebruik* 