import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsDashboardComponent } from '../../../../components/ins-dashboard/ins-dashboard.component';
import { authGuard } from '../../../guards/auth.guard';
import { ProductsComponent } from '../../../../components/products/products.component';
import { CompanyComponent } from '../../../../components/company/company.component';
import { CalculationComponent } from '../../../../components/calculation/calculation.component';
import { AddeditcompanyComponent } from '../../../../components/company/update/addeditcompany/addeditcompany/addeditcompany.component';

const routes: Routes = [
  {
    path: 'home',
    component: InsDashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'product',
    component: ProductsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'company',
    component: CompanyComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit-company/:id',
    component: AddeditcompanyComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-company',
    component: AddeditcompanyComponent,
    canActivate: [authGuard],
  },
  {
    path: 'calculation',
    component: CalculationComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsModuleRoutingModule {}
