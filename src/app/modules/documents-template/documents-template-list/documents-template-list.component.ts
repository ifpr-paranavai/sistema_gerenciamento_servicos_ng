import { Component, signal, WritableSignal } from "@angular/core";
import { DocumentsTemplateRequest } from "../../../core/requests/documents-template/documents-template.request";
import { AppointmentsCols } from "../../../core/constants/appointments.constant";
import { ITableColumn } from "../../../core/interfaces/table-columns.interface";
import { DocumentsTemplateCols } from "../../../core/constants/documents-template.constants";
import { IDocumentsTemplateResponse } from "../../../core/interfaces/documents-template-response.interface";
import { ToastService } from "../../../core/requests/toastr/toast.service";

@Component({
    selector: "sgs-documents-template-list",
    templateUrl: "./documents-template-list.component.html",
    styleUrls: ["./documents-template-list.component.scss"],
})
export class DocumentsTemplateListComponent {
    documentsTemplateItems: WritableSignal<IDocumentsTemplateResponse[]> = signal([
        {
            name: "Template 1",
            status: "Ativo",
        },
        {
            name: "Template 2",
            status: "Inativo",
        },
    ]);
    documentsTemplateColumns: ITableColumn[] = DocumentsTemplateCols;

    constructor(
        private readonly docsTemplateRequest: DocumentsTemplateRequest,
        private readonly toastService: ToastService,
    ) {}

    editDocumentTemplate(documentTemplate: IDocumentsTemplateResponse): void {

    }

    deleteDocumentTemplate(documentTemplate: IDocumentsTemplateResponse): void {

    }
}
