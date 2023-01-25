import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/admin/admin.service';
import { MainService } from 'src/app/main.service';
import toMaterialStyle from 'material-color-hash'

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  public loading: boolean = false
  public expenseCategories: any
  public showDeleteDialog: boolean = false
  public categoryIdToDelete : string = ""

  constructor(
    private route: ActivatedRoute,
    private adminService : AdminService,
    private mainService: MainService,
    ) { }

  ngOnInit(): void {
    this.route?.parent?.parent?.parent?.params.subscribe((param: any) => {
      if (param && param['slug']) {
        this.getExpenseCategory(param['slug'])
      }
    })
  }
  getExpenseCategory(slug : string) {
    this.loading = true
    this.adminService.getExpenseCategory(slug)
      .then((res) => {
        this.expenseCategories = res?.data
        console.log("Expenses", this.expenseCategories)
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log("Error", err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })
  }

  deleteCategory(catId: string) {
    this.loading = true
    this.route?.parent?.parent?.parent?.params.subscribe((param: any) => {
      if (param && param['slug']) {
        this.adminService.deleteExpenseCategory(param['slug'], catId)
          .then((res) => {
            this.loading = false
            this.mainService.openDialog("Success", "Category deleted successfully", "S", true, false)
          }).catch((err) => {
            this.loading = false
            console.log(err)
            this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
          })
      }
    })
  }


  getColor(name : string, key : string){
    const colors = toMaterialStyle(name,700)
    return key == 'color' ? colors['color'] : colors['backgroundColor']
  }

}
