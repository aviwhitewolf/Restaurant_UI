import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import * as moment from 'moment';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  public loading : boolean = true
  public employees : any
  public currencySymbol = ""
  public apiPagination : any
  private routeQueryParams$!: Subscription;
  public isLoggedIn : boolean = false
  
  constructor(
    private adminService: AdminService,
    private mainService: MainService,
    private route: ActivatedRoute,
    private _router: Router
  ) {
    this.isLoggedIn = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt && this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt.length > 0 ? true : false
    this.currencySymbol = this.mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"
    this.routeQueryParams$ = this.route.queryParams.subscribe(params => {

        this._router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            page: params['page'] || 1,
            pageSize : params['pageSize'] || Constants.PAGE_SIZE
          },
          queryParamsHandling: 'merge',
          // preserve the existing query params in the route
        });

    });

  }



  ngOnInit(): void {

    this.route?.parent?.parent?.params.subscribe((mparam: any) => {
      if (mparam && mparam['slug']) {
        this.routeQueryParams$ = this.route.queryParams.subscribe(params => {
          if (params['page'] && params['pageSize']) {
            this.getAllEmployees(mparam['slug'], params['page'], params['pageSize'])
          }
        });
        
      }
    });


  }
  getAllEmployees(slug: string, page : number, pageSize : number) {
    this.loading = true
    this.adminService.getEmployees(slug, page, pageSize)
    .then((result) => {
      this.employees = result?.data?.data
      this.apiPagination = result?.data?.meta?.pagination
      this.loading = false

    }).catch((err) => {
      this.loading = false
      console.log(err)
      this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
  
    })
  }


  checkIfResigned(date : string){
    return moment(date).isBefore(new Date());
  }

  public onPageChange(page : number): void {
    this.route?.parent?.parent?.params.subscribe((mparam: any) => {
      if (mparam && mparam['slug']) {
        this.routeQueryParams$ = this.route.queryParams.subscribe(params => {
          if (params['page'] && params['pageSize']) {
            this._router.navigate([], {
              relativeTo: this.route,
              queryParams: {
                page: page,
                pageSize : params['pageSize']
              },
              queryParamsHandling: 'merge',
              // preserve the existing query params in the route
            });
          }
        });
      }
    });

  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

}
