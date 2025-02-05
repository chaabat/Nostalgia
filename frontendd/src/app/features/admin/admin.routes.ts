import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent)
  },
  {
    path: 'albums',
    loadChildren: () => import('./albums/admin-albums.routes')
      .then(m => m.ADMIN_ALBUMS_ROUTES)
  },
  {
    path: 'songs',
    loadChildren: () => import('./songs/admin-songs.routes')
      .then(m => m.ADMIN_SONGS_ROUTES)
  },
]; 