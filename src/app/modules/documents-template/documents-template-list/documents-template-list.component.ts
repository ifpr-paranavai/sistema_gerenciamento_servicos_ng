import { Component, signal, ViewChild, WritableSignal } from "@angular/core";
import { DocumentsTemplateRequest } from "../../../core/requests/documents-template/documents-template.request";
import { AppointmentsCols } from "../../../core/constants/appointments.constant";
import { ITableColumn } from "../../../core/interfaces/table-columns.interface";
import { DocumentsTemplateCols } from "../../../core/constants/documents-template.constants";
import { IDocumentsTemplateResponse } from "../../../core/interfaces/documents-template-response.interface";
import { ToastService } from "../../../core/requests/toastr/toast.service";
import { DocumentsTemplateModalComponent } from "../../../core/modals/documents-template-modal/documents-template-modal.component";

@Component({
    selector: "sgs-documents-template-list",
    templateUrl: "./documents-template-list.component.html",
    styleUrls: ["./documents-template-list.component.scss"],
})
export class DocumentsTemplateListComponent {
    @ViewChild(DocumentsTemplateModalComponent) documentTemplateModal?: DocumentsTemplateModalComponent;

    documentsTemplateItems: WritableSignal<IDocumentsTemplateResponse[]> = signal([
        {
            id: 1,
            name: "Raxas",
            description: "Descricão",
            file_types: ["pdf", "docx"],
            created_at: new Date(),
            updated_at: new Date(),

        },
        {
            id: 2,
            name: "Sandero",
            description: "Descricão",
            file_types: ["pdf", "docx"],
            created_at: new Date(),
            updated_at: new Date(),

        },
    ]);
    documentsTemplateColumns: ITableColumn[] = DocumentsTemplateCols;

    constructor(
        private readonly docsTemplateRequest: DocumentsTemplateRequest,
        private readonly toastService: ToastService,
    ) {}

    openModalDocumentTemplate(): void {
        if (!this.documentTemplateModal) throw new Error('DocumentsTemplateModalComponent not found');

        this.documentTemplateModal.openDialog();
    }

    editDocumentTemplate(documentTemplate: IDocumentsTemplateResponse): void {
        if (!this.documentTemplateModal) throw new Error('DocumentsTemplateModalComponent not found');

        this.documentTemplateModal.openDialog(documentTemplate);
    }

    deleteDocumentTemplate(documentTemplate: IDocumentsTemplateResponse): void {
        console.log(documentTemplate);
    }
}
