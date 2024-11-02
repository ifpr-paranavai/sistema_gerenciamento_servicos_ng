import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IDocumentTemplatePayload } from '../../interfaces/document-template-payload.interface';
import { IDocumentsTemplateResponse } from '../../interfaces/documents-template-response.interface';

@Injectable({
    providedIn: 'root'
})
export class DocumentsTemplateRequest {

    // TODO -> Alterar
    private apiUrl = `${environment.baseUrl}/v1/document/documents-templates/`;

    constructor(private http: HttpClient) {}

    createDocumentTemplate(documentTemplate: IDocumentTemplatePayload): Observable<IDocumentsTemplateResponse> {
        return this.http.post<IDocumentsTemplateResponse>(this.apiUrl, documentTemplate);
    }

    updateDocumentTemplate(documentTemplate: IDocumentTemplatePayload): Observable<IDocumentsTemplateResponse> {
        return this.http.put<IDocumentsTemplateResponse>(`${this.apiUrl}${documentTemplate.id!}`, documentTemplate);
    }

    deleteDocumentTemplate(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}`);
    }

}
