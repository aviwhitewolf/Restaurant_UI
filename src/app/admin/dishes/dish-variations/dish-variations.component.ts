import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Item } from './models/item';


@Component({
  selector: 'dish-variations',
  templateUrl: './dish-variations.component.html',
  styleUrls: ['./dish-variations.component.css']
})
export class DishVariationsComponent implements OnInit {
  public parentItem: Item;
  public get connectedDropListsIds(): string[] {
    // We reverse ids here to respect items nesting hierarchy
    return this.getNameRecursive(this.parentItem).reverse();
  }

  constructor() {
    this.parentItem = new Item({ name: 'parent-item' });
  }

  public ngOnInit() {
    this.parentItem.children.push(
      new Item({
        name: 'test1',
        children: [
          new Item({ name: 'subItem1' }),
          new Item({ name: 'subItem2' }),
          new Item({ name: 'subItem3' }),
        ],
      })
    );
    this.parentItem.children.push(
      new Item({
        name: 'test2',
        children: [
          new Item({ name: 'subItem4' }),
          new Item({ name: 'subItem5' }),
          new Item({
            name: 'subItem6',
            children: [new Item({ name: 'subItem8' })],
          }),
        ],
      })
    );
    this.parentItem.children.push(new Item({ name: 'test3' }));
  }

  public onDragDrop(event: CdkDragDrop<Item>) {
    event.container.element.nativeElement.classList.remove('active');
    if (this.canBeDropped(event)) {
      const movingItem: Item = event.item.data;
      event.container.data.children.push(movingItem);
      event.previousContainer.data.children =
        event.previousContainer.data.children.filter(
          (child) => child.name !== movingItem.name
        );
    } else {
      moveItemInArray(
        event.container.data.children,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private getNameRecursive(item: Item): string[] {
    let name = [item.name];
    item.children.forEach((childItem) => {
      name = name.concat(this.getNameRecursive(childItem));
    });
    return name;
  }

  private canBeDropped(event: CdkDragDrop<Item, Item>): boolean {
    const movingItem: Item = event.item.data;

    return (
      event.previousContainer.id !== event.container.id &&
      this.isNotSelfDrop(event) &&
      !this.hasChild(movingItem, event.container.data)
    );
  }

  private isNotSelfDrop(
    event: CdkDragDrop<Item> | CdkDragEnter<Item> | CdkDragExit<Item>
  ): boolean {
    return event.container.data.name !== event.item.data.uId;
  }

  private hasChild(parentItem: Item, childItem: Item): boolean {
    const hasChild = parentItem.children.some(
      (item) => item.name === childItem.name
    );
    return hasChild
      ? true
      : parentItem.children.some((item) => this.hasChild(item, childItem));
  }

  public checkResult() {
    console.log(this.parentItem);
  }
}
