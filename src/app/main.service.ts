import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Constants } from './Constants/Interface/Constants';
import { ErrorMsgComponent } from './reusable/error-msg/error-msg.component';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(public dialog: MatDialog) { }
  /*
  ** @param data : data type any
  ** @param key : key
  ** @return 
  */
  public setToLocalStorage(data: any, key: string) {
    return localStorage.setItem(key, JSON.stringify(data))
  }

  /*
  ** @param key : key
  ** @return data 
  */
  public getToLocalStorage(key: string) {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) || "") : null
  }

  public setshowPaymentStatus(status: boolean) {
    const user = this.getToLocalStorage(Constants.LOCAL_USER)
    user.showPaymentStatus = status
    this.setToLocalStorage(user, Constants.LOCAL_USER)
  }

  public getshowPaymentStatus(): boolean {
    return this.getToLocalStorage(Constants.LOCAL_USER).showPaymentStatus || false
  }

  public setRecentDishes(dish: any) {
    let dishes: Array<any> = []
    dishes = this.getToLocalStorage(Constants.LOCAL_RECENT_DISHES) || []
    if (dishes.length >= Constants.LOCAL_RECENT_DISHES_LIMIT) {
      dishes.shift()
    }
    dishes.push(dish)
    this.setToLocalStorage(dishes, Constants.LOCAL_RECENT_DISHES)
  }

  public getRecentDishes() {
    return this.getToLocalStorage(Constants.LOCAL_RECENT_DISHES) || []
  }

  public getImageUrl(image: any, format: string, prefered: string = "") {
    let imageToDisplay = "", largeImage = '', thumbnailImage = '', mediumImage = '', smallImage = '', normalImage = ''
    if (format == Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE) {
      largeImage = image?.formats?.large?.url
      thumbnailImage = image?.formats?.thumbnail?.url
      mediumImage = image?.formats?.medium?.url
      smallImage = image?.formats?.small?.url
      normalImage = image?.url
    } else if (format == Constants.IMAGE_JSON_STRUCTURE_WITH_ATTRIBUTE) {
      largeImage = image?.attributes?.formats?.large?.url
      thumbnailImage = image?.attributes?.formats?.thumbnail?.url
      mediumImage = image?.attributes?.formats?.medium?.url
      smallImage = image?.attributes?.formats?.small?.url
      normalImage = image?.attributes?.url
    }

    if (mediumImage) {
      imageToDisplay = Constants.BASE_URL + mediumImage
      if (prefered == Constants.IMAGE_SIZE.medium) return imageToDisplay
    } else if (smallImage) {
      imageToDisplay = Constants.BASE_URL + smallImage
      if (prefered == Constants.IMAGE_SIZE.small) return imageToDisplay
    } else if (thumbnailImage) {
      imageToDisplay = Constants.BASE_URL + thumbnailImage
      if (prefered == Constants.IMAGE_SIZE.thumbnail) return imageToDisplay
    } else if (largeImage) {
      imageToDisplay = Constants.BASE_URL + largeImage
      if (prefered == Constants.IMAGE_SIZE.large) return imageToDisplay
    } else if (normalImage) {
      imageToDisplay = Constants.BASE_URL + normalImage
      if (prefered == Constants.IMAGE_SIZE.normal) return imageToDisplay
    }

    return imageToDisplay
  }


  public errorMessage(err: any, custom: boolean = false): string {
    if (custom) {
      return err

    }
    else if (!err) {
      return "No data found"

    } else if (err && err?.response && err?.response && err?.response?.data?.error) {
      return err?.response?.data?.error?.status + ": " + err?.response?.data?.error?.message

    } else {
      return "Something went wrong, check your network and try again."
    }
  }

  /*
  * * Global Error/Success Pop-up
  * @param heading any heading
  * @param message error or success message
  * @param type 'I' information, 'E' error, 'W' warning, 'S' success
  * @param reload want to reload page
  * @param goBack want to go back
  */
  public openDialog(heading: string, message: string, type: string, reload: boolean = false, goBack: boolean = false) {
    this.dialog.open(ErrorMsgComponent, {
      data: {
        message: message,
        type: type,
        heading: heading,
        reload: reload,
        goBack: goBack
      },
      panelClass: 'popUp-modalbox'
    });

  }


  getPolicy() {
    const url = Constants.BASE_URL + Constants.POLICY
    return axios.get(url)
  }

  getSeletedDate() {

    return {
      start: this.getToLocalStorage(Constants.LOCAL_USER)?.date?.start || "",
      end: this.getToLocalStorage(Constants.LOCAL_USER)?.date?.end || "",
      activeDateRange: this.getToLocalStorage(Constants.LOCAL_USER)?.date?.activeDateRange || ""
    }
  }

  setDates(start: string, end: string, activeDateRange: string) {
    const user = this.getToLocalStorage(Constants.LOCAL_USER)
    user.date = { start, end, activeDateRange }
    this.setToLocalStorage(user, Constants.LOCAL_USER)
  }

  async getSelectedDate(){
    let start = Constants.DATE_RANGE[Constants.DEFAULT_DATE_RANGE as keyof typeof Constants.DATE_RANGE].start 
    let end  = Constants.DATE_RANGE[Constants.DEFAULT_DATE_RANGE as keyof typeof Constants.DATE_RANGE].end
    let type = Constants.DEFAULT_DATE_RANGE 

    if(this.getSeletedDate()?.start && this.getSeletedDate()?.end 
    && this.getSeletedDate()?.activeDateRange){
      start = this.getSeletedDate()?.start 
      end = this.getSeletedDate()?.end
      type = this.getSeletedDate()?.activeDateRange
    }
    return {start, end, type}
  }


}
