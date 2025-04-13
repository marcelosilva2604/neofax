import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configuração necessária para o react-pdf - usando CDN compatível com a versão 3.6.172
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfPath: string;
  pageNumber: number;
  onLoadSuccess?: (totalPages: number) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfPath, pageNumber, onLoadSuccess }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(pageNumber);
  const [scale, setScale] = useState<number>(1.2);
  const [pageInput, setPageInput] = useState<string>(pageNumber.toString());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Atualiza a página atual quando o pageNumber prop muda
  useEffect(() => {
    setCurrentPage(pageNumber);
    setPageInput(pageNumber.toString());
  }, [pageNumber]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
    setLoadError(null);
    if (onLoadSuccess) {
      onLoadSuccess(numPages);
    }
    // Se a página solicitada for maior que o número total de páginas, vá para a primeira página
    if (pageNumber > numPages) {
      setCurrentPage(1);
      setPageInput("1");
    }
  }

  const handleError = (error: Error) => {
    console.error('Erro ao carregar PDF:', error);
    console.log('Detalhes do erro:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      pdfPath
    });
    setIsLoading(false);
    setLoadError(`Erro ao carregar o PDF: ${error.message}`);
  };

  const changePage = (offset: number) => {
    setCurrentPage(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      if (newPageNumber >= 1 && numPages !== null && newPageNumber <= numPages) {
        setPageInput(newPageNumber.toString());
        return newPageNumber;
      }
      return prevPageNumber;
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 3));
  const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.5));

  const goToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput);
    if (!isNaN(pageNum) && pageNum >= 1 && numPages !== null && pageNum <= numPages) {
      setCurrentPage(pageNum);
    } else {
      // Se o número da página for inválido, redefina para a página atual
      setPageInput(currentPage.toString());
    }
  };

  return (
    <div className="pdf-viewer">
      <div className="controls mb-3 d-flex justify-content-between align-items-center flex-wrap">
        <div className="d-flex mb-2 mb-md-0">
          <button 
            className="btn btn-sm btn-outline-primary me-2" 
            onClick={previousPage} 
            disabled={currentPage <= 1}
            aria-label="Página anterior"
          >
            <i className="bi bi-chevron-left"></i> Anterior
          </button>
          <button 
            className="btn btn-sm btn-outline-primary" 
            onClick={nextPage} 
            disabled={numPages !== null && currentPage >= numPages}
            aria-label="Próxima página"
          >
            Próxima <i className="bi bi-chevron-right"></i>
          </button>
        </div>
        
        <div className="page-navigation d-flex align-items-center">
          <form onSubmit={goToPage} className="d-flex align-items-center">
            <span className="me-2">Página</span>
            <input 
              type="text" 
              className="form-control form-control-sm me-2" 
              style={{ width: '50px' }} 
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              aria-label="Número da página"
            />
            <span className="me-2">de {numPages || '--'}</span>
            <button type="submit" className="btn btn-sm btn-primary" aria-label="Ir para página">
              Ir
            </button>
          </form>
        </div>
        
        <div className="d-flex">
          <button 
            className="btn btn-sm btn-outline-secondary me-2" 
            onClick={zoomOut}
            aria-label="Diminuir zoom"
          >
            <i className="bi bi-zoom-out"></i>
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={zoomIn}
            aria-label="Aumentar zoom"
          >
            <i className="bi bi-zoom-in"></i>
          </button>
        </div>
      </div>

      <div className="pdf-container border rounded p-2 text-center bg-light" style={{ height: '70vh', overflow: 'auto' }}>
        {loadError ? (
          <div className="alert alert-danger m-3" role="alert">
            <h5><i className="bi bi-exclamation-triangle-fill me-2"></i>Erro ao carregar o documento</h5>
            <p>{loadError}</p>
            <p className="mb-0">Verifique se o arquivo PDF existe e está acessível em: {pdfPath}</p>
          </div>
        ) : (
          <Document
            file={pdfPath}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={handleError}
            loading={
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-2">Carregando PDF...</p>
              </div>
            }
            error={
              <div className="alert alert-warning m-3" role="alert">
                <h5><i className="bi bi-exclamation-triangle-fill me-2"></i>Falha ao carregar o documento</h5>
                <p>Não foi possível carregar o arquivo PDF. Verifique o caminho do arquivo.</p>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </div>
              }
              error={
                <div className="alert alert-warning m-3" role="alert">
                  <p>Não foi possível renderizar a página {currentPage}.</p>
                </div>
              }
            />
          </Document>
        )}
        
        {!isLoading && !loadError && numPages && (
          <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3 bg-dark text-white px-3 py-1 rounded-pill opacity-75">
            Página {currentPage} de {numPages}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer; 