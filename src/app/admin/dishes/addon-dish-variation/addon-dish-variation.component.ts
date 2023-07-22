import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'addon-dish-variation',
  templateUrl: './addon-dish-variation.component.html',
  styleUrls: ['./addon-dish-variation.component.css']
})
export class AddonDishVariationComponent implements OnInit {

  public timePeriods = [
    'Bronze age',
    'Iron age'
  ];
  
  isEditing: string | null;

  parentForms!: FormGroup[];

  constructor(private formBuilder: FormBuilder) {
    this.isEditing = null;
   }
 
   ngOnInit() {
     this.parentForms = [this.createParentForm()];
   }
 
   createParentForm(): FormGroup {
     return this.formBuilder.group({
       name: ['', Validators.required],
       multiSelect: [false, Validators.required],
       metaData: '',
       type: ['', Validators.required],
       required: [false, Validators.required],
       children: this.formBuilder.array([])
     });
   }
 
   addChild(parentIndex: number): void {
     const parent = this.parentForms[parentIndex];
     const children = parent.get('children') as FormArray;
 
     const childForm = this.formBuilder.group({
       Name: ['', Validators.required],
       price: [0, Validators.required],
       metaData: '',
       type: ['', Validators.required]
     });
 
     children.push(childForm);
   }
 
   removeChild(parentIndex: number, childIndex: number): void {
     const parent = this.parentForms[parentIndex];
     const children = parent.get('children') as FormArray;
 
     children.removeAt(childIndex);
   }
 
   addParent(): void {
     const parentForm = this.createParentForm();
     this.parentForms.push(parentForm);
   }
 
   removeParent(index: number): void {
     this.parentForms.splice(index, 1);
   }
 
   submitForm(): void {
     // Iterate through the parent forms and access the child forms
     const formData = this.parentForms.map(parent => ({
       name: parent.value.name,
       multiSelect: parent.value.multiSelect,
       metaData: parent.value.metaData,
       type: parent.value.type,
       required: parent.value.required,
       children: parent.value.children.map((child : any) => ({
         Name: child.Name,
         price: child.price,
         metaData: child.metaData,
         type: child.type
       }))
     }));
 
     console.log(formData);
     // Do something with the form data
   }


   getChildren(parent: FormGroup): AbstractControl[] {
    const children = parent.get('children') as FormArray;
    return children.controls;
  }


  editField(field: string): void {
    this.isEditing = field;
   
  }

  cancelEdit(): void {
    this.isEditing = null;
  }

  saveField(field: string): void {
    this.isEditing = null;
    // Perform any desired actions with the updated field value
  }

}
