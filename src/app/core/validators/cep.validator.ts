import { AbstractControl, ValidationErrors } from "@angular/forms";

export function cepValidator(control: AbstractControl): ValidationErrors | null {
    const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;

    if (!control.value || cepRegex.test(control.value)) {
        return null;
    }

    return { invalidCep: true };
}
