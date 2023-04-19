import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Constants } from './Constants/Interface/Constants';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: any = null

  constructor(private mainService : MainService) {}

  initializeSocket(restaurantSlug : string): Boolean {
    try {
      const token = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt || ""
      this.socket = io(Constants.BASE_URL, {
        auth: {
          token
        },
        query : {
          slug : restaurantSlug
        }
      });
      if (this.socket != null)
        return true
      else
        return false

    } catch (error) {
      console.log("Error connecting to socket")
      return false
    }

  }

  listen(eventName: string, slug : string) {
    if (this.socket == null)
      this.initializeSocket(slug);

    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        console.log("Listening to event", eventName)
        subscriber.next(data)
      })
    })

  }

  emit(eventName: string, data: any, slug : string, callback : any) {
    if (this.socket == null)
      this.initializeSocket(slug);

    this.socket.emit(eventName, data, (err: any) => {
      if (err) {
        callback(err)
      }else{
        callback()
      }
    })

  }

}