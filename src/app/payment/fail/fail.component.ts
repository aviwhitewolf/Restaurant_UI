import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { ErrorMsgComponent } from 'src/app/reusable/error-msg/error-msg.component';

@Component({
  selector: 'app-fail',
  templateUrl: './fail.component.html',
  styleUrls: ['./fail.component.css']
})
export class FailComponent implements OnInit {

  public error: string = ""

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mainService: MainService,
    public dialog: MatDialog,
    private restaurnatService : RestaurantService
  ) {

    this.route.queryParams
      .subscribe((params: any) => {
        this.error = params.error || "Some error occurred, try again after some time"
      }
      )
  }

  ngOnInit(): void {
    this.mainService.setshowPaymentStatus(false)
  }

  navigateToCheckout() {

      const slug = this.restaurnatService.getRestaurantSlug()
      if (slug) {
        this.route.queryParams.subscribe(params => {
          if (params['tb'])
            this.router.navigate(['/restaurant', slug, 'cart'], { queryParams: { tb: params['tb'] } })
        });

      } else {
        this.mainService.openDialog("Error", "Invalid Url", "E", false, true)
      }
    
  }

}
