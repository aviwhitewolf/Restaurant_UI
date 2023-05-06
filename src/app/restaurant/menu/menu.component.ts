import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { EventHandlerService } from 'src/app/event-handler.service';
import { MainService } from 'src/app/main.service';
import { UserInfoComponent } from 'src/app/user/user-info/user-info.component';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public cartItems: any
  public cartNotification: boolean = false
  public menus = Constants.MENUS
  public cartCount: number = 0
  private routeQueryParams$!: Subscription;
  public tb: string = ""
  public showPrivacyPolicyPopup: boolean = false


  constructor(
    public dialog: MatDialog,
    private mainService: MainService,
    private restaurantService: RestaurantService,
    private router: Router,
    private route: ActivatedRoute,
    private eventManagement: EventHandlerService
  ) {

    this.cartCount = this.restaurantService.getDishCountFromLocal()

  }

  ngOnInit(): void {

    this.privacyPolicyPopUp()

    this.cartItems = this.mainService.getToLocalStorage(Constants.LOCAL_CART)
    this.cartNotification = this.checkCartItems()
    this.router.events.subscribe(params => {
      this.cartNotification = this.checkCartItems()
    });

    // subscribe to url to open user info dialog
    this.routeQueryParams$ = this.route.queryParams.subscribe(params => {
      if (params['userInfo']) {
        this.openUserInfoDialog();
      }

      if (params['tb']) this.tb = params['tb']
    });


    this.eventManagement.subscribe(Constants.CHANGE_IN_CART_ITEMS, () => {
      this.cartCount = this.restaurantService.getDishCountFromLocal()
    })
  }
  privacyPolicyPopUp() {
    const user = this.mainService.getToLocalStorage(Constants.LOCAL_USER)
    if(!user?.privacyPolicyConsent) this.showPrivacyPolicyPopup = true
  }

  checkCartItems(): boolean {
    return this.cartItems && Object.values(this.cartItems)?.length > 0 ? true : false
  }


  openUserInfoDialog() {

    const dialogRef = this.dialog.open(UserInfoComponent, {
      width: '80%',
      maxWidth: '30rem',
      panelClass: 'custom-user-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate([], { queryParams: { tb: this.tb }, relativeTo: this.route },);
    });
  }



  changePrivacyPolicyConsent() {
    const user = this.mainService.getToLocalStorage(Constants.LOCAL_USER)
    if (user) {
      user.privacyPolicyConsent = true
      console.log(user)
      this.mainService.setToLocalStorage(user, Constants.LOCAL_USER)
      this.showPrivacyPolicyPopup = false
    }
  }

  ngOnDestroy() {
    this.routeQueryParams$.unsubscribe();
  }

}
