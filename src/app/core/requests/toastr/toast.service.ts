import { MessageService } from "primeng/api";

import { Injectable } from "@angular/core";

@Injectable()
export class ToastService {
    constructor(private messageService: MessageService) { }

    success(summary: string, message: string): void {
        this.messageService.add({
            closable: true,
            detail: message,
            severity: "success",
            life: 3000,
            summary,
        });
    }

    error(summary: string, message: string): void {
        this.messageService.add({
            closable: true,
            detail: message,
            severity: "error",
            life: 7000,
            summary,
        });
    }
}
