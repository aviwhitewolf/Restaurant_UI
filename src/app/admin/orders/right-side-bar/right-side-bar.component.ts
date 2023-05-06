import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { filter, map, pairwise, throttleTime } from 'rxjs';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-right-side-bar',
  templateUrl: './right-side-bar.component.html',
  styleUrls: ['./right-side-bar.component.css']
})
export class RightSideBarComponent implements OnInit, AfterViewInit {


  @Input()
  order!: any


  @Output()
  closeBar = new EventEmitter<any>();

  public orders: Array<any> = []
  private userId!: string
  private page: number = 0
  private pageSize: number = 20
  public loading: boolean = true
  private startDate!: string
  private isLastItem: boolean = false
  public reachedToSelectedOrder: boolean = false
  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;


  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private mainService: MainService,
    private ngZone: NgZone,
    private router: Router,
    private restaurantService : RestaurantService
  ) {
    this.userId = this.mainService.getToLocalStorage(Constants.LOCAL_USER).id
  }

  ngOnInit(): void {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.route?.params.subscribe((param: any) => {
          const currentDate = moment(this.order?.createdAt).toISOString()
          const oneMonthBefore = moment(currentDate).subtract(30, "days").toISOString()
          const oneMonthAfter = moment(new Date()).toISOString()
          this.loading = true
          this.getAllOrders(restaurantSlug, 0, this.pageSize, oneMonthBefore, oneMonthAfter)
        })
      }
    
  }

  ngAfterViewInit(): void {

    this.scroller?.elementScrolled().pipe(
      map(() => this.scroller.measureScrollOffset('bottom')),
      pairwise(),
      filter(([y1, y2]) => (y2 < y1 && y2 < 140)),
      throttleTime(700)
    ).subscribe(() => {
      this.ngZone.run(() => {

        if (!this.isLastItem) {
          this.loading = true
          this.page = this.page + 1
          this.nextBatch(this.page)

        }
      });
    }
    );

  }




  getAllOrders(slug: string, page: number, pageSize: number, start: string = "", end: string = "") {

    this.adminService.getMyOrders(start, end, slug, page, pageSize)
      .then((res: any) => {
        if (res?.data?.data?.length == 0) this.isLastItem = true
        this.orders = this.orders.concat(res.data.data);
        this.loading = false
        let pageCount = null
        if(res?.data?.meta?.pagination?.pageCount != undefined && res?.data?.meta?.pagination?.pageCount != null){
          pageCount = res?.data?.meta?.pagination?.pageCount
        }
          
        if (pageCount && pageCount <= this.page) {
          this.loading = true
          this.page = this.page + 1
          this.nextBatch(this.page)
        }

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

    if (order?.foodStatus == 'ready' || order?.foodStatus == 'served') {
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
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.route?.params.subscribe((param: any) => {
          if (!this.startDate) {
            this.startDate = moment(this.orders[this.orders?.length - 1].createdAt).toISOString()
          }
          this.getAllOrders(restaurantSlug, page, this.pageSize, this.startDate)
        })
      }
    
  }

  trackByOrderId(index: number, item: any) {
    return item.orderId
  }


  scrollToFragment(index: number) {

    if (this.scroller.getRenderedRange().end == index) {

      const fragment = this.router.parseUrl(this.router.url).fragment;
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }

    }
  }

  checkOrderRead(metadata: any): boolean {

    if (metadata?.readBy[this.userId]) {
      return false
    }
    return true
  }

  getDateFromTimeX(date: string) {
    return moment(date).fromNow()
  }

  scrollToOrder() {

    if (!this.reachedToSelectedOrder) {
      const selectedIndex = this.binarySearch()
      if (selectedIndex > -1) {
        document.getElementById(this.order.orderId);
        this.scroller.scrollToIndex(selectedIndex);
        
      }
    }
  }

  stopScroll() {
    if(!this.reachedToSelectedOrder)
      this.reachedToSelectedOrder = true
  }

  private binarySearch() {

    let start = 0;
    let end = this.orders?.length - 1;

    while (start <= end) {
      let mid = Math.floor(start + ((end - start) / 2));

      if (this.orders[mid].id == this.order.id) {
        return mid;
      } else if (this.order.id < this.orders[mid].id) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
    return -1;
  }


}



