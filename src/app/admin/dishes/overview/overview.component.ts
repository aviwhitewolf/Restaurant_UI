import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

 
  public dishes!: any[]
  public loading: boolean = true
  public showDeleteDialog : boolean = false
  public dishIdToDelete : string = ''
  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private mainService: MainService,
    private restaurantService : RestaurantService
  ) {    
   }

  ngOnInit(): void {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
      if (restaurantSlug) {
        this.getAllDishes(restaurantSlug)
      }
  }


  private getAllDishes(slug: string) {
    this.loading = true
    this.adminService.getAllDishes(slug)
      .then((result) => {
        this.loading = false
        this.dishes = result.data
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })
  }

public deleteDish(dishId : string){
  this.loading = true
  const restaurantSlug = this.restaurantService.getRestaurantSlug()
  if (restaurantSlug) {
      this.adminService.deleteDish(restaurantSlug, dishId)
      .then((result) => {
        this.loading = false
        this.mainService.openDialog("Success", "Dish Deleted Successfully", "S", true)
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })
    }


}

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

}
