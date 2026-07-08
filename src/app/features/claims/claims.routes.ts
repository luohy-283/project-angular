import { Routes } from '@angular/router';

export const CLAIMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./claims.component').then((m) => m.ClaimsComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./claim-create/claim-create.component').then((m) => m.ClaimCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./claim-detail/claim-detail.component').then((m) => m.ClaimDetailComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./claim-edit/claim-edit.component').then((m) => m.ClaimEditComponent),
  },
];
