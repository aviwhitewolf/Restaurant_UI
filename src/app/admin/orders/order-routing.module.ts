import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { OverviewComponent } from './overview/overview.component';
import { ViewComponent } from './view/view.component';


const routes: Routes = [
  { path: '', component: OverviewComponent, pathMatch: 'full' },
  { path: 'view/:orderId', component: ViewComponent, pathMatch: 'full' },
  { path: 'create', component: CreateComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
