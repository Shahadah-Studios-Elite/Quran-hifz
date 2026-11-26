# QuranHifz

[![Live site](https://img.shields.io/badge/live-quranhifz.sahihfinder.com-2f855a)](https://quranhifz.sahihfinder.com/) [![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6)](https://www.typescriptlang.org/)

A browser-based Quran memorization and reading experience built with Next.js, React, and TypeScript.

**Live application:** https://quranhifz.sahihfinder.com/

## Features

- Browse all **604 Mushaf pages** with direct page navigation
- Read and navigate the **114 Surahs** with Arabic text and Sahih International English translation
- Play individual ayahs or an entire Surah
- Repeat the active ayah with a Hifz loop
- Continue automatically to the next ayah
- Choose from four supported reciters
- Show or hide the English translation during recall practice
- Preserve Mushaf page and Surah selections in the URL
- View the current Juz and Surah context while navigating Mushaf pages

## Supported reciters

- Mishary Rashid Alafasy
- Mahmoud Khalil Al-Husary
- Abdul Basit (Murattal)
- Mohamed Siddiq El-Minshawi

## Tech stack

- [Next.js 15](https://nextjs.org/) — App Router and static export
- [React 19](https://react.dev/) — user interface
- [TypeScript](https://www.typescriptlang.org/) — application logic and type definitions
- CSS — responsive application styling
- [Al Quran Cloud API](https://alquran.cloud/api) — Quran text and recitation audio
- GitHub Actions and GitHub Pages — build and deployment

## Getting started

### Prerequisites

- Node.js 22 or later
- npm

### Installation

```bash
git clone https://github.com/Shahadah-Studios-Elite/Quran-hifz.git
cd Quran-hifz
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

The project uses Next.js static export through `next.config.ts`. The generated website is written to `out/`.

### Lint

```bash
npm run lint
```

## Usage

### Mushaf mode

1. Select **Mushaf (604 Pages)**.
2. Use the previous and next controls or enter a page number.
3. Select an ayah to begin listening.
4. Enable **Hifz Loop** to repeat the active ayah.

### Surah mode

1. Select **Surah Hifz View**.
2. Choose a Surah from the dropdown.
3. Use **Listen** or **Play Full Surah**.
4. Toggle the English translation when you want to test recall without reading it.

## URL parameters

Navigation state is stored in the browser URL:

- `?page=1` opens Mushaf page 1
- `?surah=Al-Fatihah` opens Surah Al-Fatihah
- `?surah=1` opens Surah 1 by number

## Project structure

```text
.
├── .github/workflows/deploy.yml  # GitHub Pages deployment
├── public/
│   └── favicon1.png
├── src/
│   ├── app/
│   │   ├── globals.css           # Application styles
│   │   ├── layout.tsx            # Root layout and metadata
│   │   └── page.tsx              # Mushaf, Surah, and playback logic
│   ├── components/
│   │   └── MushafReader.tsx      # Mushaf reader component
│   └── types/
│       └── quran.ts              # Shared Quran types
├── CNAME                         # Custom GitHub Pages domain
├── next.config.ts                # Static export configuration
├── package.json
└── tsconfig.json
```

## Deployment

The repository includes a GitHub Actions workflow that:

1. Runs on pushes to `main` and manual dispatch
2. Installs dependencies with npm
3. Builds the Next.js static export
4. Uploads the `out/` directory
5. Deploys the result to GitHub Pages

Push changes to `main` to trigger the deployment workflow automatically.

## Data and connectivity

Quran text and recitation audio are retrieved from the public **Al Quran Cloud API**. An internet connection is required while using the application.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Make and test your changes.
4. Commit your work:

```bash
git commit -m "Add your feature"
```

5. Open a pull request.

## License

No license has been specified in this repository. All rights remain with the repository owner until a license is added.

## Links

- [Live application](https://quranhifz.sahihfinder.com/)
- [SahihFinder](https://www.sahihfinder.com)
- [GitHub repository](https://github.com/Shahadah-Studios-Elite/Quran-hifz)
