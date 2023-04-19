import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { Location } from '@angular/common';
import { AdminService } from '../../admin.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public loading: boolean = true
  public singleMenuAndDish: any = { dishes: [] }
  public showSearchDishDialog: boolean = false

  public menuUpdateFormGroup: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    sequence: ['', [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private mainService: MainService,
    private route: ActivatedRoute,
    private _location: Location,
    private restaurantService : RestaurantService
  ) {
  }

  ngOnInit(): void {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.route?.params.subscribe((param: any) => {
          if (param['menuId']) {
            this.getSingleMenuAndDish(restaurantSlug, param['menuId'])
          } else {
            this.loading = false
          }
        })
      }
  }


  public updateMenu() {
    this.loading = true
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug)  {
      this.route?.params.subscribe((param: any) => {
        const dataToUpdate = {
          ...this.menuUpdateFormGroup.value,
          dishes: this.singleMenuAndDish?.dishes.map((dish: any) => dish.id),
        }
        if (param['menuId']) {
          this.adminService.updateMenu(dataToUpdate, restaurantSlug, param['menuId'])
            .then((res) => {
              this.loading = false
              this.mainService.openDialog("Success", "Menu updated successfully", "S")
            }).catch((err) => {
              this.loading = false
              console.log(err)
              this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
            })
        } else {
          this.adminService.addMenu(dataToUpdate, restaurantSlug)
            .then((res) => {
              this.menuUpdateFormGroup.reset()
              this.singleMenuAndDish.dishes = []
              this.loading = false
              this.mainService.openDialog("Success", "Menu created successfully with id:" + res.data.id, "S")

            }).catch((err) => {
              this.loading = false
              console.log(err)
              this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
            })
        }
      })


    }


  }


  getSingleMenuAndDish(slug: string, menuId: string) {
    this.loading = true
    if (menuId) {
      this.singleMenuAndDish = this.adminService.getSingleMenuDishes(slug, menuId)
        .then((result) => {
          this.singleMenuAndDish = result.data
          if(this.singleMenuAndDish){
          this.menuUpdateFormGroup.setValue({ name: this.singleMenuAndDish.name, sequence: this.singleMenuAndDish.sequence });
          }else{
            this.mainService.openDialog("Error", this.mainService.errorMessage("No data found", true), "E", false, true)
          }
          this.loading = false
        }).catch((err) => {
          this.loading = false
          console.log(err)
          this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E", false, true)
        })
    }
  }

  public addDish(data: any) {
    const { dish, category } = data
    if (this.singleMenuAndDish && this.singleMenuAndDish.dishes && !this.singleMenuAndDish.dishes.find((mDish: any) => mDish.id == dish.id)) {
      this.singleMenuAndDish.dishes.push(dish)
    } else if (!this.singleMenuAndDish) {
      this.singleMenuAndDish['dishes'] = []
      this.singleMenuAndDish.dishes.push(dish)
    }
    else
      this.mainService.openDialog("Error", "Already Added", "E")
  }

  public removeDish(dish: any) {
    this.singleMenuAndDish.dishes = this.removeItem(this.singleMenuAndDish.dishes, dish)
  }

  removeItem<T>(arr: Array<T>, value: any): Array<T> {
    const index = arr.findIndex((object: any) => object.id == value.id);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }


  goBackback() {
    this._location.back(); // <-- go back to previous location on cancel
  }
}
