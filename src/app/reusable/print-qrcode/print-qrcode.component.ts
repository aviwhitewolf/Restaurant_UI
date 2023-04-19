import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { MainService } from 'src/app/main.service';
import { AdminService } from 'src/app/admin/admin.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';

@Component({
  selector: 'app-print-qrcode',
  templateUrl: './print-qrcode.component.html',
  styleUrls: ['./print-qrcode.component.css']
})
export class PrintQrcodeComponent implements OnInit {


  @Input()
  public table : any

  public restaurantInfo : any
  private slug : string = ''
  public elementType = NgxQrcodeElementTypes.IMG
  public correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH
  public qrCodeScale = Constants.QRCODE_SCALE

  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private mainService : MainService
  ) { 

  }
  ngOnInit(): void {

    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.slug = restaurantSlug
        this.getRestaurantInfo(restaurantSlug)
      }
  }
  getRestaurantInfo(slug: any) {

    this.restaurantService.getRestaurantInfo(slug)
    .then((result) => {
      this.restaurantInfo = result
    }).catch((err) => {
      
      console.log(err)
      this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
    })

  }


  getValue(slug: string) {

    if (this.slug) {
      return Constants.UI_DOMAIN + `/welcome/${this.slug}/${slug}`
    }
    return ''
  }





}
