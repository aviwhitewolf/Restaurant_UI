import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from 'src/app/main.service';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { Subscription } from 'rxjs';
import { PdfViewerComponent } from 'src/app/reusable/pdf-viewer/pdf-viewer.component';
import { AdminService } from '../../admin.service';
import { SearchEmployeeComponent } from 'src/app/reusable/search-employee/search-employee.component';
import * as moment from 'moment';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public loading: boolean = false
  public showChangeImageToggle: boolean = false
  public singleExpense: any
  public expenseCategories: any
  private routeQueryParams$!: Subscription;
  private formdata = new FormData();
  public files: File[] = []
  public showDeleteDocumentDialog: boolean = false
  public documentToDelete: any
  public seletedEmployee: any

  public expenseFormGroup: FormGroup = this.formBuilder.group({
    debit: [0, [Validators.required]],
    credit: [0, [Validators.required]],
    remarks: ['', [Validators.required]],
    category: ['', [Validators.required]],
    currency: ['INR', [Validators.required]],
    uploadUrl: [''],
    employee: [null],
    date : [new Date(), [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private _location: Location,
    private adminService: AdminService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private mainService: MainService,
    private cdRef: ChangeDetectorRef,
    private restaurantService : RestaurantService
  ) {
  }

  ngOnInit(): void {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.getAllExpenseCategory(restaurantSlug)
        this.route?.params.subscribe((param: any) => {
          if (param['expenseId'])
            this.getExpense(restaurantSlug, param['expenseId'])
        })
 
      }
    
  }

  updateOrSaveExpense() {
    this.loading = true
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.route?.params.subscribe(async (param: any) => {

          const time = moment(`${new Date().getHours()}:${new Date().getMinutes()}`, "HH:mm");
          const date = moment(this.expenseFormGroup?.value?.date);
          const mergedDate = date.set({
            hour: time.get("hour"),
            minute: time.get("minute"),
          });
          const expenseData = {
            currency: this.expenseFormGroup?.value?.currency,
            remarks: this.expenseFormGroup?.value?.remarks,
            address: this.expenseFormGroup?.value?.address,
            debit: this.expenseFormGroup?.value?.debit,
            credit: this.expenseFormGroup?.value?.credit,
            uploadUrl: this.expenseFormGroup?.value?.uploadUrl,
            category: this.expenseFormGroup?.value?.category,
            employee: this.seletedEmployee?.id,
            date : moment(mergedDate).toISOString()
          }

          if (this.files?.length > 0) {
            this.formdata.delete('files.upload')
            this.files.forEach((file: File) => this.formdata.append('files.upload', file, file?.name))
          } else {
            this.formdata.delete('files.upload')
          }

          //User want to edit
          if (param['expenseId']) {
            //User did not changed the Image or added a new document
            if (! this.formdata.has('files.upload')) {
              //do a normal request without formdata
              this.adminService.updateExpense(expenseData, restaurantSlug, param['expenseId'])
                .then((result) => {
                  this.loading = false
                  this.reset()
                  this.mainService.openDialog("Success", "Updated Successfully", "S", true)

                }).catch((err) => {
                  this.loading = false
                  console.log("Error", err)
                  this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
                })

              //User added a document
            } else {

              this.formdata.delete('data')
              this.formdata.append("data", JSON.stringify(expenseData));
              this.adminService.updateExpense(this.formdata, restaurantSlug, param['expenseId'])
                .then((result) => {
                  this.reset()
                  this.loading = false
                  this.mainService.openDialog("Success", "Updated Successfully", "S", true)
                }).catch((err) => {
                  this.loading = false
                  console.log("Error", err)
                  this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

                })

            }

            //User wants to add
          } else {

            const restaurantSlug = this.restaurantService.getRestaurantSlug()
            if (restaurantSlug) {

                this.formdata.delete('data')
                this.formdata.append("data", JSON.stringify(expenseData));

                this.adminService.addExpense(this.formdata, restaurantSlug)
                  .then((result) => {
                    this.reset()
                    this.loading = false
                    this.mainService.openDialog("Success", "Added Successfully with id : " + result?.data?.id, "S", true)
                  }).catch((err) => {
                    this.loading = false
                    console.log("Error", err)
                    this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

                  })

              }

          }

        })

      }

    

  }

  getAllExpenseCategory(slug: string) {
    this.loading = true
    this.adminService.getExpenseCategory(slug)
      .then((res) => {
        this.expenseCategories = res?.data

        //setting select with 'Salary' if url contans 'showSearchEmployee'
        this.route.queryParams.subscribe(params => {
          if (params['showSearchEmployee']) {
            const mCat = this.expenseCategories.find((e: any) => e?.name == 'Salary')
            this.expenseFormGroup.patchValue({ category: mCat?.id })
          }
        });
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log("Error", err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

  }

  getExpense(slug: string, expenseId: string) {
    this.loading = true
    this.adminService.getSingleExpense(slug, expenseId)
      .then((res) => {
        this.singleExpense = res?.data
        this.expenseFormGroup.patchValue(
          {
            debit: this.singleExpense?.debit,
            credit: this.singleExpense?.credit,
            remarks: this.singleExpense?.remarks,
            category: this.singleExpense?.category?.id,
            currency: this.singleExpense?.currency,
            uploadUrl: this.singleExpense?.uploadUrl,
            date : moment(this.singleExpense?.date).toISOString()
          }

        );

        this.seletedEmployee = this.singleExpense?.employee
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log("Error", err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })
  }

  onCategoryChange(catId: any) {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.router.navigate([]);
        this.seletedEmployee = null
        //Get Salary Id
        const mCatId = this.expenseCategories.find((e: any) => e.name == 'Salary')
        if (mCatId?.id == catId) {
          //Salary Selected
          this.openEmployeeSearchComponent(restaurantSlug)
        }
      }

  }

  openEmployeeSearchComponent(slug: string) {
    const dialogRef = this.dialog.open(SearchEmployeeComponent, {
      panelClass: 'popUp-modalbox',
      data: { slug: slug }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.seletedEmployee = result
      this.router.navigate([]);
    });
  }

  checkIfSalaryIsSelected() {
    if (this.expenseCategories) {
      const mCat = this.expenseCategories.find((e: any) => e?.name?.toLowerCase() == 'salary')
      if (this.expenseFormGroup.value?.category == mCat?.id) {
        return true
      }
    }
    return false

  }

  openSearchEmployee() {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
          this.openEmployeeSearchComponent(restaurantSlug)
        }
    
  }


  openPdfViewer(file: any) {
    const url = this.mainService.getImageUrl(file, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
    this.dialog.open(PdfViewerComponent, {
      data: {
        url: url,
        height: '100%',
        width: '100%'
      },
      // panelClass: 'popUp-modalbox'
    });
  }

  download(file: any) {
    let preferedFormat = ""
    if(file?.ext == '.jpeg' || file?.ext == '.png' || file?.ext == '.jpg') preferedFormat = Constants.IMAGE_SIZE.large
    const url = this.mainService.getImageUrl(file, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE, preferedFormat)
    window.open(url);
  }

  async uploadFile(event: any) {
    let fileList: FileList = event.target.files;

    if (fileList?.length > 0) {

      let file: File = fileList[0];

      if ((this.files.findIndex(mfile => mfile.name == file.name) < 0) && ((this.singleExpense && this.singleExpense?.upload) ? this.singleExpense?.upload?.findIndex((mfile: any) => mfile.name == file.name) < 0 : -1)) {
        this.files.push(file)
      } else {
        this.mainService.openDialog("Error", "Document already exists with same name.", "E")
        return
      }
    }

  }

  remove(file: any) {
    if (file?.id) {
      this.showDeleteDocumentDialog = true
    } else {
      const index = this.files.map(file => file.name).indexOf(file.name)
      if (index >= 0) this.files.splice(index, 1)
    }
  }

  private reset() {
    this.files = []
    this.formdata.delete('data')
    this.formdata.delete('files.upload')
    this.formdata.delete('files.upload')
  }

  deleteUpload(file: any) {
    this.loading = true
    const id = file?.id
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
      if (restaurantSlug && id) {
        this.route?.params.subscribe(async (mparam: any) => {
          if (mparam['expenseId']) {
            this.adminService.deleteExpenseUpload(id, mparam['expenseId'], restaurantSlug)
              .then((result) => {
                this.showDeleteDocumentDialog = false
                const index = this.singleExpense?.upload.map((file: any) => file.id).indexOf(file?.id)
                if (index >= 0) this.singleExpense?.upload.splice(index, 1)
                this.loading = false
                this.mainService.openDialog("Success", "Document deleted successfully", "S")
              }).catch((err) => {
                console.log("Error", err)
                this.showDeleteDocumentDialog = false
                this.loading = false
                this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

              })
          }

        })
      }
    
  }


  goBackback() {
    this._location.back(); // <-- go back to previous location on cancel
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

  checkSearchEmployeeInUrl(): boolean {
    this.routeQueryParams$ = this.route.queryParams.subscribe(params => {
      if (params['showSearchEmployee']) {
        return true
      } else {
        return false
      }
    });
    return false
  }


}
