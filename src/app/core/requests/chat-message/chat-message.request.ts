import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";



@Injectable({
    providedIn: 'root'
})
export class ChatMessageRequest {
    private apiUrl = `${environment.baseUrl}/v1/chat/`;

    constructor(private http: HttpClient) { }

    getOrCreateChat(): void {

    }

    listChatMessages(): void {

    }

    sendChatMessage(): void {
        
    }
    

}
