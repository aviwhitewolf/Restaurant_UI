import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { AdminService } from '../../admin.service';
import { EditImageModalComponent } from '../../../reusable/edit-image-modal/edit-image-modal.component';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';


@Component({
  selector: 'app-edit-v1',
  templateUrl: './edit-v1.component.html',
  styleUrls: ['./edit-v1.component.css']
})
export class EditV1Component implements OnInit {

  public loading: boolean = true
  private searchingTagName = ""
  public searchingTags: boolean = false
  public tagList!: [any];
  public showTagsListDropDown: boolean = false
  public showMenuListDropDown: boolean = false
  public menus: any[] = [];
  public filteredMenus: any[] = [];
  public selectedImage: any
  private routeQueryParams$!: Subscription;
  public imageFromApi: any
  private formdata = new FormData();
  public showAddTagDialog: boolean = false;
  public publish: string = ""
  public addonDishVariationFormGroupKey = 'dishVariation';

  public tagAddFormGroup: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]]
  });

  public dishFormGroup: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: ['', []],
    inStock: [true, [Validators.required]],
    type: ['', [Validators.required]],
    tags: this.formBuilder.array([], { validators: validate }),
    menus: this.formBuilder.array([], { validators: validate }),
    category: this.formBuilder.array([])
  });

  constructor(
    private _location: Location,
    private adminService: AdminService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private mainService: MainService,
    private restaurantService: RestaurantService

  ) {
  }

  ngOnInit() {

    this.addDishCategoryToFormArray()
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
      {
        this.getSingleRestaurantMenu(restaurantSlug)
        this.route?.params.subscribe((param: any) => {
          if (param['dishId']) {
            this.getSingleDish(restaurantSlug, param['dishId'])
          }
          else {
            this.addDishCategory()
            this.loading = false
          }
        })
      }

      // subscribe to open dish dialog using url change
      this.routeQueryParams$ = this.route.queryParams.subscribe(params => {
        if (params['showImageDialog']) {
          this.openEditImageModal();
        }
      });

    }

  }


  saveDish(publish: string = "Publish") {
    // this.loading = true
    // const restaurantSlug = this.restaurantService.getRestaurantSlug()
    console.log("Form Result", this.dishFormGroup.value)
      // if (restaurantSlug) {
      //   this.route?.params.subscribe(async (param: any) => {
      //     const dishData = {
      //       name: this.dishFormGroup.value.name,
      //       description: this.dishFormGroup.value.description,
      //       price: Math.min.apply(Math, this.dishFormGroup.value.category.map((cat: any) => cat.price)),
      //       inStock: this.dishFormGroup.value.inStock,
      //       type: this.dishFormGroup.value.type,
      //       tags: this.dishFormGroup.value.tags.map((tag: any) => tag.id),
      //       menus: this.dishFormGroup.value.menus.map((menu: any) => menu.id),
      //       category: this.dishFormGroup.value.category,
      //       publishedAt: publish == 'Publish' ? new Date() : null
      //     }
          
      //     dishData.category = dishData.category.map((cat: any) => {
      //       if (!cat.id)
      //         delete cat?.id
      //       return cat
      //     })


      //     //User want to edit
      //     if (param['dishId']) {
      //       //User did not changed the Image
      //       if (!this.selectedImage) {
      //         //do a normal request without formdata
      //         this.adminService.updateDish(dishData,restaurantSlug, param['dishId'])
      //           .then((result) => {
      //             this.loading = false
      //             this.mainService.openDialog("Success", "Dish Updated Successfully", "S", true)
      //           }).catch((err) => {
      //             this.loading = false
      //             console.log("Error", err)
      //             this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      //           })

      //         //User changed the image
      //       } else {

      //         this.formdata.delete('data')
      //         this.formdata.append("data", JSON.stringify(dishData));
      //         this.adminService.updateDish(this.formdata, restaurantSlug, param['dishId'])
      //           .then((result) => {
      //             this.loading = false
      //             this.mainService.openDialog("Success", "Dish Updated Successfully", "S", true)
      //           }).catch((err) => {
      //             this.loading = false
      //             console.log("Error", err)
      //             this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

      //           })
      //       }

      //       //User wants to add
      //     } else {
      //       const restaurantSlug = this.restaurantService.getRestaurantSlug()
      //         if (restaurantSlug)  {
      //           if (!this.selectedImage) {
      //             this.mainService.openDialog("Error", "Please upload image", "E")
      //             return
      //           }
      //           this.formdata.delete('data')
      //           this.formdata.append("data", JSON.stringify(dishData));

      //           this.adminService.addDish(this.formdata, restaurantSlug)
      //             .then((result) => {
      //               this.loading = false
      //               this.mainService.openDialog("Success", "Dish Added Successfully with id : " + result.data.id, "S", true)
      //             }).catch((err) => {
      //               this.loading = false
      //               console.log("Error", err)
      //               this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

      //             })
      //         }
            
      //     }

      //   })
      // }
  }


  createTag() {
    this.loading = true
    this.adminService.addTag({ data: this.tagAddFormGroup.value })
      .then(result => {
        this.showAddTagDialog = false
        this.mainService.openDialog("Success", "Tag Added Successfully", "S")
        this.tagAddFormGroup.reset()
        this.loading = false
      }
      ).catch((err: any) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      });
  }

  private getSingleDish(slug: string, dishId: string) {
    this.loading = true
    this.adminService.getSingleDish(slug, dishId)
      .then((res) => {
        const dishData = res.data
        if (dishData) {
          this.dishFormGroup.patchValue(
            {
              name: dishData?.name,
              description: dishData?.description,
              price: dishData?.price,
              inStock: dishData?.inStock,
              type: dishData?.type,
              currency: dishData?.currency
            });

          this.publish = dishData?.publishedAt

          dishData.tags.forEach((tag: any) => {
            this.tags.push(this.formBuilder.group(tag))
          })
          dishData.menus.forEach((menu: any) => {
            this.menu.push(this.formBuilder.group(menu))
          })
          dishData.category.forEach((cat: any) => {
            this.category.push(this.formBuilder.group({ id: cat?.id, name: cat?.name, price: cat?.price, metadata: cat?.metadata }))
          })

          if (dishData?.image)
            this.imageFromApi = this.mainService.getImageUrl(dishData.image ? dishData.image[0] : '', Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)

          this.loading = false
        } else {
          this.loading = false
          this.mainService.openDialog("Error", this.mainService.errorMessage("No data found", true), "E", false, true)
        }
      }).catch((err) => {
        this.loading = false
        console.log("Error", err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E", false, true)
      })

  }

  getSingleRestaurantMenu(slug: string) {
    this.loading = true
    this.adminService.getSingleRestaurantMenu(slug)
      .then((result) => {
        this.menus = result.data
        if (this.menus) {
          this.filteredMenus = this.menus
        } else {
          this.mainService.openDialog("Error", this.mainService.errorMessage("No data found", true), "E", false, true)
        }
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log("Error", err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E", false, true)
      })
  }


  //menu
  public searchMenu(data: string) {
    this.showMenuListDropDown = true
    const filterValue = data.toLowerCase();
    this.filteredMenus = this.menus.filter(menu => menu.name.toLowerCase().includes(filterValue));
  }

  get menu(): FormArray {
    return this.dishFormGroup.get("menus") as FormArray
  }

  removeMenu(i: number) {
    this.menu.removeAt(i);
  }

  public getMenu(i: number) {
    return this.menu.at(i).value.name
  }

  public addMenu(menu: any) {

    //check if already added
    if (this.menu.controls.find(element => element.value.id == menu.id))
      return

    this.menu.push(this.formBuilder.group({
      name: menu.name,
      id: menu.id
    }))
  }

  menuListClose() {
    if (this.showMenuListDropDown) {
      this.showMenuListDropDown = false
      this.dishFormGroup.get('menus')?.markAllAsTouched()
    }
  }

  //menu end


  // Tags
  get tags(): FormArray {
    return this.dishFormGroup.get("tags") as FormArray
  }

  removetags(i: number) {
    this.tags.removeAt(i);
  }

  public getTags(i: number) {
    return this.tags.at(i).value.name
  }

  public checkErrorFormGroupArray(type: string, i: number) {
    return (<FormArray>this.dishFormGroup.get(type)).controls[0].invalid;
  }

  public addTag(tag: any) {

    //check if already added
    if (this.tags.controls.find(element => element.value.id == tag.id))
      return

    this.tags.push(this.formBuilder.group({
      name: tag.name,
      id: tag.id
    }))
    this.showTagsListDropDown = false
  }

  public searchTags(data: string) {
    this.showTagsListDropDown = true
    this.searchingTags = true
    if (data && data?.length >= 2) {
      this.searchingTagName = data
      this.debouncedUpdate()
    } else {
      this.showTagsListDropDown = false
    }
  }

  tagListClose() {
    if (this.showTagsListDropDown) {
      this.showTagsListDropDown = false
      this.dishFormGroup.get('tags')?.markAllAsTouched()
    }
  }

  // tags end




  // Add dish category to formGroup

  get category(): FormArray {
    return this.dishFormGroup.get("category") as FormArray
  }

  private addDishCategoryToFormArray(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      metadata: ['']
    });
  }

  public addDishCategory(): void {
    this.category.push(
      this.addDishCategoryToFormArray()
    );
  }


  deleteSubForm(index: number, type: string) {
    let array = (this.dishFormGroup.get(type) as FormArray);
    array.removeAt(index)
  }

  checkForFormErrors(index: number, key: string, type: string): boolean {
    let array = this.getFormArray(type);
    if (array.controls[index].get(key)?.errors && (array.controls[index].get(key)?.touched || array.controls[index].get(key)?.dirty))
      return true
    else
      return false
  }

  public getFormArray(formGroupName: string): FormArray {
    return (this.dishFormGroup.get(formGroupName) as FormArray)
  }

  public getFormError(index: number, errorName: string, key: string, type: string): boolean {
    let _array = this.getFormArray(type);
    return _array.controls[index].get(key)?.errors?.[errorName] || false
  }

  getFormControl(groupName: string): FormArray {
    return <FormArray>this.dishFormGroup.get(groupName);
  }

  // Category End

  goBackback() {
    this._location.back(); // <-- go back to previous location on cancel
  }


  debounce = (fn: Function, ms = 500) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  updateState = () => {
    this.showTagsListDropDown = true
    this.adminService.searchTags(this.searchingTagName)
      .then(result => {
        this.searchingTags = false
        this.tagList = result.data
      }
      ).catch((err: any) => {
        this.searchingTags = false
        this.showTagsListDropDown = false
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

      });
  };

  debouncedUpdate = this.debounce(this.updateState);


  //image

  changeImage() {
    this.router.navigate([], { queryParams: { showImageDialog: true }, relativeTo: this.route });
  }

  private openEditImageModal() {

    // document.body.classList.add("no-parent-scroll");
    const dialogRef = this.dialog.open(EditImageModalComponent,
      {
        data: { image: "" },
        panelClass: 'custom-editDishmodalbox',
      });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result?.image) {
        this.formdata.delete("files.image")
        this.selectedImage = result?.base64
        this.formdata.append("files.image", result?.image, result.name);
      }
      // document.body.classList.remove("no-parent-scroll");
      this._location.back();
    });
  }

  getImage() {
    return (this.selectedImage ? this.selectedImage : this.imageFromApi)
  }

  //image end
  toggleStock() {
    this.dishFormGroup.patchValue({ 'inStock': !this.dishFormGroup.get('inStock')?.value })
  }


  getCurrency() {
    return this.restaurantService.getCurrency()
    }

    formInitialized(name : string, variations: FormGroup[]) {
      this.dishFormGroup.setControl(name, this.formBuilder.array(variations));
    }
}

export function validate(
  ctrls: FormArray | AbstractControl
): ValidationErrors | null {
  if (ctrls.value?.length) {
    ctrls.markAllAsTouched();
    return null;
  }
  return { notValid: true };
}