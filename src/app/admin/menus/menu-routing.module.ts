import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { OverviewComponent } from './overview/overview.component';


const routes: Routes = [
  { path: '', component: OverviewComponent, pathMatch: 'full' },
  { path: 'edit/:menuId', component: EditComponent, pathMatch: 'full' },
  { path: 'add', component: EditComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
