import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { Ref } from 'react';
import { jsPDF } from 'jspdf';
import type { ResumeData } from '../types';

export async function exportToPDF(resumeElement: HTMLElement) {
  const doc = new jsPDF({
    format: 'a4',
    unit: 'pt'
  });

  doc.html(resumeElement, {
    callback: (pdf) => {
      pdf.save('resume.pdf');
    },
    x: 20,
    y: 20,
    html2canvas: {
      scale: 0.75
    }
  });
}

export async function exportToWord(data: ResumeData) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header with name and title
        new Paragraph({
          children: [
            new TextRun({
              text: data.personalInfo.fullName,
              bold: true,
              size: 32
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: data.personalInfo.title,
              size: 24
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${data.personalInfo.email} • ${data.personalInfo.phone}`,
              size: 20
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: data.personalInfo.location,
              size: 20
            })
          ]
        }),
        new Paragraph({ text: '' }), // Empty line

        // Professional Summary
        new Paragraph({
          children: [
            new TextRun({
              text: 'Professional Summary',
              bold: true,
              size: 28
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: data.personalInfo.summary,
              size: 20
            })
          ]
        }),
        new Paragraph({ text: '' }), // Empty line

        // Experience Section
        new Paragraph({
          children: [
            new TextRun({
              text: 'Experience',
              bold: true,
              size: 28
            })
          ]
        }),
        ...(data.experience || []).flatMap(exp => [
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position,
                bold: true,
                size: 22
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.company} | ${exp.startDate} - ${exp.endDate}`,
                size: 20
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: exp.description,
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }) // Empty line after each entry
        ]),

        // Education Section
        new Paragraph({
          children: [
            new TextRun({
              text: 'Education',
              bold: true,
              size: 28
            })
          ]
        }),
        ...(data.education || []).flatMap(edu => [
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.degree} in ${edu.field}`,
                bold: true,
                size: 22
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.institution} | ${edu.graduationDate}`,
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }) // Empty line after each entry
        ]),

        // Skills Section
        new Paragraph({
          children: [
            new TextRun({
              text: 'Skills',
              bold: true,
              size: 28
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: (data.skills || []).join(', '),
              size: 20
            })
          ]
        }),
        new Paragraph({ text: '' }), // Empty line

        // Languages Section (if exists)
        ...((data.languages || []).length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Languages',
                bold: true,
                size: 28
              })
            ]
          }),
          ...(data.languages || []).map(lang =>
            new Paragraph({
              children: [
                new TextRun({
                  text: `${lang.language}: ${lang.proficiency}`,
                  size: 20
                })
              ]
            })
          ),
          new Paragraph({ text: '' }) // Empty line
        ] : []),

        // Certifications Section (if exists)
        ...((data.certifications || []).length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'Certifications',
                bold: true,
                size: 28
              })
            ]
          }),
          ...(data.certifications || []).flatMap(cert => [
            new Paragraph({
              children: [
                new TextRun({
                  text: cert.name,
                  bold: true,
                  size: 22
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${cert.issuer} | ${cert.date}`,
                  size: 20
                })
              ]
            }),
            new Paragraph({ text: '' }) // Empty line after each entry
          ])
        ] : [])
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'resume.docx');
}