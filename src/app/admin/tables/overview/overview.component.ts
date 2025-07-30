import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MainService } from 'src/app/main.service';
import { ActivatedRoute } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { AdminService } from '../../admin.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  public tables: any
  public elementType = NgxQrcodeElementTypes.IMG
  public correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH
  public qrCodeScale = Constants.QRCODE_SCALE
  public slug = ''
  public showDownloadQrCodes: boolean = false
  public selectedTable: any
  public loading : boolean = true
  public showDeleteDialog : boolean = false
  public tableToDelete : any

  constructor(
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
        this.slug = restaurantSlug
        this.getAllTables(restaurantSlug)
      }
    
  }
  getAllTables(slug: any) {
    this.loading = true
    this.adminService.getAllTables(slug)
      .then((result) => {
        this.tables = result.data.tables
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })
  }

  getValue(tableName: string) {

    if (this.slug) {
      return `/restaurant/${this.slug}/welcome/${tableName}`
    }
    return ''
  }

  deleteTable(tableId : string){
    this.loading = true
    if (this.slug) {
    this.adminService.deleteTable(this.slug, tableId)
    .then((result) => {
      this.loading = false
      this.mainService.openDialog("Success", "Table deleted successfully", "S", true, false)
    }).catch((err) => {
      this.loading = false
      console.log(err)
      this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
    })
    }
  }

  getRestaurantName() {
    if (this.slug) {
      return this.slug.toLowerCase().split('-').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
    }
    return
  }

  goBackback() {
    this._location.back(); // <-- go back to previous location on cancel
  }

}
