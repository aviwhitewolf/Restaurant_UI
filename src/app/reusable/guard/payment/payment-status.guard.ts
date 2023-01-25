import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MainService } from 'src/app/main.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentStatusGuard implements CanActivate {

  constructor(private mainService : MainService){ }

  canActivate(){
    return this.mainService.getshowPaymentStatus()
  }
  
}
