import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CpfPipe } from "./pipes/cpf.pipe";
import { ButtonModule } from "primeng/button";
import { ReactiveFormsModule } from "@angular/forms";
import { CurrencyFormatPipe } from "./pipes/currency.pipe";

const exportedModules = [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule
];

const exportedPipes = [
    CpfPipe, 
    CurrencyFormatPipe,
];

@NgModule({
    imports: [
        ButtonModule,
        CommonModule,
    ],
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
