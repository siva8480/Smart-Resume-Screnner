import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn("Failed to set workerSrc automatically:", e);
}

export async function parseResumeFile(file) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  try {
    if (extension === 'pdf') {
      return await parsePdf(file);
    } else if (extension === 'docx') {
      return await parseDocx(file);
    } else {
      return await parseTxt(file);
    }
  } catch (error) {
    console.error('File parsing error:', error);
    return {
      filename: file.name,
      text: '',
      wordCount: 0,
      charCount: 0,
      pageCount: 0,
      fileType: extension || 'other',
      error: error.message || 'Failed to extract text from file'
    };
  }
}

async function parsePdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  let fullText = '';

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    let lastY = null;
    let pageText = '';

    for (const item of textContent.items) {
      if ('str' in item) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
          pageText += ' ';
        }
        pageText += item.str;
        lastY = item.transform[5];
      }
    }
    
    fullText += pageText + '\n\n';
  }

  const cleanText = cleanExtractedText(fullText);
  return {
    filename: file.name,
    text: cleanText,
    wordCount: countWords(cleanText),
    charCount: cleanText.length,
    pageCount: numPages,
    fileType: 'pdf'
  };
}

async function parseDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const cleanText = cleanExtractedText(result.value);

  return {
    filename: file.name,
    text: cleanText,
    wordCount: countWords(cleanText),
    charCount: cleanText.length,
    pageCount: Math.max(1, Math.ceil(countWords(cleanText) / 450)),
    fileType: 'docx'
  };
}

async function parseTxt(file) {
  const text = await file.text();
  const cleanText = cleanExtractedText(text);

  return {
    filename: file.name,
    text: cleanText,
    wordCount: countWords(cleanText),
    charCount: cleanText.length,
    pageCount: Math.max(1, Math.ceil(countWords(cleanText) / 450)),
    fileType: 'txt'
  };
}

function cleanExtractedText(raw) {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \u00a0]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

function countWords(text) {
  if (!text) return 0;
  const words = text.match(/\b[\w'-]+\b/g);
  return words ? words.length : 0;
}
