import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReusableModule } from '../reusable/reusable.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserInfoComponent } from './user-info/user-info.component';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
  declarations: [
    LoginComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressBarModule,
    ReusableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRippleModule,
  ],
  exports: [
    LoginComponent
  ]
})
export class UserModule { }
