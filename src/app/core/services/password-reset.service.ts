import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

export interface RequestResetResponse {
    ok: boolean;
    message: string;
    error?: string;
}

export interface VerifyCodeResponse {
    ok: boolean;
    valid: boolean;
    message: string;
    error?: string;
}

export interface ResetPasswordResponse {
    ok: boolean;
    message: string;
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PasswordResetService {
    private readonly apiUrl = environment.apiBaseUrl;
    private readonly endpoints = environment.apiEndpoints.passwordReset;

    constructor(
        private http: HttpClient,
        private translate: TranslateService
    ) { }

    private get currentLang(): string {
        return this.translate.currentLang || 'es';
    }

    /**
     * Paso 1: Solicitar código de recuperación
     */
    requestReset(email: string): Observable<RequestResetResponse> {
        const url = `${this.apiUrl}${this.endpoints.request}?lang=${this.currentLang}`;
        return this.http.post<RequestResetResponse>(url, { email });
    }

    /**
     * Paso 2: Verificar código de 6 dígitos
     */
    verifyCode(code: string): Observable<VerifyCodeResponse> {
        const url = `${this.apiUrl}${this.endpoints.verify}?lang=${this.currentLang}`;
        return this.http.post<VerifyCodeResponse>(url, { code });
    }

    /**
     * Paso 3: Cambiar contraseña con código válido
     */
    resetPassword(code: string, newPassword: string): Observable<ResetPasswordResponse> {
        const url = `${this.apiUrl}${this.endpoints.reset}?lang=${this.currentLang}`;
        return this.http.post<ResetPasswordResponse>(url, {
            code,
            new_password: newPassword
        });
    }
}
