import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from '../restaurant.service';
import { Constants } from 'src/app/Constants/Interface/Constants';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  public loading: boolean = true
  public restaurantInfo: any = ""
  private tb: string = ""
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mainService: MainService,
    private restaurantService: RestaurantService
  ) {
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      if (params['name'] && params['tb']) {
        this.tb = params['tb']
        this.getRestaurantInfo(params['name'])

      }
    })


  }

  navigateToHome() {
    if (this.restaurantInfo?.slug && this.tb)
      this.router.navigate(['/restaurant', this.restaurantInfo?.slug, 'home'], { queryParams: { tb: this.tb } })
  }

  private async getRestaurantInfo(name: string) {
    this.loading = true
    this.restaurantService.getRestaurantInfo(name)
      .then((res: any) => {
        this.restaurantInfo = res.attributes

        const user = this.mainService.getToLocalStorage(Constants.LOCAL_USER)
        if (user) {
          user.restaurantSlug = this.restaurantInfo.slug
          user.restaurantId = res.id
          this.mainService.setToLocalStorage(user, Constants.LOCAL_USER)
        }
        this.loading = false

      }).catch((err) => {
        this.loading = false
        console.log("Error while fetching restaurant", err)
        this.mainService.openDialog("Error", "Unable to find restaurant", "E")
      })


  }

  public getImageUrl(image: any) {

    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITH_ATTRIBUTE)
  }




}
