import { Component, Inject, OnInit } from '@angular/core';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';

@Component({
    selector: 'app-edit-image-modal',
    templateUrl: './edit-image-modal.component.html',
    styleUrls: ['./edit-image-modal.component.css']
})
export class EditImageModalComponent implements OnInit {

    private imageSize!: string;
    constructor(
        public dialogRef: MatDialogRef<EditImageModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private mainService : MainService
    ) {
        
    }

    ngOnInit(): void {
    }

    imageChangedEvent: any = '';
    croppedImage: any = '';
    canvasRotation = 0;
    rotation = 0;
    scale = 1;
    showCropper = false;
    containWithinAspectRatio = true;
    transform: ImageTransform = {};

    fileChangeEvent(event: any): void {
        this.imageSize = this.calculateImageSize(event.target.files[0])

        if (this.imageSize <= Constants.MAX_IMAGE_SIZE_IN_MB) {
            this.imageChangedEvent = event;
        } else {
            this.mainService.openDialog("Error", "Image size should be less than " + Constants.MAX_IMAGE_SIZE_IN_MB + " MB", "E")
        }
    }

    imageCropped(event: ImageCroppedEvent) {

        this.croppedImage = event.base64;
        this.data.image = base64ToFile(this.croppedImage)
        this.data.base64 = this.croppedImage


    }

    calculateImageSize(file: File) {
        this.data.name = file.name
        this.data.type = file.type
        return ((file.size / 1024) / 1024).toFixed(4);
    }

    imageLoaded() {
        this.showCropper = true;
        //   console.log('Image loaded');
    }

    cropperReady(sourceImageDimensions: Dimensions) {
        //   console.log('Cropper ready', sourceImageDimensions);
    }

    loadImageFailed() {
        this.mainService.openDialog("Error", "Image Loading failed", "E")
        //   console.log('Load failed');
    }

    rotateLeft() {
        this.canvasRotation--;
        this.flipAfterRotate();
    }

    rotateRight() {
        this.canvasRotation++;
        this.flipAfterRotate();
    }

    private flipAfterRotate() {
        const flippedH = this.transform.flipH;
        const flippedV = this.transform.flipV;
        this.transform = {
            ...this.transform,
            flipH: flippedV,
            flipV: flippedH
        };
    }


    flipHorizontal() {
        this.transform = {
            ...this.transform,
            flipH: !this.transform.flipH
        };
    }

    flipVertical() {
        this.transform = {
            ...this.transform,
            flipV: !this.transform.flipV
        };
    }

    resetImage() {
        this.scale = 1;
        this.rotation = 0;
        this.canvasRotation = 0;
        this.transform = {};
    }

    zoomOut() {
        this.scale -= .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    zoomIn() {
        this.scale += .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    toggleContainWithinAspectRatio() {
        this.containWithinAspectRatio = !this.containWithinAspectRatio;
    }

    updateRotation() {
        this.transform = {
            ...this.transform,
            rotate: this.rotation
        };
    }

    closeModal(): void {
        this.dialogRef.close();
    }

    clear(): void {
        this.scale = 1;
        this.rotation = 0;
        this.canvasRotation = 0;
        this.transform = {};
        this.imageChangedEvent = null;
    }


}
