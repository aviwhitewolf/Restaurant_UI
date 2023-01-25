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

 
  public dishes!: any[]
  public loading: boolean = true
  public currencySymbol = ""
  public showDeleteDialog : boolean = false
  public dishIdToDelete : string = ''
  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private mainService: MainService
  ) {

    this.currencySymbol = this.mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"
    
   }

  ngOnInit(): void {
    this.route?.parent?.parent?.params.subscribe((param: any) => {
      if (param && param['slug']) {
        this.getAllDishes(param['slug'] || "")
      }
    });
  }


  private getAllDishes(slug: string) {
    this.loading = true
    this.adminService.getAllDishes(slug)
      .then((result) => {
        this.loading = false
        this.dishes = result.data
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })
  }

public deleteDish(dishId : string){
  this.loading = true
  this.route?.parent?.parent?.params.subscribe((param: any) => {
    if (param && param['slug']) {
      this.adminService.deleteDish(param['slug'], dishId)
      .then((result) => {
        this.loading = false
        this.mainService.openDialog("Success", "Dish Deleted Successfully", "S", true)
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
