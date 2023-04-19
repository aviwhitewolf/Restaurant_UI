import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view/view.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ViewComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatIconModule
  ]
})
export class ProfileModule { }
