import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { ChatMessageRequest } from '../../core/requests/chat-message/chat-message.request';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, interval, switchMap, throwError } from 'rxjs';
import { ToastService } from '../../core/requests/toastr/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IChatParticipant } from '../../core/interfaces/chat-message.interface';


@Component({
    selector: 'sgs-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit, AfterViewInit {
    @ViewChild('messagesContainer') messagesContainer!: ElementRef;
    
    otherMessages: WritableSignal<string[]> = signal(['Olá, tudo bem?']);
    myMessages: WritableSignal<string[]> = signal(['Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?', 'Olá, tudo bem?']);
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

    constructor(
        private chatMessageRequest: ChatMessageRequest,
        private destroyRef: DestroyRef,
        private toastService: ToastService,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.getChatMessagesData();
    }

    ngAfterViewInit(): void {
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        if (!this.messagesContainer) return;
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
    }

    getChatMessagesData(): void {
        interval(1000)
            .pipe(
                switchMap(() => this.chatMessageRequest.listUserChatMessages()),
                takeUntilDestroyed(this.destroyRef),
                catchError((error: HttpErrorResponse) => {
                    this.toastService.error("Atenção", "Erro ao buscar Mensagens!");
                    return throwError(() => error);
                }),
            )
            .subscribe(response => {
                console.log(response);
                if (!response?.length) throw Error("Erro ao buscar conversas");

                const participants: IChatParticipant[] = [];

                response.forEach(chat => {
                    if (chat?.participants?.length) {
                        chat.participants.forEach((participant) => {
                            participants.push(participant);
                        });
                    }

                    if (chat?.my_messages?.length) {
                        this.myMessages.set(chat.my_messages.map(message => message.content));
                    }

                    if (chat?.other_messages?.length) {
                        this.otherMessages.set(chat.other_messages.map(message => message.content));
                    }

                    this.contacts.set(participants);
                    this.cdr.detectChanges();
                })
                
            });
    }

    getInitials(name: string): string {        
        if (!name) return "F";
        return name.split(' ').map((n) => n.charAt(0)).slice(0, 2).join('');
    }

    onContactSelect(contact: IChatParticipant): void {
        this.selectedContact.set(contact);

        this.getChatMessagesData();
    }


}
