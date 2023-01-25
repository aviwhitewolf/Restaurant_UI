import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.css']
})
export class ErrorMsgComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _location: Location) { }

  ngOnInit(): void {
  }

  public beforeClose() {
    if (this.data?.reload)
      window.location.reload()
    if (this.data.goBack)
      this._location.back();
  }

}
