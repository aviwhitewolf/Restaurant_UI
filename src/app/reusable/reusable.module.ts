import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel/carousel.component';
import { MatIconModule } from '@angular/material/icon';
import { DishCardComponent } from './dish-card/dish-card.component';
import { CartCardComponent } from './cart-card/cart-card.component';
import { ModalComponent } from './modal/modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoaderComponent } from './loader/loader.component';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { OrderCardComponent } from './order-card/order-card.component';
import { GridListComponent } from './grid-list/grid-list.component';
import { SingleListComponent } from './single-list/single-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { PaginationComponent } from './pagination/pagination.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { KFormatPipe } from './pipes/k-format.pipe';
import { SearchEmployeeComponent } from './search-employee/search-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionHistoryComponent } from './action-history/action-history.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { SearchDishComponent } from './search-dish/search-dish.component';
import { PrintQrcodeComponent } from './print-qrcode/print-qrcode.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxPrintModule } from 'ngx-print';
import { EditImageModalComponent } from './edit-image-modal/edit-image-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DateRangeComponent } from './date-range/date-range.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OrderNotificationComponent } from './order-notification/order-notification.component';

@NgModule({
  declarations: [
    CarouselComponent,
    DishCardComponent,
    CartCardComponent,
    ModalComponent,
    LoaderComponent,
    ErrorMsgComponent,
    SnackbarComponent,
    OrderCardComponent,
    GridListComponent,
    SingleListComponent,
    PageNotFoundComponent,
    ClickOutsideDirective,
    PaginationComponent,
    PdfViewerComponent,
    KFormatPipe,
    SearchEmployeeComponent,
    ActionHistoryComponent,
    SearchDishComponent,
    PrintQrcodeComponent,
    EditImageModalComponent,
    DateRangeComponent,
    OrderNotificationComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    PdfViewerModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatRippleModule,
    FormsModule,
    NgxQRCodeModule,
    NgxPrintModule,
    ImageCropperModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  exports: [
    CarouselComponent,
    DishCardComponent,
    CartCardComponent,
    ModalComponent,
    LoaderComponent,
    SnackbarComponent,
    OrderCardComponent,
    GridListComponent,
    SingleListComponent,
    ClickOutsideDirective,
    PaginationComponent,
    KFormatPipe,
    SearchEmployeeComponent,
    ActionHistoryComponent,
    SearchDishComponent,
    PrintQrcodeComponent,
    DateRangeComponent,
    OrderNotificationComponent
  ]
})
export class ReusableModule { }
