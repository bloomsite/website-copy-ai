import jsPDF from 'jspdf';
import type { FormSubmission } from '../../hooks/Users/useUserDetail';

export const newExportFormToPDF = (form: FormSubmission) => {
    const pdf = new jsPDF();
    
    // Configuration
    const margin = 20;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (2 * margin);
    let yPosition = margin;

    // Font sizes
    const TITLE_SIZE = 16;
    const SUBTITLE_SIZE = 12;
    const SECTION_SIZE = 14;
    const CONTENT_SIZE = 11;
    
    // Line heights (in mm)
    const LINE_HEIGHT = {
        title: 10,
        subtitle: 7,
        section: 8,
        content: 7,
        gap: 5
    };

    // Helper to check and add new page if needed
    const ensureSpace = (neededSpace: number) => {
        if (yPosition + neededSpace > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
            return true;
        }
        return false;
    };

    // Helper to add text with proper wrapping
    const addWrappedText = (text: string, fontSize: number, lineHeight: number, isBold = false) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');

        const lines = pdf.splitTextToSize(text, contentWidth);
        
        // Check if we need a new page
        ensureSpace(lines.length * lineHeight);
        
        // Add each line
        lines.forEach((line: string) => {
            pdf.text(line, margin, yPosition);
            yPosition += lineHeight;
        });

        return lines.length * lineHeight;
    };

    // Add title
    addWrappedText(form.formName, TITLE_SIZE, LINE_HEIGHT.title, true);
    yPosition += LINE_HEIGHT.gap;

    // Add metadata
    addWrappedText(`Formulier ID: ${form.formId}`, SUBTITLE_SIZE, LINE_HEIGHT.subtitle);
    addWrappedText(`Versie: ${form.formVersion}`, SUBTITLE_SIZE, LINE_HEIGHT.subtitle);
    addWrappedText(
        `Ingediend op: ${new Date(form.submittedAt).toLocaleString('nl-NL')}`,
        SUBTITLE_SIZE,
        LINE_HEIGHT.subtitle
    );
    yPosition += LINE_HEIGHT.gap;

    // Process form data
    Object.entries(form.formData).forEach(([sectionName, instances]) => {
        // Add section header
        ensureSpace(LINE_HEIGHT.section);
        addWrappedText(sectionName, SECTION_SIZE, LINE_HEIGHT.section, true);
        yPosition += 3;

        // Process each instance's fields
        Object.values(instances).forEach((fields, idx) => {
            if (idx > 0) yPosition += 3;

            // Add fields
            Object.entries(fields).forEach(([fieldName, value]) => {
                const fieldText = `${fieldName}: ${value}`;
                addWrappedText(fieldText, CONTENT_SIZE, LINE_HEIGHT.content);
            });
        });

        yPosition += LINE_HEIGHT.gap;
    });

    // Save the PDF
    const fileName = `${form.formName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${
        new Date(form.submittedAt).toISOString().split('T')[0]
    }.pdf`;
    
    pdf.save(fileName);
};
