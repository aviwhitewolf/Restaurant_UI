import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { OverviewComponent } from './overview/overview.component';
import { EditV1Component } from './edit-v1/edit-v1.component';

const routes: Routes = [
  { path: '', component: OverviewComponent, pathMatch: 'full' },
  { path: 'edit/:dishId', component: EditComponent, pathMatch: 'full' },
  { path: 'v1/edit/:dishId', component: EditV1Component, pathMatch: 'full' },
  { path: 'add', component: EditComponent, pathMatch: 'full' },
  { path: 'v1/add', component: EditV1Component, pathMatch: 'full' },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DishRoutingModule {

 }
