import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { IDocumentsTemplateResponse } from '../../interfaces/documents-template-response.interface';

@Injectable({
    providedIn: 'root'
})
export class DocumentsTemplateRequest {
    private apiUrl = `${environment.baseUrl}/v1/documents/document-templates/`;

    constructor(private http: HttpClient) {}

    createDocumentTemplate(formData: FormData): Observable<IDocumentsTemplateResponse> {
        return this.http.post<IDocumentsTemplateResponse>(this.apiUrl, formData);
    }

    updateDocumentTemplate(formData: FormData): Observable<IDocumentsTemplateResponse> {
        const id = formData.get('id') as string;
        return this.http.put<IDocumentsTemplateResponse>(`${this.apiUrl}${id}/`, formData);
    }

    deleteDocumentTemplate(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}`);
    }

    getDocumentsTemplate(): Observable<IDocumentsTemplateResponse[]> {
        return this.http.get<IDocumentsTemplateResponse[]>(this.apiUrl);
    }

}
