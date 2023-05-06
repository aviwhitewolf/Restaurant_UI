import { Component, Input, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';

@Component({
  selector: 'app-print-qrcode',
  templateUrl: './print-qrcode.component.html',
  styleUrls: ['./print-qrcode.component.css']
})
export class PrintQrcodeComponent implements OnInit {


  @Input()
  public table : any
  public elementType = NgxQrcodeElementTypes.IMG
  public correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH
  public qrCodeScale = Constants.QRCODE_SCALE
  public restaurantInfo : any

  constructor(
    private restaurantService: RestaurantService,
    private mainService : MainService
  ) { 

  }
  ngOnInit(): void {
    this.restaurantInfo = this.restaurantService.getRestaurantData()
  }


  getValue(tableslug: string) {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()

    if (restaurantSlug) {
      return Constants.UI_DOMAIN + `/restaurant/${restaurantSlug}/welcome/${tableslug}`
    }
    return ''
  }


  getRestaurantSocialMedia(){

    return this.restaurantService.getRestaurantData()?.socialMedia || []

  }


  getImageUrl(image : any){
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE, Constants.IMAGE_SIZE.normal)
  }






}
