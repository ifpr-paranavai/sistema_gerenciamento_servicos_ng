import { ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { AuthenticationRequest } from "../../core/requests/authentication/authentication.request";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastService } from "../../core/requests/toastr/toast.service";

interface IResetPasswordFg {
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
}

@Component({
    selector: "sgs-reset-password",
    templateUrl: "./reset-password.component.html",
    styleUrls: ["./reset-password.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {
    loading: WritableSignal<boolean> = signal(false);

    fg: FormGroup<IResetPasswordFg> = new FormGroup<IResetPasswordFg>({
        password: new FormControl<string | null>(null, [Validators.required]),
        confirmPassword: new FormControl<string | null>(null, [Validators.required]),
    }, { validators: this.passwordsMatch });

    token: string | null = null;

    constructor(
        private authenticationRequest: AuthenticationRequest,
        private router: Router,
        private route: ActivatedRoute,
        private toastService: ToastService,
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'] || null;
            if (!this.token) {
                this.toastService.error('Token de redefinição inválido ou ausente', '');
            }
        });
    }

    resetPassword(): void {
        if (!this.token) {
            this.toastService.error('Token de redefinição inválido ou ausente', '');
            return;
        }

        if (this.fg.invalid || !this.fg.value.password) {
            this.fg.markAllAsTouched();
            return;
        }

        this.loading.set(true);

        this.authenticationRequest.changePassword(this.fg.value.password, this.token).subscribe({
            next: () => {
                this.toastService.success('Senha alterada com sucesso', '');
                this.router.navigate(['/auth']);
            },
            error: (error) => {
                this.toastService.error('Erro ao alterar senha', error.error.message);
            },
            complete: () => {
                this.loading.set(false);
            }
        });
    }

    get passwordMismatchError(): boolean {
        return this.fg.errors?.['passwordsMismatch'] || false;
    }

    private passwordsMatch(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordsMismatch: true };
    }
}
