import { ChangeDetectionStrategy, Component, WritableSignal, signal } from "@angular/core";
import { ToastService } from "../../core/services/toastr/toast.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../../core/services/authentication/authentication.service";
import { Router } from "@angular/router";
import { catchError, finalize, take } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";

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

    loading: WritableSignal<boolean> = signal(false);

    loginFg: FormGroup<ILoginFormGroup> = new FormGroup({
        email: new FormControl<string | null>(null, [Validators.required]),
        password: new FormControl<string | null>(null, [Validators.required]),
    });

    constructor(
        private toastService: ToastService,
        private authenticationService: AuthenticationService,
        private router: Router,
    ) {}

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
}
