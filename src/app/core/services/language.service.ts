import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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

  constructor(
    private translate: TranslateService,
    private http: HttpClient
  ) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY) as SupportedLanguage | null;
    const lang = stored && this.isValidLanguage(stored) ? stored : this.DEFAULT_LANGUAGE;

    this.translate.setFallbackLang(this.DEFAULT_LANGUAGE);
    this.setLanguage(lang);
  }

  setLanguage(lang: SupportedLanguage, userType?: 'admin' | 'player', userId?: number): void {
    if (!this.isValidLanguage(lang)) {
      lang = this.DEFAULT_LANGUAGE;
    }

    this.translate.use(lang);
    this.currentLanguage.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);

    if (userType && userId) {
      this.setUserPreference(userType, userId, lang).subscribe({
        next: () => { },
        error: (err) => console.error('Failed to sync language preference:', err)
      });
    }
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

  getUserPreference(userType: 'admin' | 'player', userId: number): Observable<{ language: SupportedLanguage }> {
    const url = `${environment.apiBaseUrl}/preferences/${userType}/${userId}`;
    return this.http.get<{ ok: boolean; language: SupportedLanguage }>(url).pipe(
      map(response => ({ language: response.language })),
      catchError(error => {
        console.warn('Failed to get user preference, using default:', error);
        return of({ language: 'es' as SupportedLanguage });
      })
    );
  }

  setUserPreference(userType: 'admin' | 'player', userId: number, language: SupportedLanguage): Observable<void> {
    const url = `${environment.apiBaseUrl}/preferences/${userType}/${userId}/language`;
    return this.http.put<{ ok: boolean }>(url, { language }).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Failed to save language preference:', error);
        return of(void 0); // Continue even if save fails
      })
    );
  }
}
