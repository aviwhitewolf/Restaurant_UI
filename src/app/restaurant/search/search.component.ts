import { Component, OnInit } from '@angular/core';
import { MenuDishes } from 'src/app/Constants/Interface/menu-dishes';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from '../restaurant.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SingleDishComponent } from '../single-dish/single-dish.component';
import { Dish } from 'src/app/Constants/Interface/dish';
import { SingleDishBottomSheetComponent } from '../single-dish-bottom-sheet/single-dish-bottom-sheet.component';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public menuAndDishes: MenuDishes[] = []
  public searchMenuAndDishes: MenuDishes[] = []
  public loading: boolean = true
  private routeQueryParams$!: Subscription;
  public search!: string
  private searchingDishName!: string
  private tb : string = ""

  constructor(
    private restaurantSerive: RestaurantService,
    private mainService: MainService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService : RestaurantService,
    private _bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    // to scroll up
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug)
        this.getMenuDishes(restaurantSlug)
  
    this.route.queryParams.subscribe(params => {
      if (params['tb']) this.tb = params['tb']
    });


  }

  private getMenuDishes(slug : string){
    this.loading = true
    if (slug) {
      this.restaurantSerive.getRestaurantMenuAndDishes(slug)
        .then((res: any) => {
          this.menuAndDishes = res
          this.searchMenuAndDishes = this.menuAndDishes
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
      this.loading = false
      this.mainService.openDialog("Error", (404 + ": " + "Invalid url") || "Something went wrong, try again later", "E")
    }
  }

  openDishModal(pMenu: string, dishId: string) {

    if (this.menuAndDishes) {
      const mMenu = this.menuAndDishes.find((menu: any) => menu.name == pMenu)
      if (mMenu) {
        const modalData = mMenu?.dishes.find((dish: Dish) => dish.id == dishId)
        if (modalData) {
          // const dialogRef = this.dialog.open(SingleDishComponent, {
          //   width: '100%',
          //   minWidth: '100vw',
          //   data: modalData,
          //   height: "100%",
          //   panelClass: 'custom-dishmodalbox'
          // });
          // dialogRef.afterClosed().subscribe(result => {
          //   document.body.classList.remove("cdk-global-scrollblock");
          //   this.router.navigate([], { queryParams: { tb: this.tb }, relativeTo: this.route });
          // });


          const bottomSheetRef =  this._bottomSheet.open(SingleDishBottomSheetComponent, {
            data: modalData,
            panelClass : 'custom-single-bottom-dish'
          })

          bottomSheetRef.afterDismissed().subscribe(result => {
            document.body.classList.remove("cdk-global-scrollblock");
            this.router.navigate([], { queryParams: { tb: this.tb }, relativeTo: this.route });
          });


        }
      }
    } else {
      this.mainService.openDialog("Create Order Error", (404 + ": " + "No dish exists") || "Something went wrong, try again later", "E")
    }
  }


  public searchDish(data: string) {
    // this.loading = true
    this.searchingDishName = data.toLocaleLowerCase().trim()
    this.debouncedUpdate()
  }

  debounce = (fn: Function, ms = 800) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  updateState = () => {
    
    this.searchMenuAndDishes = []
    this.menuAndDishes.forEach((menu: any) => {
      const obj: any = {}
      obj.name = menu.name
      const dishes: any[] = []
      menu.dishes.forEach((dish: any) => {
          if (JSON.stringify(dish)?.toLowerCase().includes(this.searchingDishName)) {
              dishes.push(dish)
          }
       
      })
      obj.dishes = dishes
      this.searchMenuAndDishes.push(obj)
    });


    if (!this.searchingDishName) {
      this.searchMenuAndDishes = this.menuAndDishes
    }
    // this.loading = false

  }

  debouncedUpdate = this.debounce(this.updateState);

  ngOnDestroy() {
    this.routeQueryParams$.unsubscribe();
  }

}
