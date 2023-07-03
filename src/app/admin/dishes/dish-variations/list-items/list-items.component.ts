import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../models/item';


@Component({
  selector: 'list-item',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class ListItemsComponent {

  @Input() item!: Item;
  @Input() parentItem?: Item;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }
  public get connectedDropListsIds(): string[] {
    return this.allDropListsIds.filter((name) => name !== this.item.name);
  }
  public allDropListsIds: string[];

  public get dragDisabled(): boolean {
    return !this.parentItem;
  }

  public get parentItemId(): string {
    return this.dragDisabled ? '' : this.parentItem?.name || "";
  }


  @Output() itemDrop: EventEmitter<CdkDragDrop<Item>>

  constructor() {
    this.allDropListsIds = [];
    this.itemDrop = new EventEmitter();
  }

  public onDragDrop(event: CdkDragDrop<Item, Item>): void {
    this.itemDrop.emit(event);
  }

}
