import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { Dish } from 'src/app/Constants/Interface/dish';
import { MainService } from 'src/app/main.service';

@Component({
  selector: 'app-cart-card',
  templateUrl: './cart-card.component.html',
  styleUrls: ['./cart-card.component.css']
})
export class CartCardComponent implements OnInit {


  @Input()
  public dish!: Dish

  @Input()
  public type! : string

  @Input()
  public theme : string = 'user'

  @Output()
  public refreshCart = new EventEmitter<number>();
  public currencySymbol = ""
  constructor(private mainService: MainService) { 
    this.currencySymbol = mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"
  }

  ngOnInit(): void {
  }

  public getJsonData(data : any, key : string){
    return data[key]
  }

  removeDish(name : string) {
    const cartDishes = this.mainService.getToLocalStorage(Constants.LOCAL_CART)
    delete cartDishes[this.dish.id].category[name]
    if(Object.keys(cartDishes[this.dish.id].category).length == 0){
      delete cartDishes[this.dish.id]
    }
    this.mainService.setToLocalStorage(cartDishes, Constants.LOCAL_CART)
    this.refreshCart.emit(parseInt(this.dish.id))
  }

  increaseQuntity(name : string) {
    const cartDishes = this.mainService.getToLocalStorage(Constants.LOCAL_CART)
    cartDishes[this.dish.id].category[name].quantity++
    this.mainService.setToLocalStorage(cartDishes, Constants.LOCAL_CART)
    this.refreshCart.emit(parseInt(this.dish.id))
  }

  decreaseQuntity(name : string) {
    const cartDishes = this.mainService.getToLocalStorage(Constants.LOCAL_CART)
    let quantity = cartDishes[this.dish.id].category[name].quantity
    quantity--
    if (quantity == 0) {
      this.removeDish(name)
    }else{
      cartDishes[this.dish.id].category[name].quantity--
      this.mainService.setToLocalStorage(cartDishes, Constants.LOCAL_CART)
      this.refreshCart.emit(parseInt(this.dish.id))
    }
  }

  public getImageUrl(dish: any) {
    if(typeof dish.image == 'object'){
      return this.mainService.getImageUrl(dish.image ? dish.image[0] : '', Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
    }else{
      return dish.image
    }
    
  }

}
