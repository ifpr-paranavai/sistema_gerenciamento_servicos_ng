import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, WritableSignal, signal } from "@angular/core";
import { ToastService } from "../../requests/toastr/toast.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ServiceRequest } from "../../requests/services/service.request";
import { catchError, of, take } from "rxjs";
import { IServiceOfferPayload } from "../../interfaces/service-offer.interface";
import { IDocumentRequirement, ServiceResponse } from "../../interfaces/service-response.interface";
import { positiveValueValidator } from "../../validators/cost.validator";
import { IDocumentsTemplateResponse } from "../../interfaces/documents-template-response.interface";
import { DocumentsTemplateRequest } from "../../requests/documents-template/documents-template.request";

interface IServiceFg {
    id: FormControl<number | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    cost: FormControl<number | null>;
    duration: FormControl<number | null>;
    documentTemplates: FormControl<IDocumentRequirement[] | null>;
}

@Component({
    selector: "sgs-service-modal",
    templateUrl: "./service-modal.component.html",
    styleUrls: ["./service-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceModalComponent implements OnInit{
    @Output() service: EventEmitter<ServiceResponse> = new EventEmitter();

    visible: WritableSignal<boolean> = signal(false);
    serviceFg: FormGroup<IServiceFg> = new FormGroup<IServiceFg>({
        id: new FormControl<number | null>(null),
        name: new FormControl<string | null>(null, [Validators.required]),
        description: new FormControl<string | null>(null, [Validators.required]),
        cost: new FormControl<number | null>(null, [Validators.required, positiveValueValidator()]),
        duration: new FormControl<number | null>(null, [Validators.required]),
        documentTemplates: new FormControl<IDocumentRequirement[] | null>(null)
    });

    documentTemplates: WritableSignal<IDocumentRequirement[]> = signal([]);

    loading: WritableSignal<boolean> = signal(false);
    isEdit: WritableSignal<boolean> = signal(false);

    constructor(
        private toastService: ToastService,
        private readonly serviceRequest: ServiceRequest,
        private readonly documentTemplateRequest: DocumentsTemplateRequest
    ) {}

    ngOnInit(): void {
        this.loadDocumentTemplates();
    }

    private closeDialogWithSuccess(message: string, documentTemplate: any): void {
        this.resetForm();
        this.visible.set(false);
        this.loading.set(false);
        this.isEdit.set(false);
        this.toastService.success("Sucesso", message);
    }

    private resetForm(): void {
        this.serviceFg.reset();
        this.serviceFg.markAsUntouched();
        this.serviceFg.markAsPristine();
        Object.keys(this.serviceFg.controls).forEach(key => {
            const control = this.serviceFg.get(key);
            control?.setErrors(null);
        });
    }

    openDialog(service?: ServiceResponse): void {
        if (!service) {
            this.serviceFg.reset();
            this.documentTemplates.update(templates =>
                templates.map(template => ({
                    ...template,
                    selected: false,
                    required: false
                }))
            );
            this.isEdit.set(false);
            this.visible.set(true);
            return;
        }


        this.serviceFg.patchValue({
            id: service.id,
            name: service.name,
            description: service.description,
            cost: service.cost,
            duration: service.duration
        });

        this.documentTemplates.update(templates =>
            templates.map(template => {
                const requirement = service.document_requirements.find(
                    req => req.document_template?.id === template.document_template?.id
                );
                return {
                    ...template,
                    selected: !!requirement,
                    required: requirement?.is_required ?? false
                };
            })
        );

        this.isEdit.set(true);
        this.visible.set(true);
    }

    onSubmit(): void {
        if (this.loading()) return;

        if (!this.serviceFg.valid) {
            this.serviceFg.markAllAsTouched();
            this.toastService.error("", "Preencha todos os campos obrigatórios");
            return;
        }

        const selectedTemplates = this.documentTemplates()
            .filter(template => template.selected)
            .map(template => ({
                document_template_id: template.document_template.id,
                is_required: template.required || false
            }));

        const payload: IServiceOfferPayload = {
            id: this.serviceFg.controls.id?.value!,
            name: this.serviceFg.controls.name?.value!,
            description: this.serviceFg.controls.description?.value!,
            cost: this.serviceFg.controls.cost?.value!,
            duration: this.serviceFg.controls.duration?.value!,
            document_requirements: selectedTemplates
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
                this.service.emit(service!);
                this.closeDialogWithSuccess("Serviço criado com sucesso", payload);
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
                this.closeDialogWithSuccess("Serviço atualizado com sucesso", payload);
                this.service.emit(service!);
            });
    }

    private loadDocumentTemplates(): void {
        this.documentTemplateRequest.getDocumentsTemplates()
        .pipe(
            take(1),
            catchError(() => {
                this.toastService.error("", "Falha ao carregar templates");
                return of([]);
            })
        )
        .subscribe((templates: IDocumentsTemplateResponse[]) => {
            const templatesWithSelection = templates.map(template => ({
                document_template: template,
                is_required: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                selected: false,
                required: false,
            })) as IDocumentRequirement[];

            this.documentTemplates.set(templatesWithSelection);
        });
    }
}
