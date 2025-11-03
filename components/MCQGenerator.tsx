import React, { useState, useCallback, useRef } from 'react';
import { Difficulty, MCQ } from '../types.ts';
import { generateMcqs } from '../services/geminiService.ts';
import { parsePdf, createPdf, createDocx } from '../services/fileService.ts';
import { SpinnerIcon, UploadIcon, FileIcon, DownloadIcon, AccentMark, CheckCircleIcon } from './Icons.tsx';
import { useApp } from '../hooks/useApp.ts';

export const MCQGenerator: React.FC = () => {
  const { translations: t } = useApp();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
      setPdfFile(file);
      setError(null);
      if(!topic) {
        setTopic(file.name.replace(/\.pdf$/i, '').replace(/_/g, ' '));
      }
    } else {
      setPdfFile(null);
      setError(t.mcqErrorPdfSize);
    }
  };
  
  const handleGenerate = useCallback(async () => {
    if (!pdfFile) {
      setError(t.mcqErrorNoFile);
      return;
    }
    setIsLoading(true);
    setError(null);
    setMcqs([]);
    try {
      const text = await parsePdf(pdfFile);
      const generated = await generateMcqs(text, topic, difficulty, questionCount);
      setMcqs(generated);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [pdfFile, topic, difficulty, questionCount, t]);

  const handleDownload = async (format: 'pdf' | 'docx') => {
    if (mcqs.length === 0) return;
    try {
        const blob = format === 'pdf' 
            ? createPdf(mcqs, topic, t)
            : await createDocx(mcqs, topic, t);
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${topic.replace(/ /g, '_')}_MCQs.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error(`Failed to create ${format} file`, err);
        setError(`Failed to generate ${format} file.`);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls Panel */}
      <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow h-fit">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">{t.mcqConfigureTitle}</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t.mcqPdfDocument}</label>
            <div 
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer hover:border-primary transition-colors duration-200 bg-slate-50 hover:bg-primary/5"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-2 text-center">
                {pdfFile ? <FileIcon className="mx-auto h-10 w-10 text-primary" /> : <UploadIcon className="mx-auto h-10 w-10 text-slate-400" />}
                <div className="flex text-sm text-slate-600">
                  <p className="truncate px-2">{pdfFile ? pdfFile.name : t.mcqUploadAFile}</p>
                </div>
                <p className="text-xs text-slate-500">{t.mcqPdfLimit}</p>
              </div>
            </div>
            <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" accept="application/pdf" onChange={handleFileChange} />
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-600">{t.mcqTopic}</label>
            <input type="text" id="topic" value={topic} onChange={e => setTopic(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm" placeholder={t.mcqTopicPlaceholder} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-slate-600">{t.mcqDifficulty}</label>
              <select id="difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm rounded-lg">
                {Object.values(Difficulty).map(d => <option key={d} value={d}>{t[d]}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="count" className="block text-sm font-medium text-slate-600">{t.mcqQuestions}</label>
              <input type="number" id="count" value={questionCount} min="1" max="20" onChange={e => setQuestionCount(parseInt(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm" />
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!pdfFile || isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5">
            {isLoading ? <><SpinnerIcon /> {t.mcqGeneratingButton}</> : t.mcqGenerateButton}
          </button>
        </div>
      </div>
      
      {/* Output Panel */}
      <div className="lg:col-span-8">
        <div className="bg-white p-6 rounded-xl shadow min-h-[600px] flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">{t.mcqReviewTitle}</h2>
            {mcqs.length > 0 && (
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button onClick={() => handleDownload('pdf')} className="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors duration-200">
                  <DownloadIcon className="mr-2 rtl:mr-0 rtl:ml-2" /> {t.mcqDownloadPdf}
                </button>
                <button onClick={() => handleDownload('docx')} className="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors duration-200">
                  <DownloadIcon className="mr-2 rtl:mr-0 rtl:ml-2" /> {t.mcqDownloadDocx}
                </button>
              </div>
            )}
          </div>
          <div className="flex-grow overflow-y-auto pr-2 -mr-2">
            {error && <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>}
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <SpinnerIcon className="w-12 h-12 text-primary"/>
                <p className="mt-4 text-lg">{t.mcqGeneratingState}</p>
                <p className="text-sm">{t.mcqGeneratingStateSub}</p>
              </div>
            )}

            {!isLoading && mcqs.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
                <FileIcon className="w-16 h-16 mb-4"/>
                <h3 className="text-xl font-semibold text-slate-600">{t.mcqEmptyState}</h3>
                <p>{t.mcqEmptyStateSub}</p>
              </div>
            )}

            {mcqs.length > 0 && (
              <div className="space-y-6">
                {mcqs.map((mcq, index) => (
                  <div key={index} className="relative p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                    <p className="font-semibold text-slate-800"><span className="text-primary font-bold">{index + 1}.</span> {mcq.question}</p>
                    <ul className="mt-3 space-y-2 ml-4">
                      {mcq.options.map((option, i) => (
                        <li key={i} className={`flex items-start p-2 rounded-md text-sm ${option === mcq.answer ? 'text-secondary-dark font-medium' : 'text-slate-700'}`}>
                          <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(97 + i)}.</span>
                          <span>{option}</span>
                          {option === mcq.answer && <CheckCircleIcon className="w-5 h-5 text-secondary ml-auto rtl:ml-0 rtl:mr-auto flex-shrink-0" />}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};