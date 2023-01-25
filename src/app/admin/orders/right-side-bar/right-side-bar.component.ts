import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { filter, map, pairwise, throttleTime } from 'rxjs';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-right-side-bar',
  templateUrl: './right-side-bar.component.html',
  styleUrls: ['./right-side-bar.component.css']
})
export class RightSideBarComponent implements OnInit {


  @Input()
  order!: any


  @Output()
  closeBar = new EventEmitter<any>();

  public orders: Array<any> = []
  private page: number = 0
  private pageSize: number = 20
  public loading: boolean = true
  public currencySymbol = ""
  private startDate!: string
  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;


  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private mainService: MainService,
    private ngZone: NgZone,
    private router: Router,
  ) {
    this.currencySymbol = this.mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"
  }

  ngOnInit(): void {
    this.route?.parent?.parent?.params.subscribe((mparam: any) => {
      if (mparam && mparam['slug']) {
        this.route?.params.subscribe((param: any) => {
          const currentDate = moment(this.order?.createdAt).toISOString()
          const oneMonthBefore = moment(currentDate).subtract(30, "days").toISOString()
          this.startDate = oneMonthBefore
          const oneMonthAfter = moment(new Date()).toISOString()
          this.loading = true
          this.getAllOrders(mparam['slug'], 0, 0, oneMonthBefore, oneMonthAfter)
        })
      }
    });
  }

  ngAfterViewInit(): void {
    this.scroller?.elementScrolled().pipe(
      map(() => this.scroller.measureScrollOffset('bottom')),
      pairwise(),
      filter(([y1, y2]) => (y2 < y1 && y2 < 140)),
      throttleTime(700)
    ).subscribe(() => {
      this.ngZone.run(() => {
        this.loading = true
        this.page = this.page + 1
        this.nextBatch(this.page);
      });
    }
    );
  }




  getAllOrders(slug: string, page: number, pageSize: number, start: string = "", end: string = "") {

    
    this.adminService.getMyOrders(start, end, slug, page, pageSize)
      .then((res: any) => {

        this.orders = this.orders.concat(res.data.data);
        this.loading = false

      }).catch((err) => {

        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

      })

  }




  getStepStatus(order: any) {

    let stepStatus = { payment: false, food: false, delivered: false }

    if (order?.status == 'success') {
      stepStatus.payment = true
    }
    
    if (order?.foodStatus == 'ready' || order?.foodStatus ==  'served') {
      stepStatus.food = true
    }

    if (order?.foodStatus == 'served') {
      stepStatus.delivered = true
    }

    return stepStatus

  }

  toggleRightSideBar(status: boolean) {
    this.closeBar.emit(status)
  }

  nextBatch(page: number) {
    this.route?.parent?.parent?.params.subscribe((mparam: any) => {
      if (mparam && mparam['slug']) {
        this.route?.params.subscribe((param: any) => {
          this.getAllOrders(mparam['slug'], page, this.pageSize, this.startDate)
        })
      }
    });
  }

  trackByOrderId(index: number, item: any) {
    return item.orderId
  }


  scrollToFragment(index : number) {

    if(this.scroller.getRenderedRange().end == index){
      

    const fragment = this.router.parseUrl(this.router.url).fragment;
    if (fragment) {
      const element = document.getElementById(fragment);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
   
  }
  }
}



