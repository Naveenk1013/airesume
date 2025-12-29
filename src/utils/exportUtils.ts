import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { ResumeData } from '../types';

// A4 dimensions at 96 DPI
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

// PDF dimensions in mm (standard A4)
const PDF_WIDTH_MM = 210;
const PDF_HEIGHT_MM = 297;

export async function exportToPDF(containerElement: HTMLElement) {
  const resumeElement = containerElement.querySelector('.resume-page') as HTMLElement || containerElement;

  // Add exporting class
  resumeElement.classList.add('exporting');

  try {
    // Store original styles
    const originalWidth = resumeElement.style.width;
    const originalMinHeight = resumeElement.style.minHeight;
    const originalOverflow = resumeElement.style.overflow;

    // Set fixed width for consistent capture
    resumeElement.style.width = A4_WIDTH + 'px';
    resumeElement.style.overflow = 'visible';

    // Wait for layout to settle
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture the resume as high-quality canvas
    const canvas = await html2canvas(resumeElement, {
      scale: 2, // 2x for quality
      useCORS: true,
      logging: false,
      backgroundColor: window.getComputedStyle(resumeElement).backgroundColor || '#ffffff',
      width: A4_WIDTH,
      windowWidth: A4_WIDTH,
    });

    // Restore original styles
    resumeElement.style.width = originalWidth;
    resumeElement.style.minHeight = originalMinHeight;
    resumeElement.style.overflow = originalOverflow;

    // Calculate dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate how the content maps to A4 pages
    // The canvas is 2x scale, so actual content height = canvasHeight / 2
    const contentHeight = canvasHeight / 2;
    const pageCount = Math.ceil(contentHeight / A4_HEIGHT);

    // Create PDF in mm units for proper sizing
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Calculate image dimensions in mm
    // The image should span the full width of A4
    const imgWidthMM = PDF_WIDTH_MM;
    // Scale height proportionally based on the actual content ratio
    const imgHeightMM = (canvasHeight / canvasWidth) * PDF_WIDTH_MM;

    // Add image to PDF, positioning for each page
    for (let page = 0; page < pageCount; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      // Calculate Y offset in mm for this page
      const yOffsetMM = -(page * PDF_HEIGHT_MM);

      // Add the full image, offset to show correct page section
      pdf.addImage(
        imgData,
        'JPEG',
        0,
        yOffsetMM,
        imgWidthMM,
        imgHeightMM
      );
    }

    pdf.save('resume.pdf');

  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  } finally {
    resumeElement.classList.remove('exporting');
  }
}

export async function exportToWord(data: ResumeData) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: data.personalInfo.fullName, bold: true, size: 32 })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: data.personalInfo.title, size: 24 })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `${data.personalInfo.email} • ${data.personalInfo.phone}`, size: 20 })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: data.personalInfo.location, size: 20 })
          ]
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Professional Summary', bold: true, size: 28 })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: data.personalInfo.summary, size: 20 })
          ]
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Experience', bold: true, size: 28 })
          ]
        }),
        ...(data.experience || []).flatMap(exp => [
          new Paragraph({
            children: [
              new TextRun({ text: exp.position, bold: true, size: 22 })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${exp.company} | ${exp.startDate} - ${exp.endDate}`, size: 20 })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: exp.description, size: 20 })
            ]
          }),
          new Paragraph({ text: '' })
        ]),
        new Paragraph({
          children: [
            new TextRun({ text: 'Education', bold: true, size: 28 })
          ]
        }),
        ...(data.education || []).flatMap(edu => [
          new Paragraph({
            children: [
              new TextRun({ text: `${edu.degree} in ${edu.field}`, bold: true, size: 22 })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${edu.institution} | ${edu.graduationDate}`, size: 20 })
            ]
          }),
          new Paragraph({ text: '' })
        ]),
        new Paragraph({
          children: [
            new TextRun({ text: 'Skills', bold: true, size: 28 })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: (data.skills || []).join(', '), size: 20 })
          ]
        }),
        new Paragraph({ text: '' }),
        ...((data.languages || []).length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({ text: 'Languages', bold: true, size: 28 })
            ]
          }),
          ...(data.languages || []).map(lang =>
            new Paragraph({
              children: [
                new TextRun({ text: `${lang.language}: ${lang.proficiency}`, size: 20 })
              ]
            })
          ),
          new Paragraph({ text: '' })
        ] : []),
        ...((data.certifications || []).length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({ text: 'Certifications', bold: true, size: 28 })
            ]
          }),
          ...(data.certifications || []).flatMap(cert => [
            new Paragraph({
              children: [
                new TextRun({ text: cert.name, bold: true, size: 22 })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `${cert.issuer} | ${cert.date}`, size: 20 })
              ]
            }),
            new Paragraph({ text: '' })
          ])
        ] : [])
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'resume.docx');
}