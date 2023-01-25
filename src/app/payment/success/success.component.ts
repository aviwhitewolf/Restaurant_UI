import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'src/app/main.service';
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
    private route : ActivatedRoute
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
    this.route?.parent?.params.subscribe((param: any) => {
      if (param && param['name']) {
        
        this.route.queryParams.subscribe(params => {
          if (params['tb']) 
          this.router.navigate(['/restaurant', param['name'], 'orders'], {queryParams : { tb : params['tb']}}) 
        });
    
      }else{
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
