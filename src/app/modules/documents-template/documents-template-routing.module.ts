import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DocumentsTemplateComponent } from "./documents-template.component";

const routes: Routes = [
    {
        path: "",
        component: DocumentsTemplateComponent,
        canActivate: [],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DocumentsTemplateRoutingModule { }
