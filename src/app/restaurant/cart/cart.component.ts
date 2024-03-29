import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { EventHandlerService } from 'src/app/event-handler.service';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public cartItems!: any
  public total: number = 0
  private tb: string = ""

  constructor(
    private router: Router,
    private mainService: MainService,
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private eventManagement: EventHandlerService
  ) {
    this.cartItems = this.mainService.getToLocalStorage(Constants.LOCAL_CART)
    if (this.checkCartItems()) this.calculateTotal()
  }

  ngOnInit(): void {


    this.route.queryParams.subscribe(params => {
      if (params['tb']) this.tb = params['tb']
    });

  }

  getJsonData(data: any): any {
    return data
  }

  getCurrecy(): string|undefined {
  return this.restaurantService.getCurrency()  
  }

  refreshCartItems(id: number) {
    this.eventManagement.broadcast({ name: Constants.CHANGE_IN_CART_ITEMS })
    this.cartItems = this.mainService.getToLocalStorage(Constants.LOCAL_CART)
    if (this.checkCartItems())
      this.calculateTotal()
  }

  calculateTotal() {
    this.total = this.restaurantService.calculateTotal(this.cartItems);
  }

  checkCartItems(): boolean {
    return this.cartItems && Object.values(this.cartItems)?.length > 0 ? true : false
  }

  navigateToCheckout() {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug){
      this.mainService.setshowPaymentStatus(true)
      this.router.navigate(['/restaurant', restaurantSlug, 'payment', 'checkout'], { queryParams: { tb: this.tb } })
    }
  }

}
