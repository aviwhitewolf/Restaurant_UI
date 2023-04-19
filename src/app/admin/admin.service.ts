import { Injectable } from '@angular/core';
import axios from 'axios';
import { Constants } from '../Constants/Interface/Constants';
import { MainService } from '../main.service';
import { OrderInfo } from '../payment/Interface/OrderInfo';
import * as qs from 'qs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor(
    private mainService: MainService
  ) { }

  getAdminMenu(slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_UI_MENU + `?slug=${slug}`
    return axios.get(url, { headers })
  }

  getMyOrders(from: string, to: string, slug: string, page?: number, pageSize?: number) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }

    let customUrl = `?slug=${slug}`
    if (from) {
      customUrl += `&start=${from}`
    }

    if (to) {
      customUrl += `&end=${to}`
    }

    if (page && pageSize) {
      customUrl += `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_ORDER + customUrl
    return axios.get(url, { headers })
  }


  deleteMultipleOrders(ids: any, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.delete(Constants.BASE_URL + Constants.ADMIN_ORDER + `/${ids}?slug=${slug}`, { headers })

  }

  getOverview(from: string, to: string, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_GET_OVERVIEW + `/${slug}?start=${from}&end=${to}`
    return axios.get(url, { headers })
  }

  getSingleOrder(slug: string, orderId: number) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_SINGLE_ORDER + `/${orderId}/${slug}?publicationState=preview`
    return axios.get(url, { headers })
  }

  updateOrder(orderId: number, updateOrder: any) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }

    return axios.put(Constants.BASE_URL + Constants.ORDER_URL + `/${orderId}`, updateOrder, { headers })
  }

  getAllDishes(slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_GET_ALLDISHES + `?slug=${slug}`
    return axios.get(url, { headers })

  }

  searchUser(mobile: string = "", slug: string, value: string = "") {

    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_USER + `?slug=${slug}&mobile=${mobile}&value=${value}`
    return axios.get(url, { headers })

  }

  searchEmployee(slug: string, value: string) {

    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_SEARCH_EMPLOYEE + `?slug=${slug}&value=${value}`
    return axios.get(url, { headers })

  }

  createOrder(orderInfo: OrderInfo, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.post(Constants.BASE_URL + Constants.ADMIN_ORDER + `?slug=${slug}`, orderInfo, { headers })
  }

  getAllRestaurantAssigned() {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_RESTAURANTS
    return axios.get(url, { headers })

  }

  getMenuAndDishes(slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_MENUS + `?slug=${slug}`
    return axios.get(url, { headers })

  }

  getSingleMenuAndDishes(menuId: string) {
    const query = qs.stringify({
      populate: [
        'dishes',
        'dishes.image',
        'dishes.category'
      ],
    }, {
      encodeValuesOnly: true, // prettify URL
    });
    const url = Constants.BASE_URL + Constants.MENU_URL + `/${menuId}?${query}`
    return axios.get(url)

  }

  getSingleRestaurantMenu(slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_MENUS + `?slug=${slug}`
    return axios.get(url, { headers })

  }

  searchTags(name: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_TAG + `?name=${name}`
    return axios.get(url, { headers })

  }

  addDish(data: any, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.post(Constants.BASE_URL + Constants.ADMIN_DISH + `?slug=${slug}`, data, { headers })

  }

  updateDish(data: any, slug: string, id: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.put(Constants.BASE_URL + Constants.ADMIN_DISH + `/${id}?slug=${slug}`, data, { headers })

  }

  getAllTables(slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_TABLE + `?slug=${slug}`
    return axios.get(url, { headers })

  }

  getSingleMenuDishes(slug: string, id: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_MENUS + `/${id}?slug=${slug}`
    return axios.get(url, { headers })

  }

  updateMenu(data: any, slug: string, menuId: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.put(Constants.BASE_URL + Constants.ADMIN_MENUS + `/${menuId}?slug=${slug}`, data, { headers })
  }

  addMenu(data: any, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.post(Constants.BASE_URL + Constants.ADMIN_MENUS + `?slug=${slug}`, data, { headers })

  }

  deleteMenu(menuId: string, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.delete(Constants.BASE_URL + Constants.ADMIN_MENUS + `/${menuId}?slug=${slug}`, { headers })

  }

  getSingleDish(slug: string, id: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_DISH + `/${id}?slug=${slug}`
    return axios.get(url, { headers })

  }

  deleteDish(slug: string, dishId: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.delete(Constants.BASE_URL + Constants.ADMIN_DISH + `/${dishId}?slug=${slug}`, { headers })

  }

  addTag(data: any) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.post(Constants.BASE_URL + Constants.ADMIN_ADD_TAG, data, { headers })

  }

  getSingleTable(slug: string, id: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_TABLE + `/${id}?slug=${slug}`
    return axios.get(url, { headers })

  }

  addTable(data: any, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.post(Constants.BASE_URL + Constants.ADMIN_TABLE + `?slug=${slug}`, data, { headers })

  }

  updateTable(data: any, slug: string, id: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.put(Constants.BASE_URL + Constants.ADMIN_TABLE + `/${id}?slug=${slug}`, data, { headers })

  }

  deleteTable(slug: string, tableId: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.delete(Constants.BASE_URL + Constants.ADMIN_TABLE + `/${tableId}?slug=${slug}`, { headers })

  }


  getEmployees(slug: string, page: number, pageSize: number) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_EMPLOYEE + `?slug=${slug}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    return axios.get(url, { headers })

  }


  getSingleEmployee(slug: string, staffId: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_EMPLOYEE + `/${staffId}?slug=${slug}`
    return axios.get(url, { headers })

  }

  updateEmployee(data: any, slug: string, employeeId: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_EMPLOYEE + `/${employeeId}?slug=${slug}`
    return axios.put(url, data, { headers })

  }

  updateMyImage(data: any, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_USER_ME + `?slug=${slug}`
    return axios.put(url, data, { headers })

  }


  addEmployee(data: any, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.post(Constants.BASE_URL + Constants.ADMIN_EMPLOYEE + `?slug=${slug}`, data, { headers })

  }


  getDesignation(slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_ALL_DESIGNATION + `?slug=${slug}`
    return axios.get(url, { headers })

  }

  deleteEmployeeUpload(id: string, staffId: string, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_EMPLOYEE_UPLOAD + `/${id}/${staffId}?slug=${slug}`
    return axios.delete(url, { headers })

  }


  getAllExpense(from: string, to: string, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_EXPENSE + `?slug=${slug}&start=${from}&end=${to}`
    return axios.get(url, { headers })
  }

  getSingleExpense(slug: string, expenseId: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_EXPENSE + `/${expenseId}?slug=${slug}`
    return axios.get(url, { headers })
  }

  deleteExpenses(ids: any, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.delete(Constants.BASE_URL + Constants.ADMIN_EXPENSE + `/${ids}?slug=${slug}`, { headers })

  }

  getExpenseCategory(slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_EXPENSE_CATEGORY + `?slug=${slug}`
    return axios.get(url, { headers })
  }

  updateExpense(data: any, slug: string, expenseId: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_EXPENSE + `/${expenseId}?slug=${slug}`
    return axios.put(url, data, { headers })

  }

  addExpense(data: any, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.post(Constants.BASE_URL + Constants.ADMIN_EXPENSE + `?slug=${slug}`, data, { headers })

  }

  deleteExpenseUpload(id: string, expenseId: string, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_EXPENSE_UPLOAD + `/${id}/${expenseId}?slug=${slug}`
    return axios.delete(url, { headers })

  }

  getSingleCategory(slug: string, catId: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_EXPENSE_CATEGORY + `/${catId}?slug=${slug}`
    return axios.get(url, { headers })
  }


  updateExpenseCategory(data: any, slug: string, id: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.put(Constants.BASE_URL + Constants.ADMIN_EXPENSE_CATEGORY + `/${id}?slug=${slug}`, data, { headers })

  }

  addExpenseCategory(data: any, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.post(Constants.BASE_URL + Constants.ADMIN_EXPENSE_CATEGORY + `?slug=${slug}`, data, { headers })

  }

  getLoggedInEmployee(slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_EMPLOYEE_ME + `?slug=${slug}`
    return axios.get(url, { headers })
  }

  

  subscribeToWebpushNotification(data: any, slug: string){
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.post(Constants.BASE_URL + Constants.ADMIN_WEBPUSH + `?slug=${slug}`, data, { headers })

  }

  findSubscribeToWebpushNotification(deviceInfo : string, slug: string){
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.get(Constants.BASE_URL + Constants.ADMIN_WEBPUSH + `?slug=${slug}&deviceInfo=${deviceInfo}`, { headers })

  }

  updateSubscribeToWebpushNotification(data : any ,slug: string){
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.put(Constants.BASE_URL + Constants.ADMIN_WEBPUSH + `?slug=${slug}`, data, { headers })

  }

  deleteExpenseCategory(slug: string, catId: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.delete(Constants.BASE_URL + Constants.ADMIN_EXPENSE_CATEGORY + `/${catId}?slug=${slug}`, { headers })

  }

  getTaxes(slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_TAX + `?slug=${slug}`
    return axios.get(url, { headers })

  }

  getSingleTax(slug: string, taxId : string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    const url = Constants.BASE_URL + Constants.ADMIN_TAX + `/${taxId}?slug=${slug}`
    return axios.get(url, { headers })

  }

  deleteTax(slug: string, taxId: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.delete(Constants.BASE_URL + Constants.ADMIN_TAX + `/${taxId}?slug=${slug}`, { headers })

  }

  addTax(data: any, slug: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.post(Constants.BASE_URL + Constants.ADMIN_TAX + `?slug=${slug}`, data, { headers })

  }

  updateTax(data: any, slug: string, id: string) {
    const jwt = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.put(Constants.BASE_URL + Constants.ADMIN_TAX + `/${id}?slug=${slug}`, data, { headers })

  }


  async getBase64ImageFromUrl(imageUrl: string) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

}
