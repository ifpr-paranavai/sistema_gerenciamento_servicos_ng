import { Component, OnInit, signal, ViewChild, WritableSignal } from "@angular/core";
import { DocumentsTemplateRequest } from "../../../core/requests/documents-template/documents-template.request";
import { AppointmentsCols } from "../../../core/constants/appointments.constant";
import { ITableColumn } from "../../../core/interfaces/table-columns.interface";
import { DocumentsTemplateCols } from "../../../core/constants/documents-template.constants";
import { IDocumentsTemplateResponse } from "../../../core/interfaces/documents-template-response.interface";
import { ToastService } from "../../../core/requests/toastr/toast.service";
import { DocumentsTemplateModalComponent } from "../../../core/modals/documents-template-modal/documents-template-modal.component";
import { catchError, of, take } from "rxjs";

@Component({
    selector: "sgs-documents-template-list",
    templateUrl: "./documents-template-list.component.html",
    styleUrls: ["./documents-template-list.component.scss"],
})
export class DocumentsTemplateListComponent implements OnInit {
    @ViewChild(DocumentsTemplateModalComponent) documentTemplateModal?: DocumentsTemplateModalComponent;

    documentsTemplateItems: WritableSignal<IDocumentsTemplateResponse[]> = signal([]);
    documentsTemplateColumns: ITableColumn[] = DocumentsTemplateCols;

    constructor(
        private readonly docsTemplateRequest: DocumentsTemplateRequest,
        private readonly toastService: ToastService,
    ) { }

    ngOnInit(): void {
        this.loadDocumentsTemplates();
    }

    loadDocumentsTemplates(): void {
        this.docsTemplateRequest
            .getDocumentsTemplates()
            .pipe(
                take(1),
                catchError(error => {
                    this.toastService.error("Atenção", error?.error?.error ?? "Falha ao buscar Documentos");
                    return of();
                })
            ).subscribe((documentsTemplate) => {
                this.documentsTemplateItems.set(documentsTemplate);
            })
    }

    openModalDocumentTemplate(): void {
        if (!this.documentTemplateModal) throw new Error('DocumentsTemplateModalComponent not found');

        this.documentTemplateModal.openDialog();
    }

    editDocumentTemplate(documentTemplate: IDocumentsTemplateResponse): void {
        if (!this.documentTemplateModal) throw new Error('DocumentsTemplateModalComponent not found');

        this.documentTemplateModal.openDialog(documentTemplate);
    }

    deleteDocumentTemplate(documentTemplate: IDocumentsTemplateResponse): void {
        this.docsTemplateRequest.deleteDocumentTemplate(documentTemplate.id!)
            .pipe(take(1)).subscribe({
                next: () =>{
                    this.documentsTemplateItems.update((docTemp) => docTemp.filter((dt) => dt.id !== documentTemplate.id));
                    this.toastService.success("", "Serviço deletado com sucesso")
                },
                error: ({error}) => {
                    this.toastService.error("Atenção", error?.detail ?? "Falha ao deletar Documento");
                }
            });
    }

    addDocumentTemplate(documentTemplate: IDocumentsTemplateResponse): void {
        const index = this.documentsTemplateItems().findIndex((docTemplate) => docTemplate.id === documentTemplate.id);
        if (index !== -1) {
            this.documentsTemplateItems().splice(index, 1, documentTemplate);
            return;
        }

        this.documentsTemplateItems().push(documentTemplate);
    }
}
