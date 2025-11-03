import { MCQ } from '../types.ts';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, Numbering, LevelFormat } from 'docx';
import { Translations } from '../types.ts';

// pdfjs-dist worker setup
GlobalWorkerOptions.workerSrc = `https://aistudiocdn.com/pdfjs-dist@5.4.394/build/pdf.worker.mjs`;

export async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument(arrayBuffer).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
}

export function createPdf(mcqs: MCQ[], topic: string, t: Translations): Blob {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(`${t.fileServiceMcqsFor}: ${topic}`, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);

  const body = mcqs.flatMap((mcq, index) => {
    const questionRow = [`${index + 1}. ${mcq.question}`];
    const optionsRows = mcq.options.map(option => [`   ${option}`]);
    const answerRow = [`   ${t.fileServiceAnswer}: ${mcq.answer}`];
    return [questionRow, ...optionsRows, answerRow, ['']]; // Add empty row for spacing
  });

  (doc as any).autoTable({
    startY: 30,
    body: body,
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 1,
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
    },
    didParseCell: (data: any) => {
      if (data.cell.raw.toString().includes(`${t.fileServiceAnswer}:`)) {
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  return doc.output('blob');
}

export async function createDocx(mcqs: MCQ[], topic: string, t: Translations): Promise<Blob> {
    const numbering = {
        config: [
            {
                reference: "mcq-options",
                levels: [
                    {
                        level: 0,
                        format: LevelFormat.LOWER_LETTER,
                        text: "%1.",
                        indent: { left: 720, hanging: 360 },
                    },
                ],
            },
        ],
    };

    const children = [
        new Paragraph({
            children: [new TextRun({ text: `${t.fileServiceMcqsFor}: ${topic}`, bold: true, size: 32 })],
            spacing: { after: 300 },
        }),
    ];

    mcqs.forEach((mcq, index) => {
        children.push(
            new Paragraph({
                children: [new TextRun({ text: `${index + 1}. ${mcq.question}`, bold: true, size: 24 })],
                spacing: { after: 150 },
            })
        );
        mcq.options.forEach((option) => {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: option, size: 22 })],
                    numbering: {
                        reference: "mcq-options",
                        level: 0,
                    },
                })
            );
        });
        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: `${t.fileServiceAnswer}: `, bold: true, size: 22 }),
                    new TextRun({ text: mcq.answer, size: 22 }),
                ],
                spacing: { after: 300 },
            })
        );
    });

    const doc = new Document({
        numbering,
        sections: [{ children }],
    });

    return await Packer.toBlob(doc);
}