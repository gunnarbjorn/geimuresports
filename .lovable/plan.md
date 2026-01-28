

# Geimur – Rafíþróttafélag Website

A premium, dark "space esports" website for the Icelandic esports club Geimur, featuring training signups and Fortnite tournament registration with email notifications.

---

## Visual Design

**Theme:** Dark space aesthetic with subtle starfield background, grid overlay, and soft radial glows. The Geimur logo (red planet with rings) will be prominently featured in the navbar and hero section.

**Color Palette:**
- Deep navy/black backgrounds (#05070D, #070B14)
- Charcoal cards with subtle borders (#0E121B, #1B2232)
- Geimur red primary accent (#D83A2E)
- Off-white and muted gray text

**Components:** Large rounded corners, soft shadows, hover glow effects, modern clean typography.

---

## Pages & Features

### 1. Forsíða (Home) – /
- **Hero section** with Geimur logo, title, subtitle, and two CTAs (training signup + tournaments)
- **3 stat cards** showing training frequency, tournaments, and community values
- **"Hvað færðu út úr Geimi?"** – 4 benefit cards with icons
- **"Næstu viðburðir"** – Event cards for upcoming tournaments and training
- **"Æfingapakkar"** – Pricing-style cards for beginner/advanced packages
- **FAQ accordion** – Common questions for parents and players
- **Footer** with links, social, and contact info

### 2. Æfingar (Training) – /aefingar
- Hero with training overview
- Weekly schedule component (placeholder slots)
- "How a session works" step list
- **Training signup form** with name, age, email, phone, group selection, message
- Email notification sent upon submission

### 3. Mót (Tournaments) – /mot
- Hero for Fortnite tournaments
- Tournament grid with cards showing dates, formats, deadlines
- "How registration works" steps
- **Tournament registration form** with Epic username, tournament selection, team mode
- Email notification sent upon submission

### 4. Skráning (Registration Hub) – /skraning
- Two-card layout for choosing training vs tournament signup
- Both forms available as collapsible accordions

### 5. Um Geimur (About) – /um
- Club story and mission
- 3 value cards: Fagmennska, Liðsandi, Heilbrigðar venjur
- Team section with placeholder coach cards
- CTA to join

### 6. Hafðu samband (Contact) – /hafa-samband
- Contact form: name, email, subject, message
- Facebook link and contact information
- Email notification for inquiries

---

## Technical Implementation

- **Lovable Cloud** for backend functionality
- **Edge function** to handle form submissions and send email notifications via Resend
- **React Router** for multi-page navigation
- **Responsive design** with mobile hamburger menu
- **Theme variables** for easy color customization
- **Placeholder data** structured for easy updates

---

## Forms & Email Notifications

All forms will:
- Validate input on the frontend
- Show success/error feedback
- Trigger email notifications to the club inbox

*Note: You'll need to set up a Resend API key for email sending.*

