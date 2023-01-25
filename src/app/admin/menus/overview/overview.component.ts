import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  public menu: any
  public loading: boolean = true
  public currencySymbol = ""
  public showDeleteDialog: boolean = false
  public menuIdToDelete: string = ""

  constructor(
    private adminService: AdminService,
    private mainService: MainService,
    private route: ActivatedRoute
  ) {
    this.currencySymbol = this.mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"
  }

  ngOnInit(): void {
    this.getAllMenuAndDishes()
  }

  private getAllMenuAndDishes() {
    this.loading = true
    this.route?.parent?.parent?.params.subscribe((param: any) => {
      if (param && param['slug']) {
        this.adminService.getMenuAndDishes(param['slug'])
          .then((results) => {
            this.menu = results.data
            this.loading = false
          }).catch((err) => {
            this.loading = false
            console.log(err)
            this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
          })
      }
    });

  }

  deleteMenu(menuId: string) {
    this.loading = true
    this.route?.parent?.parent?.params.subscribe((param: any) => {
      if (param && param['slug']) {
        this.adminService.deleteMenu(menuId, param['slug'])
          .then((results) => {
            this.menuIdToDelete = ""
            this.getAllMenuAndDishes()
            this.loading = false
            this.mainService.openDialog("Success", "Menu deleted successfully", "S")
          }).catch((err) => {
            this.loading = false
            console.log(err)
            this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

          })
      }
    });

  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

}
