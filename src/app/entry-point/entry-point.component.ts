import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../Constants/Interface/Constants';
import { MainService } from '../main.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-entry-point',
  templateUrl: './entry-point.component.html',
  styleUrls: ['./entry-point.component.css']
})
export class EntryPointComponent implements OnInit {

  public loading: boolean = true
  public isOk: boolean = false

  constructor(
    private mainService: MainService,
    private userService: UserService,
    private route: ActivatedRoute,
    private restaurantService: RestaurantService
  ) {

  }

  ngOnInit(): void {

    const user = this.mainService.getToLocalStorage(Constants.LOCAL_USER)
    this.route.parent?.params.subscribe(async (params) => {
      if (params['name']) {
        
        await this.restaurantService.getRestaurantInfo(params['name']).then((restaurant) => {
          if (restaurant) {

            
            if (!user) {
              this.mainService.setToLocalStorage({ jwt: "", privacyPolicyConsent: false }, Constants.LOCAL_USER)
              this.loading = false
              this.isOk = true
            } else if (user.jwt) {
  
              this.userService.checkLoggedIn(user.jwt)
                .then((res) => {
                  this.loading = false
                  this.isOk = true
                }).catch((error) => {
                  this.loading = false
                  this.isOk = true
                  //Unauthorized, or token expires
                  if (error?.response?.status == 401) {
                    user.jwt = ""
                    this.mainService.setToLocalStorage(user, Constants.LOCAL_USER)
                    this.mainService.openDialog("You've been logged out", "You've been logged out of the website. Just login again, go to home screen and click on Login / Signup button on top  left.", "W", false, true)
                  }
                  console.error("Invalid token", error)
                })
            } else {
              this.loading = false
              this.isOk = true
            }
          } else {
            this.mainService.openDialog("Error", "Invalid restaurant name", "E")
          }
  
        }).catch((error) => {


          this.loading = false
          this.isOk = false
          //Unauthorized, or token expires
          if (error?.response?.status == 401) {
            this.mainService.openDialog("You've been logged out", "You've been logged out of the website. Just login again, go to home screen and click on Login / Signup button on top  left.", "W", true, false)
            user.jwt = ""
            this.mainService.setToLocalStorage(user, Constants.LOCAL_USER)
          }
          console.error("Restaurant Fetch Error", error)

        })


      } else {
        this.mainService.openDialog("Error", "Invalid restaurant name", "E")
      }
    })

  }

}
