import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/admin/admin.service';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';

@Component({
  selector: 'app-search-dish',
  templateUrl: './search-dish.component.html',
  styleUrls: ['./search-dish.component.css']
})
export class SearchDishComponent implements OnInit {

  @Input()
  public format : string = 'WITH_CATEGORY'

  @Output()
  public selectedData : EventEmitter<any> = new EventEmitter();

  public loading : boolean = true
  public filteredDishes: any
  private _searchTerm: string = ""
  public dishes : any
  
  constructor(
    private mainService : MainService,
    private adminService : AdminService,
    private route: ActivatedRoute,
    private restaurantService : RestaurantService
    ) { }

  ngOnInit(): void {

    const restaurantSlug = this.restaurantService.getRestaurantSlug()
      if (restaurantSlug) {
        this.getAllDishes(restaurantSlug)
      } 
    
  }

  private getAllDishes(slug: string) {
    this.loading = true
    this.adminService.getAllDishes(slug)
      .then((result) => {
        this.dishes = result.data
        this.filteredDishes = this.dishes?.slice(0, 2)
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })
  }

  filterDishes(value: string): any {
    if (this.filteredDishes?.length == this.dishes?.length) {
      return this.dishes?.slice(0, 2)
    }
    return this.dishes.filter((dish: any) => {
      const dataStr = JSON.stringify(dish).toLowerCase();
      return dataStr.indexOf(value.toLowerCase()) != -1;
    })
  }


  public selectedDish(dish: any, category: any) {
      this.selectedData.emit({dish, category});
  }



  get searchTerm(): string {
    return this._searchTerm
  }

  set searchTerm(value: string) {
    this._searchTerm = value
    this.filteredDishes = this.filterDishes(value)
  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }


}
