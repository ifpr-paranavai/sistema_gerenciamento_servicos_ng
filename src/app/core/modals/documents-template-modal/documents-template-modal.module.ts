import { NgModule } from "@angular/core";
import { DocumentsTemplateModalComponent } from "./documents-template-modal.component";
import { DocumentsTemplateRequest } from "../../requests/documents-template/documents-template.request";
import { DialogModule } from "primeng/dialog";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
    declarations: [
        DocumentsTemplateModalComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        MultiSelectModule,
        FileUploadModule
    ],
    exports: [
        DocumentsTemplateModalComponent,
    ],
    providers: [
        DocumentsTemplateRequest,
    ],
})
export class DocumentsTemplateModalModule { }
