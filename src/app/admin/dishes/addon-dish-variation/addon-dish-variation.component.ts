import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

interface ChildFormData {
  name: string;
  price: number;
  metaData: any;
  type: string;
  dependsOn: string,
  showDropDown: boolean
}

@Component({
  selector: 'addon-dish-variation',
  templateUrl: './addon-dish-variation.component.html',
  styleUrls: ['./addon-dish-variation.component.css']
})
export class AddonDishVariationComponent implements OnInit {

  @Output() formCreated = new EventEmitter<FormGroup[]>();

  parentForms!: FormGroup[];

  constructor(private formBuilder: FormBuilder) { 
    this.parentForms = [this.createParentForm()];
    this.addChild(0)
  }

  ngOnInit() {
    this.formCreated.emit(this.parentForms);
  }

  createParentForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      multiSelect: [false, Validators.required],
      metaData: '',
      type: ['Veg', Validators.required],
      required: [false, Validators.required],
      children: this.formBuilder.array([], [Validators.required, this.childrenRequiredValidator])
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
      dependsOn: [''],
      showDropDown: [false],
      dependsOnIndex: [[]]
    });

    children.push(childForm);
    this.formCreated.emit(this.parentForms);
  }

  removeChild(parentIndex: number, childIndex: number): void {
    const parent = this.parentForms[parentIndex];
    const children = parent.get('children') as FormArray;
    const childForm = children.at(childIndex);
    this.updateForm([[parentIndex, childIndex]])
    children.removeAt(childIndex);
    this.formCreated.emit(this.parentForms);
  }

  addParent(): void {
    const parentForm = this.createParentForm();
    this.parentForms.push(parentForm);
    this.addChild(this.parentForms.length - 1)
    this.formCreated.emit(this.parentForms);
  }

  removeParent(parentIndex: number): void {
    this.parentForms.splice(parentIndex, 1);
    const parent = this.parentForms[parentIndex];
    const children = parent.value.children;
    this.updateForm(children.map((child : any, childIndex : number) => [parentIndex, childIndex]))
    this.formCreated.emit(this.parentForms);
  }

  submitForm(): void {
    // Iterate through the parent forms and access the child forms
    console.log(this.parentForms[0].value)
    const formData = this.parentForms.map(parent => ({
      name: parent.value.name,
      multiSelect: parent.value.multiSelect,
      metaData: parent.value.metaData,
      type: parent.value.type,
      required: parent.value.required,
      children: parent.value.children.map((child: any) => {

        const myChild = {
          name: child.name,
          price: child.price,
          metaData: child.metaData,
          type: child.type,
          dependsOn: null,
          dependsOnIndex : []
        }

        if (child.dependsOnIndex && child.dependsOnIndex.length > 0) {
          const [dependOnParentIndex, dependOnChildIndex] = child.dependsOnIndex
          const dependsOnParent = this.parentForms[dependOnParentIndex];
          const dependsOnchildren = dependsOnParent.get('children') as FormArray;
          const dependsOnChildForm = dependsOnchildren.at(dependOnChildIndex);
          myChild.dependsOn = dependsOnChildForm.value?.name,
          myChild.dependsOnIndex = child.dependsOnIndex
        }

        return myChild
      })
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
        children: [] as ChildFormData[],
        index: i
      };

      const children = parent.value.children;
      for (let j = 0; j < children.length; j++) {
        const child = children[j];

        if (child.name) {
          const childData = {
            name: child.name,
            price: child.price,
            metaData: child.metaData,
            type: child.type,
            dependsOn: child.dependsOn,
            showDropDown: false,
            index: j,
            dependsOnIndex: child.dependsOnIndex
          };
          parentData.children.push(childData);
        }
      }
      formData.push(parentData);
    }
    return formData
  }


  updateForm(dependsOnIndices: any[]) {

    for (let i = 0; i < this.parentForms.length; i++) {

      const parent = this.parentForms[i];
      const children = parent.value.children;

      for (let j = 0; j < children.length; j++) {

        const dependsOnchildren = parent.get('children') as FormArray;
        const dependsOnchildForm = dependsOnchildren.at(j);
        if (dependsOnIndices.findIndex((index: number[]) => index[0] === dependsOnchildForm.value?.dependsOnIndex[0] &&
          index[1] === dependsOnchildForm.value?.dependsOnIndex[1]) >= 0) {
          dependsOnchildForm.patchValue({
            dependsOn: '',
            showDropDown: false,
            dependsOnIndex: []
          });
        }
      }
    }

  }

  changeValueOfDependsOn(parentIndex: number, childIndex: number, child: any, dependOnParentIndex: number, dependOnChildIndex: number) {

    const parent = this.parentForms[parentIndex];
    const children = parent.get('children') as FormArray;
    const childForm = children.at(childIndex);

    const dependsOnParent = this.parentForms[dependOnParentIndex];
    const dependsOnchildren = dependsOnParent.get('children') as FormArray;
    const dependsOnChildForm = dependsOnchildren.at(dependOnChildIndex);

    childForm.patchValue({
      // dependsOn: dependsOnChildForm?.value?.name,
      showDropDown: false,
      dependsOnIndex: [dependOnParentIndex, dependOnChildIndex]
    });


  }


  toggleDropDown(parentIndex: number, childIndex: number, child: any, showDropDown: boolean) {
    const parent = this.parentForms[parentIndex];
    const children = parent.get('children') as FormArray;
    const childForm = children.at(childIndex);

    // Replace these default values with your desired values to patch
    const patchedValues = {
      showDropDown: showDropDown
    };

    childForm.patchValue(patchedValues);
  }


  getName(dependsOnIndex: number[]): string | null {
    if (dependsOnIndex && dependsOnIndex.length > 0) {
      const dependOnParentIndex = dependsOnIndex[0]
      const dependOnChildIndex = dependsOnIndex[1]
      const dependsOnParent = this.parentForms[dependOnParentIndex];
      const dependsOnchildren = dependsOnParent.get('children') as FormArray;
      const dependsOnChildForm = dependsOnchildren.at(dependOnChildIndex);
      return dependsOnChildForm?.value?.name ? dependsOnChildForm?.value?.name : null
    } else {
      return null
    }
  }

  childrenRequiredValidator(control: FormArray): ValidationErrors | null {
    const children = control.controls;
    if (children.length === 0) {
      return { childrenRequired: true }; // Validation error if no children are present
    }
    return null; // No validation error
  }
  

}


