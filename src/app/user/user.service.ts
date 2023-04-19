import { Injectable } from '@angular/core';
import axios from 'axios';
import { Constants } from '../Constants/Interface/Constants';
import * as qs from 'qs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userInfo: any

  constructor() { }

  async checkLoggedIn(jwt: string) {

    return new Promise(async (resolve, reject) => {

      if (this.userInfo)
        return resolve(this.userInfo)

      const query = qs.stringify({
        fields: ['*'],
        populate: {
          restaurants: {
            fields: ['*']
          },
          // employee: {
          //   fields: ['*'],
          //   populate: {
          //     image: {
          //       fields: ["url", "alternativeText", "formats"]
          //     },
          //     designation : true
          //   },

          // }
          image: {
            fields: ['*']
          }
        }
      }, {
        encodeValuesOnly: true,
      });


      const headers = {
        Authorization: `Bearer ${jwt}`
      }

      this.userInfo = await axios.get(Constants.BASE_URL + Constants.ME_URL + `?${query}`, { headers })
      resolve(this.userInfo)

    })

  }

  updateMe(jwt: string, data: any, userId: string) {

    const headers = {
      Authorization: `Bearer ${jwt}`
    }
    return axios.put(Constants.BASE_URL + Constants.ME_UPDATE_URL + `/update/${userId}`, data, { headers })
  }


}
