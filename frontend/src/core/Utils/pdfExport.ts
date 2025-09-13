import jsPDF from 'jspdf';
import type { FormSubmission } from '../../hooks/Users/useUserDetail';

export const exportFormToPDF = (form: FormSubmission) => {
    const pdf = new jsPDF();
    let yPosition = 20;
    const leftMargin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const lineHeight = 7;

    // Helper function to add text and handle wrapping
    const addText = (text: string, y: number, fontSize = 12, isBold = false) => {
        pdf.setFontSize(fontSize);
        if (isBold) {
            pdf.setFont('helvetica', 'bold');
        } else {
            pdf.setFont('helvetica', 'normal');
        }
        
        const textWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor;
        if (textWidth > pageWidth - 2 * leftMargin) {
            const words = text.split(' ');
            let line = '';
            for (const word of words) {
                const testLine = line + (line ? ' ' : '') + word;
                const testWidth = pdf.getStringUnitWidth(testLine) * fontSize / pdf.internal.scaleFactor;
                if (testWidth > pageWidth - 2 * leftMargin) {
                    pdf.text(line, leftMargin, y);
                    line = word;
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }
            if (line) {
                pdf.text(line, leftMargin, y);
            }
            return y + lineHeight;
        } else {
            pdf.text(text, leftMargin, y);
            return y + lineHeight;
        }
    };

    // Add Form Header
    yPosition = addText(form.formName, yPosition, 20, true);
    yPosition += 5;

    // Add Meta Information
    yPosition = addText(`Formulier ID: ${form.formId}`, yPosition, 10);
    yPosition = addText(`Versie: ${form.formVersion}`, yPosition, 10);
    yPosition = addText(`Ingediend op: ${new Date(form.submittedAt).toLocaleString('nl-NL')}`, yPosition, 10);
    yPosition += 10;

    // Add Form Data
    Object.entries(form.formData).forEach(([sectionName, instances]) => {
        // Add Section Title
        yPosition = addText(sectionName, yPosition, 14, true);
        yPosition += 3;

        // Add Instances
        Object.entries(instances).forEach(([_, fields], instanceIndex) => {
            if (instanceIndex > 0) yPosition += 3;
            
            // Add Fields
            Object.entries(fields).forEach(([fieldName, value]) => {
                // Check if we need a new page
                if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
                    pdf.addPage();
                    yPosition = 20;
                }
                
                const fieldText = `${fieldName}: ${value}`;
                yPosition = addText(fieldText, yPosition, 12);
            });
        });
        yPosition += 5;
    });

    // Save the PDF
    const fileName = `${form.formName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${
        new Date(form.submittedAt).toISOString().split('T')[0]
    }.pdf`;
    
    pdf.save(fileName);
};
