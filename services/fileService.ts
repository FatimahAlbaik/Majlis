import { MCQ, Language, Translations } from '../types.ts';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun, Numbering, LevelFormat, AlignmentType } from 'docx';

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

export async function createDocx(mcqs: MCQ[], topic: string, t: Translations, lang: Language): Promise<Blob> {
    const isRtl = lang === 'ar';
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
            children: [new TextRun({ text: `${t.fileServiceMcqsFor}: ${topic}`, bold: true, size: 32, rightToLeft: isRtl })],
            spacing: { after: 300 },
            alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            bidirectional: isRtl,
        }),
    ];

    mcqs.forEach((mcq, index) => {
        children.push(
            new Paragraph({
                children: [new TextRun({ text: `${index + 1}. ${mcq.question}`, bold: true, size: 24, rightToLeft: isRtl })],
                spacing: { after: 150 },
                bidirectional: isRtl,
                alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            })
        );
        mcq.options.forEach((option) => {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: option, size: 22, rightToLeft: isRtl })],
                    numbering: {
                        reference: "mcq-options",
                        level: 0,
                    },
                    bidirectional: isRtl,
                    alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
                })
            );
        });
        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: `${t.fileServiceAnswer}: `, bold: true, size: 22, rightToLeft: isRtl }),
                    new TextRun({ text: mcq.answer, size: 22, rightToLeft: isRtl }),
                ],
                spacing: { after: 300 },
                bidirectional: isRtl,
                alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
            })
        );
    });

    const doc = new Document({
        numbering,
        sections: [{ 
            properties: { rightToLeft: isRtl },
            children 
        }],
    });

    return await Packer.toBlob(doc);
}