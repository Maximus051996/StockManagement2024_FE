import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InsDashboardComponent } from './components/ins-dashboard/ins-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { ProductsComponent } from './components/products/products.component';

export const routes: Routes = [
  // {
  //   path: 'sms',
  //   loadChildren: () =>
  //     import('./modules/default/default.module').then((m) => m.DefaultModule),
  // },
  // {
  //   path: 'ins',
  //   loadChildren: () =>
  //     import('./modules/ins-module/ins-module.module').then(
  //       (m) => m.InsModuleModule
  //     ),
  // },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: InsDashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [authGuard],
  },
];
