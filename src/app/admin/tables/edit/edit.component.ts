import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { Location } from '@angular/common';
import { AdminService } from '../../admin.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public loading: boolean = true
  public currencySymbol = ""
  public singleTable: any
  private tableId: string = ""

  public tableUpdateFormGroup: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    slug: [{ value: '', disabled: true }],
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
    this.route?.parent?.parent?.params.subscribe((mparam: any) => {
      if (mparam && mparam['slug']) {
        this.route?.params.subscribe((param: any) => {
          if (param['tableId']) {
            this.tableId = param['tableId']
            this.getSingletable(mparam['slug'], param['tableId'])
          } else {
            this.loading = false
          }
        })
      }
    });
  }

  private getSingletable(slug: string, tableId: string) {
    this.loading = true
    this.adminService.getSingleTable(slug, tableId)
      .then((result) => {
        this.singleTable = result.data
        this.tableUpdateFormGroup.setValue({ name: this.singleTable.name, slug: this.singleTable.slug });
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E", false, true)
      })
  }

  updateOrAddTable() {
    this.route?.parent?.parent?.params.subscribe((mparam: any) => {
      if (mparam && mparam['slug']) {
        this.route?.params.subscribe((param: any) => {
          if (param['tableId']) {
            this.updateTable(mparam['slug'], param['tableId'])
          } else {
            this.addTable(mparam['slug'])
          }

        })
      }
    });
  }

  updateTable(slug: string, tableId: string) {
    this.loading = true
    this.adminService.updateTable(this.tableUpdateFormGroup.value, slug, tableId)
      .then((res) => {
        this.loading = false
        this.mainService.openDialog("Success", "Table updated successfully", "S", true, false)
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

  }

  addTable(slug: string) {
    this.loading = true
    const data = { name: this.tableUpdateFormGroup.value.name, slug: this.tableUpdateFormGroup.value?.name?.toLocaleLowerCase().replaceAll(' ', '-') }
    this.adminService.addTable(data, slug)
      .then((res) => {
        this.loading = false
        this.mainService.openDialog("Success", "Table created successfully with id:" + res?.data?.id, "S", true, false)
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

  }

  deleteTable(tableId: string) {
    this.loading = true
    this.route?.parent?.parent?.params.subscribe((param: any) => {
      if (param && param['slug']) {
        this.adminService.deleteTable(param['slug'], tableId)
          .then((res) => {
            this.loading = false
            this.mainService.openDialog("Success", "Table deleted successfully", "S", true, false)
          }).catch((err) => {
            this.loading = false
            console.log(err)
            this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
          })
      }
    })
  }

  goBackback() {
    this._location.back(); // <-- go back to previous location on cancel
  }

}
