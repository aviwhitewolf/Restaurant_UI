import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from 'src/app/main.service';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { Subscription } from 'rxjs';
import { PdfViewerComponent } from 'src/app/reusable/pdf-viewer/pdf-viewer.component';
import * as moment from 'moment';
import { AdminService } from '../../admin.service';
import { EditImageModalComponent } from '../../../reusable/edit-image-modal/edit-image-modal.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public loading: boolean = true
  public showChangeImageToggle: boolean = false
  public singleEmployee: any
  public selectedImage: any
  public imageFromApi: any
  public currencySymbol = ""
  public designation: any
  private routeQueryParams$!: Subscription;
  private formdata = new FormData();
  public files: File[] = []
  public showDeleteDocumentDialog: boolean = false
  public documentToDelete: any

  public employeeFormGroup: FormGroup = this.formBuilder.group({
    fullName: ['', [Validators.required]],
    address: ['', [Validators.required]],
    mobile: ['', [Validators.required]],
    dateOfResignation: [new Date('9999-12-31'), [Validators.required]],
    documentVerified: [false, [Validators.required]],
    dateOfJoining: [new Date(), [Validators.required]],
    salary: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    currency: ['INR', [Validators.required]],
    countryCode: ['+91', [Validators.required]],
    designation: ['', [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private _location: Location,
    private adminService: AdminService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private mainService: MainService,
    private cdRef: ChangeDetectorRef
  ) {
    this.currencySymbol = this.mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"
    
  }

  ngOnInit(): void {
    this.route?.parent?.parent?.params.subscribe((mparam: any) => {
      if (mparam && mparam['slug']) {
        this.getAllDesignation(mparam['slug'])
        this.route?.params.subscribe((param: any) => {
          if (param['staffId'])
            this.getEmployee(mparam['slug'], param['staffId'])
        })
      }
    });
    // subscribe to open dish dialog using url change
    this.routeQueryParams$ = this.route.queryParams.subscribe(params => {
      if (params['showImageDialog']) {
        this.openEditImageModal();
      }
    });
  }


  updateOrSaveEmployee() {
    this.loading = true
    this.route?.parent?.parent?.params.subscribe((mparam: any) => {
      if (mparam && mparam['slug']) {
        this.route?.params.subscribe(async (param: any) => {

          const employeeData = {
            fullName: this.employeeFormGroup.value.fullName,
            address: this.employeeFormGroup.value.address,
            mobile: this.employeeFormGroup.value.mobile,
            dateOfResignation: moment(this.employeeFormGroup.value.dateOfResignation).endOf('day').toISOString(),
            dateOfJoining: moment(this.employeeFormGroup.value.dateOfJoining).startOf('day').toISOString(),
            salary: this.employeeFormGroup.value.salary,
            gender: this.employeeFormGroup.value.gender,
            email: this.employeeFormGroup.value.email,
            currency: this.employeeFormGroup.value.currency,
            countryCode: this.employeeFormGroup.value.countryCode,
            designation: this.employeeFormGroup.value.designation,
            documentVerified: this.employeeFormGroup.value.documentVerified
          }

          if (this.files.length > 0) {
            this.formdata.delete('files.documents')
            this.files.forEach((file: File) => this.formdata.append('files.documents', file, file.name))
          } else {
            this.formdata.delete('files.documents')
          }

          if (!this.formdata.has('files.image')) {
            this.formdata.delete('files.image')
          }


          //User want to edit
          if (param['staffId']) {
            //User did not changed the Image or added a new document
            if (!(this.formdata.has('files.image') || this.formdata.has('files.documents'))) {
              //do a normal request without formdata
              this.adminService.updateEmployee(employeeData, mparam['slug'], param['staffId'])
                .then((result) => {
                  this.loading = false
                  this.reset()
                  this.mainService.openDialog("Success", "Updated Successfully", "S", true)

                }).catch((err) => {
                  this.loading = false
                  console.log("Error", err)
                  this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
                })

              //User changed the image or added a document
            } else {

              this.formdata.delete('data')
              this.formdata.append("data", JSON.stringify(employeeData));
              this.adminService.updateEmployee(this.formdata, mparam['slug'], param['staffId'])
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

            this.route?.parent?.parent?.params.subscribe((param: any) => {
              if (param && param['slug']) {

                if (!this.selectedImage) {
                  this.mainService.openDialog("Error", "Please upload image", "E")
                  this.loading = false
                  return
                }

                this.formdata.delete('data')
                this.formdata.append("data", JSON.stringify(employeeData));

                this.adminService.addEmployee(this.formdata, param['slug'])
                  .then((result) => {
                    this.reset()
                    this.loading = false
                    this.mainService.openDialog("Success", "Added Successfully with id : " + result.data.id, "S", true)
                  }).catch((err) => {
                    this.loading = false
                    console.log("Error", err)
                    this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

                  })

              }

            });

          }

        })

      }

    });

  }

  getAllDesignation(slug: string) {
    this.loading = true
    this.adminService.getDesignation(slug)
      .then((res) => {
        this.designation = res?.data?.data
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log("Error", err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

  }


  getEmployee(slug: string, staffId: string) {
    this.loading = true
    this.adminService.getSingleEmployee(slug, staffId)
      .then((res) => {
        this.singleEmployee = res?.data[0]
        this.employeeFormGroup.patchValue(
          {
            fullName: this.singleEmployee.fullName,
            address: this.singleEmployee.address,
            mobile: this.singleEmployee.mobile,
            dateOfResignation: moment(this.singleEmployee.dateOfResignation).endOf('day').toISOString(),
            dateOfJoining: moment(this.singleEmployee.dateOfJoining).startOf('day').toISOString(),
            salary: this.singleEmployee.salary,
            gender: this.singleEmployee.gender,
            email: this.singleEmployee.email,
            currency: this.singleEmployee.currency,
            countryCode: this.singleEmployee.countryCode,
            designation: this.singleEmployee.designation?.id,
            documentVerified: this.singleEmployee.documentVerified
          }

        );
        if (this.singleEmployee.image)
          this.imageFromApi = this.mainService.getImageUrl(this.singleEmployee.image ? this.singleEmployee.image[0] : '', Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)

        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log("Error", err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })
  }


  checkIfResigned() {
    return moment(this.singleEmployee?.dateOfResignation).isBefore(new Date());
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

  downloadPdf(file: any) {
    const url = this.mainService.getImageUrl(file, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
    window.open(url);
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


  async uploadFile(event: any) {
    let fileList: FileList = event.target.files;

    if (fileList.length > 0) {

      let file: File = fileList[0];

      if ((this.files.findIndex(mfile => mfile.name == file.name) < 0) && ((this.singleEmployee && this.singleEmployee?.documents) ? this.singleEmployee?.documents?.findIndex((mfile: any) => mfile.name == file.name) < 0 : -1)) {
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
  // deleteFile()

  private reset() {
    this.files = []
    this.formdata.delete('data')
    this.formdata.delete('files.image')
    this.formdata.delete('files.documents')
  }

  deleteUpload(file: any) {
    this.loading = true
    const id = file?.id
    this.route?.parent?.parent?.params.subscribe((param: any) => {
      if (param && param['slug'] && id) {
        this.route?.params.subscribe(async (mparam: any) => {
          if (mparam['staffId']) {
            this.adminService.deleteEmployeeUpload(id, mparam['staffId'], param['slug'])
              .then((result) => {
                this.showDeleteDocumentDialog = false
                const index = this.singleEmployee?.documents.map((file: any) => file.id).indexOf(file.id)
                if (index >= 0) this.singleEmployee?.documents.splice(index, 1)
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
    })
  }


  changeImage() {
    this.router.navigate([], { queryParams: { showImageDialog: true }, relativeTo: this.route });
  }

  getImage() {
    return (this.selectedImage ? this.selectedImage : this.imageFromApi)
  }

  goBackback() {
    this._location.back(); // <-- go back to previous location on cancel
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

}
