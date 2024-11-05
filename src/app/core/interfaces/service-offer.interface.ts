import { IDocumentRequirement } from "./service-response.interface";

export interface IServiceOfferPayload {
    id?: number;
    name: string;
    description: string;
    cost: number;
    duration: number;
    document_requirements: {
        document_template_id: number;
        is_required: boolean;
    }[];
}