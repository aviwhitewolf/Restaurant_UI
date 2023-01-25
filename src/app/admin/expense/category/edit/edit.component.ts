import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/admin/admin.service';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

 
  public loading: boolean = true
  public currencySymbol = ""
  public singleCategory: any

  public categoryUpdateFormGroup: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private mainService: MainService,
    private route: ActivatedRoute,
    private _location: Location
  ) {
    this.currencySymbol = this.mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"
    
  }

  ngOnInit(): void {
    this.route?.parent?.parent?.parent?.params.subscribe((mparam: any) => {
      if (mparam && mparam['slug']) {
        this.route?.params.subscribe((param: any) => {
          if (param['catId']) {
            this.getSingleCategory(mparam['slug'], param['catId'])
          } else {
            this.loading = false
          }
        })
      }
    });
  }

  private getSingleCategory(slug: string, catId: string) {
    this.loading = true
    this.adminService.getSingleCategory(slug, catId)
      .then((result) => {
        this.singleCategory = result.data
        this.categoryUpdateFormGroup.setValue({ name: this.singleCategory.name});
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E", false, true)
      })
  }

  updateOrAddCategory() {
    this.route?.parent?.parent?.parent?.params.subscribe((mparam: any) => {
      if (mparam && mparam['slug']) {
        this.route?.params.subscribe((param: any) => {
          if (param['catId']) {
            this.updateTable(mparam['slug'], param['catId'])
          } else {
            this.addCategory(mparam['slug'])
          }

        })
      }
    });
  }

  updateTable(slug: string, catId: string) {
    this.loading = true
    this.adminService.updateExpenseCategory(this.categoryUpdateFormGroup.value, slug, catId)
      .then((res) => {
        this.loading = false
        this.mainService.openDialog("Success", "Category updated successfully", "S", true, false)
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

  }

  addCategory(slug: string) {
    this.loading = true
    const data = { name: this.categoryUpdateFormGroup.value.name }
    this.adminService.addExpenseCategory(data, slug)
      .then((res) => {
        this.loading = false
        this.mainService.openDialog("Success", "Category created successfully with id:" + res?.data?.id, "S", true, false)
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

  }

  goBackback() {
    this._location.back(); // <-- go back to previous location on cancel
  }
}
