import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  { path: 'overview', component: OverviewComponent, pathMatch: 'full' },
  { path: 'edit/:expenseId', component: EditComponent, pathMatch: 'full' },
  { path: 'add', component: EditComponent, pathMatch: 'full' },
  {
    path: 'category',
    loadChildren: () => import('./category/category.module').then(m => m.CategoryModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseRoutingModule { }
