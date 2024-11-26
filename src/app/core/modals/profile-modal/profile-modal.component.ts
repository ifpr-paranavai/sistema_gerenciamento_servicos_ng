import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal, WritableSignal } from "@angular/core";
import { ToastService } from "../../requests/toastr/toast.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationRequest } from "../../requests/authentication/authentication.request";
import { catchError, finalize, switchMap, take, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { cpfValidator } from "../../validators/cpf.validator";
import { IEditUserPayload } from "../../interfaces/edit-user-payload.interface";
import { ICountryStates } from "../../interfaces/country-states.interface";
import { CountryStatesConstants } from "../../constants/country-states.constants";
import { UserState } from "../../abstractions/user.state";
import { IUser } from "../../interfaces/user.interface";
import { positiveValueValidator } from "../../validators/cost.validator";
import { cepValidator } from "../../validators/cep.validator";

interface ProfileModalFg {
    name: FormControl<string | null>;
    email: FormControl<string | null>;
    cpf: FormControl<string | null>;
    profile_picture: FormControl<string | null>;
    street: FormControl<string | null>;
    number: FormControl<string | null>;
    city: FormControl<string | null>;
    state: FormControl<string | null>;
    zip_code: FormControl<string | null>;
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
        profile_picture: new FormControl(null),
        street: new FormControl(null),
        number: new FormControl(null, [Validators.min(1)]),
        city: new FormControl(null),
        state: new FormControl(null),
        zip_code: new FormControl(null, [cepValidator]),
    });

    userId?: string;

    coutryStatesOptions: ICountryStates[] = CountryStatesConstants;

    constructor(
        private readonly toastService: ToastService,
        private readonly authenticationRequest: AuthenticationRequest,
        private readonly cdr: ChangeDetectorRef,
        private readonly userState: UserState,
    ) {}

    recoverUser(): void {
        this.authenticationRequest.currentUser.pipe(
            take(1),
            switchMap(dataUser => {
                if (!dataUser) {
                    this.toastService.error("Atenção", "Usuário não encontrado.");
                    throw new Error("User not found!");
                }

                this.userId = dataUser.user.id;

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
                cpf: user.cpf,
                profile_picture: user.profile?.profile_picture,
                street: user.profile?.street,
                number: user.profile?.number,
                city: user.profile?.city,
                state: this.setStateOption(user.profile?.state ?? ""),
                zip_code: user.profile?.zip_code,
            });
        });
    }

    setStateOption(state: string): string {
        if (!state) return "";

        return this.coutryStatesOptions.find(option => option.uf === state)?.uf ?? "";
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

        const payload: IEditUserPayload = {
            name: this.profileFg.controls.name.value!,
            email: this.profileFg.controls.email.value!,
            cpf: this.profileFg.controls.cpf.value!,
            profile_picture: this.profileFg.controls.profile_picture.value!,
            street: this.profileFg.controls.street.value,
            number: this.profileFg.controls.number.value,
            city: this.profileFg.controls.city.value,
            state: this.profileFg.controls.state.value,
            zip_code: this.profileFg.controls.zip_code.value,
        };

        this.authenticationRequest.updateUserById(this.userId!, payload)
        .pipe(
            take(1),
            catchError((error: HttpErrorResponse) => {
                this.toastService.error("Erro", "Erro ao atualizar dados");
                return throwError(() => error)
            }),
            finalize(() => this.toastService.success("", "Usuário atualizado!")),
        ).subscribe(user => {
            this.updateUserLocalStorage(user);
            this.userState.update(user);
            this.cdr.detectChanges();
        });
    }

    updateUserLocalStorage(user: IUser): void {
        this.authenticationRequest.currentUser.pipe(take(1)).subscribe(data => {
            if (!data) throw new Error("User not found");

            this.authenticationRequest.setUserLocalStorage({
                ...data,
                user: user
            });
        });
    }

    triggerFileInput(fileInput: HTMLInputElement): void {
        fileInput.click();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            this.toastService.error("Erro", "Nenhuma imagem foi selecionada.");
            return;
        }

        const file = input.files[0];

        const validFormats = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validFormats.includes(file.type)) {
            this.toastService.error("Erro", "Formato inválido. Permitidos: PNG, JPG, JPEG.");
            return;
        }

        const SIZE_3MB = 3 * 1024 * 1024

        if (file.size > SIZE_3MB) {
            this.toastService.error("Erro", "A imagem deve ter no máximo 3MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;
            this.profileFg.controls.profile_picture.setValue(base64String);
            this.cdr.detectChanges();
        };
        reader.onerror = () => {
            this.toastService.error("Erro", "Erro ao carregar a imagem.");
        };

        reader.readAsDataURL(file);
    }
}
