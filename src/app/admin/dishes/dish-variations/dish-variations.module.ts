import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DishVariationsComponent } from './dish-variations.component';
import { ListItemsComponent } from './list-items/list-items.component';


@NgModule({
  declarations: [
    DishVariationsComponent,
    ListItemsComponent
  ],
  imports: [
    CommonModule,
    DragDropModule
  ],
  exports :[
    DishVariationsComponent
  ]
})
export class DishVariationsModule { }
