import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit, OnDestroy{

  public isLogin: boolean = false
  public loading: boolean = true
  public userData!: any
  private user!: any

  public updateFormGroup: FormGroup = this.formBuilder.group({
    fullName: ['', []],
    username: ['', [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UserInfoComponent>,
    private userService: UserService,
    private mainService: MainService
  ) {
    document.body.classList.add("cdk-global-scrollblock");
  }


  ngOnInit(): void {
    this.user = this.mainService.getToLocalStorage(Constants.LOCAL_USER)
    if (this.user && this.user.jwt) {
      this.checkUserIsLoggedIn(this.user.jwt)
    } else {
      this.loading = false
    }

  }

  private checkUserIsLoggedIn(jwt: string) {
    this.loading = true
    this.userService.checkLoggedIn(jwt)
      .then((response: any) => {
        this.loading = false
        if (response.status == 200 && response.data.id) {
          this.isLogin = true
          this.userData = response.data
          this.updateFormGroup.setValue({ fullName: response.data.fullName, username: response.data.username });
        }
        this.loading = false
      }).catch((error: any) => {
        this.loading = false
        console.log("Error", error)
        this.mainService.openDialog("Login Error", "Invalid credential, kindly login again", "E")
      })
  }

  updateUser() {
    this.loading = true
    const updateData = {
      fullName: this.updateFormGroup.value.fullName,
      username: this.updateFormGroup.value.username
    }

    if (this.user.jwt && this.user.id) {
      this.userService.updateMe(this.user.jwt, updateData, this.user.id)
        .then((res) => {
          this.isLogin = true
          this.user.username = this.updateFormGroup.value.username
          this.user.fullName = this.updateFormGroup.value.fullName
          this.mainService.setToLocalStorage(this.user, Constants.LOCAL_USER)
          this.loading = false
          this.mainService.openDialog("User Info", "Information Updated Successfully", "S", true, false)
        }).catch((err) => {
          this.loading = false
          console.log("Error", err)
          this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

        })
    } else {
      this.loading = false
      this.isLogin = false
    }
  }

  logout() {
    this.mainService.logout()
  }


  getErrors(): string {

    let errorText = ""
    if ((this.updateFormGroup.get('username')?.errors &&
      (this.updateFormGroup.get('username')?.touched || this.updateFormGroup.get('username')?.dirty))
      ||
      (this.updateFormGroup.get('fullName')?.errors &&
        (this.updateFormGroup.get('fullName')?.touched || this.updateFormGroup.get('fullName')?.dirty))
    ) {

      if (this.updateFormGroup.get('fullName')?.errors?.['required']) {
        errorText += "Name is required"
      }

      if (this.updateFormGroup.get('username')?.errors?.['required']) {
        if (errorText?.length > 0) errorText += " & "
        errorText += "Username is required"
      }

      if (this.updateFormGroup.get('fullName')?.errors?.['fullName']) {
        if (errorText?.length > 0) errorText += " & "
        errorText += "Name is invalid"
      }

    }

    return errorText

  }


  ngOnDestroy(): void {
    document.body.classList.remove("cdk-global-scrollblock");
  }





}

