import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { AdminService } from '../../admin.service';
import { Expense } from '../../../Constants/dto/expense.dto';
import toMaterialStyle from 'material-color-hash'
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OverviewComponent implements OnInit {

  public loading: boolean = true
  public restaurant: any
  public expense: any
  public currencySymbol = ""
  public dataSource!: MatTableDataSource<Expense>;
  public displayedColumns: string[] = ['select', 'category', 'employee', 'date', 'debit', 'credit'];
  public columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  public expandedElement!: Expense
  public selection = new SelectionModel<Expense>(true, []);
  public groupSummary: any = {}

  public dateData: any
  public activeDateRange: string = ""

  @ViewChild(MatSort) sort!: MatSort;
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });

  constructor(
    private adminService: AdminService,
    private mainService: MainService,
    private route: ActivatedRoute
  ) {
    this.currencySymbol = this.mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.route?.parent?.parent?.params.subscribe((param: any) => {
      if (param && param['slug']) {
        this.initDate(param['slug'])
      }
    });
  }


  dateRangeChanged(date: any) {
    this.route?.parent?.parent?.params.subscribe((param: any) => {
      if (param && param['slug']) {
        this.activeDateRange = date.type
        this.dateData = date

        this.getAllExpense(param['slug'],
          moment(date.start).startOf('day').toISOString(),
          moment(date.end).endOf('day').toISOString()
        )
      }
    })
  }

  private async initDate(slug: string) {

    const date = await this.mainService.getSelectedDate()
    if (date?.start && date?.end && date?.type) {
      this.activeDateRange = date.type
      this.dateData = date
      this.getAllExpense(slug,
      moment(date.start).startOf('day').toISOString(),
      moment(date.end).endOf('day').toISOString()
    )
    }

  }


  getAllExpense(slug: string, start: string, end: string) {
    this.loading = true
    this.adminService.getAllExpense(start, end, slug)
      .then((res: any) => {
        this.restaurant = res.data.restaurant
        this.expense = res.data

        this.dogrouping()
        this.dataSource = new MatTableDataSource<Expense>(this.expense);
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: Expense, filter) => {
          const dataStr = JSON.stringify(data).toLowerCase(); return dataStr.indexOf(filter) != -1;
        }

        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

  }

  dogrouping() {
    this.groupSummary = {}
    if (this.expense && this.expense.length > 0) {
      for (let index = 0; index < this.expense.length; index++) {
        const element = this.expense[index];
        if (this.groupSummary[element.category.name]) {
          this.groupSummary[element.category.name]['debit'] = this.groupSummary[element.category.name].debit + element.debit
          this.groupSummary[element.category.name]['credit'] = this.groupSummary[element.category.name].credit + element.credit
        } else {
          this.groupSummary[element.category.name] = {
            debit: parseFloat(element.debit),
            credit: parseFloat(element.credit),
            currency: element.currency,
            colors: toMaterialStyle(element.category.name, 700)
          }
        }
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public getDebitCost() {
    return parseInt(this.expense.map((e: any) => e.debit).reduce((acc: number, value: number) => acc + value, 0));
  }

  public getCreditCost() {
    return parseInt(this.expense.map((e: any) => e.credit).reduce((acc: number, value: number) => acc + value, 0));
  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

  public deleteMultipleExpense(){
    this.loading = true
    const idsToDelete = this.selection.selected.map(e => e.id)
    this.route?.parent?.parent?.params.subscribe((param: any) => {
      if (param && param['slug']) {
        this.adminService.deleteExpenses(idsToDelete, param['slug']) 
        .then((res) => {
          this.loading = false
          this.mainService.openDialog("Success", "Selected expense deleted successfully", "S", true, false)
        }).catch((err) => {
          this.loading = false
          console.log(err)
          this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
        })

      }
    });
    
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Expense): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} }`;
  }

}
