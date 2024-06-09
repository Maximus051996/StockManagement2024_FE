import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsDashboardComponent } from '../../../../components/ins-dashboard/ins-dashboard.component';
import { authGuard } from '../../../guards/auth.guard';
import { ProductsComponent } from '../../../../components/products/products.component';
import { CompanyComponent } from '../../../../components/company/company.component';
import { AddeditcompanyComponent } from '../../../../components/company/addupdate/addeditcompany/addeditcompany/addeditcompany.component';
import { AddeditproductComponent } from '../../../../components/products/addupdate/addeditproduct/addeditproduct.component';
import { PercCalcuComponent } from '../../../../components/percentage-calculation/perc-calcu/perc-calcu.component';
import { DamageProductsComponent } from '../../../../components/damage-product/damage-products/damage-products.component';
import { AddeditdamageproductComponent } from '../../../../components/damage-product/addupdate/addeditdamageproduct/addeditdamageproduct.component';
import { AddedituserComponent } from '../../../../components/user/addupdate/addedituser/addedituser.component';
import { UserComponent } from '../../../../components/user/user.component';

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
    path: 'calc-percent',
    component: PercCalcuComponent,
    canActivate: [authGuard],
  },
  {
    path: 'damage-details',
    component: DamageProductsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit-damage-details/:id',
    component: AddeditdamageproductComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-damage-details',
    component: AddeditdamageproductComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit-product/:id',
    component: AddeditproductComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-product',
    component: AddeditproductComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit-user/:id',
    component: AddedituserComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-user',
    component: AddedituserComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user-details',
    component: UserComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsModuleRoutingModule {}
