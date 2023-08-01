import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

interface ChildFormData {
  name: string;
  price: number;
  metaData: any;
  type: string;
  dependsOn : string,
  showDropDown : boolean
}

@Component({
  selector: 'addon-dish-variation',
  templateUrl: './addon-dish-variation.component.html',
  styleUrls: ['./addon-dish-variation.component.css']
})
export class AddonDishVariationComponent implements OnInit {

  parentForms!: FormGroup[];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.parentForms = [this.createParentForm()];
  }

  createParentForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      multiSelect: [false, Validators.required],
      metaData: '',
      type: ['Veg', Validators.required],
      required: [false, Validators.required],
      children: this.formBuilder.array([])
    });
  }

  addChild(parentIndex: number): void {
    const parent = this.parentForms[parentIndex];
    const children = parent.get('children') as FormArray;

    const childForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      metaData: '',
      type: ['Veg', Validators.required],
      dependsOn : [''],
      showDropDown : [false]
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
      children: parent.value.children.map((child: any) => ({
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

  getList(limitIndex: number): any {
    const formData = [];

    for (let i = 0; i < limitIndex; i++) {
      
      const parent = this.parentForms[i];
      const parentData = {
        name: parent.value.name,
        multiSelect: parent.value.multiSelect,
        metaData: parent.value.metaData,
        type: parent.value.type,
        required: parent.value.required,
        children: [] as ChildFormData[]
      };

      const children = parent.value.children;
      for (let j = 0; j < children.length; j++) {
        const child = children[j];

        if(child.name){
        const childData = {
          name: child.name,
          price: child.price,
          metaData: child.metaData,
          type: child.type,
          dependsOn : '',
          showDropDown : false
        };
        parentData.children.push(childData);
      }
      }

      formData.push(parentData);
    }

    console.log(formData)
    return formData
  }


  changeValueOfDependsOn(parentIndex: number, childIndex : number, child : any) {
    const parent = this.parentForms[parentIndex];
    const children = parent.get('children') as FormArray;
    const childForm = children.at(childIndex);

    // Replace these default values with your desired values to patch
    const patchedValues = {
      dependsOn : child.name,
      showDropDown : false
    };

    childForm.patchValue(patchedValues);
  }

  toggleDropDown(parentIndex: number, childIndex : number, child : any, showDropDown : boolean){
    const parent = this.parentForms[parentIndex];
    const children = parent.get('children') as FormArray;
    const childForm = children.at(childIndex);

    // Replace these default values with your desired values to patch
    const patchedValues = {
      showDropDown : showDropDown
    };

    childForm.patchValue(patchedValues);
  }

}
