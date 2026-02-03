import { Routes } from '@angular/router';

export const routes: Routes = [
  // Admin - Login (Public access needed)
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/admin-login.component').then(m => m.AdminLoginComponent),
    data: { title: 'Acceso de Administrador' }
  },
  {
    path: 'admin/password-reset/request',
    loadComponent: () =>
      import('./features/admin/password-reset/request/password-reset-request.component')
        .then(m => m.PasswordResetRequestComponent),
    data: { title: 'Recuperar Contraseña' }
  },
  {
    path: 'admin/password-reset/verify',
    loadComponent: () =>
      import('./features/admin/password-reset/verify/password-reset-verify.component')
        .then(m => m.PasswordResetVerifyComponent),
    data: { title: 'Verificar Código' }
  },
  {
    path: 'admin/password-reset/new',
    loadComponent: () =>
      import('./features/admin/password-reset/new/password-reset-new.component')
        .then(m => m.PasswordResetNewComponent),
    data: { title: 'Nueva Contraseña' }
  },

  // Admin Feature (Protected - lazy loaded as feature)
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  // Public - Player Entry
  {
    path: 'play',
    loadComponent: () => import('./features/game/start/game-start.component').then(m => m.GameStartComponent),
    data: { title: 'Ingreso de Jugador' }
  },

  // Public - Game Board
  {
    path: 'game/board',
    loadComponent: () => import('./features/game/board/game-board.component').then(m => m.GameBoardComponent),
    data: { title: 'Tablero del Juego' }
  },

  // Public - Leaderboard
  {
    path: 'leaderboard',
    loadComponent: () => import('./features/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent),
    data: { title: 'Clasificación' }
  },

  // Public - Player Profile
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/player-profile.component').then(m => m.PlayerProfileComponent),
    data: { title: 'Mi Perfil' }
  },

  {
    path: '',
    redirectTo: '/play',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: '/play'
  }
];

