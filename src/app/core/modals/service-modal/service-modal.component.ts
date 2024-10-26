import { ChangeDetectionStrategy, Component, EventEmitter, Output, WritableSignal, signal } from "@angular/core";
import { ToastService } from "../../services/toastr/toast.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ServiceOfferService } from "../../services/services-offer/service-offer.service";
import { catchError, of, take } from "rxjs";
import { IServiceOfferPayload } from "../../interfaces/service-offer.interface";
import { ServiceResponse } from "../../interfaces/service-response.interface";

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
    @Output() service: EventEmitter<ServiceResponse> = new EventEmitter();

    visible: WritableSignal<boolean> = signal(false);
    serviceFg: FormGroup<IServiceOfferFg> = new FormGroup<IServiceOfferFg>({
        name: new FormControl<string | null>(null, [Validators.required]),
        description: new FormControl<string | null>(null, [Validators.required]),
        cost: new FormControl<number | null>(null, [Validators.required]),
        duration: new FormControl<number | null>(null, [Validators.required]),
    });

    loading: WritableSignal<boolean> = signal(false);

    constructor(
        private toastService: ToastService,
        private readonly serviceOfferService: ServiceOfferService
    ) { }

    showDialog(): void {
        console.log("chegou aqui")
        this.visible.set(true);
    }

    onSubmit(): void {
        if (this.loading()) return;

        if(!this.serviceFg.valid) {
            this.serviceFg.markAllAsTouched();
            this.toastService.error("", "Preencha todos os campos obrigatórios");
            return;
        }

        const payload: IServiceOfferPayload = {
            name: this.serviceFg.get("name")?.value!,
            description: this.serviceFg.get("description")?.value!,
            cost: this.serviceFg.get("cost")?.value!,
            duration: this.serviceFg.get("duration")?.value!
        };

        this.serviceOfferService
            .createService(payload)
            .pipe(
                take(1),
                catchError(() => {
                    this.toastService.error("", "Falha ao cadastrar o serviço");
                    this.loading.set(false);
                    return of(null);
                }),
            )
            .subscribe((service) => {
                this.serviceFg.reset();
                this.visible.set(false);
                this.toastService.success("", "Serviço criado com sucesso");
                this.service.emit(service!);
            });

    }
}
