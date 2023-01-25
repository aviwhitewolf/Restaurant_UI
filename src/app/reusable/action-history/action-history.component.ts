import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

interface ActionHistory{
  id : any,
  date : string,
  action : string,
  new : any,
  old : any,
  remarks : string,
  user : any
}

@Component({
  selector: 'app-action-history',
  templateUrl: './action-history.component.html',
  styleUrls: ['./action-history.component.css']
})
export class ActionHistoryComponent implements OnInit {

  @ViewChild(MatAccordion)
  accordion!: MatAccordion;

  checkState : boolean = false 

  @Input()
  public actionHistory! : ActionHistory[] 

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleState(){
    this.checkState = !this.checkState
  }



}
