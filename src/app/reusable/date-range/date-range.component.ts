import { AfterViewInit, Component, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css']
})

export class DateRangeComponent implements OnInit {

  @Output()
  data : EventEmitter<any> = new EventEmitter();;

  public showDateRange: boolean = false
  public dateRange = Constants.DATE_RANGE
  public activeDateRange: string = Constants.DEFAULT_DATE_RANGE

  @ViewChild(MatSort) sort!: MatSort;
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });

  constructor(
    private mainService: MainService
    ) {}

  ngOnInit(): void { 
    this.initDate() 
  }


  private async initDate(){
    const date = await this.mainService.getSelectedDate()
    if (date?.start && date?.end && date?.type) {
      this.activeDateRange = date.type
      this.range.patchValue({ start: date?.start, end: date?.end })
    }
  }


  getDate(date: string) {
    if (this.dateRange[this.activeDateRange as keyof typeof this.dateRange]) {
      return date == 'start' ? this.dateRange[this.activeDateRange as keyof typeof this.dateRange].start : this.dateRange[this.activeDateRange as keyof typeof this.dateRange].end
    } else {
      return date == 'start' ? this.range.value.start : this.range.value.end
    }
  }

  dateRangeSelected(name: string, dateObj: any) {
    this.activeDateRange = name
    this.showDateRange = false
    this.mainService.setDates(dateObj.start, dateObj.end, name)
    this.range.patchValue({ start: dateObj.start, end: dateObj.end })
    this.data.emit({ start: dateObj.start, end: dateObj.end, type: name })

  }

  customDateRange() {
    this.activeDateRange = 'Custom'
    if (this.range.value.start && this.range.value.end) {
      this.mainService.setDates(this.range.value.start, this.range.value.end, this.activeDateRange)
      this.data.emit({ start: this.range.value.start, end: this.range.value.end, type: 'Custom' })
    }

  }

  returnZero() {
    return 0
  }

}
