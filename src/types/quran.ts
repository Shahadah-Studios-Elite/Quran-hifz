export interface SurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  arabicText: string;
  translationText: string;
  audioUrl: string;
  page?: number;
  juz?: number;
  surahNumber?: number;
  surahName?: string;
  surahEnglishName?: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  ayahs: Ayah[];
}
