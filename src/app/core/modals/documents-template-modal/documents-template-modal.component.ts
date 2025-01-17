import { Component, EventEmitter, Output, signal, ViewChild, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "../../requests/toastr/toast.service";
import { take, catchError } from "rxjs";
import { DocumentsTemplateRequest } from "../../requests/documents-template/documents-template.request";
import { DocumentFile, IDocumentsTemplateResponse } from "../../interfaces/documents-template-response.interface";
import { FileUpload, FileUploadHandlerEvent } from "primeng/fileupload";

interface IDocumentTemplateFg {
    id: FormControl<number | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    file_types: FormControl<string | string[] | null>;
    file: FormControl<File | null>;
}

interface FileType {
    name: string;
    value: string;
}

interface DocumentFileWithPreview extends DocumentFile {
    preview?: string;
}

@Component({
    selector: "sgs-documents-template-modal",
    templateUrl: "./documents-template-modal.component.html",
    styleUrls: ["./documents-template-modal.component.scss"],
})
export class DocumentsTemplateModalComponent {
    @Output() documentTemplateEvent: EventEmitter<IDocumentsTemplateResponse> = new EventEmitter();
    @ViewChild('fileUpload') fileUpload!: FileUpload;

    visible: WritableSignal<boolean> = signal(false);
    loading: WritableSignal<boolean> = signal(false);
    isEdit: WritableSignal<boolean> = signal(false);

    selectedFile = signal<DocumentFileWithPreview | null>(null);
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
        file_types: new FormControl<string | string[] | null>(null, [Validators.required]),
        file: new FormControl<File | null>(null)
    });

    constructor(
        private readonly toastService: ToastService,
        private readonly documentTemplateRequest: DocumentsTemplateRequest,
    ) {}

    openDialog(documentTemplate?: IDocumentsTemplateResponse): void {
        if (!documentTemplate) {
            this.documentTemplateFg.reset();
            this.selectedFile.set(null);
            this.isEdit.set(false);
            this.visible.set(true);
            return;
        }

        this.documentTemplateFg.patchValue({
            id: documentTemplate.id,
            name: documentTemplate.name,
            description: documentTemplate.description,
            file_types: this.parseFileTypes(documentTemplate.file_types),
        });

        this.createPreview(documentTemplate.document);
        this.visible.set(true);
        this.isEdit.set(true);
    }

    private parseFileTypes(fileTypesString: string[]): string[] {
        try {
            const fileTypesArray = fileTypesString;
            
            return this.fileTypes
                .filter(fileType => {
                    const extensions = fileType.value.split(',');
                    return extensions.some(ext => 
                        fileTypesArray.includes(ext.trim())
                    );
                })
                .map(fileType => fileType.value);
        } catch (error) {
            console.error('Erro ao parsear os tipos de arquivo:', error);
            return [];
        }
    }

    onSubmit(): void {
        if (this.loading()) return;

        if (this.documentTemplateFg.invalid) {
            this.documentTemplateFg.markAllAsTouched();
            this.toastService.error("Erro de Validação", "Preencha todos os campos obrigatórios");
            return;
        }

        this.loading.set(true);

        const payload: FormData = this.getFormDataValue();

        if (this.isEdit()) {
            this.updateDocumentTemplate(payload);
        } else {
            this.createDocumentTemplate(payload);
        }
    }

    getFormDataValue(): FormData {
        const formData = new FormData();
        formData.append('id', this.documentTemplateFg.value.id?.toString() || '');
        formData.append('name', this.documentTemplateFg.value.name!);
        formData.append('description', this.documentTemplateFg.value.description!);
        formData.append('file_types', JSON.stringify(this.documentTemplateFg.value.file_types));
        
        const file = this.documentTemplateFg.value.file;
        if (file) {
            formData.append('file', file);
        }
        
        return formData;
    }

    private createDocumentTemplate(formData: FormData): void {
        this.documentTemplateRequest
            .createDocumentTemplate(formData)
            .pipe(
                take(1),
                catchError((error) => {
                    this.toastService.error("Erro", "Falha ao cadastrar o documento modelo");
                    this.loading.set(false);
                    this.visible.set(false);
                    throw error;
                }),
            )
            .subscribe((documentTemplate) => {
                this.closeDialogWithSuccess("Documento modelo criado com sucesso", documentTemplate);
            });
    }

    private updateDocumentTemplate(formData: FormData): void {
        this.documentTemplateRequest
            .updateDocumentTemplate(formData)
            .pipe(
                take(1),
                catchError((error) => {
                    this.toastService.error("Erro", "Falha ao atualizar o documento modelo");
                    this.loading.set(false);
                    this.visible.set(false);
                    throw error;
                }),
            )
            .subscribe((documentTemplate) => {
                this.closeDialogWithSuccess("Documento modelo atualizado com sucesso", documentTemplate);
            });
    }

    private closeDialogWithSuccess(message: string, documentTemplate: IDocumentsTemplateResponse): void {
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
        this.documentTemplateFg.markAsPristine();
        Object.keys(this.documentTemplateFg.controls).forEach(key => {
            const control = this.documentTemplateFg.get(key);
            control?.setErrors(null);
        });
        this.removeFile();
    }

    onFileSelect(event: FileUploadHandlerEvent): void {
        if (!event || !event.files || !event.files.length) return;

        const file = event.files[0];
        if (!file) {
            throw new Error('No file selected');
        }

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
                const documentFile: DocumentFileWithPreview = {
                    lastModified: file.lastModified,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    dataUrl: e.target.result as string,
                    preview: this.isImageType(file.type) ? e.target.result as string : undefined
                };
                this.createPreview(documentFile);
                this.documentTemplateFg.patchValue({ file });
            }
        };
        reader.readAsDataURL(file);
    }

    createPreview(file: DocumentFileWithPreview): void {
        this.selectedFile.set(file);
        if (file?.preview) {
            this.previewUrl.set(file.preview);
        } else {
            this.previewUrl.set(null);
        }
    }

    removeFile(): void {
        this.selectedFile.set(null);
        this.previewUrl.set(null);
        this.documentTemplateFg.patchValue({
            file: null
        });
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }

    isImageFile(file: DocumentFileWithPreview | null): boolean {
        if (!file) return false;
        return this.isImageType(file.type);
    }

    private isImageType(type: string): boolean {
        return type.startsWith('image/');
    }

    formatFileSize(bytes: number | undefined): string {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    downloadFile(): void {
        const file = this.selectedFile();
        if (!file || !file.dataUrl) {
            this.toastService.error("Erro", "Arquivo não encontrado para download");
            return;
        }

        try {
            const link = document.createElement('a');
            link.href = file.dataUrl;
            link.download = file.name || 'download'; 
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        } catch (error) {
            console.error('Erro ao fazer download do arquivo:', error);
            this.toastService.error("Erro", "Não foi possível baixar o arquivo");
        }
    }

    onCancel(): void {
        this.removeFile();
        this.visible.set(false);
        this.resetForm();
        this.isEdit.set(false);
    }
}