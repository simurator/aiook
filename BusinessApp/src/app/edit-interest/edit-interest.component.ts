import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InterestService } from '../interest.service';
import { lettersValidator } from '../letters-validator';

// Forbidden words list
const FORBIDDEN_WORDS = ['tennis', 'programming', 'photography', 'learning', 'watching movies'];

// Duplicate Interest Validator with Forbidden Words Check
function duplicateInterestValidator(existingInterests: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.trim().toLowerCase();

        // Check for duplicate interests
        const isDuplicate = existingInterests.some(
            (interest: string) => interest.trim().toLowerCase() === value
        );

        // Check for forbidden words
        const isForbidden = FORBIDDEN_WORDS.some(
            forbiddenWord => value === forbiddenWord.toLowerCase()
        );

        // Return appropriate error
        if (isDuplicate) return { duplicateInterest: true };
        if (isForbidden) return { forbiddenWord: true };

        return null;
    };
}

@Component({
    selector: 'app-edit-interest',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './edit-interest.component.html',
    styleUrl: './edit-interest.component.css'
})
export class EditInterestComponent {
    @Input() set editValue(newValue: string) {
        this.oldValue = newValue;
        this.currentValue = newValue;
    }
    get editValue(): string {
        return this.oldValue;
    }
    @Output() doEditInParent: EventEmitter<string> = new EventEmitter();
    @Input() position: number | undefined;
    currentValue!: string;
    oldValue!: string;
    formModel: FormGroup;

    constructor(private interestService: InterestService) {
        const currentInterests = this.interestService.interests
            .filter((interest: string) => interest !== this.oldValue);

        this.formModel = new FormGroup({
            valueForEdit: new FormControl('', [
                Validators.required,
                Validators.minLength(2),
                lettersValidator,
                duplicateInterestValidator(currentInterests)
            ])
        });
    }

    ngOnInit() {
        this.formModel.setValue({ valueForEdit: this.oldValue });
    }

    submitForm() {
        if (this.formModel.valid && this.position !== undefined) {
            const newValue = this.formModel.value.valueForEdit;
            this.interestService.editInterest(this.position, newValue);
            this.doEditInParent.emit();
        }
    }

    cancel() {
        this.doEditInParent.emit(this.editValue);
    }
}