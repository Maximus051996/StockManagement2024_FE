import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sms',
    loadChildren: () =>
      import('././core/modules/default/default/default.module').then(
        (m) => m.DefaultModule
      ),
  },
  {
    path: 'ins',
    loadChildren: () =>
      import('./core/modules/inspector/ins-module/ins-module.module').then(
        (m) => m.InsModuleModule
      ),
  },
  {
    path: 'sa',
    loadChildren: () =>
      import(
        './core/modules/salesassistant/salesassistant/salesassistant.module'
      ).then((m) => m.SalesassistantModule),
  },
];
