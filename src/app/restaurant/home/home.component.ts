import { Component, HostListener, OnInit } from '@angular/core';
import { Dish } from 'src/app/Constants/Interface/dish';
import { MenuDishes } from 'src/app/Constants/Interface/menu-dishes';
import { RestaurantService } from '../restaurant.service';
import { MatDialog } from '@angular/material/dialog';
import { SingleDishComponent } from 'src/app/restaurant/single-dish/single-dish.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/main.service';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { Location } from '@angular/common';
import { PlatformLocation } from '@angular/common' 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss',]
})
export class HomeComponent implements OnInit {

  public menuAndDishes: MenuDishes[] = []
  public loading: boolean = true
  public selectedtheme?: string
  public themes = Constants.THEME
  private routeQueryParams$!: Subscription;
  public userInfo: string = ""
  private tb: string = ""

  constructor(
    public restaurantService: RestaurantService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private mainService: MainService,
    private _location: Location,
    private location: PlatformLocation
  ) {
    this.selectedtheme = this.mainService.getToLocalStorage(Constants.LOCAL_USER).theme || "grid"
    this.userInfo = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt ? this.mainService.getToLocalStorage(Constants.LOCAL_USER).username : "Login / Signup"
  
  }

  ngOnInit(): void {
    this.route?.parent?.params.subscribe((param: any) => {
      if (param && param['name']) {
        this.fetchMenuAndDishes(param['name'] || "")
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['tb']) this.tb = params['tb']
    });
  }


  fetchMenuAndDishes(slug: string) {
    this.loading = true
    if (slug) {
      this.restaurantService.getMenuAndDishes(slug)
        .then((res: any) => {
          this.menuAndDishes = res

          // subscribe to open dish dialog using url change
          this.routeQueryParams$ = this.route.queryParams.subscribe(params => {
            if (params['dishInfo'] && params['menu']) {
              this.openDishModal(params['menu'], params['dishId']);
            }
          });
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
          this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
        })
    } else {
      this.mainService.openDialog("Error", (404 + ": " + "Invalid url") || "Something went wrong, try again later", "E")
    }
  }


  openDishModal(pMenu: string, dishId: string) {

    if (this.menuAndDishes) {
      const mMenu = this.menuAndDishes.find((menu: any) => menu.name == pMenu)
      if (mMenu) {
        const modalData = mMenu?.dishes.find((dish: Dish) => dish.id == dishId)
        if (modalData) {
          
          document.body.classList.add("no-parent-scroll");
          const dialogRef = this.dialog.open(SingleDishComponent, {
            width: '100%',
            minWidth: '100vw',
            data: modalData,
            height: "100%",
            panelClass: 'custom-dishmodalbox',
            closeOnNavigation: true
          });
          dialogRef.afterClosed().subscribe(result => {

            document.body.classList.remove("no-parent-scroll");
            this.router.navigate([], { queryParams: { tb: this.tb } });
            // this.goBackback()
          });
        }
      }
    } else {
      this.loading = false
      this.mainService.openDialog("Error", (404 + ": " + "No dish exists") || "Something went wrong, try again later", "E")

    }
  }

  changeTheme(theme: string) {

    const user = this.mainService.getToLocalStorage(Constants.LOCAL_USER)
    if (this.themes.find((e) => e.name == theme)) {
      user.theme = theme
      this.mainService.setToLocalStorage(user, Constants.LOCAL_USER)
      this.selectedtheme = theme
    }

  }
  goBackback() {
    this._location.back(); // <-- go back to previous location on cancel
  }

  changeUrlToOpenUserInfo() {
    this.router.navigate([], { queryParams: { userInfo: true, tb: this.tb } });
  }

  ngOnDestroy() {
    this.routeQueryParams$.unsubscribe();
  }



}


