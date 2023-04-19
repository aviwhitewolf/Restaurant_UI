import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { ErrorMsgComponent } from 'src/app/reusable/error-msg/error-msg.component';


@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  public message: string = ""

  constructor(
    private mainService: MainService,
    private router: Router,
    public dialog: MatDialog,
    private route : ActivatedRoute,
    private restaurantService : RestaurantService
  ) { 

    this.route.queryParams
    .subscribe((params: any) => {
      this.message = params.message || "Success"
    }
    )

  }

  ngOnInit(): void {
    this.mainService.setshowPaymentStatus(false)
  }

  navigateToOrders() {

    const slug = this.restaurantService.getRestaurantSlug()
      if (slug) {  
        this.route.queryParams.subscribe(params => {
          if (params['tb']) 
          this.router.navigate(['/restaurant', slug, 'orders'], {queryParams : { tb : params['tb']}}) 
        });
      }else{
        this.mainService.openDialog("Error", "Invalid Url", "E", false, true)
      }
  }
}
