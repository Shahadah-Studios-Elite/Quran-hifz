export interface SurahMeta {
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
  text: string;
  translation: string;
  audio: string;
}

export interface SurahDetail extends SurahMeta {
  ayahs: Ayah[];
}
