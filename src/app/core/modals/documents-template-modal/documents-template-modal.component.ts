import { Component, EventEmitter, Output, signal, ViewChild, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "../../requests/toastr/toast.service";
import { take, catchError, of } from "rxjs";
import { DocumentsTemplateRequest } from "../../requests/documents-template/documents-template.request";
import { IDocumentTemplatePayload } from "../../interfaces/document-template-payload.interface";
import { IDocumentsTemplateResponse } from "../../interfaces/documents-template-response.interface";
import { FileUpload } from "primeng/fileupload";

interface IDocumentTemplateFg {
    id: FormControl<number | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    file_types: FormControl<string[] | null>;
    document_template: FormControl<File | null>;
}

interface FileType {
    name: string;
    value: string;
}

@Component({
    selector: "sgs-documents-template-modal",
    templateUrl: "./documents-template-modal.component.html",
    styleUrls: ["./documents-template-modal.component.scss"],
})
export class DocumentsTemplateModalComponent {
    @Output() documentTemplateEvent: EventEmitter<any> = new EventEmitter();
    @ViewChild('fileUpload') fileUpload!: FileUpload;

    visible: WritableSignal<boolean> = signal(false);
    loading: WritableSignal<boolean> = signal(false);
    isEdit: WritableSignal<boolean> = signal(false);

    selectedFile = signal<File | null>(null);
    previewUrl = signal<string | null>(null);

    fileTypes: FileType[] = [
        { name: 'PDF', value: 'pdf' },
        { name: 'Documentos Word', value: 'doc,docx' },
        { name: 'Planilhas Excel', value: 'xls,xlsx' },
        { name: 'Imagens', value: 'jpg,jpeg,png' },
        { name: 'Texto', value: 'txt' },
        { name: 'Apresentações', value: 'ppt,pptx' }
    ];

    documentTemplateFg: FormGroup<IDocumentTemplateFg> = new FormGroup<IDocumentTemplateFg>({
        id: new FormControl<number | null>(null),
        name: new FormControl<string | null>(null, [Validators.required]),
        description: new FormControl<string | null>(null, [Validators.required]),
        file_types: new FormControl<string[] | null>(null, [Validators.required]),
        document_template: new FormControl<File | null>(null, [Validators.required])
    });

    constructor(
        private readonly toastService: ToastService,
        private readonly documentTemplateRequest: DocumentsTemplateRequest,
    ) { }

    openDialog(documentTemplate?: IDocumentsTemplateResponse): void {
        this.resetForm();
        
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
            this.toastService.error("Erro de Validação", "Preencha todos os campos obrigatórios");
            return;
        }

        this.loading.set(true);

        const payload: IDocumentTemplatePayload = {
            ...(this.documentTemplateFg.value.id && { id: this.documentTemplateFg.value.id }),
            name: this.documentTemplateFg.value.name!,
            description: this.documentTemplateFg.value.description!,
            fileTypes: this.documentTemplateFg.value.file_types || []
        };

        if (this.isEdit()) {
            this.updateService(payload);
        } else {
            this.createNewService(payload);
        }
    }

    private createNewService(payload: IDocumentTemplatePayload): void {
        this.documentTemplateRequest
            .createDocumentTemplate(payload)
            .pipe(
                take(1),
                catchError((error) => {
                    this.toastService.error("Erro", "Falha ao cadastrar o documento modelo");
                    this.loading.set(false);
                    console.error('Erro ao criar documento modelo:', error);
                    return of(null);
                }),
            )
            .subscribe((documentTemplate) => {
                if (documentTemplate) {
                    this.closeDialogWithSuccess("Documento modelo criado com sucesso", documentTemplate);
                }
            });
    }

    private updateService(payload: IDocumentTemplatePayload): void {
        this.documentTemplateRequest
            .updateDocumentTemplate(payload)
            .pipe(
                take(1),
                catchError((error) => {
                    this.toastService.error("Erro", "Falha ao atualizar o documento modelo");
                    this.loading.set(false);
                    console.error('Erro ao atualizar documento modelo:', error);
                    return of(null);
                }),
            )
            .subscribe((documentTemplate) => {
                if (documentTemplate) {
                    this.closeDialogWithSuccess("Documento modelo atualizado com sucesso", documentTemplate);
                }
            });
    }

    private closeDialogWithSuccess(message: string, documentTemplate: any): void {
        this.resetForm();
        this.visible.set(false);
        this.loading.set(false);
        this.isEdit.set(false);
        this.toastService.success("Sucesso", message);
        this.documentTemplateEvent.emit(documentTemplate);
    }

    private resetForm(): void {
        this.documentTemplateFg.reset();
        this.documentTemplateFg.markAsUntouched();
        Object.keys(this.documentTemplateFg.controls).forEach(key => {
            const control = this.documentTemplateFg.get(key);
            control?.setErrors(null);
        });
    }

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            const file = event.files[0];
            this.selectedFile.set(file);
            this.documentTemplateFg.patchValue({
                document_template: file
            });

            // Gerar preview para imagens
            if (this.isImageFile(file)) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.previewUrl.set(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                this.previewUrl.set(null);
            }
        }
    }

    removeFile(): void {
        this.selectedFile.set(null);
        this.previewUrl.set(null);
        this.documentTemplateFg.patchValue({
            document_template: null
        });
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }

    isImageFile(file: File | null): boolean {
        if (!file) return false;
        return file.type.startsWith('image/');
    }

    formatFileSize(bytes: number | undefined): string {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    onCancel(): void {
        this.removeFile();
        this.visible.set(false);
        this.resetForm();
        this.isEdit.set(false);
    }
}