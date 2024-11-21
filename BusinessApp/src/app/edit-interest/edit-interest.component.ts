import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InterestService } from '../interest.service';
import { lettersValidator } from '../letters-validator';

@Component({
  selector: 'app-edit-interest',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './edit-interest.component.html',
  styleUrl: './edit-interest.component.css'
})
export class EditInterestComponent {
  @Input() set editValue(newValue:string){
    this.oldValue=newValue;
    this.currentValue=newValue;

  }
  get editValue():string{
    return this.oldValue;
  }
  @Output() doEditInParent: EventEmitter<string>=new EventEmitter();

  @Input() position:number | undefined;
  currentValue!:string;
  oldValue!:string;

  formModel: FormGroup;

  
 constructor(private interestService:InterestService){
  this.formModel = new FormGroup({
    valueForEdit: new FormControl('',[Validators.required,Validators.minLength(2), lettersValidator])
    
  });
 }

 ngOnInit(){
  this.formModel.setValue({valueForEdit: this.oldValue});
 }

 

  changeEditValue(){
    //this.doEditInParent.emit(this.currentValue);
    if(this.position!==undefined)
      this.interestService.editInterest(this.position,this.currentValue);
    this.doEditInParent.emit();
  }


  submitForm(){
    console.log('form',this.formModel.value.valueForEdit);
    if(this.position!==undefined){
      let newValue=this.formModel.value.valueForEdit;
      console.log('new value',newValue,this.formModel.value.valueForEdit);
      this.interestService.editInterest(this.position,this.formModel.value.valueForEdit);
    }
      
    this.doEditInParent.emit();
  }

  cancel(){
    this.doEditInParent.emit(this.editValue);
  }
}
