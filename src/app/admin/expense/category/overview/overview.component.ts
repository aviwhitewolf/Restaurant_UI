import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/admin/admin.service';
import { MainService } from 'src/app/main.service';
import toMaterialStyle from 'material-color-hash'
import { RestaurantService } from 'src/app/restaurant/restaurant.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  public loading: boolean = false
  public expenseCategories: any
  public showDeleteDialog: boolean = false
  public categoryIdToDelete : string = ""

  constructor(
    private route: ActivatedRoute,
    private adminService : AdminService,
    private mainService: MainService,
    private restaurantService : RestaurantService
    ) { }

  ngOnInit(): void {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.getExpenseCategory(restaurantSlug)
      }
    
  }
  getExpenseCategory(slug : string) {
    this.loading = true
    this.adminService.getExpenseCategory(slug)
      .then((res) => {
        this.expenseCategories = res?.data
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log("Error", err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })
  }

  deleteCategory(catId: string) {
    this.loading = true
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.adminService.deleteExpenseCategory(restaurantSlug, catId)
          .then((res) => {
            this.loading = false
            this.mainService.openDialog("Success", "Category deleted successfully", "S", true, false)
          }).catch((err) => {
            this.loading = false
            console.log(err)
            this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
          })
      }
  }


  getColor(name : string, key : string){
    const colors = toMaterialStyle(name,700)
    return key == 'color' ? colors['color'] : colors['backgroundColor']
  }

}
