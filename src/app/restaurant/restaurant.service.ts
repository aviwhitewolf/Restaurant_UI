import { Injectable } from '@angular/core';
import * as qs from 'qs';
import axios from 'axios'
import { Constants } from '../Constants/Interface/Constants';
import { MainService } from '../main.service';
import { Dish } from '../Constants/Interface/dish';
import { MenuDishes } from '../Constants/Interface/menu-dishes';
import { EventHandlerService } from '../event-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {


  public menuAndDishes: MenuDishes[] = []
  private restaurantData: any
  constructor(
    private mainService: MainService,
    private eventManagement: EventHandlerService
  ) { }

  /*
  ** @param restaurantName : Name of the Restaurant
  ** @return Promise with list of menus and dishes 
  */
  getRestaurantMenuAndDishes(restaurantSlug: string, restaurantInfoOnly: boolean = false) {

    return new Promise(async (resolve, reject) => {

      try {

        if (!this.menuAndDishes || !this.menuAndDishes[0]) {
          const query = qs.stringify({
            populate: {
              menus: {
                sort: ['sequence'],
                fields: ['name'],
                populate: {
                  dishes: {
                    fields: ['*'],
                    populate: {
                      image: {
                        fields: ["url", "alternativeText", "formats"]
                      },
                      category: {
                        fields: ["*"]
                      },
                      tags: {
                        fields: ["name"]
                      }
                    }
                  }
                }
              },
              image: {
                fields: ['*']
              },
              logo: {
                fields: ['*']
              },
              socialMedia: {
                fields: ['*'],
                populate: {
                  icon: {
                    fields: ['*']
                  }
                }
              }
            },
            filters: {
              slug: {
                $eq: restaurantSlug
              }
            }
          }, {
            encodeValuesOnly: true,
          });


          const response = await axios.get(Constants.BASE_URL + Constants.RESTAURANT_URL + `?${query}`);
          const getMenuAndDishesData = response?.data?.data[0]?.attributes?.menus

          getMenuAndDishesData?.data?.forEach((item: any) => {
            const obj: any = {}
            obj.name = item?.attributes?.name
            obj.dishes = item?.attributes?.dishes?.data?.map((item: any) => {
              let mDish: Dish = {
                id: "",
                name: "",
                tags: [""],
                description: "",
                currency: "",
                images: [],
                type: "",
                category: {},
                image: "",
                inStock: false,
                price: 0.0
              }
              const largeImage = item.attributes.image.data[0].attributes.formats?.large?.url
              const thumbnailImage = item.attributes.image.data[0].attributes.formats?.thumbnail?.url
              const mediumImage = item.attributes.image.data[0].attributes.formats?.medium?.url
              const smallImage = item.attributes.image.data[0].attributes.formats?.small?.url
              let imageToDisplay = ""

              if (mediumImage) {
                imageToDisplay = Constants.BASE_URL + mediumImage
              } else if (smallImage) {
                imageToDisplay = Constants.BASE_URL + smallImage
              } else if (thumbnailImage) {
                imageToDisplay = Constants.BASE_URL + thumbnailImage
              } else if (largeImage) {
                imageToDisplay = Constants.BASE_URL + largeImage
              }

              mDish.name = item?.attributes?.name
              mDish.id = item?.id
              mDish.description = item?.attributes?.description
              mDish.currency = item?.attributes?.currency
              mDish.price = item?.attributes?.price
              mDish.image = imageToDisplay
              mDish.inStock = item?.attributes?.inStock
              mDish.category = item?.attributes?.category
              mDish.type = item?.attributes?.type
              mDish.tags = item?.attributes?.tags?.data?.map((tag: any) => tag?.attributes?.name)
              mDish.images = item?.attributes?.image?.data?.map((item: any) => {
                return Constants.BASE_URL + item?.attributes?.url
              })
              return mDish
            })
            this.menuAndDishes.push(obj)
          });

        }
        resolve(this.menuAndDishes)

      } catch (error) {
        reject(error)
      }

    })

  }

  public getDishQuantityFromLocal(dish: Dish): any {
    const cartDishes = this.mainService.getToLocalStorage(Constants.LOCAL_CART)
    const dishQuantity: any = {}
    if (cartDishes && cartDishes[dish.id])
      dish.category.find((item: any) => {
        if (cartDishes[dish.id].category[item.name]) {
          dishQuantity[item.name] = cartDishes[dish.id].category[item.name].quantity
        }
      })
    return dishQuantity
  }

  public getDishCountFromLocal(): number {
    let cartDishCount = 0
    const cartItems = this.mainService.getToLocalStorage(Constants.LOCAL_CART) || {}
    for (const key in cartItems) {
      cartDishCount = cartDishCount + Object.keys(cartItems[key]['category'])?.length
    }
    return cartDishCount
  }

  public changeDishQunatityLocaly(dish: Dish, categoryName: string, number: number, price: number, id: string) {

    //getting all cartsDishes
    const cartDishes = this.mainService.getToLocalStorage(Constants.LOCAL_CART) || {}

    if (cartDishes && cartDishes[dish.id]) {
      if (cartDishes[dish.id].category[categoryName]) {
        if (cartDishes[dish.id].category[categoryName].quantity + number > 0) {
          cartDishes[dish.id].category[categoryName].quantity = cartDishes[dish.id].category[categoryName].quantity + number
        }
        else {
          delete cartDishes[dish.id].category[categoryName]
        }
      } else {
        if (number > 0)
          cartDishes[dish.id].category[categoryName] = { id: id, "name": categoryName, "price": price, "quantity": 1 }
      }

      if (cartDishes[dish.id].category && (Object.keys(cartDishes[dish.id].category)?.length === 0))
        delete cartDishes[dish.id]

      this.mainService.setToLocalStorage(cartDishes, Constants.LOCAL_CART)

    } else {

      const mDish: Dish = {
        id: dish.id,
        name: dish.name,
        currency: dish.currency,
        description: dish.description,
        image: dish.image,
        inStock: dish.inStock,
        price: dish.price,
        category: {},
        type: dish.type,
        tags: [],
        images: dish.images
      }

      mDish.category[categoryName] = { id: id, "name": categoryName, "price": price, "quantity": 1 }
      cartDishes[mDish.id] = mDish
      this.mainService.setToLocalStorage(cartDishes, Constants.LOCAL_CART)

    }

    this.eventManagement.broadcast({ name: Constants.CHANGE_IN_CART_ITEMS })
  }

  public calculateTotal(cartItems: any): number {
    let total = 0

    for (const key in cartItems) {

      if (Object.prototype.hasOwnProperty.call(cartItems, key)) {
        const element = cartItems[key];
        for (const mkey in element.category) {
          if (Object.prototype.hasOwnProperty.call(element.category, mkey)) {
            const melement = element.category[mkey];
            total += (melement.price * melement.quantity)

          }
        }

      }
    }

    return total
  }

  public getOrders(slug: string) {
    return new Promise(async (resolve, reject) => {

      try {
        const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
        const headers = {
          Authorization: `Bearer ${jwt}`
        }
        const response = await axios.get(Constants.BASE_URL + Constants.ALL_ORDER_API + `/${slug}?publicationState=preview`, { headers });
        resolve(response.data)
      } catch (error) {
        reject(error)
      }

    })
  }


  deletePendingOrder(orderId: string, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.delete(Constants.BASE_URL + Constants.ORDER_URL + `/${orderId}?slug=${slug}`, { headers })

  }

  getRestaurantInfo(slug: string) {

    return new Promise(async (resolve, reject) => {
      try {
        if (!this.restaurantData) {
          const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER)?.jwt || ""

          const headers = {
            Authorization: `Bearer ${jwt}`
          }
          const url = Constants.BASE_URL + Constants.ADMIN_RESTAURANT_INFO + `/${slug}`
          const restaurant = await axios.get(url, { headers })
          if (restaurant?.data) {
            this.restaurantData = restaurant?.data
          } else {
            return reject("No Restaurtant Data found")
          }

        }
        return resolve(this.restaurantData)

      } catch (error) {
        return reject(error)
      }
    })


  }

  getCurrency() {
    return this.restaurantData?.currency
  }

  getTaxes() {
    return this.restaurantData?.taxes
  }

  getRestaurantSlug() {
    return this.restaurantData?.slug
  }

  getRestaurantPaymentGateway() {
    return this.restaurantData?.paymentGateway
  }

  getRestaurantData() {
    return this.restaurantData
  }



}

