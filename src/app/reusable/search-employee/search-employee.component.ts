import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/admin/admin.service';
import { MainService } from 'src/app/main.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Constants } from 'src/app/Constants/Interface/Constants';

@Component({
  selector: 'app-search-employee',
  templateUrl: './search-employee.component.html',
  styleUrls: ['./search-employee.component.scss']
})
export class SearchEmployeeComponent implements OnInit {


  public loading: boolean = false
  public notFoundError : boolean = false
  public searchUpdate = new Subject<string>();
  public employees: any
  public selectedEmpAfterSearch: any
  public employeeFormGroup: FormGroup = this.formBuilder.group({
    search: ['', [Validators.email]],
  });

  constructor(
    public dialogRef: MatDialogRef<SearchEmployeeComponent>,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private mainService: MainService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {


    // Debounce search.
    this.searchUpdate.pipe(
      debounceTime(900),
      distinctUntilChanged())
      .subscribe(value => {
        if (value && value?.length > 3) {
          this.searchEmployee(value)
        } 
      });
  }

  searchEmployee(value: string) {
    if(this.notFoundError) this.notFoundError = false
    this.selectedEmpAfterSearch = null
    this.adminService.searchEmployee(this.data.slug, value)
      .then((result) => {
        this.loading = false
        this.employees = result.data
      }).catch((err) => {
        this.loading = false
        console.log(err)
        // this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E", false, false)
        this.notFoundError = true
      })

  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  

}
