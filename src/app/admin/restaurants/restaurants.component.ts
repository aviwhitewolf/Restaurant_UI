import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {

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
