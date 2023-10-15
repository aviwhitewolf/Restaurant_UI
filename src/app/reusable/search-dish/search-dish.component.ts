import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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

  @ViewChild('searchInputField')
  searchInputField!: ElementRef;

  @Input()
  public format: string = 'WITH_CATEGORY'

  @Output()
  public selectedData: EventEmitter<any> = new EventEmitter();

  public loading: boolean = true
  public filteredDishes: any
  private _searchTerm: string = ""
  public dishes: any
  public searchingDish: boolean = false
  private searchingDishName: string = ""

  constructor(
    private mainService: MainService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private restaurantService: RestaurantService
  ) { }

  ngOnInit(): void {

    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
      this.getAllDishes(restaurantSlug)
    }

  }

  ngAfterViewInit() {
    this.searchInputField?.nativeElement?.focus();
  }

  private getAllDishes(slug: string) {
    this.loading = true
    this.adminService.getAllDishes(slug)
      .then((result) => {
        this.dishes = result?.data?.filter((dish: any) => dish?.publishedAt)
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
      return dish.publishedAt && JSON.stringify(dish).toLowerCase().indexOf(value.toLowerCase()) != -1;
    })
  }


  public selectedDish(dish: any, category: any) {
    this.selectedData.emit({ dish, category });
  }

  get searchTerm(): string {
    return this._searchTerm
  }

  set searchTerm(value: string) {
    this._searchTerm = value
    this.filteredDishes = this.filterDishes(value)
  }


  public searchDish(data: string) {
    this.searchingDish = true
    if (data && data?.length >= 2) {
      this.searchingDishName = data
      this.debouncedUpdate()
    } else if (data && data?.length == 0) {
      this.searchingDish = false
      this.filteredDishes = this.dishes?.slice(0, 2)
    }
    else {
      this.searchingDish = false
      this.filteredDishes = this.dishes?.slice(0, 2)
    }
  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }


  debounce = (fn: Function, ms = 700) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  updateState = () => {
    this.filteredDishes = this.filterDishes(this.searchingDishName)
  };

  debouncedUpdate = this.debounce(this.updateState);


}
