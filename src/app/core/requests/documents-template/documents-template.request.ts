import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DocumentsTemplateRequest {

    // TODO -> Alterar
    private apiUrl = `${environment.baseUrl}/v1/documents-template/`;

    constructor(private http: HttpClient) { }

}
