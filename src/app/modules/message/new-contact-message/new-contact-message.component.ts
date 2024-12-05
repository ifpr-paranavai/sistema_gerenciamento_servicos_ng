import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, signal, WritableSignal } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastService } from "../../../core/requests/toastr/toast.service";
import { IDropdown } from "../../../core/interfaces/dropdown.interface";
import { UsersRequest } from "../../../core/requests/users/users.request";
import { HttpErrorResponse } from "@angular/common/http";
import { take, catchError, throwError, switchMap } from "rxjs";
import { ChatMessageRequest } from "../../../core/requests/chat-message/chat-message.request";

interface INewMessageFg {
    receiver: FormControl<IDropdown | null>;
    content: FormControl<string | null>;
}

@Component({
    selector: "sgs-new-contact-message",
    templateUrl: "./new-contact-message.component.html",
    styleUrls: ["./new-contact-message.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewContactMessageComponent implements OnInit {
    @Output() newMessage: EventEmitter<boolean> = new EventEmitter<boolean>();
    visible: WritableSignal<boolean> = signal(false);

    newMessageFg: FormGroup<INewMessageFg> = new FormGroup({
        receiver: new FormControl<IDropdown | null>(null, [Validators.required]),
        content: new FormControl<string | null>(null, [Validators.required]),
    });

    usersDropdownOptions: WritableSignal<IDropdown[]> = signal([]);

    constructor(
        private toastService: ToastService,
        private readonly usersRequest: UsersRequest,
        private readonly chatMessageRequest: ChatMessageRequest,
    ) {}

    ngOnInit(): void {
        this.getDropdownOptions();
    }

    closeModal(): void {
        this.visible.set(false);
        this.newMessageFg.reset();
        this.newMessageFg.markAsUntouched();
    }

    openNewMessageModal(): void {
        this.visible.set(true);
    }

    getDropdownOptions(): void {
        this.usersRequest.getUsers().pipe(take(1)).subscribe({
            next: (users) => {
                this.usersDropdownOptions.set(
                    users.map(user => ({ label: user.name, value: user.id! }))
                );
            }
        })
    }

    sendMessage(): void {
        const content = this.newMessageFg.controls.content.value;
        const receiver = this.newMessageFg.controls.receiver.value;

        this.chatMessageRequest.getOrCreateChat(receiver?.value as string).pipe(
            take(1),
            catchError((error: HttpErrorResponse) => {
                this.toastService.error('Erro', 'Erro ao criar conversa');
                return throwError(() => error);
            }),
            switchMap((response) => {
                return this.chatMessageRequest.sendChatMessage({
                    'chat_id': response.chat_id,
                    content: content!
                });
            })
        ).subscribe(() => {
            this.newMessageFg.reset();
            this.newMessageFg.markAsUntouched();
            this.visible.set(false);
            this.newMessage.emit(true);
        });
    }
}
