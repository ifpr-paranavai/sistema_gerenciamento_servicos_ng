import { IDocumentsTemplateResponse } from "./documents-template-response.interface"

export interface ServiceResponse {
    id?: number,
    name: string,
    description: string,
    cost: number,
    duration: number,
    ratting_avg?: number,
    document_requirements: IDocumentRequirement[]
}

export interface IDocumentRequirement {
    id: number;
    service: number;
    document_template: IDocumentsTemplateResponse;
    is_required: boolean;
    created_at: string;
    updated_at: string;
    selected?: boolean;
    required?: boolean;
}