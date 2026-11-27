# QuranHifz

<p align="center">
  <strong>A smart, focused Quran reading and memorization experience for the web.</strong>
</p>

[![Live Site](https://img.shields.io/badge/Live-quranhifz.sahihfinder.com-2f855a)](https://quranhifz.sahihfinder.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6)](https://www.typescriptlang.org/)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-2088ff)](https://pages.github.com/)
[![Deploy QuranHifz to GitHub Pages](https://github.com/Shahadah-Studios-Elite/Quran-hifz/actions/workflows/deploy.yml/badge.svg)](https://github.com/Shahadah-Studios-Elite/Quran-hifz/actions/workflows/deploy.yml)
**QuranHifz** helps learners read, listen to, repeat, annotate, and study the Quran in a clean, responsive browser experience. It combines Mushaf-style navigation, complete Surah study, multiple reciters, automatic ayah playback, memorization loops, voice controls, and a collaborative drawing board.

**Live application:** [quranhifz.sahihfinder.com](https://quranhifz.sahihfinder.com/)

---

## Smart Features

### Mushaf reading

- Navigate all 604 Quran pages.
- Jump directly to any Mushaf page from 1 through 604.
- Move forward and backward with a right-to-left-friendly toolbar.
- View Juz and Surah context while reading.
- See Surah headers and Bismillah sections where they appear.
- Select any ayah to begin listening and highlight the active verse.
- Use Arabic-Indic page and ayah markers.

### Intelligent Hifz practice

- Play ayah-by-ayah in a selected Mushaf page or Surah.
- Advance automatically after an audio recording ends.
- Repeat the same ayah continuously with Hifz Loop.
- Move backward or forward through verses from the audio player.
- Scroll active Surah verses into view automatically.
- Hide the English translation to test recall.
- Choose from several respected recitations.

### Voice control

- Start voice commands using the microphone control.
- Say **play**, **pause**, **next**, **previous**, or **loop**.
- Receive a temporary visual confirmation for the recognized command.
- Continue listening hands-free with browser speech recognition.

Voice commands depend on browser support and microphone permission.

### Surah study

- Browse all 114 Surahs.
- Switch by Surah name or number.
- Read the Uthmani Arabic text.
- Read Sahih International English translation alongside each ayah.
- Play an individual ayah or the complete Surah.
- Hide translations during memorization practice.

### Collaborative Hifz board

A dedicated drawing workspace is available at [`/hifzstudy`](https://quranhifz.sahihfinder.com/hifzstudy).

- Draw freely on a high-resolution canvas.
- Use a pen, eraser, or Arabic/English text tool.
- Adjust colors and brush size.
- Clear the full board.
- Download the board as a PNG image.
- Generate a short room ID.
- Copy an invite link or enter a partner's room ID.
- Share drawing and text events with connected study partners in real time.

The collaboration board uses browser PeerJS connections and does not require a separate backend service.

### Shareable reading state

QuranHifz preserves navigation choices in the URL:

- `?page=1` opens Mushaf page 1.
- `?page=604` opens Mushaf page 604.
- `?surah=1` opens Surah 1.
- `?surah=Al-Fatihah` opens Al-Fatihah.

This makes a reading position easy to bookmark or share.

---

## Supported Reciters

- Mishary Rashid Alafasy
- Mahmoud Khalil Al-Husary
- Abdul Basit Murattal
- Mohamed Siddiq El-Minshawi

The selected recitation is requested dynamically from the Al Quran Cloud API for Mushaf pages and complete Surahs.

---

## Technology

- **Next.js 15** with the App Router
- **React 19**
- **TypeScript 5**
- **CSS**
- **Al Quran Cloud API** for Quran editions, Surahs, pages, translations, and audio
- **Web Speech API** for voice commands
- **PeerJS** for live collaborative drawing
- **GitHub Actions** for automated deployment
- **GitHub Pages** with a custom domain

The application is configured as a fully static Next.js export.

---

## Getting Started

### Requirements

- Node.js 22 or later
- npm
- A modern browser
- An internet connection for Quran data and recitation audio

### Installation

```bash
git clone https://github.com/Shahadah-Studios-Elite/Quran-hifz.git
cd Quran-hifz
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
```

Next.js exports the complete static site to `out/`.

To preview the exported site locally, serve that directory with any static file server.

### Lint

```bash
npm run lint
```

> `next lint` behavior can vary with newer Next.js releases. If the lint command is removed from a future Next.js version, run the project checks through the framework's supported replacement instead.

---

## Usage Guide

### Mushaf Mode

1. Open the live site or run it locally.
2. Select **Mushaf (604 Pages)**.
3. Use the previous/next controls or enter a page number.
4. Select an ayah to begin playback.
5. Enable **Hifz Loop** when you want to repeat the active verse.
6. Use the audio bar controls to move between verses or stop and resume playback.

### Surah Mode

1. Select **Surah View**.
2. Choose one of the 114 Surahs.
3. Select a reciter from the reciter menu.
4. Use **Listen** on an ayah or **Play Full Surah** for sequential playback.
5. Hide the translation to turn the page into a recall exercise.

### Voice Practice

1. Press **Voice**.
2. Allow microphone access if the browser requests it.
3. Say commands such as **play**, **pause**, **next**, **previous**, or **loop**.
4. Press the microphone control again to stop listening.

### Collaborative Study Board

1. Visit `/hifzstudy`.
2. Copy the generated room invite link.
3. Share the link with a study partner.
4. Choose a drawing tool and begin the live session.
5. Download or clear the board as needed.

---

## Project Structure

```text
.
├── .github/workflows/deploy.yml  # GitHub Pages build and deployment
├── public/
│   ├── favicon1.png
│   └── favicon2.png
├── src/
│   ├── app/
│   │   ├── globals.css           # Shared application styling
│   │   ├── layout.tsx            # Root layout and metadata
│   │   ├── page.tsx              # Main Mushaf and Surah experience
│   │   └── hifzstudy/
│   │       ├── page.tsx          # Collaborative study board
│   │       ├── StudyHeader.tsx   # Room controls and partner status
│   │       ├── StudyToolbar.tsx  # Drawing tools and actions
│   │       └── types.ts          # Drawing event types
│   ├── components/
│   │   ├── BismillahCleaner.tsx
│   │   ├── LandingOverlay.tsx
│   │   ├── MushafReader.tsx      # Mushaf page presentation
│   │   ├── SettingsModal.tsx
│   │   └── VoiceCommands.tsx     # Browser voice control
│   └── types/
│       └── quran.ts              # Shared Quran data types
├── CNAME                         # Custom GitHub Pages domain
├── next.config.ts                # Static export configuration
├── package.json                  # Scripts and dependencies
└── tsconfig.json                 # TypeScript configuration
```

---

## Data and Connectivity

Quran text, Surah data, translations, Mushaf pages, and recitation URLs come from the [Al Quran Cloud API](https://alquran.cloud/api).

The application generally needs internet access for:

- Loading Surah and Mushaf editions
- Fetching selected recitations
- Streaming ayah audio
- Peer-to-peer study collaboration

Cached browser behavior is not guaranteed because the project does not implement its own Quran or audio database.

---

## Deployment

This repository includes an automated GitHub Actions workflow for GitHub Pages.

Every push to `main` or manual workflow dispatch:

1. Checks out the repository.
2. Uses Node.js 22.
3. Installs dependencies with `npm ci` when a lockfile exists, otherwise `npm install`.
4. Builds the Next.js static export with telemetry disabled.
5. Uploads `out/` as a Pages artifact.
6. Deploys the artifact to the GitHub Pages environment.

The custom domain is configured through `CNAME` and the repository Pages settings.

To deploy manually:

```bash
npm run build
```

Then publish the generated `out/` directory through GitHub Pages or another static host.

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make focused, tested changes.
4. Keep TypeScript types accurate and preserve accessibility labels.
5. Build the project before opening a pull request:

   ```bash
   npm run build
   ```

6. Open a pull request with a clear description and screenshots for UI changes.

---

## Browser Support

The core reading and audio experience works on modern desktop and mobile browsers.

Some enhanced features are browser-dependent:

- Voice commands require Web Speech API support.
- Microphone access requires HTTPS or localhost and user permission.
- Collaborative rooms require PeerJS connectivity and may be affected by network restrictions.
- Canvas downloads require a browser that supports the HTML Canvas API.

---

## License

No license has been specified for this repository. Until an explicit open-source license is added, usage rights remain controlled by the repository owner.

---

## Links

- [Live QuranHifz application](https://quranhifz.sahihfinder.com/)
- [Hifz study board](https://quranhifz.sahihfinder.com/hifzstudy)
- [SahihFinder](https://www.sahihfinder.com)
- [Al Quran Cloud API](https://alquran.cloud/api)
- [GitHub repository](https://github.com/Shahadah-Studios-Elite/Quran-hifz)
