import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { ChatMessageRequest } from '../../core/requests/chat-message/chat-message.request';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, interval, switchMap, take, throwError } from 'rxjs';
import { ToastService } from '../../core/requests/toastr/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IChatMessage, IChatParticipant } from '../../core/interfaces/chat-message.interface';


@Component({
	selector: 'sgs-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit, AfterViewInit {
	@ViewChild('messagesContainer') messagesContainer!: ElementRef;

    otherMessages: WritableSignal<IChatMessage[]> = signal([]);
    myMessages: WritableSignal<IChatMessage[]> = signal([]);
	selectedContact: WritableSignal<IChatParticipant | null> = signal(null);
	messages: { [key: number]: { myMessages: string[]; otherMessages: string[] } } = {
		1: {
			myMessages: ['Olá, Ana!', 'Tudo bem?'],
			otherMessages: ['Oi, tudo sim!', 'E você?']
		},
		2: {
			myMessages: ['Olá, João!', 'Como está?'],
			otherMessages: ['Oi!', 'Estou bem, obrigado.']
		}
	};
	contacts: WritableSignal<IChatParticipant[]> = signal([]);
    loading: WritableSignal<boolean> = signal(false);
    controlListMessages: WritableSignal<boolean> = signal(false);
    allMessages: WritableSignal<IChatMessage[]> = signal([]);

	constructor(
		private chatMessageRequest: ChatMessageRequest,
		private destroyRef: DestroyRef,
		private toastService: ToastService,
		private cdr: ChangeDetectorRef,
	) { }

	ngOnInit(): void {
		this.listUserChatMessagesData();
        this.listMessages();
	}

	ngAfterViewInit(): void {
		this.scrollToBottom();
	}

	private scrollToBottom(): void {
		if (!this.messagesContainer) return;
		const container = this.messagesContainer.nativeElement;
		container.scrollTop = container.scrollHeight;
	}

	listUserChatMessagesData(): void {
		this.chatMessageRequest.listUserChatMessages()
        .pipe(
            take(1),
            catchError((error: HttpErrorResponse) => {
                this.toastService.error('Erro ao buscar mensagens', 'Nenhuma mensagem encontrada');
                return throwError(() => error);
            })
        ).subscribe(response => {
			if (!response?.length) throw Error("Erro ao buscar conversas");

			const participants: IChatParticipant[] = [];

			response.forEach(chat => {
				if (chat?.participants?.length) {
					chat.participants.forEach((participant) => {
						participants.push({
                            ...participant,
                            chatId: chat.chat_id
                        });
					});
				}

				this.contacts.set(participants);
				this.cdr.detectChanges();
			})
		});
	}

    listMessages(): void {
        if (!this.selectedContact() || !this.selectedContact()?.chatId || this.loading()) return;
        this.controlListMessages.set(true);
        this.loading.set(true);
        interval(1000)
        .pipe(
            takeUntilDestroyed(this.destroyRef),
            switchMap(() => this.chatMessageRequest.listChatMessages(this.selectedContact()?.chatId!)),
            catchError((error: HttpErrorResponse) => {
                this.toastService.error('Erro ao buscar mensagens', 'Nenhuma mensagem encontrada');
                this.loading.set(false);
                return throwError(() => error);
            })
        )
        .subscribe((messages) => {
            this.myMessages.set(messages.my_messages);
            this.otherMessages.set(messages.other_messages);

            this.myMessages.set([
                ...this.myMessages().map(msg => ({ ...msg, isMine: true }))
            ]);

            this.otherMessages.set([
                ...this.otherMessages().map(msg => ({ ...msg, isMine: false }))
            ]);

            this.getSortedMessages();

            this.loading.set(false);
            this.cdr.detectChanges();
        });
    }

	getInitials(name: string): string {
		if (!name) return "F";
		return name.split(' ').map((n) => n.charAt(0)).slice(0, 2).join('');
	}

	onContactSelect(contact: IChatParticipant): void {
		this.selectedContact.set(contact);

        if (!this.controlListMessages()) {
            this.listMessages();
        }
	}

    private getSortedMessages(): void {
        const allMessages = [...this.myMessages(), ...this.otherMessages()];
        this.allMessages.set(allMessages);
        this.allMessages.set(this.allMessages().sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    }

}
