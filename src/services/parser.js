import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';

// Configure PDF.js worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn("Failed to set workerSrc automatically:", e);
}

export async function parseResumeFile(file) {
  return parseDocumentOrImageFile(file, 'resume');
}

export async function parseJobDescriptionFile(file) {
  return parseDocumentOrImageFile(file, 'job_description');
}

export async function parseDocumentOrImageFile(file, docType = 'document') {
  const extension = file.name.split('.').pop()?.toLowerCase();

  try {
    if (extension === 'pdf') {
      return await parsePdfWithVisuals(file);
    } else if (['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'].includes(extension)) {
      return await parseImageFile(file);
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
      visualPreviews: [],
      error: error.message || 'Failed to extract text from file'
    };
  }
}

async function parsePdfWithVisuals(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  let fullText = '';
  const visualPreviews = [];

  for (let pageNum = 1; pageNum <= Math.min(numPages, 10); pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    
    // 1. Extract text content
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

    // 2. Render visual page image (including all embedded images & graphics)
    try {
      const viewport = page.getViewport({ scale: 1.35 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      const pageImgUrl = canvas.toDataURL('image/jpeg', 0.85);
      visualPreviews.push({
        pageNum,
        dataUrl: pageImgUrl,
        width: viewport.width,
        height: viewport.height
      });

      // If page text is empty/very sparse (< 15 words) and contains graphics, run OCR on the rendered canvas
      if (pageText.trim().split(/\s+/).filter(Boolean).length < 15 && numPages <= 3) {
        try {
          const ocrText = await performOcrOnImage(pageImgUrl);
          if (ocrText && ocrText.length > pageText.length) {
            fullText += `\n[OCR Extracted Text - Page ${pageNum}]\n` + ocrText + '\n\n';
          }
        } catch (ocrErr) {
          console.warn('OCR fallback warning on page', pageNum, ocrErr);
        }
      }
    } catch (renderErr) {
      console.warn('PDF visual rendering error on page', pageNum, renderErr);
    }
  }

  const cleanText = cleanExtractedText(fullText);
  return {
    filename: file.name,
    text: cleanText,
    wordCount: countWords(cleanText),
    charCount: cleanText.length,
    pageCount: numPages,
    fileType: 'pdf',
    visualPreviews
  };
}

async function parseImageFile(file) {
  // 1. Create visual preview data URL
  const dataUrl = await readFileAsDataUrl(file);
  const visualPreviews = [{
    pageNum: 1,
    dataUrl,
    width: 600,
    height: 800
  }];

  // 2. Run OCR using Tesseract
  let ocrText = '';
  try {
    ocrText = await performOcrOnImage(dataUrl);
  } catch (err) {
    console.error('Image OCR error:', err);
    ocrText = 'Could not extract text from image automatically. Please review the image preview or edit the text manually.';
  }

  const cleanText = cleanExtractedText(ocrText);
  return {
    filename: file.name,
    text: cleanText,
    wordCount: countWords(cleanText),
    charCount: cleanText.length,
    pageCount: 1,
    fileType: file.type.split('/')[1] || 'image',
    visualPreviews
  };
}

async function performOcrOnImage(imageSource) {
  const worker = await createWorker('eng');
  const ret = await worker.recognize(imageSource);
  await worker.terminate();
  return ret.data.text || '';
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
    fileType: 'docx',
    visualPreviews: []
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
    fileType: 'txt',
    visualPreviews: []
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
