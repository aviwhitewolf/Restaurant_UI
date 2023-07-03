import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

export type Item = {
  id: string;
  name: string;
  children: Array<Item>;
};
@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css']
})
export class DragAndDropComponent implements OnInit {
  public data: Array<Item> = [];

  public invert: boolean = true;
  public onDragDrop$ = new Subject<CdkDragDrop<Array<Item>>>();

  constructor() {}

  ngOnInit() {
    this.data = [
      {
        id: '1',
        name: 'One',
        children: []
      },
      {
        id: '2',
        name: 'Two',
        children: []
      },
      {
        id: '3',
        name: 'Three',
        children: [
          {
            id: '3_1',
            name: 'Three One',
            children: []
          },
          {
            id: '3_2',
            name: 'Three Two',
            children: []
          },
          {
            id: '3_3',
            name: 'Three Three',
            children: []
          }
        ]
      }
    ];

    this.onDragDrop$.subscribe(this.onDragDrop);
  }


  private onDragDrop = (event: CdkDragDrop<Array<Item>>) => {
    if (event.container === event.previousContainer) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  };
}
