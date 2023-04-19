import { Injectable } from '@angular/core';
import axios from 'axios';
import { Constants } from '../Constants/Interface/Constants';
import { MainService } from '../main.service';
import { OrderDishCategory } from './Interface/OrderDishCategory';
import { OrderInfo } from './Interface/OrderInfo';
import { OrderItems } from './Interface/OrderItems';

@Injectable({
  providedIn: 'root'
})

export class PaymentService {

  constructor(private mainService: MainService) { }

  getOrderInfo(slug : string): OrderInfo {
    const cartItems = this.mainService.getToLocalStorage(Constants.LOCAL_CART)

    const orderInfo: OrderInfo = {
      "user": this.mainService.getToLocalStorage(Constants.LOCAL_USER).id,
      "restaurantSlug": slug,
      "orderItems": [],
      "table" : "",
      "modeOfPayment" : ""
    }

    for (const key in cartItems) {
      if (Object.prototype.hasOwnProperty.call(cartItems, key)) {
        const dish = cartItems[key];
        const obj: OrderItems = { "dish": dish.id, "orderDishCategory": [] }
        for (const mkey in dish.category) {
          if (Object.prototype.hasOwnProperty.call(dish.category, mkey)) {
            const category = dish.category[mkey];
            const mCatObj: OrderDishCategory = {
              quantity: category.quantity,
              name: category.name,
              id: category.id,
            }
            obj.orderDishCategory.push(mCatObj)
          }
          orderInfo.orderItems.push(obj)
        }
      }
    }

    return orderInfo

  }

  createOrder(orderInfo: OrderInfo, table : string, modeOfPayment : string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    orderInfo.table = table
    orderInfo.modeOfPayment = modeOfPayment
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.post(Constants.BASE_URL + Constants.CREATE_ORDER_URL , orderInfo, { headers })
  }

  getAllTables(slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.TABLE + `?slug=${slug}`
    return axios.get(url, { headers })

  }

}

