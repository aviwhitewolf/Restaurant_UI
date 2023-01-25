import { Injectable } from '@angular/core';
import {CanActivate, Router, RoutesRecognized} from '@angular/router';
import { MainService } from 'src/app/main.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  

  canActivate(){
    return false
  }
  
}
