import { Injectable, inject, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from './logger.service';
import { NotificationService } from './notification.service';
import { HttpStatus } from '../constants/http-status.const';
import { NOTIFICATION_DURATION } from '../constants/notification-config.const';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
    private logger = inject(LoggerService);
    private notification = inject(NotificationService);
    private injector = inject(Injector);

    private get translate(): TranslateService {
        return this.injector.get(TranslateService);
    }

    handle(error: HttpErrorResponse) {
        this.logger.error(`HTTP Error ${error.status}`, error);

        switch (error.status) {
            case 0:
                this.notification.error(
                    this.translate.instant('common.connection_error') || 'Error de conexión con el servidor.',
                    NOTIFICATION_DURATION.LONG
                );
                break;
            case HttpStatus.UNAUTHORIZED:
                this.notification.error(
                    this.translate.instant('auth.session_expired') || 'Sesión expirada. Por favor inicia sesión nuevamente.',
                    NOTIFICATION_DURATION.LONG
                );
                break;
            case HttpStatus.FORBIDDEN:
                this.notification.error(
                    this.translate.instant('auth.forbidden') || 'Acceso denegado.',
                    NOTIFICATION_DURATION.DEFAULT
                );
                break;
            case HttpStatus.NOT_FOUND:
                this.notification.error(
                    this.translate.instant('common.not_found') || 'Recurso no encontrado.',
                    NOTIFICATION_DURATION.DEFAULT
                );
                break;
            case HttpStatus.INTERNAL_SERVER_ERROR:
                this.notification.error(
                    this.translate.instant('common.server_error') || 'Error del servidor. Intenta más tarde.',
                    NOTIFICATION_DURATION.LONG
                );
                break;
            case HttpStatus.BAD_REQUEST:
                this.notification.error(
                    this.translate.instant('common.bad_request') || 'Solicitud inválida.',
                    NOTIFICATION_DURATION.DEFAULT
                );
                break;
            default:
                this.notification.error(
                    this.translate.instant('common.unknown_error') || 'Error desconocido. Intenta de nuevo.',
                    NOTIFICATION_DURATION.DEFAULT
                );
        }
    }
}