import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal, WritableSignal } from "@angular/core";
import { ToastService } from "../../requests/toastr/toast.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationRequest } from "../../requests/authentication/authentication.request";
import { catchError, switchMap, take, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { cpfValidator } from "../../validators/cpf.validator";

interface ProfileModalFg {
    name: FormControl<string | null>;
    email: FormControl<string | null>; 
    cpf: FormControl<string | null>; 
    profileImage: FormControl<File | null>;
}

@Component({
    selector: "sgs-profile-modal",
    templateUrl: "./profile-modal.component.html",
    styleUrls: ["./profile-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileModalComponent {
    visible: WritableSignal<boolean> = signal(false);
    loading: WritableSignal<boolean> = signal(false);

    profileFg: FormGroup<ProfileModalFg> = new FormGroup<ProfileModalFg>({
        name: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required]),
        cpf: new FormControl(null, [Validators.required, cpfValidator, Validators.minLength(11), Validators.maxLength(11)]),
        profileImage: new FormControl(null)
    });
    
    constructor(
        private readonly toastService: ToastService,
        private readonly authenticationRequest: AuthenticationRequest,
    ) {}

    recoverUser(): void {
        this.authenticationRequest.currentUser.pipe(
            take(1),
            switchMap(dataUser => {
                if (!dataUser) {
                    this.toastService.error("Atenção", "Usuário não encontrado.");
                    throw new Error("User not found!");
                }

                return this.authenticationRequest.getUserById(dataUser.user.id).pipe(
                    catchError((error: HttpErrorResponse) => {
                        this.toastService.error("Atenção", "Ocorreu um erro, tente novamente mais tarde.");
                        return throwError(() => error);
                    })
                );
            })
        ).subscribe(data => {
            if (!data || !data.user) {
                this.toastService.error("Atenção", "Ocorreu um erro, tente novamente mais tarde.");
                throw new Error("Erro ao buscar usuário!");
            }

            const user = data.user;
            this.profileFg.patchValue({
                name: user.name,
                email: user.email,
                cpf: user.cpf
            });
        });
    }

    openDialog(): void {
        this.visible.set(true);
        this.recoverUser();
    }

    closeDialog(): void {
        this.profileFg.reset();
        this.visible.set(false);
    }

    onSubmit(): void {
        if (this.loading()) return;

        if (this.profileFg.invalid) {
            this.toastService.error("Erro", "Existem campos a serem preenchidos!");
            return;
        }

    }
}
