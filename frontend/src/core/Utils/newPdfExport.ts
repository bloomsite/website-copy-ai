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
        
        // Clean the text of newlines and spaces for the check
        const cleanText = text.replace(/[\n\r\s]+/g, '');

        // Check for Azure blob storage URLs or other image URLs
        const imageUrlPattern = /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i;
        const azureBlobPattern = /\.blob\.core\.windows\.net\/.*images\//i;
        const httpUrlPattern = /^https?:\/\//i;
        
        // If it's an Azure blob URL with 'images' in the path, it's likely an image
        if (azureBlobPattern.test(cleanText)) {
            console.log('Detected Azure blob image URL:', cleanText);
            return true;
        }
        
        // Check for standard image file extensions
        if (httpUrlPattern.test(cleanText) && imageUrlPattern.test(cleanText)) {
            console.log('Detected standard image URL:', cleanText);
            return true;
        }
        
        return false;
    };

    // Helper to load image and get dimensions
    const loadImage = (url: string): Promise<{ dataUrl: string; width: number; height: number }> => {
        return new Promise((resolve, reject) => {
            // Helper to calculate dimensions
            const calculateDimensions = (img: HTMLImageElement) => {
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
                return { width, height };
            };

            // First try to fetch the image
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.blob();
                })
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const dataUrl = reader.result as string;
                        const img = new Image();
                        img.onload = () => {
                            const { width, height } = calculateDimensions(img);
                            resolve({ dataUrl, width, height });
                        };
                        img.src = dataUrl;
                    };
                    reader.onerror = () => reject(new Error('Failed to read blob'));
                    reader.readAsDataURL(blob);
                })
                .catch(fetchError => {
                    console.warn('Fetch failed, trying direct image load with CORS:', fetchError);
                    
                    const img = new Image();
                    img.crossOrigin = 'Anonymous';
                    
                    img.onload = () => {
                        try {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                ctx.drawImage(img, 0, 0);
                                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                                const { width, height } = calculateDimensions(img);
                                resolve({ dataUrl, width, height });
                            } else {
                                reject(new Error('Could not get canvas context'));
                            }
                        } catch (e) {
                            reject(new Error('Failed to convert image to data URL'));
                        }
                    };
                    
                    img.onerror = () => reject(new Error(`Failed to load image (CORS/Network): ${url}`));
                    
                    // Don't append timestamp for SAS URLs as it might invalidate the signature
                    const isSasUrl = url.includes('sig=') || url.includes('se=');
                    if (isSasUrl) {
                        img.src = url;
                    } else {
                        const separator = url.includes('?') ? '&' : '?';
                        img.src = `${url}${separator}t=${Date.now()}`;
                    }
                });
        });
    };

    // Helper to add image to PDF
    const addImageToPDF = async (imageUrl: string, fieldName: string) => {
        // Clean the URL - remove all whitespace/newlines that might have crept in
        let cleanUrl = imageUrl.replace(/[\n\r\s]+/g, '');
        // Fix common URL encoding issues that might appear in data
        cleanUrl = cleanUrl.replace(/&amp;/g, '&');

        let imageResult = null;
        let errorMessage = '';

        try {
            // Validate URL
            try {
                new URL(cleanUrl);
            } catch (e) {
                throw new Error('Invalid URL format');
            }

            console.log('Attempting to load image:', cleanUrl);
            imageResult = await loadImage(cleanUrl);
        } catch (error: any) {
            console.warn('Failed to load image for PDF:', error);
            errorMessage = error.message || 'Unknown error';
        }

        if (imageResult) {
            const { dataUrl, width, height } = imageResult;
            
            // Ensure space for the image
            ensureSpace(height + LINE_HEIGHT.content + 5);
            
            // Add field name
            addWrappedText(`${sanitizeText(fieldName)}:`, CONTENT_SIZE, LINE_HEIGHT.content);
            yPosition += 2; // Small gap
            
            try {
                // Add the image
                const format = dataUrl.match(/^data:image\/(\w+);base64,/)?.[1]?.toUpperCase() || 'JPEG';
                pdf.addImage(dataUrl, format, margin, yPosition, width, height);
                yPosition += height + 5; // Add some space after image
                console.log('Successfully added image to PDF');
            } catch (pdfError) {
                console.error('Error adding image to PDF:', pdfError);
                addWrappedText(`[Error rendering image]`, CONTENT_SIZE, LINE_HEIGHT.content);
            }
            
        } else {
            // Fallback to text if image loading fails
            const fieldText = `${sanitizeText(fieldName)}: [Image Load Failed: ${errorMessage}]`;
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
