import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Dish } from 'src/app/Constants/Interface/dish';
import { RestaurantService } from '../restaurant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MainService } from 'src/app/main.service';
import { SingleDishComponent } from '../single-dish/single-dish.component';
import { SnackbarComponent } from 'src/app/reusable/snackbar/snackbar.component';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-single-dish-bottom-sheet',
  templateUrl: './single-dish-bottom-sheet.component.html',
  styleUrls: ['./single-dish-bottom-sheet.component.css']
})
export class SingleDishBottomSheetComponent implements OnInit {

  public dishQuantity!: any

  constructor(

    private _bottomSheetRef: MatBottomSheetRef<SingleDishBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Dish,
    private restaurantService: RestaurantService,
    private _snackBar: MatSnackBar,
    private mainService : MainService

  ) { }

  ngOnInit(): void {
    this.dishQuantity = this.restaurantService.getDishQuantityFromLocal(this.data)
  }
  public changeDishQuantity(category: any, number: number) {

    if (this.dishQuantity[category.name]) {

      if (this.dishQuantity[category.name] + number >= 0) {
        this.dishQuantity[category.name] = this.dishQuantity[category.name] + number
      }

    } else {

      if (number > 0) {
        this.dishQuantity[category.name] = number
      }

    }

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

    this.restaurantService.changeDishQunatityLocaly(
      this.data,
      category.name,
      number,
      category.price,
      category.id
    )
  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image[0], Constants.IMAGE_JSON_STRUCTURE_WITH_ATTRIBUTE)
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
