import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dish } from 'src/app/Constants/Interface/dish';
import { SnackbarComponent } from 'src/app/reusable/snackbar/snackbar.component';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-single-dish',
  templateUrl: './single-dish.component.html',
  styleUrls: ['./single-dish.component.css']
})
export class SingleDishComponent implements OnInit, OnDestroy {

  public dishQuantity!: any

  constructor(
    public dialogRef: MatDialogRef<SingleDishComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Dish,
    private restaurantService: RestaurantService,
    private _snackBar: MatSnackBar
  ) {
    // document.body.classList.add("cdk-global-scrollblock");
  }

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
  ngOnDestroy(): void {

  }



}
