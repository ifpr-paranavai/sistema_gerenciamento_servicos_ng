import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IChatMessageListResponse, IChatMessageSendRequest, IChatMessageSendResponse, IListChatMessage } from "../../interfaces/chat-message.interface";


@Injectable({
    providedIn: 'root'
})
export class ChatMessageRequest {
    private apiUrl = `${environment.baseUrl}/v1/chat`;

    constructor(private http: HttpClient) { }

    getOrCreateChat(userReceiverId: string): Observable<IChatMessageListResponse> {
        return this.http.post<IChatMessageListResponse>(`${this.apiUrl}/${userReceiverId}/create_or_get_chat/`, {});
    }

    listUserChatMessages(): Observable<IChatMessageListResponse[]> {
        return this.http.get<IChatMessageListResponse[]>(`${this.apiUrl}/list_user_chats/`);
    }

    listChatMessages(): Observable<IListChatMessage> {
        return this.http.get<IListChatMessage>(`${this.apiUrl}/list_messages/`);
    }

    sendChatMessage(data: IChatMessageSendRequest): Observable<IChatMessageSendResponse> {
        return this.http.post<IChatMessageSendResponse>(`${this.apiUrl}/send_message/`, data);
    }


}
