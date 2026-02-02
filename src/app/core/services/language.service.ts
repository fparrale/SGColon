import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type SupportedLanguage = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'sg_ia_language';
  private readonly DEFAULT_LANGUAGE: SupportedLanguage = 'es';

  readonly currentLanguage = signal<SupportedLanguage>(this.DEFAULT_LANGUAGE);

  readonly availableLanguages: { code: SupportedLanguage; nameKey: string; flag: string }[] = [
    { code: 'es', nameKey: 'common.spanish', flag: '🇪🇸' },
    { code: 'en', nameKey: 'common.english', flag: '🇺🇸' }
  ];

  getTranslatedLanguages(): { code: SupportedLanguage; name: string; flag: string }[] {
    return this.availableLanguages.map(lang => ({
      code: lang.code,
      name: this.translate.instant(lang.nameKey),
      flag: lang.flag
    }));
  }

  constructor(private translate: TranslateService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY) as SupportedLanguage | null;
    const lang = stored && this.isValidLanguage(stored) ? stored : this.DEFAULT_LANGUAGE;

    this.translate.setFallbackLang(this.DEFAULT_LANGUAGE);
    this.setLanguage(lang);
  }

  setLanguage(lang: SupportedLanguage): void {
    if (!this.isValidLanguage(lang)) {
      lang = this.DEFAULT_LANGUAGE;
    }

    this.translate.use(lang);
    this.currentLanguage.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
  }

  setLanguageForRoom(lang: SupportedLanguage): void {
    if (!this.isValidLanguage(lang)) {
      lang = this.DEFAULT_LANGUAGE;
    }
    this.translate.use(lang);
    this.currentLanguage.set(lang);
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage();
  }

  private isValidLanguage(lang: string): lang is SupportedLanguage {
    return ['es', 'en'].includes(lang);
  }

  getLanguageName(code: SupportedLanguage): string {
    const lang = this.availableLanguages.find(l => l.code === code);
    return lang ? this.translate.instant(lang.nameKey) : code;
  }
}
