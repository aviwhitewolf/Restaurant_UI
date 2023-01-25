import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { MainService } from 'src/app/main.service';
import { AdminService } from 'src/app/admin/admin.service';

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
    private adminService: AdminService,
    private route: ActivatedRoute,
    private mainService : MainService
  ) { 

  }
  ngOnInit(): void {

    this.route?.parent?.parent?.params.subscribe((param: any) => {
      if (param && param['slug']) {
        this.slug = param['slug']
        this.getRestaurantInfo(param['slug'])
      }
    });

  }
  getRestaurantInfo(slug: any) {

    this.adminService.getRestaurantInfo(slug)
    .then((result) => {
      this.restaurantInfo = result?.data?.data?.attributes
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
