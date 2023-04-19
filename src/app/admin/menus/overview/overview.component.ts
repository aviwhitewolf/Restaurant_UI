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

  public menu: any
  public loading: boolean = true
  public showDeleteDialog: boolean = false
  public menuIdToDelete: string = ""

  constructor(
    private adminService: AdminService,
    private mainService: MainService,
    private route: ActivatedRoute,
    private restaurantService : RestaurantService
  ) {
  }

  ngOnInit(): void {
    this.getAllMenuAndDishes()
  }

  private getAllMenuAndDishes() {
    this.loading = true
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.adminService.getMenuAndDishes(restaurantSlug)
          .then((results) => {
            this.menu = results.data
            this.loading = false
          }).catch((err) => {
            this.loading = false
            console.log(err)
            this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
          })
      }
    

  }

  deleteMenu(menuId: string) {
    this.loading = true
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.adminService.deleteMenu(menuId, restaurantSlug)
          .then((results) => {
            this.menuIdToDelete = ""
            this.getAllMenuAndDishes()
            this.loading = false
            this.mainService.openDialog("Success", "Menu deleted successfully", "S")
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
