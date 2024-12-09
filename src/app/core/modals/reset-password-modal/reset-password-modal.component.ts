import { ChangeDetectionStrategy, Component, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationRequest } from "../../requests/authentication/authentication.request";
import { catchError, take, throwError } from "rxjs";
import { ToastService } from "../../requests/toastr/toast.service";
import { HttpErrorResponse } from "@angular/common/http";

interface IResetPasswordModalFg {
    email: FormControl<string | null>;
}

@Component({
    selector: "sgs-reset-password-modal",
    templateUrl: "./reset-password-modal.component.html",
    styleUrls: ["./reset-password-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordModalComponent {
    visible: WritableSignal<boolean> = signal(false);
    loading: WritableSignal<boolean> = signal(false);

    fg: FormGroup<IResetPasswordModalFg> = new FormGroup<IResetPasswordModalFg>({
        email: new FormControl<string | null>(null, [Validators.required])
    });

    constructor(
        private authenticationRequest: AuthenticationRequest,
        private toastService: ToastService,
    ) {}

    openDialog(): void {
        this.visible.set(true);
    }

    closeDialog(): void {
        this.fg.reset();
        this.visible.set(false);
    }

    resetPassword(): void {
        if (this.loading()) return;

        this.loading.set(true);

        this.authenticationRequest
            .resetPassword(this.fg.controls.email.value!)
            .pipe(
                take(1),
                catchError((error: HttpErrorResponse) => {
                    this.loading.set(false);
                    this.toastService.error("Atenção", "Erro ao enviar o token para o e-mail. Tente novamente mais tarde!");
                    return throwError(() => error);
                })
            )
            .subscribe(() => {
                this.loading.set(false);
                this.closeDialog();
                this.toastService.success("Sucesso", "Enviado token para o e-mail com sucesso.");
            });
    }
}
