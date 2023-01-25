import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input()
  total: number = 0

  @Input()
  pageCount: number = 0;

  @Input()
  page: number = 0;

  @Input()
  pageSize: number = 0

  @Output()
  public pageChange: EventEmitter<number> = new EventEmitter();

  public pageArray: any[] = []
  constructor() { }

  ngOnInit(): void {
    this.generatePages()
  }

  generatePages() {
    if (this.pageCount <= 6) {
      for (let i = 1; i <= this.pageCount; i++) {
        this.pageArray.push(i)
      }
    }
    else {

      this.pageArray.push(1)

      // Print "..." only if page is > 3
      if (this.page > 3) {
        this.pageArray.push("...");
      }

      // special case where last page is selected...
      if (this.page == this.pageCount) {
        this.pageArray.push(this.page - 2);
      }

      // Print previous number button if page > 2
      if (this.page > 2) {
        this.pageArray.push(this.page - 1);
      }

      //Print current page number button as long as it not the first or last page
      if (this.page != 1 && this.page != this.pageCount) {
        this.pageArray.push(this.page);
      }

      //print next number button if page < lastPage - 1
      if (this.page < this.pageCount - 1) {
        this.pageArray.push(this.page + 1);
      }

      // special case where first page is selected...
      if (this.page == 1) {
        this.pageArray.push(this.page + 2);
      }

      //print "..." if page is < lastPage -2
      if (this.page < this.pageCount - 2) {
        this.pageArray.push("...");
      }

      //Always print last page button if there is more than 1 page
      this.pageArray.push(this.pageCount);
    }

  }

  changePageNumber(pageIndex: number) {

    if (this.page != pageIndex) {
      this.page = pageIndex
      this.pageArray = []
      this.pageChange.emit(pageIndex);
      this.generatePages()
    }

  }


}
