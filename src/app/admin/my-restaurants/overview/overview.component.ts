import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  public restaurants : any
  public loading : boolean = true

  constructor(
    private adminService : AdminService,
    private mainService : MainService
    ) { 
    }

  ngOnInit(): void {
    this.getAllAssignedRestaurants()
  }
  
  private getAllAssignedRestaurants() {
    this.loading = true
    this.adminService.getAllRestaurantAssigned()
    .then((results) => {
      this.restaurants = results.data.restaurants || []
      this.loading = false
    }).catch((err) => {
      this.loading = false
      console.log(err)
      this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
   
    })
  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }


}
