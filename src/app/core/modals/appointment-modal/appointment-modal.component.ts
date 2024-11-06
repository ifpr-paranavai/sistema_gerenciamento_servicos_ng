import { ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal } from "@angular/core";
import { ServiceRequest } from "../../requests/services/service.request";
import { ToastService } from "../../requests/toastr/toast.service";
import { IAppointmentResponse } from "../../interfaces/appointment-response.interface";
import { forkJoin, Observable, take } from "rxjs";
import { IDropdown } from "../../interfaces/dropdown.interface";
import { FormControl, FormGroup } from "@angular/forms";
import { ClientRequest } from "../../requests/clients/clients.request";
import { ProviderRequest } from "../../requests/providers/providers.request";
import { IDocumentRequirement, ServiceResponse } from "../../interfaces/service-response.interface";
import { IClient } from "../../interfaces/client.interface";
import { IProvider } from "../../interfaces/provider.interface";
import { AppointmentStatusEnum } from "../../interfaces/appointment-status.interface";

interface IAppointmentFg {
    id: FormControl<number | null>;
    serviceId: FormControl<string | null>;
    documentType: FormControl<DocumentType | null>;
    clientId: FormControl<number | null>;
    providerId: FormControl<number | null>;
    status: FormControl<AppointmentStatusEnum | null>;
    appointmentDate: FormControl<Date | null>;
    observation: FormControl<string | null>;
    documents: FormControl<{ [key: number]: File } | null>;
}

@Component({
    selector: 'sgs-appointment-modal',
    templateUrl: './appointment-modal.component.html',
    styleUrls: ['./appointment-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentModalComponent implements OnInit {
    visible: WritableSignal<boolean> = signal(false);
    loading: WritableSignal<boolean> = signal(false);
    isEdit: WritableSignal<boolean> = signal(false);
    servicesDropdownOptions: WritableSignal<IDropdown[]> = signal([]);
    clientDropdownOptions: WritableSignal<IDropdown[]> = signal([]);
    providerDropdownOptions: WritableSignal<IDropdown[]> = signal([]);
    selectedDocuments: { [key: number]: File } = {};
    selectedService: ServiceResponse | null = null;
    minDate: Date = new Date();

    appointmentFg: FormGroup<IAppointmentFg> = new FormGroup<IAppointmentFg>({
        id: new FormControl<number | null>(null),
        serviceId: new FormControl<string | null>(null),
        documentType: new FormControl<DocumentType | null>(null),
        clientId: new FormControl<number | null>(null),
        providerId: new FormControl<number | null>(null),
        status: new FormControl<AppointmentStatusEnum | null>(null),
        appointmentDate: new FormControl<Date | null>(null),
        observation: new FormControl<string | null>(null),
        documents: new FormControl<{ [key: number]: File } | null>(null),
    });

    constructor(
        private toastService: ToastService,
        private readonly serviceRequest: ServiceRequest,
        private readonly clientRequest: ClientRequest,
        private readonly providerRequest: ProviderRequest,
    ) { }

    ngOnInit(): void {
        this.getDropdownOptions();
    }

    openDialog(appointment?: IAppointmentResponse): void {
        this.visible.set(true);
        if (appointment) {
            this.isEdit.set(true);
            this.appointmentFg.patchValue({
                ...appointment,
                id: parseInt(appointment.id),
            });
        }
    }

    onSubmit(): void {
        if (this.loading()) return;

        if (this.appointmentFg.invalid) {
            this.toastService.error("Atenção", "Preencha todos os campos obrigatórios.");
            this.appointmentFg.markAllAsTouched();
            return;
        }

        console.log(this.appointmentFg.value);
    }

    private getDropdownOptions(): void {
        forkJoin([
            this.getServicesOptions(),
            this.getClientsOptions(),
            this.getProvidersOptions(),
        ]).pipe(take(1)).subscribe(([services, clients, providers]) => {
            this.servicesDropdownOptions.set(
                services.map(service => ({ label: service.name, value: service.id! }))
            );
            this.clientDropdownOptions.set(
                clients.map(client => ({ label: client.name, value: client.id!, complement: client.cpf }))
            );
            this.providerDropdownOptions.set(
                providers.map(provider => ({ label: provider.name, value: provider.id!, complement: provider.cpf }))
            );
        });
    }

    private getServicesOptions(): Observable<ServiceResponse[]> {
        return this.serviceRequest
            .getServices()
            .pipe(take(1));
    }

    private getClientsOptions(): Observable<IClient[]> {
        return this.clientRequest
            .getClients()
            .pipe(take(1));
    }

    private getProvidersOptions(): Observable<IProvider[]> {
        return this.providerRequest
            .getProviders()
            .pipe(take(1));
    }

    closeModal(): void {
        this.reset();
        this.visible.set(false);
    }

    reset(): void {
        this.appointmentFg.reset();
        this.selectedDocuments = {};
        this.selectedService = null;
        this.isEdit.set(false);
    }

    onServiceSelect(event: any): void {
        const serviceId = event.value;
        if (serviceId) {
            this.loading.set(true);
            this.serviceRequest.getServiceById(serviceId).pipe(take(1)).subscribe({
                next: (service) => {
                    this.selectedService = service;
                    this.initializeDocuments(service.document_requirements);
                    this.loading.set(false);
                },
                error: () => {
                    this.toastService.error('Erro', 'Erro ao carregar detalhes do serviço');
                    this.loading.set(false);
                }
            });
        }
    }

    getSelectedServiceLabel(): string {
        const selectedId = this.appointmentFg.get('serviceId')?.value;
        const service = this.servicesDropdownOptions()
            .find(option => option.value === selectedId);
        return service ? service.label : '';
    }

    triggerFileInput(elementId: string): void {
        const element = document.getElementById(elementId) as HTMLInputElement;
        if (element) {
          element.click();
        }
    }
    
    onFileSelect(event: any, requirementId: number): void {
        const file = event.target.files[0];
        if (file) {
            const requirement = this.selectedService?.document_requirements
                .find(req => req.id === requirementId);
            
            if (requirement) {
                const allowedTypes = requirement.document_template?.file_types;
                const fileExtension = file.name.split('.').pop()?.toLowerCase();
                
                if (!allowedTypes.includes(fileExtension)) {
                    this.toastService.error(
                        'Erro',
                        `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`
                    );
                    return;
                }
                
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    this.toastService.error(
                        'Erro',
                        'O arquivo é muito grande. Tamanho máximo permitido: 5MB'
                    );
                    return;
                }

                this.selectedDocuments[requirementId] = file;
                this.appointmentFg.patchValue({ documents: this.selectedDocuments });
                
                this.toastService.success(
                    'Sucesso',
                    'Documento anexado com sucesso!'
                );
            }
        }
    }
    
    private initializeDocuments(requirements: IDocumentRequirement[]): void {
        this.selectedDocuments = {};
        requirements.forEach(req => {
          if (req.is_required) {
            this.appointmentFg.get('documents')?.addValidators([
              (control) => {
                return this.selectedDocuments[req.id] ? null : { required: true };
              }
            ]);
          }
        });
    }
}
