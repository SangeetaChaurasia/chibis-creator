# ChibiRealm (ChibiVerse)

An interactive, collectible anime chibi character showcase, sticker vault, and AI creation lab built with React, TypeScript, Tailwind CSS, Express, and Google Gemini API.

Explore official chibi cards from 10 iconic anime universes, preview emotional expression shifts, listen to voice catchphrases, customize die-cut stickers, and generate brand-new chibis or character fusions.

---

## ✨ Features

- **Interactive Anime Sub-Menu & Live Search**:
  - Secondary category bar with instant franchise search and quick clear (`X`).
  - 10 registered anime series with live collectible item counts:
    - *Frieren: Beyond Journey's End* (28)
    - *Spy x Family* (34)
    - *Jujutsu Kaisen* (42)
    - *Demon Slayer: Kimetsu no Yaiba* (48)
    - *Bocchi the Rock!* (18)
    - *Chainsaw Man* (26)
    - *Oshi no Ko* (22)
    - *One Piece* (65)
    - *My Hero Academia* (38)
    - *Attack on Titan* (30)
- **Collectible Chibi Cards**:
  - High-fidelity chibi artwork for featured anime icons: Anya Forger, Frieren, Gojo Satoru, Nezuko Kamado, Hitori "Bocchi" Gotoh, Denji & Pochita, Ai Hoshino, Monkey D. Luffy, Levi Ackerman, and Izuku "Deku" Midoriya.
  - Metallic Rarity Tiers: **5-Star UR** (Gold Foil) and **4-Star SSR** (Radiant Lavender).
  - Serial collector codes (`#CR-001` through `#CR-010`), elemental affinities, and personality tags.
  - Real-time like counts with heart burst animations and persistent `localStorage` storage.
- **Audio Catchphrase & Sound Bite Engine**:
  - Web Audio API synthesizer for character-themed audio chords (chimes, spark waves, power pulses).
  - Speech synthesis vocalizing authentic Japanese and English catchphrases with custom pitch profiles.
- **Interactive Multi-Mood Expression Vault**:
  - 6 distinct facial and emotional expressions per character (e.g. Classic Smug, Waku Waku, Panic Glitch, Battle Mode, Derp/Sleepy, Victory).
  - Quotes and contextual voice lines for each mood.
- **AI Chibi Generator & Fusion Lab**:
  - **Single Variant Mode**: Select any character to evolve them into a themed variant (Cyberpunk, Royal Knight, Maid Cafe, Astronaut, Dark Sorcerer, Summer Yukata, Winter Fluff, Steampunk, or custom prompt).
  - **Fusion Mode (2-in-1)**: Combine two anime characters into a hybrid chibi with merged powers, dual styling, and custom lore.
  - Generates custom titles, Japanese names, catchphrases, and four distinct mood expressions using **Gemini 3.8 Flash**.
  - Automatically synthesizes composite canvas artwork with thematic accessories, auras, and companion mascot pets.
  - One-click **"Add to My Collection & Vault"** to persist new chibis across the entire app.
- **Lossless PNG Die-Cut Sticker Export**:
  - In-browser HTML5 Canvas sticker engine generating high-resolution transparent PNG stickers with crisp white die-cut borders, holographic foil ribbons, and collectible nameplates.
- **Sticker Studio**:
  - Interactive preview studio to customize border thickness (4px–24px), toggle holographic badges, and adjust nameplate labels.
- **Random Gacha Summon**:
  - Animated magic summoning circle with particle rings and fanfare audio revealing a random character drop.
- **Flexible View Toggles**:
  - **Grid View**: Rich collectible cards with detailed stats and quick actions.
  - **Compact View**: High-density sticker grid.
  - **Card Deck 3D Showcase**: Interactive carousel showcase with 3D tilt effects and mini-thumbnail navigation.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4, Custom Obsidian Glass aesthetic (`#0B0F19` backdrop, `#131A2A` glass panels)
- **Typography**: Google Fonts (*Outfit* for titles/numbers, *Plus Jakarta Sans* for body/metadata)
- **Backend**: Node.js, Express 4, `tsx`
- **AI Integration**: `@google/genai` (Google Gen AI SDK with `gemini-3.8-flash`)
- **Icons**: Lucide React
- **Audio**: Web Audio API + Web SpeechSynthesis API
- **Graphics/Export**: HTML5 Canvas 2D Context

---

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

- **Node.js**: Version `18.0.0` or higher (Node `20.x` or `22.x` recommended)
- **Package Manager**: `npm` (comes with Node.js), `yarn`, `pnpm`, or `bun`
- **(Optional) Google Gemini API Key**: Needed if you wish to use server-side AI prompt generation for the Chibi Generator (fallback generation is built-in if no key is provided). Obtain a key from [Google AI Studio](https://aistudio.google.com/).

---

## 🚀 Installation & Setup

### 1. Clone or Download the Repository

```bash
git clone <repository-url>
cd chibirealm
```

### 2. Install Dependencies

Install all dependencies listed in `package.json`:

```bash
npm install
```

*(Or use `pnpm install` / `yarn install` / `bun install` if preferred).*

### 3. Environment Configuration

Copy the example environment configuration to create your local `.env` file:

```bash
cp .env.example .env
```

Open `.env` in your code editor and configure your variables:

```env
# Optional: Required for live Gemini AI generation in the Chibi Lab
GEMINI_API_KEY="your_actual_gemini_api_key_here"

# Application host URL (defaults to http://localhost:3000)
APP_URL="http://localhost:3000"

# Optional server port (defaults to 3000)
PORT=3000
```

> **Note**: If `GEMINI_API_KEY` is omitted, the application runs normally and utilizes high-fidelity client-side algorithmic generation and visual synthesis for newly created chibis.

---

## 🖥️ Running the Application

### Development Mode

Start the integrated Express backend and Vite development server:

```bash
npm run dev
```

Once the server starts, open your browser and navigate to:
```
http://localhost:3000
```

### Type Checking & Linting

Verify that there are no TypeScript compile or linting errors:

```bash
npm run lint
```

### Production Build

To build the client application for production:

```bash
npm run build
```

This compiles static assets into the `/dist` directory.

### Running in Production

To run the production Express server serving the compiled `/dist` bundle:

```bash
npm start
```

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── index.html                # HTML entry point with fonts & metadata
├── metadata.json             # AI Studio applet metadata & capabilities
├── package.json              # Project scripts & dependencies
├── server.ts                 # Express backend API & Vite middleware entry point
├── tsconfig.json             # TypeScript compiler configuration
├── vite.config.ts            # Vite & Tailwind plugin setup
├── public/                   # Public static assets
└── src/
    ├── main.tsx              # React DOM entry point
    ├── App.tsx               # Root application layout & state orchestration
    ├── index.css             # Tailwind v4 imports, obsidian glass styles, & keyframes
    ├── types.ts              # TypeScript interfaces (ChibiCharacter, AnimeSeries, etc.)
    ├── data/
    │   └── animeData.ts      # 10 anime series inventories & character rosters
    ├── components/
    │   ├── Navbar.tsx             # Sticky top navigation adhering to Top Bar Contract
    │   ├── AnimeSubMenu.tsx       # Secondary anime category bar with search & 10 pills
    │   ├── FilterToolbar.tsx      # Character search, rarity tabs, tags, sort, & view toggles
    │   ├── ChibiCard.tsx          # Collectible card with sound bite player & quick actions
    │   ├── CardDeckShowcase.tsx   # 3D interactive carousel showcase view
    │   ├── ExpressionModal.tsx    # Multi-mood character expression vault & voice player
    │   ├── GachaModal.tsx         # Animated gacha summon circle & drop reveal
    │   ├── StickerStudioModal.tsx # Custom die-cut border & PNG sticker exporter
    │   ├── SeriesVaultView.tsx    # Anime franchise directory view
    │   └── ChibiGeneratorSection.tsx # AI Chibi Creation & 2-in-1 Fusion Lab
    ├── utils/
    │   ├── audio.ts               # Web Audio API chime synthesizer & speech synthesis
    │   ├── stickerGenerator.ts    # High-DPI canvas die-cut PNG sticker engine
    │   └── chibiVisualSynthesizer.ts # Composite artwork synthesis for new chibis
    └── assets/
        └── images/           # High-resolution chibi artwork assets
```

---

## 🔌 API Endpoints

### `POST /api/generate-chibi`
Generates creative anime chibi attributes, catchphrase, Japanese naming, and 4 mood expressions based on a base character or character fusion.

**Request Body (`application/json`):**
```json
{
  "baseCharacterName": "Anya Forger",
  "baseSeriesName": "Spy x Family",
  "fusionCharacterName": "Gojo Satoru",
  "theme": "Cyberpunk Neon Hacker",
  "mood": "Ultra Smug (Heh)",
  "element": "Cosmic",
  "companion": "Mini Chimera",
  "customPrompt": "Optional custom user request"
}
```

**Response (`application/json`):**
```json
{
  "success": true,
  "data": {
    "name": "Cyber-Anya [Eden Protocol]",
    "japaneseName": "アーニャ (電脳特製)",
    "rarity": "5-Star UR",
    "catchphrase": "Target locked! Peanuts downloaded at lightspeed!",
    "catchphraseAudioText": "Waku waku! Cyber peanuts daisuki!",
    "personalityTags": ["Cyberpunk", "Cosmic", "Telepath", "Limited Drop"],
    "lore": "Equipped with experimental Eden Academy cyber-optics...",
    "height": "12 cm (Chibi scale)",
    "favoriteItem": "Holographic Peanut & Chimera Drone",
    "expressions": [
      {
        "id": "expr-1",
        "name": "Ultra Smug (Heh)",
        "emoji": "😏",
        "dialogue": "Heh! My cyber-visor calculated your plan 5 seconds ago!",
        "moodColor": "#06b6d4",
        "description": "Smug cybernetic smile"
      }
    ]
  }
}
```

---

## 🎨 Design System Tokens

The application follows the **ChibiVerse Obsidian Glass** design system:
- **Canvas Backdrop**: Deep Midnight Slate (`#0B0F19`)
- **Glass Surfaces**: Obsidian Glass (`#131A2A`) with `backdrop-filter: blur(16px)`
- **Primary Accent**: Vibrant Lavender (`#8B5CF6`)
- **Secondary Accent**: Electric Cyan (`#06B6D4`)
- **Highlight Accent**: Coral Pop (`#F43F5E`) & Sunny Gold (`#FBBF24`)
- **Rims & Strokes**: 15%–30% alpha neon borders for subtle anime rim-lighting

---

## 📄 License

Apache-2.0 License. See the header notices in individual source files for copyright details.
