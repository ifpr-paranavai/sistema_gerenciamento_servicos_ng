import { ChangeDetectionStrategy, Component, WritableSignal, signal } from "@angular/core";
import { ToastService } from "../../services/toastr/toast.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

interface IServiceOfferFg {
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    cost: FormControl<number | null>;
    duration: FormControl<number | null>;
}

@Component({
    selector: "sgs-service-modal",
    templateUrl: "./service-modal.component.html",
    styleUrls: ["./service-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceModalComponent { 
    visible: WritableSignal<boolean> = signal(false);
    serviceFg: FormGroup<IServiceOfferFg> = new FormGroup<IServiceOfferFg>({
        name: new FormControl<string | null>(null, [Validators.required]),
        description: new FormControl<string | null>(null, [Validators.required]),
        cost: new FormControl<number | null>(null, [Validators.required]),
        duration: new FormControl<number | null>(null, [Validators.required]),
    });

    constructor(
        private toastService: ToastService,
    ) {}

    showDialog(): void {
        console.log("chegou aqui")
        this.visible.set(true);
    }

    onSubmit(): void {
        console.log(this.serviceFg.value);
    }
}