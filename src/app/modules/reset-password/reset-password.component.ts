import { ChangeDetectionStrategy, Component, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationRequest } from "../../core/requests/authentication/authentication.request";

interface IResetPasswordFg {
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
    token: FormControl<string | null>;
}

@Component({
    selector: "sgs-reset-password",
    templateUrl: "./reset-password.component.html",
    styleUrls: ["./reset-password.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
    loading: WritableSignal<boolean> = signal(false);

    fg: FormGroup<IResetPasswordFg> = new FormGroup<IResetPasswordFg>({
        password: new FormControl<string | null>(null, [Validators.required]),
        confirmPassword: new FormControl<string | null>(null, [Validators.required]),
        token: new FormControl<string | null>(null, [Validators.required]),
    })

    constructor(private authenticationRequest: AuthenticationRequest) {}

    resetPassword(): void {

    }
}
