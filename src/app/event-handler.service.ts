import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { filter, share } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class EventHandlerService {

  observable!: Observable<any>;
  observer!: Observer<any>

  constructor() {
    this.observable = new Observable((observer: Observer<any>) => {
      this.observer = observer;
    }).pipe(share());
  }

  subscribe(eventName: any, callback: any) {
    const subscriber: Subscription = this.observable
      .pipe(
        filter(event => {
          return event.name === eventName
        })
      ).subscribe(callback)

    return subscriber
  }

  broadcast(event : any){
    if(this.observer != null){
      this.observer.next(event)
    }
  }

  destroy(subscriber : Subscription){
    subscriber.unsubscribe();
  }

}