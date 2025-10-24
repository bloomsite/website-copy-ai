import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { FormSubmission } from '../../hooks/Users/useUserDetail';

export const newExportFormToPDFv2 = async (form: FormSubmission) => {
    // Create a temporary HTML element with the form content
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '800px';
    tempDiv.style.padding = '20px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '14px';
    tempDiv.style.lineHeight = '1.5';
    
    // Helper to check if a string is an image URL
    const isImageUrl = (text: string): boolean => {
        if (typeof text !== 'string') return false;
        
        const imageUrlPattern = /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i;
        const azureBlobPattern = /\.blob\.core\.windows\.net\/.*images\//i;
        const httpUrlPattern = /^https?:\/\//i;
        
        return azureBlobPattern.test(text) || (httpUrlPattern.test(text) && imageUrlPattern.test(text));
    };

    // Build HTML content
    let htmlContent = `
        <h1 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${form.formName}</h1>
        <div style="margin-bottom: 20px;">
            <p><strong>Formulier ID:</strong> ${form.formId}</p>
            <p><strong>Versie:</strong> ${form.formVersion}</p>
            <p><strong>Ingediend op:</strong> ${new Date(form.submittedAt).toLocaleString('nl-NL')}</p>
        </div>
    `;

    // Process form data
    for (const [sectionName, instances] of Object.entries(form.formData)) {
        htmlContent += `<h2 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0;">${sectionName}</h2>`;

        // Process each instance's fields
        for (const [idx, fields] of Object.values(instances).entries()) {
            if (idx > 0) htmlContent += '<div style="margin: 10px 0;"></div>';

            // Add fields
            for (const [fieldName, value] of Object.entries(fields)) {
                if (typeof value === 'string' && isImageUrl(value)) {
                    // Handle image field
                    htmlContent += `
                        <div style="margin: 10px 0;">
                            <p><strong>${fieldName}:</strong></p>
                            <img src="${value}" style="max-width: 300px; max-height: 200px; margin: 5px 0;" 
                                 onerror="this.style.display='none'; this.nextSibling.style.display='block';" />
                            <p style="display: none; color: #666;">[Afbeelding kon niet geladen worden]</p>
                        </div>
                    `;
                } else {
                    // Handle regular text field - convert to plain text to avoid emoji issues
                    const cleanValue = String(value || '').replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters
                    htmlContent += `<p style="margin: 8px 0;"><strong>${fieldName}:</strong> ${cleanValue}</p>`;
                }
            }
        }
    }

    tempDiv.innerHTML = htmlContent;
    document.body.appendChild(tempDiv);

    try {
        // Wait a bit for images to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Convert to canvas
        const canvas = await html2canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

        // Save the PDF
        const fileName = `${form.formName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_v2_${
            new Date(form.submittedAt).toISOString().split('T')[0]
        }.pdf`;
        
        pdf.save(fileName);

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    } finally {
        // Clean up
        document.body.removeChild(tempDiv);
    }
};