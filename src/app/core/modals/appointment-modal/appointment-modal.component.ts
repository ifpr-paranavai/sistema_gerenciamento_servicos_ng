import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, signal, WritableSignal } from "@angular/core";
import { ServiceRequest } from "../../requests/services/service.request";
import { ToastService } from "../../requests/toastr/toast.service";
import { IAppointmentResponse } from "../../interfaces/appointment-response.interface";
import { catchError, EMPTY, forkJoin, Observable, take } from "rxjs";
import { IDropdown } from "../../interfaces/dropdown.interface";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { ClientRequest } from "../../requests/clients/clients.request";
import { ProviderRequest } from "../../requests/providers/providers.request";
import { IDocumentRequirement, ServiceResponse } from "../../interfaces/service-response.interface";
import { IClient } from "../../interfaces/client.interface";
import { IProvider } from "../../interfaces/provider.interface";
import { AppointmentStatusEnum } from "../../interfaces/appointment-status.interface";
import { AppointmentsRequest } from "../../requests/appointments/appointments.request";
import { DocumentFile } from "../../interfaces/documents-template-response.interface";

interface IAppointmentFg {
    id: FormControl<string | null>;
    serviceSelected: FormControl<IDropdown | null>;
    documentType: FormControl<DocumentType | null>;
    client: FormControl<IDropdown | null>;
    provider: FormControl<IDropdown | null>;
    status: FormControl<AppointmentStatusEnum | null>;
    appointmentDate: FormControl<Date | null>;
    observation: FormControl<string | null>;
    documents: FormControl<{ [key: number]: File } | null>;
}

interface IDateConflict {
    hasConflict: boolean;
    conflictingAppointments?: {
      start: string;
      end: string;
      service: string;
    }[];
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
    selectedDocuments: { [key: number]: DocumentFile } = {};
    services: ServiceResponse[] = [];
    selectedService: ServiceResponse | null = null;
    providerAppointments: { [key: string]: IProvider } = {};
    selectedProvider: IProvider | null = null;
    disabledDates: Date[] = [];
    hourFormat: string = "24";
    timeIntervals = Array.from({ length: 24 }, (_, i) => i); // 0-23 horas
    invalidHours = this.timeIntervals.filter(hour => hour < 8 || hour >= 18);
    isDateDisabled = (date: Date): boolean => {
        if (!this.selectedProvider || !this.selectedService?.duration ) {
            return false;
        }
    
        const proposedStart = new Date(date);
        const proposedEnd = new Date(proposedStart.getTime() + (this.selectedService?.duration || 0) * 60000);
    
        return this.selectedProvider.appointments.some(app => {
            const appointmentStart = new Date(app.start);
            const appointmentEnd = new Date(app.end);
        
            return (
                (proposedStart >= appointmentStart && proposedStart < appointmentEnd) ||
                (proposedEnd > appointmentStart && proposedEnd <= appointmentEnd) ||
                (proposedStart <= appointmentStart && proposedEnd >= appointmentEnd)
            );
        });
    };
    
    isTimeDisabled = (date: Date): boolean => {
        const hour = date.getHours();
        return hour < 8 || hour >= 18;
    };

    get serviceDuration(): string {
        return this.selectedService?.duration 
            ? `Duração do serviço: ${this.selectedService.duration} minutos`
            : '';
    }



    appointmentFg: FormGroup<IAppointmentFg> = new FormGroup<IAppointmentFg>({
        id: new FormControl<string | null>(null),
        serviceSelected: new FormControl<IDropdown | null>(null),
        documentType: new FormControl<DocumentType | null>(null),
        client: new FormControl<IDropdown | null>(null),
        provider: new FormControl<IDropdown | null>(null),
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
        this.updateDisabledDates();
    }
    
    updateDisabledDates(): void {
        if (!this.selectedProvider || !this.selectedService?.duration ) {
          this.disabledDates = [];
          return;
        }
    
        const newDisabledDates: Date[] = [];
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    
        for (let d = new Date(today); d <= nextMonth; d.setDate(d.getDate() + 1)) {
          if (this.isDateConflicting(new Date(d))) {
            newDisabledDates.push(new Date(d));
          }
        }
    
        this.disabledDates = newDisabledDates;
      }
    
    isDateConflicting(date: Date): boolean {
        if (!this.selectedProvider || !!this.selectedService?.duration ) {
            return false;
        }
    
        const proposedStart = new Date(date);
        const proposedEnd = new Date(proposedStart.getTime() + (this.selectedService?.duration || 0) * 60000);
    
        return this.selectedProvider.appointments.some(app => {
            const appointmentStart = new Date(app.start);
            const appointmentEnd = new Date(app.end);
        
            return (
                (proposedStart >= appointmentStart && proposedStart < appointmentEnd) ||
                (proposedEnd > appointmentStart && proposedEnd <= appointmentEnd) ||
                (proposedStart <= appointmentStart && proposedEnd >= appointmentEnd)
            );
        });
    }

    onProviderSelect(event: any): void {
        const providerId = event.value?.value;
        if (providerId) {
            this.selectedProvider = this.providerAppointments[providerId];
            const appointmentsCount = this.selectedProvider.appointments?.length || 0;
            
            if (appointmentsCount > 0) {
                this.toastService.info(
                    "Informação",
                    `Este prestador possui ${appointmentsCount} agendamento(s) futuros. Por favor, selecione uma data/horário disponível.`
                );
            }
        } else {
            this.selectedProvider = null;
        }
        
        this.appointmentFg.patchValue({ appointmentDate: null });
        this.updateDateValidation();
    }
    
    private updateDateValidation(): void {
        if (this.appointmentFg.get('appointmentDate')) {
            this.appointmentFg.get('appointmentDate')?.updateValueAndValidity();
        }
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
                if (!requirement) return;
                
                const documentFile: DocumentFile = {
                    lastModified: doc.created_at ? new Date(doc.created_at).getTime() : 0,
                    name: doc.file_name,
                    size: doc.file_size,
                    type: `application/${doc.file_type}`,
                    dataUrl: doc.file_content
                };
                this.selectedDocuments[requirement.id] = documentFile;
            });
        }

        this.appointmentFg.patchValue({
            id: appointment.id,
            serviceSelected:{
                label: appointment.services[0]?.name || '',
                value: appointment.services[0]?.id || ''
            },
            client: {
                label: appointment.client.name,
                value: appointment.client.id,
                complement: appointment.client.cpf
            },
            provider: {
                label: appointment.provider.name,
                value: appointment.provider.id,
                complement: appointment.provider.cpf
            },
            status: appointment.status as AppointmentStatusEnum,
            appointmentDate: new Date(appointment.appointment_date),
            observation: appointment.observation,
            documents: Object.fromEntries(
                Object.entries(this.selectedDocuments).map(([key, docFile]) => [key, new File([docFile.dataUrl], docFile.name, { type: docFile.type })])
            )
        });
    }

    getFormDataValue(): FormData {
        const formData = new FormData();
        
        formData.append('id', (this.appointmentFg.get('id')?.value || '').toString());
        formData.append('services', this.appointmentFg.get('serviceSelected')?.value?.value?.toString() || '');
        formData.append('client', this.appointmentFg.get('client')?.value?.value?.toString() || '');
        formData.append('provider', this.appointmentFg.get('provider')?.value?.value?.toString() || '');
        formData.append('status', this.appointmentFg.get('status')?.value || '');
        
        const appointmentDate = this.appointmentFg.get('appointmentDate')?.value;
        formData.append('appointment_date', appointmentDate ? appointmentDate.toISOString() : '');
        
        console.log('Documentos selecionados:', this.selectedDocuments);
        
        for (const [requirementId, documentFile] of Object.entries(this.selectedDocuments)) {
            console.log(`Processando documento ${requirementId}:`, documentFile);
            
            if (documentFile instanceof File) {
                console.log('Anexando arquivo direto:', documentFile);
                formData.append(`document_requirement_${requirementId}`, documentFile);
            } else {
                const file = documentFile as unknown as DocumentFile;
                const byteString = atob(file.dataUrl.split(',')[1]);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: file.type });
                const newFile = new File([blob], file.name, { type: file.type });
                
                console.log('Anexando arquivo convertido:', newFile);
                formData.append(`document_requirement_${requirementId}`, newFile);
            }
        }
    
        formData.forEach((value, key) => {
            console.log(`FormData contém: ${key}:`, value);
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

        const appointmentDate = this.appointmentFg.get('appointmentDate')?.value;
        if (appointmentDate) {
            const availability = this.checkDateAvailability(appointmentDate);
            if (availability.hasConflict) {
                let errorMessage = 'Horário indisponível:\n';
                availability.conflictingAppointments?.forEach(conflict => {
                    if (conflict.service.includes('Fora do horário') || conflict.service.includes('Não atendemos')) {
                        errorMessage += `${conflict.service}\n`;
                    } else {
                        errorMessage += `Conflito com agendamento existente: ${conflict.start} - ${conflict.end} (${conflict.service})\n`;
                    }
                });
                
                this.toastService.error("Erro", errorMessage);
                return;
            }
        }

        const payload: FormData = this.getFormDataValue();

        if (this.isEdit()) {
            this.updateAppointment(payload);
            return;
        }
        
        this.createAppointment(payload);
    }

    createAppointment(formData: FormData): void {
        console.log('Enviando FormData:', formData);
        this.appointmentRequest
            .createAppointment(formData)
            .pipe(
                take(1),
                catchError((error) => {
                    let errorMessage = "Erro ao criar agendamento";
                    if (error.error?.detail) {
                        errorMessage = error.error.detail;
                    }
                    this.toastService.error("Erro", errorMessage);
                    this.loading.set(false);
                    return EMPTY;
                })
            )
            .subscribe({
                next: (appointment) => {
                    this.closeDialogWithSuccess("Agendamento criado com sucesso");
                }
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
            this.providerAppointments = providers.reduce((acc, provider) => {
                acc[provider.id] = provider;
                return acc;
              }, {} as { [key: string]: IProvider });
        
              this.providerDropdownOptions.set(
                providers.map(provider => ({
                  label: provider.name,
                  value: provider.id,
                  complement: provider.cpf
                }))
              );
        });
    }

    checkDateAvailability(date: Date): IDateConflict {
        if (!this.selectedProvider || !this.selectedService?.duration ) {
            return { hasConflict: false };
        }
    
        const proposedStart = new Date(date);
        const proposedEnd = new Date(proposedStart.getTime() + (this.selectedService?.duration || 0 ) * 60000);
        const conflicts: { start: string; end: string; service: string }[] = [];
    
        const hour = proposedStart.getHours();
        if (hour < 8 || hour >= 18) {
            return {
                hasConflict: true,
                conflictingAppointments: [{
                    start: proposedStart.toLocaleTimeString(),
                    end: proposedEnd.toLocaleTimeString(),
                    service: 'Fora do horário comercial (8h às 18h)'
                }]
            };
        }
    
        const day = proposedStart.getDay();
        if (day === 0 || day === 6) {
            return {
                hasConflict: true,
                conflictingAppointments: [{
                    start: proposedStart.toLocaleDateString(),
                    end: proposedStart.toLocaleDateString(),
                    service: 'Não atendemos aos finais de semana'
                }]
            };
        }
    
        this.selectedProvider.appointments?.forEach(app => {
            const appointmentStart = new Date(app.start);
            const appointmentEnd = new Date(app.end);
    
            if (
                (proposedStart >= appointmentStart && proposedStart < appointmentEnd) ||
                (proposedEnd > appointmentStart && proposedEnd <= appointmentEnd) ||
                (proposedStart <= appointmentStart && proposedEnd >= appointmentEnd)
            ) {
                conflicts.push({
                    start: appointmentStart.toLocaleTimeString(),
                    end: appointmentEnd.toLocaleTimeString(),
                    service: app.service
                });
            }
        });
    
        return {
            hasConflict: conflicts.length > 0,
            conflictingAppointments: conflicts
        };
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
            return;
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
        this.updateDateValidation();
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
        if (!file) return;
    
        const requirement = this.selectedService?.document_requirements
            .find(req => req.id === requirementId);
        
        if (!requirement) {
            this.toastService.error('Erro', 'Requisito não encontrado');
            return;
        }
    
        try {
            const allowedTypes = requirement.document_template.file_types;
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            
            if (!fileExtension || !allowedTypes.includes(fileExtension)) {
                this.toastService.error('Erro', `Tipos aceitos: ${allowedTypes.join(', ')}`);
                return;
            }
    
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                this.toastService.error('Erro', 'Arquivo muito grande. Máximo: 5MB');
                return;
            }

            this.selectedDocuments[requirementId] = file;
            console.log(`Arquivo armazenado para requisito ${requirementId}:`, file);
    
            const currentFiles = this.appointmentFg.get('documents')?.value || {};
            currentFiles[requirementId] = file;
            this.appointmentFg.patchValue({ documents: currentFiles });
            
            this.toastService.success('Sucesso', 'Documento anexado!');
            
        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            this.toastService.error('Erro', 'Erro ao processar arquivo');
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

    downloadTemplate(serviceTemplateId: number): void {
        try {
            const documentRequirement = this.selectedService?.document_requirements.find(
                req => req.document_template?.id === serviceTemplateId
            );
    
            if (!documentRequirement?.document_template?.document) {
                this.toastService.error('Erro', 'Template não encontrado');
                return;
            }
    
            const file = documentRequirement.document_template.document;
            
            const link = document.createElement('a');
            link.href = file.dataUrl;
            link.download = file.name;
            
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);
            
            this.toastService.success('Sucesso', 'Template baixado com sucesso!');
        } catch (error) {
            console.error('Erro ao baixar template:', error);
            this.toastService.error('Erro', 'Não foi possível baixar o template');
        }
    }
    
    
    downloadUploadedDocument(requirementId: number): void {
        try {
            const file = this.selectedDocuments[requirementId];
            if (!file) {
                this.toastService.error('Erro', 'Nenhum arquivo encontrado');
                return;
            }
            
            const link = document.createElement('a');
            link.href = file.dataUrl;
            link.download = file.name;
            
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);

            this.toastService.success('Sucesso', 'Documento baixado com sucesso!');
        } catch (error) {
            console.error('Erro ao baixar documento:', error);
            this.toastService.error('Erro', 'Não foi possível baixar o documento');
        }
    }
}
