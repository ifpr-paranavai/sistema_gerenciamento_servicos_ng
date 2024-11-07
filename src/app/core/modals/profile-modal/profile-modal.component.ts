import { ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal } from "@angular/core";
import { ToastService } from "../../requests/toastr/toast.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationRequest } from "../../requests/authentication/authentication.request";

interface ProfileModalFg {
    name: FormControl<string | null>;
    email: FormControl<string | null>; 
    profileImage: FormControl<File | null>;
}

@Component({
    selector: "sgs-profile-modal",
    templateUrl: "./profile-modal.component.html",
    styleUrls: ["./profile-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileModalComponent implements OnInit {
    visible: WritableSignal<boolean> = signal(false);
    loading: WritableSignal<boolean> = signal(false);

    profileFg: FormGroup<ProfileModalFg> = new FormGroup<ProfileModalFg>({
        name: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required]),
        profileImage: new FormControl(null)
    });
    
    constructor(
        private readonly toastService: ToastService,
        private readonly authenticationRequest: AuthenticationRequest,
        ) {}

    ngOnInit(): void {
    }

    openDialog(): void {
        this.visible.set(true);
    }

    onSubmit(): void {

    }
}
