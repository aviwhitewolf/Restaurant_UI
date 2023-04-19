import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dish } from 'src/app/Constants/Interface/dish';
import { MainService } from 'src/app/main.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/reusable/snackbar/snackbar.component';
import { Constants } from 'src/app/Constants/Interface/Constants';

@Component({
  selector: 'app-dish-card',
  templateUrl: './dish-card.component.html',
  styleUrls: ['./dish-card.component.scss']
})
export class DishCardComponent implements OnInit {

  @Input()
  dish!: Dish

  @Input()
  theme!: string

  @Output()
  public openDishInfo = new EventEmitter<Dish>();
  public showCategoryMenu: boolean = false

  constructor(
    public dialog: MatDialog,
    private restaurantService: RestaurantService,
    private mainService: MainService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
  }

  public addToCart() {
    this.showCategoryMenu = true
    this.openDialog(this.dish)
  }

  public getCategoryString(): string {
    return this.dish.category.map((i: any) => " " + i.name).toString()
  }

  dishInfo(dish: Dish) {
    this.openDishInfo.emit(dish)
  }

  openDialog(dish: Dish) {
    history.pushState({}, "");    
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '80%',
      maxWidth: '50rem',
      data: dish,
      panelClass: 'custom-modalbox',
      closeOnNavigation: true
    });

    dialogRef.componentInstance.changeQuantity.subscribe((mData: any) => {

      this.restaurantService.changeDishQunatityLocaly(this.dish, mData.category.name, mData.number, mData.category.price, mData.category.id)

      this._snackBar.openFromComponent(SnackbarComponent, {
        data: {
          message: 'Updated cart successfully',
          type: 'S'
        },
        panelClass: 'snack-bar',
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1700
      });

    });

  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

}
