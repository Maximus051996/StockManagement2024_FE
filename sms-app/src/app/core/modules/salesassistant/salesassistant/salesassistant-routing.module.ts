import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from '../../../../components/company/company.component';
import { authGuard } from '../../../guards/auth.guard';
import { ProductsComponent } from '../../../../components/products/products.component';

const routes: Routes = [
  {
    path: 'companydetails',
    component: CompanyComponent,
    canActivate: [authGuard],
  },
  {
    path: 'productdetails',
    component: ProductsComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesassistantRoutingModule {}
