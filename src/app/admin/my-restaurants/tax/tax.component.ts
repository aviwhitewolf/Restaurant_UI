import { Component, OnInit } from '@angular/core';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { AdminService } from '../../admin.service';
import { MainService } from 'src/app/main.service';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.css']
})
export class TaxComponent implements OnInit {


  public loading: boolean = false
  public taxes: any[] = []
  public showDeleteDialog: boolean = false
  public taxToDelete: any
  public taxIdToDelete: any


  constructor(
    private restaurantService: RestaurantService,
    private adminService: AdminService,
    private mainService : MainService
  ) {


  }

  ngOnInit(): void {
    this.getTaxes()
  }

  private getTaxes() {

    this.loading = true
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
      this.adminService.getTaxes(restaurantSlug)
        .then((results) => {
          this.taxes = results.data
          this.loading = false
        }).catch((err) => {
          this.loading = false
          console.log(err)
          
        })
    }
  }

  deleteTax(taxId: string) {
    this.loading = true
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.adminService.deleteTax(restaurantSlug, taxId)
          .then((res) => {
            this.loading = false
            this.mainService.openDialog("Success", "Tax deleted successfully", "S", true, false)
          }).catch((err) => {
            this.loading = false
            console.log(err)
            this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
          })
      }
  }



}
