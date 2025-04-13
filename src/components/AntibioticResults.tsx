import React, { useState, useEffect } from 'react';
import { antibiotics } from '../data/antibiotics';
import { PatientData } from './PatientForm';
import SimplePDFViewer from './SimplePDFViewer';
import { getPageForAntibioticByName } from '../utils/PDFHelper';

interface AntibioticResultsProps {
  patientData: PatientData;
  onReset: () => void;
}

interface CategoryMap {
  [key: string]: string[];
}

const AntibioticResults: React.FC<AntibioticResultsProps> = ({ patientData, onReset }) => {
  const { 
    birthDate, 
    gestationalAge, 
    gestationalAgeWeeks, 
    gestationalAgeDays, 
    weight, 
    postnatalAge,
    currentDate
  } = patientData;

  // Estado para controlar qual categoria está ativa
  const [activeCategory, setActiveCategory] = useState<string>('all');
  // Estado para armazenar informações do antibiótico selecionado para o modal
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<{name: string, page: number} | null>(null);
  // Estado para forçar a atualização do PDFViewer
  const [pdfKey, setPdfKey] = useState<number>(0);

  // Categorias de antibióticos
  const antibioticCategories: CategoryMap = {
    'all': antibiotics.map(a => a.id),
    'common': ['ampicillin', 'gentamicin', 'cefotaxime'],
    'resistant': ['vancomycin', 'meropenem', 'piperacillin_tazobactam', 'oxacillin'],
    'aminoglycosides': ['gentamicin', 'amikacin']
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR');
  };

  const filteredAntibiotics = activeCategory === 'all' 
    ? antibiotics 
    : antibiotics.filter(antibiotic => antibioticCategories[activeCategory].includes(antibiotic.id));

  // Função para abrir o modal com as informações do antibiótico
  const openReferenceModal = (name: string, page: number) => {
    console.log(`Abrindo referência para: ${name}, página: ${page}`);
    
    // Usar a função utilitária para obter a página correta
    const correctPage = getPageForAntibioticByName(name);
    console.log(`Página correta para ${name}: ${correctPage}`);
    
    setSelectedAntibiotic({ name, page: correctPage });
    setPdfKey(prevKey => prevKey + 1); // Força o componente a renderizar novamente
  };

  // Configurar o listener do modal para limpar os dados quando o modal for fechado
  useEffect(() => {
    const neofaxModal = document.getElementById('neofaxReferenceModal');
    
    const handleModalHidden = () => {
      console.log('Modal fechado');
      // Reseta o estado do modal, mas não limpa o antibiótico selecionado
      setPdfKey(prevKey => prevKey + 1);
    };
    
    if (neofaxModal) {
      neofaxModal.addEventListener('hidden.bs.modal', handleModalHidden);
    }
    
    return () => {
      if (neofaxModal) {
        neofaxModal.removeEventListener('hidden.bs.modal', handleModalHidden);
      }
    };
  }, []);

  // Recria o componente SimplePDFViewer quando o antibiótico selecionado muda
  useEffect(() => {
    if (selectedAntibiotic) {
      console.log(`Antibiótico selecionado alterado: ${selectedAntibiotic.name}, página ${selectedAntibiotic.page}`);
      setPdfKey(prevKey => prevKey + 1);
    }
  }, [selectedAntibiotic]);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0">
            <i className="bi bi-capsule-pill me-2"></i>
            Resultado do Cálculo de Antibióticos
          </h5>
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={onReset}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Voltar ao Formulário
          </button>
        </div>

        <div className="alert alert-info mb-4">
          <h6 className="mb-2">
            <i className="bi bi-person me-2"></i>
            Dados do Paciente:
          </h6>
          <div className="row">
            <div className="col-md-6">
              <p className="mb-1"><strong>Data de Nascimento:</strong> {formatDate(birthDate)}</p>
              <p className="mb-1">
                <strong>Data do Cálculo:</strong> {formatDate(currentDate)} <span className="badge bg-success">Hoje</span>
              </p>
              <p className="mb-0"><strong>Idade Pós-Natal:</strong> {postnatalAge} dias</p>
            </div>
            <div className="col-md-6">
              <p className="mb-1">
                <strong>Idade Gestacional ao Nascimento:</strong> {gestationalAgeWeeks} semanas e {gestationalAgeDays} dias 
                <span className="text-muted ms-1">({gestationalAge.toFixed(1)} semanas)</span>
              </p>
              <p className="mb-0"><strong>Peso Atual:</strong> {weight} kg</p>
            </div>
          </div>
        </div>

        {/* Filtros de categoria */}
        <div className="mb-3">
          <div className="btn-group w-100">
            <button 
              className={`btn ${activeCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveCategory('all')}
            >
              <i className="bi bi-grid me-1"></i>
              Todos
            </button>
            <button 
              className={`btn ${activeCategory === 'common' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveCategory('common')}
            >
              <i className="bi bi-star me-1"></i>
              Mais Comuns
            </button>
            <button 
              className={`btn ${activeCategory === 'resistant' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveCategory('resistant')}
            >
              <i className="bi bi-shield me-1"></i>
              Infecções Resistentes
            </button>
            <button 
              className={`btn ${activeCategory === 'aminoglycosides' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveCategory('aminoglycosides')}
            >
              <i className="bi bi-capsule me-1"></i>
              Aminoglicosídeos
            </button>
          </div>
        </div>

        <div className="accordion" id="antibioticAccordion">
          {filteredAntibiotics.length === 0 ? (
            <div className="alert alert-warning">
              Nenhum antibiótico encontrado nesta categoria.
            </div>
          ) : (
            filteredAntibiotics.map((antibiotic, index) => {
              const dosageCalc = antibiotic.dosageCalculation(
                weight,
                gestationalAge,
                postnatalAge,
                birthDate
              );

              return (
                <div className="accordion-item" key={antibiotic.id}>
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="false"
                      aria-controls={`collapse${index}`}
                    >
                      <i className="bi bi-capsule me-2"></i>
                      <span className="fw-bold">{antibiotic.name}</span>
                      <span className="badge bg-primary ms-2 rounded-pill">
                        {calculateDose(dosageCalc.dosage, weight)}
                      </span>
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${index}`}
                    data-bs-parent="#antibioticAccordion"
                  >
                    <div className="accordion-body">
                      <p className="mb-3"><strong>Descrição:</strong> {antibiotic.description}</p>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <h6 className="border-bottom pb-2">
                              <i className="bi bi-info-circle me-2"></i>
                              Posologia Neofax
                            </h6>
                            <p className="mb-1"><strong>Dosagem:</strong> {dosageCalc.dosage}</p>
                            <p className="mb-0"><strong>Intervalo:</strong> {dosageCalc.interval}</p>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="mb-3">
                            <h6 className="border-bottom pb-2">
                              <i className="bi bi-calculator me-2"></i>
                              Cálculo para {weight} kg
                            </h6>
                            <p className="mb-1">
                              <strong>Dose por administração:</strong> {' '}
                              {calculateDose(dosageCalc.dosage, weight)}
                            </p>
                            <p className="mb-0">
                              <strong>Administrar a cada:</strong> {dosageCalc.interval}
                            </p>
                          </div>
                        </div>
                      </div>

                      {dosageCalc.notes && (
                        <div className="alert alert-info mt-2 mb-3">
                          <h6 className="mb-2">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            Observações Importantes:
                          </h6>
                          <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>{dosageCalc.notes}</p>
                        </div>
                      )}

                      <p className="mb-0 mt-3 text-muted">
                        <small>
                          <i className="bi bi-journal-text me-1"></i>
                          Referência: Neofax, página {antibiotic.neofaxPage}
                          <button 
                            className="ms-2 btn btn-link btn-sm p-0 text-decoration-none"
                            data-bs-toggle="modal" 
                            data-bs-target="#neofaxReferenceModal"
                            onClick={() => openReferenceModal(antibiotic.name, 0)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver Referência
                          </button>
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        <div className="d-flex justify-content-center mt-4">
          <button 
            className="btn btn-outline-secondary"
            onClick={onReset}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Voltar ao Formulário
          </button>
        </div>
      </div>

      {/* Modal para exibir a referência do Neofax */}
      <div className="modal fade" id="neofaxReferenceModal" tabIndex={-1} aria-labelledby="neofaxReferenceModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="neofaxReferenceModalLabel">
                <i className="bi bi-journal-medical me-2"></i>
                Neofax: {selectedAntibiotic?.name || 'Antibiótico'} (Página {selectedAntibiotic?.page || ''})
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedAntibiotic && (
                <SimplePDFViewer 
                  key={`pdf-viewer-${pdfKey}-${selectedAntibiotic.page}`}
                  pdfPath={process.env.PUBLIC_URL + "/neofax.pdf"} 
                  pageNumber={selectedAntibiotic.page}
                />
              )}
            </div>
            <div className="modal-footer">
              <div className="text-muted me-auto">
                <small>
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>
                  As informações fornecidas são baseadas no Neofax e devem ser confirmadas por um profissional de saúde.
                </small>
              </div>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                <i className="bi bi-x-circle me-1"></i>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Função para calcular a dose específica com base no peso do paciente
const calculateDose = (dosage: string, weight: number): string => {
  const match = dosage.match(/(\d+(\.\d+)?)/);
  if (match) {
    const dosePerKg = parseFloat(match[0]);
    const totalDose = dosePerKg * weight;
    return `${totalDose.toFixed(1)} mg/dose`;
  }
  return dosage;
};

export default AntibioticResults;