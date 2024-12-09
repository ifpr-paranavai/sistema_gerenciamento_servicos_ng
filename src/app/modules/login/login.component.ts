import { ChangeDetectionStrategy, Component, ViewChild, WritableSignal, signal } from "@angular/core";
import { ToastService } from "../../core/requests/toastr/toast.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationRequest } from "../../core/requests/authentication/authentication.request";
import { Router } from "@angular/router";
import { catchError, finalize, take } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { ResetPasswordModalComponent } from "../../core/modals/reset-password-modal/reset-password-modal.component";

interface ILoginFormGroup {
    email: FormControl<string | null>;
    password: FormControl<string | null>;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
    @ViewChild(ResetPasswordModalComponent) resetPasswordModalComponent?: ResetPasswordModalComponent

    loading: WritableSignal<boolean> = signal(false);

    loginFg: FormGroup<ILoginFormGroup> = new FormGroup({
        email: new FormControl<string | null>(null, [Validators.required]),
        password: new FormControl<string | null>(null, [Validators.required]),
    });

    constructor(
        private toastService: ToastService,
        private authenticationService: AuthenticationRequest,
        private router: Router,
    ) { }

    doUserLogin(): void {
        if (this.loading()) return;

        if (!this.loginFg.valid) {
            this.loginFg.markAllAsTouched();
            this.toastService.error("", "Preencha todos os campos obrigatórios");
            return;
        }

        this.loading.set(true);
        const { email, password } = this.loginFg.controls;

        this.authenticationService
            .doUserLogin(email.value!, password.value!)
            .pipe(
                take(1),
                finalize(() => this.loading.set(false)),
            ).subscribe({
                next: (response) => {
                    this.authenticationService.setUserLocalStorage(response);
                    this.router.navigate(["/app/home"]);
                    this.toastService.success("Sucesso", "Acesso realizado.");
                },
                error: (error: HttpErrorResponse) => {
                    this.toastService.error("Atenção", error.error.error);
                }
            });
    }

    openResetPasswordModal(): void {
        if (!this.resetPasswordModalComponent) throw new Error('ResetPasswordModalComponent not found');

        this.resetPasswordModalComponent.openDialog();
    }
}
