import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from '../drag-and-drop.component';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input('onDragDrop') public onDragDrop$!: Subject<CdkDragDrop<Array<Item>>>;
  @Input() item!: Item;
  @Input() invert!: boolean;

  constructor() {}

  ngOnInit() {}
}
