import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { Location } from '@angular/common';
import { AdminService } from '../../admin.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public loading: boolean = true
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
    private _location: Location,
    private restaurantService : RestaurantService
  ) {
  }

  ngOnInit(): void {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.route?.params.subscribe((param: any) => {
          if (param['tableId']) {
            this.tableId = param['tableId']
            this.getSingletable(restaurantSlug, param['tableId'])
          } else {
            this.loading = false
          }
        })
      }
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
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.route?.params.subscribe((param: any) => {
          if (param['tableId']) {
            this.updateTable(restaurantSlug, param['tableId'])
          } else {
            this.addTable(restaurantSlug)
          }

        })
      }
    
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
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.adminService.deleteTable(restaurantSlug, tableId)
          .then((res) => {
            this.loading = false
            this.mainService.openDialog("Success", "Table deleted successfully", "S", true, false)
          }).catch((err) => {
            this.loading = false
            console.log(err)
            this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
          })
      }
  }

  goBackback() {
    this._location.back(); // <-- go back to previous location on cancel
  }

}
