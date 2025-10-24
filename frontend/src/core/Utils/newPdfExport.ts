import jsPDF from 'jspdf';
import type { FormSubmission } from '../../hooks/Users/useUserDetail';

export const newExportFormToPDF = async (form: FormSubmission) => {
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

    // Text sanitization function to remove emojis and special characters
    const sanitizeText = (text: string): string => {
        if (typeof text !== 'string') return String(text);
        
        return text
            // Remove emojis and various Unicode ranges that cause issues
            .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
            .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
            .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
            .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
            .replace(/[\u{2600}-\u{26FF}]/gu, '') // Misc symbols
            .replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
            .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
            .replace(/[\u{1F018}-\u{1F270}]/gu, '') // Various symbols
            .replace(/[\u{238C}-\u{2454}]/gu, '') // Various symbols
            .replace(/[\u{20D0}-\u{20FF}]/gu, '') // Combining marks
            .replace(/[\u{FE00}-\u{FE0F}]/gu, '') // Variation selectors
            .replace(/[\u{E000}-\u{F8FF}]/gu, '') // Private use area
            // Remove zero-width characters
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            // Keep only basic Latin, numbers, common punctuation and Dutch characters
            .replace(/[^\u0020-\u007E\u00A0-\u00FF\u0100-\u017F\u0180-\u024F]/g, '')
            // Clean up multiple spaces
            .replace(/\s+/g, ' ')
            .trim();
    };



    // Helper to check if a string is an image URL
    const isImageUrl = (text: string): boolean => {
        if (typeof text !== 'string') return false;
        
        // Check for Azure blob storage URLs or other image URLs
        const imageUrlPattern = /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i;
        const azureBlobPattern = /\.blob\.core\.windows\.net\/.*images\//i;
        const httpUrlPattern = /^https?:\/\//i;
        
        // If it's an Azure blob URL with 'images' in the path, it's likely an image
        if (azureBlobPattern.test(text)) {
            console.log('Detected Azure blob image URL:', text);
            return true;
        }
        
        // Check for standard image file extensions
        if (httpUrlPattern.test(text) && imageUrlPattern.test(text)) {
            console.log('Detected standard image URL:', text);
            return true;
        }
        
        return false;
    };

    // Helper to load image and get dimensions
    const loadImage = (url: string): Promise<{ img: HTMLImageElement; width: number; height: number }> => {
        return new Promise((resolve, reject) => {
            // First try to fetch the image as a blob to handle CORS better
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    const img = new Image();
                    const objectUrl = URL.createObjectURL(blob);
                    
                    img.onload = () => {
                        console.log('Image loaded successfully via fetch, dimensions:', img.width, 'x', img.height);
                        
                        // Clean up the object URL
                        URL.revokeObjectURL(objectUrl);
                        
                        // Calculate dimensions to fit within content width
                        const maxWidth = contentWidth - 20; // Leave some padding
                        const maxHeight = 100; // Maximum height in mm
                        
                        let { width, height } = img;
                        
                        // Convert pixels to mm (approximate: 1mm = 3.78 pixels at 96 DPI)
                        width = width / 3.78;
                        height = height / 3.78;
                        
                        // Scale down if too large
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                        
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                        
                        console.log('Scaled image dimensions for PDF:', width, 'x', height, 'mm');
                        resolve({ img, width, height });
                    };
                    
                    img.onerror = () => {
                        URL.revokeObjectURL(objectUrl);
                        reject(new Error('Failed to load image from blob'));
                    };
                    
                    img.src = objectUrl;
                })
                .catch(fetchError => {
                    console.warn('Fetch failed, trying direct image load:', fetchError);
                    
                    // Fallback to direct image loading
                    const img = new Image();
                    
                    // Try without CORS first for Azure blob storage
                    img.onload = () => {
                        console.log('Image loaded successfully via direct load, dimensions:', img.width, 'x', img.height);
                        
                        const maxWidth = contentWidth - 20;
                        const maxHeight = 100;
                        
                        let { width, height } = img;
                        width = width / 3.78;
                        height = height / 3.78;
                        
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                        
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                        
                        resolve({ img, width, height });
                    };
                    
                    img.onerror = (error) => {
                        console.error(`All image loading methods failed for: ${url}`, error);
                        reject(new Error(`Failed to load image: ${url}`));
                    };
                    
                    // Try without crossOrigin for Azure blob storage
                    img.src = url;
                });
        });
    };

    // Helper to add image to PDF
    const addImageToPDF = async (imageUrl: string, fieldName: string) => {
        try {
            console.log('Attempting to load image:', imageUrl);
            const { img, width, height } = await loadImage(imageUrl);
            
            // Ensure we have space for the image
            ensureSpace(height + LINE_HEIGHT.content + 5);
            
            // Add field name
            addWrappedText(`${sanitizeText(fieldName)}:`, CONTENT_SIZE, LINE_HEIGHT.content);
            yPosition += 2; // Small gap
            
            // Add the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                pdf.addImage(imageData, 'JPEG', margin, yPosition, width, height);
                yPosition += height + 5; // Add some space after image
                console.log('Successfully added image to PDF');
            } else {
                throw new Error('Could not get canvas context');
            }
            
        } catch (error) {
            console.warn('Failed to add image to PDF:', error);
            // Fallback to text if image loading fails
            const fieldText = `${sanitizeText(fieldName)}: [Image: ${imageUrl}]`;
            addWrappedText(fieldText, CONTENT_SIZE, LINE_HEIGHT.content);
        }
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
    addWrappedText(sanitizeText(form.formName), TITLE_SIZE, LINE_HEIGHT.title, true);
    yPosition += LINE_HEIGHT.gap;

    // Add metadata
    addWrappedText(`Formulier ID: ${sanitizeText(form.formId)}`, SUBTITLE_SIZE, LINE_HEIGHT.subtitle);
    addWrappedText(`Versie: ${sanitizeText(form.formVersion)}`, SUBTITLE_SIZE, LINE_HEIGHT.subtitle);
    addWrappedText(
        `Ingediend op: ${new Date(form.submittedAt).toLocaleString('nl-NL')}`,
        SUBTITLE_SIZE,
        LINE_HEIGHT.subtitle
    );
    yPosition += LINE_HEIGHT.gap;

    // Process form data
    for (const [sectionName, instances] of Object.entries(form.formData)) {
        // Add section header
        ensureSpace(LINE_HEIGHT.section);
        addWrappedText(sanitizeText(sectionName), SECTION_SIZE, LINE_HEIGHT.section, true);
        yPosition += 3;

        // Process each instance's fields
        for (const [idx, fields] of Object.values(instances).entries()) {
            if (idx > 0) yPosition += 3;

            // Add fields
            for (const [fieldName, value] of Object.entries(fields)) {
                console.log(`Processing field: ${fieldName}, value: ${value}, type: ${typeof value}`);
                
                if (typeof value === 'string' && isImageUrl(value)) {
                    // Handle image field
                    console.log('Processing as image field');
                    await addImageToPDF(value, sanitizeText(fieldName));
                } else {
                    // Handle regular text field - sanitize both field name and value
                    console.log('Processing as text field');
                    const sanitizedFieldName = sanitizeText(fieldName);
                    const sanitizedValue = sanitizeText(String(value));
                    const fieldText = `${sanitizedFieldName}: ${sanitizedValue}`;
                    console.log(`Original text: "${fieldName}: ${value}"`);
                    console.log(`Sanitized text: "${fieldText}"`);
                    addWrappedText(fieldText, CONTENT_SIZE, LINE_HEIGHT.content);
                }
            }
        }

        yPosition += LINE_HEIGHT.gap;
    }

    // Save the PDF
    const fileName = `${form.formName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${
        new Date(form.submittedAt).toISOString().split('T')[0]
    }.pdf`;
    
    pdf.save(fileName);
};
