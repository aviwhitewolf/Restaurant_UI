import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { TaxComponent } from './tax/tax.component';
import { EditTaxComponent } from './edit-tax/edit-tax.component';



const routes: Routes = [
  { path: 'overview', component: OverviewComponent, pathMatch: 'full' },
  { path: 'tax', component: TaxComponent, pathMatch: 'full' },
  { path: 'tax/edit/:taxId', component: EditTaxComponent, pathMatch: 'full' },
  { path: 'tax/add', component: EditTaxComponent, pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyRestaurantRoutingModule { }
