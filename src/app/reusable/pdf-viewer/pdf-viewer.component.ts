import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PdfViewerComponent as pdfVc } from 'ng2-pdf-viewer';
import { MainService } from 'src/app/main.service';


@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {

  renderText = true;
  originalSize = false;
  fitToPage = true;
  showAll = true;
  autoresize = false;
  showBorders = true;
  renderTextModes = [0, 1, 2];
  renderTextMode = 1;
  rotation = 0;
  zoom = 1;
  zoomScale = 'page-fit';
  pdfQuery = '';
  totalPages: number = 0;
  page: number = 1;
  isLoaded: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mainService : MainService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
  }

  @ViewChild(pdfVc) private pdfComponent!: pdfVc;

  searchQueryChanged(stringToSearch: string) {
    this.pdfComponent.eventBus.dispatch('find', {
      query: stringToSearch, type: 'again', caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true
    });
  }


  pagechanging(e: any) {
    if (e?.pageNumber)
      this.page = e.pageNumber; // the page variable
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    if (this.page < this.totalPages)
      this.page++;
  }

  prevPage() {
    if (this.totalPages > 0 && this.page > 1)
      this.page--;
  }

  changeZoomScale(mZoomScale : string) {
    this.pdfComponent.pdfViewer.currentScaleValue = mZoomScale;
  }

  onError(error: any) {
    console.log("Error", error)
    this.mainService.openDialog("Error", "Error loading pdf.", "E")
  }

}
