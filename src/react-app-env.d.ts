/// <reference types="react-scripts" />

declare module 'react-pdf' {
  import React from 'react';
  
  export interface DocumentProps {
    file: string | { url: string; };
    onLoadSuccess?: (pdf: { numPages: number }) => void;
    onLoadError?: (error: Error) => void;
    loading?: React.ReactNode;
    noData?: React.ReactNode;
    className?: string;
    options?: any;
    error?: React.ReactNode;
    children?: React.ReactNode;
  }
  
  export interface PageProps {
    pageNumber: number;
    scale?: number;
    rotate?: number;
    width?: number;
    onLoadSuccess?: () => void;
    onRenderSuccess?: () => void;
    onRenderError?: (error: Error) => void;
    renderTextLayer?: boolean;
    renderAnnotationLayer?: boolean;
    loading?: React.ReactNode;
    className?: string;
    error?: React.ReactNode;
  }
  
  export const Document: React.FC<DocumentProps>;
  export const Page: React.FC<PageProps>;
  
  export interface PDFJSStatic {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
    version: string;
  }
  
  export const pdfjs: PDFJSStatic;
}
