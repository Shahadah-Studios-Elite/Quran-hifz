# QuranHifz

[![Live site](https://img.shields.io/badge/live-quranhifz.sahihfinder.com-2f855a)](https://quranhifz.sahihfinder.com/) [![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org/) [![License](https://img.shields.io/badge/license-not%20specified-lightgrey)](#license)

**QuranHifz** is a focused, browser-based Quran memorization experience. Study the Qur’an by Mushaf page or by Surah, listen to complete verses, navigate naturally through the recitation, and repeat a verse as often as needed.

**Live application:** https://quranhifz.sahihfinder.com/

## Highlights

- **604-page Mushaf view** — browse every Mushaf page and jump directly to a specific page
- **Surah view** — select any of the 114 Surahs and read Arabic text with English Sahih International translation
- **Ayah audio playback** — listen with one of four supported reciters
- **Hifz repeat loop** — repeat the current verse until memorization is complete
- **Continuous listening** — progress automatically to the next ayah when a recitation ends
- **Translation control** — hide or show the English translation in Surah view
- **Shareable URLs** — page and Surah selections are retained in the browser address bar
- **Juz and Surah context** — page navigation includes the current Juz and Surah names

## Supported reciters

- Mishary Rashid Alafasy
- Mahmoud Khalil Al-Husary
- Abdul Basit (Murattal)
- Mohamed Siddiq El-Minshawi

## Tech stack

- [Next.js 15](https://nextjs.org/) App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- CSS
- [Al Quran Cloud API](https://alquran.cloud/api)
- GitHub Pages with GitHub Actions

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

Open http://localhost:3000 in your browser.

### Create a production build

```bash
npm run build
```

The project is configured for static export through `next.config.ts`, so the generated site is written to `out/`.

## Usage

### Mushaf mode

1. Choose **Mushaf (604 Pages)**.
2. Use the next and previous controls or enter a page number to navigate.
3. Select an ayah to begin listening.
4. Enable **Hifz Loop** to repeat the active ayah.

### Surah mode

1. Choose **Surah Hifz View**.
2. Select a Surah from the dropdown.
3. Use **Listen** or **Play Full Surah**.
4. Toggle the translation when you want to test recall without reading it.

## URL parameters

QuranHifz stores navigation state in the URL:

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

1. Runs on pushes to `main` and manual workflow dispatches.
2. Installs dependencies with npm.
3. Builds the Next.js static export.
4. Uploads the `out/` directory.
5. Deploys it to GitHub Pages.

Push changes to `main` to deploy automatically.

## Data source

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
