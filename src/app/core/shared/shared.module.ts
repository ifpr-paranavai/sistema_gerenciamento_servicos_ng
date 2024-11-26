import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CpfPipe } from "./pipes/cpf.pipe";
import { ButtonModule } from "primeng/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CurrencyFormatPipe } from "./pipes/currency.pipe";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { InputMaskModule } from "primeng/inputmask";

const exportedModules = [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    InputNumberModule,
    InputMaskModule,
];

const exportedPipes = [
    CpfPipe,
    CurrencyFormatPipe,
];

@NgModule({
    imports: [],
    declarations: [
        ...exportedPipes
    ],
    providers: [],
    exports: [
        ...exportedModules,
        ...exportedPipes
    ],
})
export class SharedModule {}
