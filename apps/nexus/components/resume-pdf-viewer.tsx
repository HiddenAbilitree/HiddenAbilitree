'use client';

import dynamic from 'next/dynamic';

import { ResumePdfSkeleton } from './resume-pdf-skeleton';

const ResumePdfDocument = dynamic(
  () =>
    import('./resume-pdf-document').then(
      ({ ResumePdfDocument: ResumePdfDocumentComponent }) => ResumePdfDocumentComponent,
    ),
  {
    loading: () => <ResumePdfSkeleton />,
    ssr: false,
  },
);

export const ResumePdfViewer = () => <ResumePdfDocument />;
