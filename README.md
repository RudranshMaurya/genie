# 🪔 PROJECT GENIE — A PERSONAL WORLD OF WISHES

> **"Your wishes are never just wishes. They're things waiting to become memories."**

Created with love for **Ananya**.

---

## ✨ Features Implemented

1. **Cinematic Fairytale Opening Sequence**
   - Deep midnight sky awakening with interactive fireflies, stardust, shooting stars, and ambient nebula gradients.
   - Handcrafted antique Arabian golden lamp that pulses with warm radiant light and curls of magical smoke.
   - Fluid original Genie character emerging from the spout with friendly expressions, greeting Ananya warmly: *"Well, well... look who's here! Welcome back, Ananya."*
   - Skip option and sound effects synthesized via Web Audio API (no broken asset dependencies).

2. **The Main Genie Interaction & Wish Submission**
   - Conversational AI-like responsive Genie with real-time speech reactions based on her keywords (e.g. Manali mountain trips, surprise dates, chocolate treats, cuddles).
   - Voice-to-text input microphone via Web Speech API.
   - Full categorized wish submission with optional detailed notes and image inspiration URLs.
   - Magical golden orb submission animation and confetti stardust celebrations.

3. **The Wish Vault (Her Bucket List Archive)**
   - Enchanted storybook parchment cards displaying all wishes.
   - Live dynamic counters: *X wishes captured, Y dreams fulfilled, Z magic brewing*.
   - Filter by status (*All, Received, In Progress, Coming Soon, Fulfilled*).
   - Real-time updates with special golden seals for completed wishes.

4. **When Magic Happens (The Magic Calendar)**
   - Live real-time countdown clocks (`DAYS : HOURS : MINS : SECS`) for upcoming scheduled wishes.
   - Automatic time-zone awareness (Asia/Kolkata default).

5. **A Little Note From Your Genie**
   - Personal enclave of heartwarming messages and love letters.
   - Dynamically editable from the Administrator dashboard.

6. **Master Secret Administrator Chamber (`/admin`)**
   - Private password-protected administrator portal (`ananyamyworld` or Firebase Admin auth).
   - Full wish status management:
     - `WISH RECEIVED`
     - `UNDER CONSIDERATION`
     - `MAGIC IN PROGRESS`
     - `COMING SOON`
     - `WISH GRANTED`
     - `ON HOLD`
   - Set expected completion timestamps for countdown timers.
   - Write custom personal notes back to Ananya that appear instantly on her wish cards.
   - Delete wish safeguards with confirmation.

7. **Firebase Integration & Offline-First Dual Layer**
   - Cloud Firestore real-time `onSnapshot` listeners.
   - Hardened `firestore.rules` security definitions enforcing read/write permissions.
   - Seamless offline storage backup so the app works reliably anywhere.

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Admin Credentials
- Route: `/admin`
- Master Passkey: `ananyamyworld`
# genie
