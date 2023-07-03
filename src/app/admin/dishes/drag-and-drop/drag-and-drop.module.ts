import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { DragAndDropManagerDirective, DragAndDropManagerRootDirective } from './drag-and-drop-manager.directive';
import { DragAndDropManagerService } from './drag-and-drop-manager.service';
import { ItemComponent } from './item/item.component';
import { DragAndDropComponent } from './drag-and-drop.component';


@NgModule({
  declarations: [
    ItemComponent,
    DragAndDropComponent,
    DragAndDropManagerDirective,
    DragAndDropManagerRootDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule, 
    DragDropModule
  ],
  exports : [DragAndDropComponent],
  providers: [DragAndDropManagerService]
})
export class DragAndDropModule { }
