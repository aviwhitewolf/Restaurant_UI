import { Injectable } from '@angular/core';
import axios from 'axios';
import { Constants } from '../Constants/Interface/Constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userInfo: any

  constructor() { }

  async checkLoggedIn(jwt: string) {

      const headers = {
        Authorization: `Bearer ${jwt}`
      }
     return this.userInfo = await axios.get(Constants.BASE_URL + Constants.ME_URL, { headers })
    
  }

  updateMe(jwt: string, data: any, userId: string) {

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.put(Constants.BASE_URL + Constants.ME_UPDATE_URL + `/update/${userId}`, data, { headers })
  }


}
