'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { ResumePdfSkeleton } from './resume-pdf-skeleton';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const RESUME_PDF_URL = `/resume/download`;

const ViewerNotice = ({ children }: { children: ReactNode }) => (
  <div className='text-tns-white/70 flex min-h-48 items-center justify-center p-6 text-center'>
    {children}
  </div>
);

export const ResumePdfDocument = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [numPages, setNumPages] = useState<number>();

  useEffect(() => {
    if (!container) return undefined;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return;

      const nextWidth = Math.floor(entry.contentRect.width);
      setContainerWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth));
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [container]);

  return (
    <section aria-label='Resume PDF viewer' className='w-full' ref={setContainer}>
      <Document
        className='flex w-full flex-col items-stretch gap-4'
        error={<ViewerNotice>Unable to display the resume PDF.</ViewerNotice>}
        file={RESUME_PDF_URL}
        loading={<ResumePdfSkeleton />}
        onLoadSuccess={({ numPages: nextNumPages }) => setNumPages(nextNumPages)}
      >
        {containerWidth > 0 && numPages ? (
          Array.from({ length: numPages }, (_, index) => {
            const pageNumber = index + 1;

            return (
              <Page
                className='w-full overflow-hidden rounded-[12px] bg-white shadow-md sm:rounded-[18px]'
                error={<ViewerNotice>Unable to display page {pageNumber}.</ViewerNotice>}
                key={pageNumber}
                loading={<ResumePdfSkeleton label={`Loading resume page ${pageNumber}`} />}
                pageNumber={pageNumber}
                devicePixelRatio={Math.max(window.devicePixelRatio, 2)}
                renderAnnotationLayer
                renderTextLayer
                width={containerWidth}
              />
            );
          })
        ) : (
          <ResumePdfSkeleton label='Preparing resume pages' />
        )}
      </Document>
    </section>
  );
};
