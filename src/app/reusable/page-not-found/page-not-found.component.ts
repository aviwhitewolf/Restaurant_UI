import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor( private router: Router,
    private mainService : MainService) { }

  ngOnInit(): void {
  }

  navigateToHome(){
    this.router.navigate(['/restaurant', this.mainService.getToLocalStorage(Constants.LOCAL_USER).restaurantSlug,'home'])
  }

}
