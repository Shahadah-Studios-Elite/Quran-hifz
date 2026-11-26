# QuranHifz

[![Live Site](https://img.shields.io/badge/Live-quranhifz.sahihfinder.com-2f855a)](https://quranhifz.sahihfinder.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6)](https://www.typescriptlang.org/)

**QuranHifz** is a browser-based Quran reading and memorization experience designed to make practice simple, focused, and accessible.

**Live application:** [quranhifz.sahihfinder.com](https://quranhifz.sahihfinder.com/)

## Overview

QuranHifz provides two ways to explore and listen to the Quran:

- **Mushaf mode:** Navigate all 604 Mushaf pages, view Juz and Surah context, and select individual ayahs.
- **Surah mode:** Choose any of the 114 Surahs and follow along with Arabic text and Sahih International English translation.

## Features

- Full 604-page Mushaf navigation
- Direct page jumping
- Complete 114-Surah browser
- Arabic text and English translation
- Ayah-by-ayah audio playback
- Full-Surah playback
- Automatic continuation to the next ayah
- Hifz loop for repeating the active ayah
- Translation visibility controls for recall practice
- Four reciter options
- Mushaf page and Surah state preserved in the URL
- Responsive layout for desktop and mobile devices

## Supported Reciters

- Mishary Rashid Alafasy
- Mahmoud Khalil Al-Husary
- Abdul Basit Murattal
- Mohamed Siddiq El-Minshawi

## Technology

- Next.js 15 with App Router
- React 19
- TypeScript
- CSS
- Al Quran Cloud API
- GitHub Actions
- GitHub Pages

## Getting Started

### Requirements

- Node.js 22 or later
- npm

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

The project is configured for static export in `next.config.ts`. The generated site is written to `out/`.

### Lint

```bash
npm run lint
```

## Usage

### Mushaf Practice

1. Select **Mushaf (604 Pages)**.
2. Navigate with the previous and next controls or enter a page number.
3. Select an ayah to begin playback.
4. Enable **Hifz Loop** to repeat the current ayah.

### Surah Practice

1. Select **Surah View**.
2. Choose a Surah from the dropdown.
3. Listen to an individual ayah or play the entire Surah.
4. Toggle the English translation to test recall without reading it.

## URL Navigation

Current navigation state is stored in the browser URL:

- `?page=1` opens Mushaf page 1
- `?surah=Al-Fatihah` opens Al-Fatihah
- `?surah=1` opens Surah 1 by number

## Project Structure

```text
.
├── .github/workflows/deploy.yml  # GitHub Pages deployment
├── public/
│   └── favicon1.png
├── src/
│   ├── app/
│   │   ├── globals.css           # Application styles
│   │   ├── layout.tsx            # Root layout and metadata
│   │   └── page.tsx              # Reading and playback logic
│   ├── components/
│   │   ├── BismillahCleaner.tsx
│   │   ├── LandingOverlay.tsx
│   │   ├── MushafReader.tsx
│   │   └── SettingsModal.tsx
│   └── types/
│       └── quran.ts
├── CNAME                         # Custom Pages domain
├── next.config.ts                # Static export configuration
├── package.json
└── tsconfig.json
```

## Data and Connectivity

Quran text and recitation audio are retrieved from the [Al Quran Cloud API](https://alquran.cloud/api). An internet connection is required during use.

## Deployment

A GitHub Actions workflow builds and deploys the application to GitHub Pages.

The workflow:

1. Runs when changes are pushed to `main` or dispatched manually
2. Installs dependencies with Node.js 22
3. Creates the Next.js static export
4. Uploads the `out/` directory
5. Deploys it to GitHub Pages

Push changes to `main` to start a deployment automatically.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Implement and test your changes.
4. Commit your work:

```bash
git commit -m "Add your feature"
```

5. Open a pull request.

## License

No license has been specified for this repository. All rights remain with the repository owner until a license is added.

## Links

- [Live application](https://quranhifz.sahihfinder.com/)
- [SahihFinder](https://www.sahihfinder.com)
- [GitHub repository](https://github.com/Shahadah-Studios-Elite/Quran-hifz)
