import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { EditComponent } from './edit/edit.component';
import { OverviewComponent } from './overview/overview.component';



const routes: Routes = [
  { path: '', component: OverviewComponent, pathMatch: 'full' },
  { path: 'edit/:staffId', component: EditComponent, pathMatch: 'full' },
  { path: 'add', component: EditComponent, pathMatch: 'full' },
  { path: 'chart', component: ChartComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
