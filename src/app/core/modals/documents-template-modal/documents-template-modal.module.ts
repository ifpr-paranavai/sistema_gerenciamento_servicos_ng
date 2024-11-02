import { NgModule } from "@angular/core";
import { DocumentsTemplateModalComponent } from "./documents-template-modal.component";
import { DocumentsTemplateRequest } from "../../requests/documents-template/documents-template.request";
import { DialogModule } from "primeng/dialog";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    declarations: [
        DocumentsTemplateModalComponent,
    ],
    imports: [
        SharedModule,
        DialogModule,
    ],
    exports: [
        DocumentsTemplateModalComponent,
    ],
    providers: [
        DocumentsTemplateRequest,
    ],
})
export class DocumentsTemplateModalModule { }
