import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, signal, WritableSignal } from "@angular/core";
import { ServiceRequest } from "../../requests/services/service.request";
import { ToastService } from "../../requests/toastr/toast.service";
import { IAppointmentResponse } from "../../interfaces/appointment-response.interface";
import { catchError, forkJoin, Observable, take } from "rxjs";
import { IDropdown } from "../../interfaces/dropdown.interface";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { ClientRequest } from "../../requests/clients/clients.request";
import { ProviderRequest } from "../../requests/providers/providers.request";
import { IDocumentRequirement, ServiceResponse } from "../../interfaces/service-response.interface";
import { IClient } from "../../interfaces/client.interface";
import { IProvider } from "../../interfaces/provider.interface";
import { AppointmentStatusEnum } from "../../interfaces/appointment-status.interface";
import { AppointmentsRequest } from "../../requests/appointments/appointments.request";

interface IAppointmentFg {
    id: FormControl<string | null>;
    serviceSelected: FormControl<IDropdown | null>;
    documentType: FormControl<DocumentType | null>;
    clientId: FormControl<IDropdown | null>;
    providerId: FormControl<IDropdown | null>;
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
    @Output() appointmentEvent: EventEmitter<IAppointmentResponse> = new EventEmitter();
    visible: WritableSignal<boolean> = signal(false);
    loading: WritableSignal<boolean> = signal(false);
    isEdit: WritableSignal<boolean> = signal(false);
    servicesDropdownOptions: WritableSignal<IDropdown[]> = signal([]);
    clientDropdownOptions: WritableSignal<IDropdown[]> = signal([]);
    providerDropdownOptions: WritableSignal<IDropdown[]> = signal([]);
    selectedDocuments: { [key: number]: File } = {};
    services: ServiceResponse[] = [];
    selectedService: ServiceResponse | null = null;
    minDate: Date = new Date();

    appointmentFg: FormGroup<IAppointmentFg> = new FormGroup<IAppointmentFg>({
        id: new FormControl<string | null>(null),
        serviceSelected: new FormControl<IDropdown | null>(null),
        documentType: new FormControl<DocumentType | null>(null),
        clientId: new FormControl<IDropdown | null>(null),
        providerId: new FormControl<IDropdown | null>(null),
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
        private readonly appointmentRequest: AppointmentsRequest,
    ) { }

    ngOnInit(): void {
        this.getDropdownOptions();
    }

    openDialog(appointment?: IAppointmentResponse): void {
        this.visible.set(true);
        
        if (!appointment) {
            return;
        }

        this.isEdit.set(true);
        if (appointment.services && appointment.services.length > 0) {
            const service = appointment.services[0];
            this.selectedService = service;
            
            if (service.document_requirements) {
                this.initializeDocuments(service.document_requirements);
            }
        }

        if (appointment.documents) {
            appointment.documents.forEach(doc => {
                const requirement = this.selectedService?.document_requirements.find(
                    req => req.document_template.file_types.includes(doc.file_type)
                );
                
                if (requirement) {
                    const file = new File(
                        [new Blob([doc.file_content])], 
                        doc.file_name,
                        { type: doc.file_type }
                    );
                    this.selectedDocuments[requirement.id] = file;
                }
            });
        }

        this.appointmentFg.patchValue({
            id: appointment.id,
            serviceSelected:{
                label: appointment.services[0]?.name || '',
                value: appointment.services[0]?.id || ''
            },
            clientId: {
                label: appointment.client.name,
                value: appointment.client.id,
                complement: appointment.client.cpf
            },
            providerId: {
                label: appointment.provider.name,
                value: appointment.provider.id,
                complement: appointment.provider.cpf
            },
            status: appointment.status as AppointmentStatusEnum,
            appointmentDate: new Date(appointment.appointment_date),
            observation: appointment.observation,
            documents: this.selectedDocuments
        });
    }

    getFormDataValue(): FormData {
        const formData = new FormData();
        formData.append('id', (this.appointmentFg.get('id')?.value || '').toString());
        formData.append('services', (`${this.appointmentFg.get('serviceSelected')?.value?.value}` || '').toString());
        formData.append('client', (this.appointmentFg.get('clientId')?.value?.value || '').toString());
        formData.append('provider', (this.appointmentFg.get('providerId')?.value?.value || '').toString());
        formData.append('status', this.appointmentFg.get('status')?.value || '');
        const appointmentDate = this.appointmentFg.get('appointmentDate')?.value;
        formData.append('appointment_date', appointmentDate ? appointmentDate.toISOString() : '');
        
        Object.entries(this.selectedDocuments).forEach(([requirementId, file]) => {
            formData.append(`document_requirement_${requirementId}`, file);
        });

        return formData;
    }

    onSubmit(): void {
        if (this.loading()) return;

        if (this.appointmentFg.invalid) {
            this.toastService.error("Atenção", "Preencha todos os campos obrigatórios.");
            this.appointmentFg.markAllAsTouched();
            return;
        }

        const payload: FormData = this.getFormDataValue();

        if (this.isEdit()) {
            this.updateAppointment(payload);
            return;
        }
        
        this.createAppointment(payload);
    }

    private createAppointment(formData: FormData): void {
        this.appointmentRequest
            .createAppointment(formData)
            .pipe(
                take(1),
                catchError((error) => {
                    this.toastService.error("Erro", "Falha ao cadastrar o documento modelo");
                    this.loading.set(false);
                    this.visible.set(false);
                    throw new Error(error);
                }),
            )
            .subscribe((appointment) => {
                this.closeDialogWithSuccess("Documento modelo criado com sucesso");
            });
    }

    private updateAppointment(formData: FormData): void {
        this.appointmentRequest
            .updateAppointment(formData)
            .pipe(
                take(1),
                catchError((error) => {
                    this.toastService.error("Erro", "Falha ao atualizar o documento modelo");
                    this.loading.set(false);
                    this.visible.set(false);
                    throw new Error(error);
                }),
            )
            .subscribe((appointment) => {
                this.closeDialogWithSuccess("Documento modelo atualizado com sucesso");
            });
    }

    private closeDialogWithSuccess(message: string): void {
        this.resetForm();
        this.visible.set(false);
        this.loading.set(false);
        this.isEdit.set(false);
        this.appointmentEvent.emit();
        this.toastService.success("Sucesso", message);
    }

    private resetForm(): void {
        this.appointmentFg.reset();
        this.appointmentFg.get('documents')?.clearValidators();
        this.appointmentFg.get('documents')?.updateValueAndValidity();
        this.selectedDocuments = {};        
        this.selectedService = null;
        this.appointmentFg.markAsUntouched();
        this.appointmentFg.markAsPristine();
        Object.keys(this.appointmentFg.controls).forEach(key => {
            const control = this.appointmentFg.get(key);
            if (control) {
                control.setErrors(null);
                control.updateValueAndValidity();
            }
        });
    }

    private getDropdownOptions(): void {
        forkJoin([
            this.getServicesOptions(),
            this.getClientsOptions(),
            this.getProvidersOptions(),
        ]).pipe(take(1)).subscribe(([services, clients, providers]) => {
            this.services = services;
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
        const serviceSelected = event.value;
        this.resetDocumentValidations();
        
        if (!serviceSelected) {
            this.selectedService = null;
            this.selectedDocuments = {};
        }

        this.loading.set(true);
        const serviceFind = this.services.find(service => service.id === serviceSelected.value) || null;
            
        if (!serviceFind) {
            this.toastService.error('Erro', 'Serviço não encontrado');
            this.loading.set(false);
            return;
        }

        this.selectedService = serviceFind;
        this.initializeDocuments(serviceFind.document_requirements);
        this.loading.set(false);
    }

    private resetDocumentValidations(): void {
        this.selectedDocuments = {};
        
        const documentsControl = this.appointmentFg.get('documents');
        if (documentsControl) {
            documentsControl.clearValidators();
            documentsControl.updateValueAndValidity();
        }
        
        this.appointmentFg.patchValue({ documents: null });
    }

    triggerFileInput(elementId: string): void {
        const element = document.getElementById(elementId) as HTMLInputElement;
        if (element) {
          element.click();
        }
    }
    
    onFileSelect(event: any, requirementId: number): void {
        const file = event.target.files[0];
        const requirement = this.selectedService?.document_requirements
            .find(req => req.id === requirementId);
        
        if (!file || !requirement) {
            return;
        }
        
        try {
            const allowedTypes = requirement.document_template.file_types;
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            
            if (!fileExtension || !allowedTypes.includes(fileExtension)) {
                this.toastService.error('Erro', `Tipos aceitos: ${allowedTypes.join(', ')}`);
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                this.toastService.error('Erro', 'Arquivo muito grande. Máximo: 5MB');
                return;
            }

            this.selectedDocuments[requirementId] = file;
            this.appointmentFg.patchValue({ documents: this.selectedDocuments });
            
            this.toastService.success('Sucesso', 'Documento anexado!');
            
        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            this.toastService.error('Erro', 'Erro ao validar arquivo');
        }
    }
    
    private initializeDocuments(requirements: IDocumentRequirement[]): void {
        this.resetDocumentValidations();
        
        const documentsControl = this.appointmentFg.get('documents');
        if (documentsControl && requirements?.length) {
            const requiredValidators = requirements
                .filter(req => req.is_required)
                .map(req => {
                    return (control: AbstractControl) => {
                        return this.selectedDocuments[req.id] ? null : { 
                            required: {
                                documentName: req.document_template.name
                            }
                        };
                    };
                });

            if (requiredValidators.length) {
                documentsControl.setValidators(requiredValidators);
                documentsControl.updateValueAndValidity();
            }
        }
    }
}
