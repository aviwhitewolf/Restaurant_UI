import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Order } from '../../../Constants/dto/order.dto';
import { AdminService } from '../../admin.service';
import { SelectionModel } from '@angular/cdk/collections';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';

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
  public orders: any
  public dataSource!: MatTableDataSource<Order>;
  public displayedColumns: string[] = ['select', 'fullName', 'totalAmount', 'status', 'table', 'number', 'modeOfPayment', 'createdAt'];
  public columnsToDisplayWithExpand = [...this.displayedColumns, 'expand']
  public selection = new SelectionModel<Order>(true, []);
  public expandedElement!: Order
  public dateData: any
  public activeDateRange: string = ""

  @ViewChild(MatSort) sort!: MatSort;
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });

  public dateRange = Constants.DATE_RANGE

  constructor(
    private adminService: AdminService,
    private mainService: MainService,
    private route: ActivatedRoute,
    private restaurantService : RestaurantService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.initDate(restaurantSlug)
      }
    
  }

  dateRangeChanged(date: any) {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.activeDateRange = date.type
        this.dateData = date

        this.getMyOrders(
          restaurantSlug,
          moment(date.start).startOf('day').toISOString(),
          moment(date.end).endOf('day').toISOString()
        )
      }
    
  }

  getMyOrders(slug: string, start: string, end: string) {
    this.loading = true
    this.adminService.getMyOrders(start, end, slug)
      .then((res: any) => {
        this.orders = res?.data?.data
        this.dataSource = new MatTableDataSource<Order>(this.orders);
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: Order, filter) => {
          const dataStr = JSON.stringify(data).toLowerCase(); return dataStr.indexOf(filter) != -1;
        }

        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

  }


  deleteMultipleOrders() {

    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.loading = true
        const idsToDelete = this.selection.selected.map(e => e.id)
        this.adminService.deleteMultipleOrders(idsToDelete, restaurantSlug)
          .then((res) => {
            this.loading = false
            this.mainService.openDialog("Success", "Selected order deleted successfully", "S", true, false)
          }).catch((err) => {
            this.loading = false
            console.log(err)
            this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
          })
      }
  }


  private async initDate(slug: string) {

    const date = await this.mainService.getSelectedDate()
    if (date?.start && date?.end && date?.type) {
      this.activeDateRange = date.type
      this.dateData = date

      this.getMyOrders(
        slug,
        moment(date.start).startOf('day').toISOString(),
        moment(date.end).endOf('day').toISOString()
      )
    }

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection?.selected?.length;
    const numRows = this.dataSource?.data?.length;
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
  checkboxLabel(row?: Order): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} }`;
  }

}
