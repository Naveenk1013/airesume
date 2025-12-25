import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Use the local worker file from node_modules instead of CDN
// Vite will handle bundling this properly
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

export async function parseResumeFile(file: File): Promise<string> {
    const fileType = file.type;

    console.log('📄 Parsing file:', file.name, 'Type:', fileType);

    if (fileType === 'application/pdf') {
        return parsePDF(file);
    } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx')
    ) {
        return parseDOCX(file);
    } else {
        throw new Error('Unsupported file format. Please upload PDF or DOCX.');
    }
}

async function parsePDF(file: File): Promise<string> {
    try {
        console.log('📄 Starting PDF parse...');
        const arrayBuffer = await file.arrayBuffer();
        console.log('✅ ArrayBuffer created, size:', arrayBuffer.byteLength);

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        console.log('✅ PDF loaded, pages:', pdf.numPages);

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n';
            console.log(`✅ Page ${i}/${pdf.numPages} extracted, length: ${pageText.length}`);
        }

        console.log('✅ PDF parsing complete, total text length:', fullText.length);
        return fullText;
    } catch (error) {
        console.error('❌ PDF parsing error:', error);
        throw new Error(`PDF parsing failed: ${(error as Error).message}`);
    }
}

async function parseDOCX(file: File): Promise<string> {
    try {
        console.log('📄 Starting DOCX parse...');
        const arrayBuffer = await file.arrayBuffer();
        console.log('✅ ArrayBuffer created, size:', arrayBuffer.byteLength);

        const result = await mammoth.extractRawText({ arrayBuffer });
        console.log('✅ DOCX parsing complete, text length:', result.value.length);
        return result.value;
    } catch (error) {
        console.error('❌ DOCX parsing error:', error);
        throw new Error(`DOCX parsing failed: ${(error as Error).message}`);
    }
}
