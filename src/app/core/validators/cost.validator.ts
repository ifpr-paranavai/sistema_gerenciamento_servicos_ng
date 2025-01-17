import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function positiveValueValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (value !== null && value <= 0) {
            return { positiveValue: true };
        }

        return null;
    };
}
