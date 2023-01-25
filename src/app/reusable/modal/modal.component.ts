import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { Dish } from 'src/app/Constants/Interface/dish';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';

@Component({
  selector: 'app-dish-category-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  public dish!: Dish
  public dishQuantity!: any

  @Output() changeQuantity = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private restaurantService: RestaurantService) {
      
    if (this.data) {
      this.dish = this.data
    }
    this.dishQuantity = this.restaurantService.getDishQuantityFromLocal(this.dish)
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    
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

    this.changeQuantity.emit({ category, number })

  }



}


