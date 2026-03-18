# 🧠 Brain Games Hub

> A playful, animated, cartoon-style brain games website where you can train your brain with fun mini-games!

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-FF0055?style=for-the-badge&logo=framer&logoColor=white)

---

## ✨ Features

### 🎮 Mini Brain Games
| Game | Status | Description |
|------|--------|-------------|
| ⚡ Reaction Speed | ✅ Playable | Click as fast as you can when the screen turns green |
| 🧩 Memory Matrix | ✅ Playable | Remember the highlighted pattern and recreate it |
| ⌨️ Typing Speed | 🔒 Coming Soon | Type words as fast as you can |
| 🎨 Color Reflex | 🔒 Coming Soon | Stroop test — match the color, not the word |
| 🎯 Focus Tracker | 🔒 Coming Soon | Follow a moving target with your cursor |
| 🔮 Pattern Predict | 🔒 Coming Soon | Spot and predict the next pattern |

### 🎨 Cartoon 3D Style
- Flat-shaded, thick-bordered elements that look like cartoon stickers
- Bold, vibrant colors (yellow, red, blue, purple)
- Chunky **Bungee** font with text outlines
- Hard drop shadows (offset, not blurred)

### 🌌 Floating Objects
- SVG stars, circles, blobs, diamonds, and more floating across the screen
- Mouse-parallax effect — shapes move with your cursor
- Smooth anti-gravity drift animations

### 🎵 Audio System
- **Web Audio API** synthesized sounds — no audio files needed!
- Piano title — each letter plays a musical note on hover/click
- Button clicks produce satisfying pop sounds
- Ambient background tones
- Sound ON/OFF toggle

### 🎬 Animations
- Framer Motion spring physics throughout
- Bouncy hover effects on all interactive elements
- Smooth page scroll transitions
- Animated game scoring and level-ups

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** (App Router) | React framework with server components |
| **TypeScript** | Type-safe code |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Physics-based animations |
| **Web Audio API** | Runtime sound synthesis |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ installed
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Motion_website

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in your browser
open http://localhost:3000
```

That's it! 🎉

---

## 📂 Project Structure

```
src/
├── app/
│   ├── globals.css        # Design system (colors, borders, shadows)
│   ├── layout.tsx         # Root layout with Google Fonts
│   └── page.tsx           # Main page (all sections)
├── components/
│   ├── AudioProvider.tsx   # Global audio context
│   ├── Contact.tsx         # Contact section
│   ├── FloatingShapes.tsx  # Animated floating SVG elements
│   ├── GameCard.tsx        # Cartoon-styled game card
│   ├── GameModal.tsx       # Animated full-screen game overlay
│   ├── GamesSection.tsx    # Games grid with modals
│   ├── Hero.tsx            # Hero section with piano title
│   ├── HowItWorks.tsx      # How it works section
│   ├── Navbar.tsx          # Navigation with mobile menu
│   └── SoundToggle.tsx     # Mute/unmute button
├── games/
│   ├── ReactionSpeed.tsx   # ⚡ Reaction Speed game
│   └── MemoryMatrix.tsx    # 🧩 Memory Matrix game
└── hooks/
    ├── useAudio.ts         # Web Audio API sound synthesis
    └── useParallax.ts      # Mouse-tracking parallax hook
```

---

## 🎨 Customization

### Change Colors

Edit the `@theme` block in `src/app/globals.css`:

```css
@theme {
  --color-cartoon-yellow: #FFD93D;
  --color-cartoon-red: #FF6B6B;
  --color-cartoon-blue: #4ECDC4;
  /* ...change any color here */
}
```

### Change Sounds

All sounds are synthesized in `src/hooks/useAudio.ts`. Modify the frequencies and durations:

```ts
// Musical notes frequencies (C major scale)
const NOTE_FREQUENCIES = [261.63, 293.66, 329.63, ...];
```

### Add a New Game

1. Create a new file in `src/games/YourGame.tsx`
2. Import it in `src/components/GamesSection.tsx`
3. Add an entry to the `GAMES` array:
   ```ts
   {
     id: 'yourgame',
     title: 'Your Game',
     description: 'Description here',
     color: '#FF6B6B',
     icon: '🎮',
     playable: true,
   }
   ```
4. Add a `<GameModal>` for it with your game component

---

## ❓ Troubleshooting

### Port 3000 is already in use
```bash
# Kill the process using port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

### Dependencies won't install
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Audio not playing
Modern browsers block autoplay audio. The app handles this by:
- Starting audio **only after** the user's first click/interaction
- Providing a visible sound toggle button

If audio still doesn't work:
1. Check browser audio permissions for localhost
2. Ensure your browser supports the Web Audio API (all modern browsers do)
3. Try clicking the sound toggle button

### Build errors
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Run the build
npm run build
```

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

<p align="center">
  Made with 🧠 & ❤️
</p>
