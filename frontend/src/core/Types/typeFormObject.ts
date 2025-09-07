export interface FormField {
    label: string; 
    description: string; 
    type: string; 
    required: boolean;
    placeholder: string;
    options?: (string | { value: string; label: string })[];  // Support both string and {value, label} options
}

export interface FormSection {
    title: string; 
    description: string; 
    repeatableCount: number; 
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