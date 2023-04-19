import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { EditImageModalComponent } from 'src/app/reusable/edit-image-modal/edit-image-modal.component';
import { UserService } from 'src/app/user/user.service';
import { Location } from '@angular/common';
import { AdminService } from '../../admin.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  public loading: boolean = true
  public me: any
  public reportTo: any
  public salaryHistory: any
  public selectedImage: any
  public imageFromApi: any
  private routeQueryParams$!: Subscription;
  private formdata = new FormData();

  constructor(
    private userService: UserService,
    private mainService: MainService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _location: Location,
    private adminService: AdminService,
    private restaurantService : RestaurantService
  ) { }

  ngOnInit(): void {

    this.getUserInfo()

    // subscribe to open dish dialog using url change
    this.routeQueryParams$ = this.route.queryParams.subscribe(params => {
      if (params['showImageDialog']) {
        this.openEditImageModal();
      }
    });
  }

  updateEmployeeImage() {
    this.loading = true
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.formdata.append("data", JSON.stringify({ employee: this.me.id }));
        this.adminService.updateMyImage(this.formdata,restaurantSlug)
          .then((result) => {
            this.formdata.delete('files.image')
            this.formdata.delete('data')
            this.loading = false
            this.mainService.openDialog("Success", "Image Updated Successfully", "S", true)
          }).catch((err) => {
            this.formdata.delete('data')
            this.loading = false
            console.log("Error", err)
            this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

          })

      }
    

  }

  async getUserInfo() {

    this.loading = true
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.userService.checkLoggedIn(this.mainService.getToLocalStorage(Constants.LOCAL_USER)?.jwt)
          .then((res : any) => {
            this.loading = false
            this.me = res?.data
            this.reportTo = res?.data?.reportTo
            this.salaryHistory = res?.data?.salaryHistory

            if (this.me?.image) {
              this.imageFromApi = this.mainService.getImageUrl(this.me?.image ? this.me?.image : '', Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
              console.log(this.imageFromApi)
            }

          }).catch((err) => {
            this.loading = false
            console.log("Error", err)
            this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E", false, true)

          })
      }
  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

  changeImage() {
    this.router.navigate([], { queryParams: { showImageDialog: true }, relativeTo: this.route });
  }

  getImage() {
    return (this.selectedImage ? this.selectedImage : this.imageFromApi)
  }

  private openEditImageModal() {

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
      // document.body.classList.remove("cdk-global-scrollblock");
      this._location.back();
    });
  }



}
