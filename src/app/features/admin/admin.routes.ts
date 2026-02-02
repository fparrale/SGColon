import { Routes } from '@angular/router';
import { AdminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
    {
        path: 'dashboard',
        canActivate: [AdminGuard],
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        data: { title: 'Panel de Administrador' }
    },
    {
        path: 'questions',
        canActivate: [AdminGuard],
        loadComponent: () => import('./questions/admin-questions.component').then(m => m.AdminQuestionsComponent),
        data: { title: 'Gestión de Preguntas' }
    },
    {
        path: 'settings',
        canActivate: [AdminGuard],
        loadComponent: () => import('./settings/admin-settings.component').then(m => m.AdminSettingsComponent),
        data: { title: 'Configuración de Administrador' }
    },
    {
        path: 'players',
        canActivate: [AdminGuard],
        loadComponent: () => import('./players/admin-players.component').then(m => m.AdminPlayersComponent),
        data: { title: 'Gestión de Jugadores' }
    },
    {
        path: 'rooms',
        canActivate: [AdminGuard],
        loadComponent: () => import('./rooms/admin-rooms.component').then(m => m.AdminRoomsComponent),
        data: { title: 'Gestión de Salas' }
    },
    {
        path: 'admins',
        canActivate: [AdminGuard],
        loadComponent: () => import('./admin-management/admin-management.component').then(m => m.AdminManagementComponent),
        data: { title: 'Gestión de Administradores' }
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];
