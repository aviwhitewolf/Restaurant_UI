import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'src/app/main.service';
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
    public dialog: MatDialog
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

    this.route?.parent?.params.subscribe((param: any) => {
      if (param && param['name']) {
        this.route.queryParams.subscribe(params => {
          if (params['tb'])
            this.router.navigate(['/restaurant', param['name'], 'cart'], { queryParams: { tb: params['tb'] } })
        });

      } else {
        this.mainService.openDialog("Error", "Invalid Url", "E")
      }
    });
  }

  private openDialog(heading: string, error: string, type: string) {
    this.dialog.open(ErrorMsgComponent, {
      data: {
        message: error,
        type: type,
        heading: heading
      },
      panelClass: 'popUp-modalbox'
    });
  }

}
