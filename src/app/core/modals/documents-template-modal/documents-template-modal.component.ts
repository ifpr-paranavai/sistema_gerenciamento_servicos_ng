import { Component, EventEmitter, Output, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "../../requests/toastr/toast.service";
import { take, catchError, of } from "rxjs";
import { DocumentsTemplateRequest } from "../../requests/documents-template/documents-template.request";
import { IDocumentTemplatePayload } from "../../interfaces/document-template-payload.interface";
import { IDocumentsTemplateResponse } from "../../interfaces/documents-template-response.interface";

interface IDocumentTemplateFg {
    id: FormControl<number | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    'file_types': FormControl<string[] | null>;
}

@Component({
    selector: "sgs-documents-template-modal",
    templateUrl: "./documents-template-modal.component.html",
    styleUrls: ["./documents-template-modal.component.scss"],
})
export class DocumentsTemplateModalComponent {
    @Output() documentTemplateEvent: EventEmitter<any> = new EventEmitter();

    visible: WritableSignal<boolean> = signal(false);
    documentTemplateFg: FormGroup<IDocumentTemplateFg> = new FormGroup<IDocumentTemplateFg>({
        id: new FormControl<number | null>(null),
        name: new FormControl<string | null>(null, [Validators.required]),
        description: new FormControl<string | null>(null, [Validators.required]),
        file_types: new FormControl<string[] | null>(null),
    });

    loading: WritableSignal<boolean> = signal(false);
    isEdit: WritableSignal<boolean> = signal(false);

    constructor(
        private readonly toastService: ToastService,
        private readonly documentTemplateRequest: DocumentsTemplateRequest,
    ) { }

    openDialog(documentTemplate?: IDocumentsTemplateResponse): void {
        if (documentTemplate) {
            this.documentTemplateFg.patchValue({
                id: documentTemplate.id,
                name: documentTemplate.name,
                description: documentTemplate.description,
                file_types: documentTemplate.file_types
            });
            this.isEdit.set(true);
        }
        this.visible.set(true);
    }

    onSubmit(): void {
        if (this.loading()) return;

        if (!this.documentTemplateFg.valid) {
            this.documentTemplateFg.markAllAsTouched();
            this.toastService.error("", "Preencha todos os campos obrigatórios");
            return;
        }

        const payload: IDocumentTemplatePayload = {
            id: this.documentTemplateFg.controls.id!.value!,
            name: this.documentTemplateFg.controls.name!.value!,
            description: this.documentTemplateFg.controls.description!.value!,
            fileTypes: this.documentTemplateFg.controls.file_types.value
        };

        if (this.isEdit()) {
            this.updateService(payload);
            return;
        }

        this.createNewService(payload);
    }

    createNewService(payload: IDocumentTemplatePayload): void {
        this.documentTemplateRequest
            .createDocumentTemplate(payload)
            .pipe(
                take(1),
                catchError(() => {
                    this.toastService.error("", "Falha ao cadastrar o serviço");
                    this.loading.set(false);
                    return of(null);
                }),
            )
            .subscribe((documentTemplate) => {
                this.documentTemplateFg.reset();
                this.visible.set(false);
                this.toastService.success("", "Documento modelo criado com sucesso");
                this.documentTemplateEvent.emit(documentTemplate!);
            });
    }

    updateService(payload: IDocumentTemplatePayload): void {
        this.documentTemplateRequest
            .updateDocumentTemplate(payload)
            .pipe(
                take(1),
                catchError(() => {
                    this.toastService.error("", "Falha ao atualizar o Documento Modelo");
                    this.loading.set(false);
                    return of(null);
                }),
            )
            .subscribe((documentTemplate) => {
                this.documentTemplateFg.reset();
                this.visible.set(false);
                this.toastService.success("", "Documento modelo atualizado com sucesso");
                this.documentTemplateEvent.emit(documentTemplate!);
            });
    }
}
