import { Component, computed, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, SupportedLanguage } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {
  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private elementRef = inject(ElementRef);

  isOpen = false;

  currentLang = computed(() => {
    const code = this.languageService.currentLanguage();
    return this.languageService.getTranslatedLanguages().find(l => l.code === code);
  });

  get availableLanguages() {
    return this.languageService.getTranslatedLanguages();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectLanguage(lang: SupportedLanguage): void {
    // Obtener información del usuario (admin o player)
    const adminUser = this.authService.getCurrentUser();
    const playerId = localStorage.getItem('playerId');

    if (adminUser) {
      // Usuario admin logueado
      this.languageService.setLanguage(lang, 'admin', adminUser.id);
    } else if (playerId) {
      // Jugador en sesión
      this.languageService.setLanguage(lang, 'player', parseInt(playerId));
    } else {
      // Sin usuario logueado, solo cambio local
      this.languageService.setLanguage(lang);
    }

    this.isOpen = false;
  }
}
