import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { AdminService } from '../../admin.service';
import { MainService } from 'src/app/main.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-tax',
  templateUrl: './edit-tax.component.html',
  styleUrls: ['./edit-tax.component.css']
})
export class EditTaxComponent implements OnInit {


  private taxId: string = ""
  public singleTax : any
  public loading: boolean = false
  public taxes: any[] = []
  public showDeleteDialog: boolean = false
  public taxToDelete: any
  private rateRegrex = /^([1-9]|[1-9][0-9]|100)$/
  private compoundRegrex = /^(true|false)$/i

  taxForm : FormGroup = this.formBuilder.group({
    disable: [false, [Validators.required, Validators.pattern(this.compoundRegrex)]],
    name: ['', [Validators.required]],
    rate: ['', [Validators.required, Validators.pattern(this.rateRegrex)]],
    priority: ['', [Validators.required, Validators.pattern(this.rateRegrex)]],
    compound: [false, [Validators.required, Validators.pattern(this.compoundRegrex)]]
  });


  constructor(
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantService,
    private adminService: AdminService,
    private mainService: MainService,
    private _location: Location,
    private route: ActivatedRoute,
  ) {


  }


  ngOnInit(): void {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.route?.params.subscribe((param: any) => {
          if (param['taxId']) {
            this.taxId = param['taxId']
            this.getSingletax(restaurantSlug, param['taxId'])
          } else {
            this.loading = false
          }
        })
      }
  }

  private getSingletax(slug: string, taxId: string) {
    this.loading = true
    this.adminService.getSingleTax(slug, taxId)
      .then((result) => {
        this.singleTax = result.data
        this.taxForm.setValue({ disable: this.singleTax.disable, name: this.singleTax.name, rate: this.singleTax.rate, priority: this.singleTax.priority, compound: this.singleTax.compound});
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E", false, true)
      })
  }

  updateOrAddTaxes() {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.route?.params.subscribe((param: any) => {
          if (param['taxId']) {
            this.updateTax(restaurantSlug, param['taxId'])
          } else {
            this.addTax(restaurantSlug)
          }

        })
      }
    
  }

  updateTax(slug: string, taxId: string) {
    this.loading = true
    this.adminService.updateTax(this.taxForm.value, slug, taxId)
      .then((res) => {
        this.loading = false
        this.mainService.openDialog("Success", "Tax updated successfully", "S", true, false)
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

  }

  addTax(slug: string) {
    this.loading = true
    const data = { disable: this.taxForm.value.disable, name: this.taxForm.value.name, rate: this.taxForm.value.rate, priority: this.taxForm.value.priority, compound: this.taxForm.value.compound }
    this.adminService.addTax(data, slug)
      .then((res) => {
        this.loading = false
        this.mainService.openDialog("Success", "Tax created successfully with id:" + res?.data?.id, "S", true, false)
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

  }



  goBackback() {
    this._location.back(); // <-- go back to previous location on cancel
  }

}
