import { NgModule } from "@angular/core";
import { DocumentsTemplateComponent } from "./documents-template.component";
import { DocumentsTemplateRoutingModule } from "./documents-template-routing.module";
import { DocumentsTemplateListComponent } from "./documents-template-list/documents-template-list.component";
import { DocumentsTemplateRequest } from "../../core/requests/documents-template/documents-template.request";
import { SharedModule } from "../../core/shared/shared.module";
import { TableModule } from "primeng/table";
import { TableCellTemplateDirective } from "../../core/directives/table/table-cell-template";

@NgModule({
    declarations: [
        DocumentsTemplateComponent,
        DocumentsTemplateListComponent,
    ],
    imports: [
        DocumentsTemplateRoutingModule,
        SharedModule,
        TableModule,
    ],
    exports: [
        DocumentsTemplateComponent,
    ],
    providers: [
        DocumentsTemplateRequest,
        TableCellTemplateDirective,
    ],
})
export class DocumentsTemplateModule {}
