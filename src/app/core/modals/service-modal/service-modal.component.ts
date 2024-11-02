import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output, WritableSignal, signal } from "@angular/core";
import { ToastService } from "../../requests/toastr/toast.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ServiceRequest } from "../../requests/services/service.request";
import { catchError, of, take } from "rxjs";
import { IServiceOfferPayload } from "../../interfaces/service-offer.interface";
import { ServiceResponse } from "../../interfaces/service-response.interface";
import { costValueValidator } from "../../validators/cost.validator";

interface IServiceFg {
    id: FormControl<number | null>;
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
    serviceFg: FormGroup<IServiceFg> = new FormGroup<IServiceFg>({
        id: new FormControl<number | null>(null),
        name: new FormControl<string | null>(null, [Validators.required]),
        description: new FormControl<string | null>(null, [Validators.required]),
        cost: new FormControl<number | null>(null, [Validators.required, costValueValidator()]),
        duration: new FormControl<number | null>(null, [Validators.required]),
    });

    loading: WritableSignal<boolean> = signal(false);
    isEdit: WritableSignal<boolean> = signal(false);

    constructor(
        private toastService: ToastService,
        private readonly serviceRequest: ServiceRequest
    ) {}

    openDialog(service?: ServiceResponse): void {
        if (!service) this.serviceFg.reset();

        if (service) {
            this.serviceFg.patchValue({
                id: service.id,
                name: service.name,
                description: service.description,
                cost: service.cost,
                duration: service.duration
            });
            this.isEdit.set(true);
        }

        this.visible.set(true);
    }

    onSubmit(): void {
        if (this.loading()) return;

        if (!this.serviceFg.valid) {
            this.serviceFg.markAllAsTouched();
            this.toastService.error("", "Preencha todos os campos obrigatórios");
            return;
        }

        const payload: IServiceOfferPayload = {
            id: this.serviceFg.controls.id?.value!,
            name: this.serviceFg.controls.name?.value!,
            description: this.serviceFg.controls.description?.value!,
            cost: this.serviceFg.controls.cost?.value!,
            duration: this.serviceFg.controls.duration?.value!,
        };

        if (this.isEdit()) {
            this.updateService(payload);
            return;
        }

        this.createNewService(payload);
    }

    createNewService(payload: IServiceOfferPayload): void {
        this.serviceRequest
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

    updateService(payload: IServiceOfferPayload): void {
        this.serviceRequest
            .updateService(payload.id!, payload)
            .pipe(
                take(1),
                catchError(() => {
                    this.toastService.error("", "Falha ao atualizar o serviço");
                    this.loading.set(false);
                    return of(null);
                }),
            )
            .subscribe((service) => {
                this.serviceFg.reset();
                this.visible.set(false);
                this.toastService.success("", "Serviço atualizado com sucesso");
                this.service.emit(service!);
            });
    }
}
