import { IDocumentFile } from "./document.interface";

export interface IDocumentsTemplateResponse {
    id: number;
    name: string;
    description: string;
    'file_types': string | string[];
    document: File | IDocumentFile;
    created_at: Date;
    updated_at: Date;
}
