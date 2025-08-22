export interface FormField {
    label: string; 
    description: string; 
    type: string; 
    required: boolean;
    placeholder: string; 
}

export interface FormSection {
    title: string; 
    description: string; 
    fields: FormField[]; 
}

export interface Form {
    formId: string; 
    title: string; 
    icon: string; 
    description: string; 
    shortDescription: string; 
    version: string; 
    sections: FormSection[];
}