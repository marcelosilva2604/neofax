import React, { useState } from 'react';
import PatientForm, { PatientData } from '../components/PatientForm';
import AntibioticResults from '../components/AntibioticResults';
import { antibiotics } from '../data/antibiotics';

const Home: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const handleFormSubmit = (data: PatientData) => {
    setPatientData(data);
  };

  const handleReset = () => {
    setPatientData(null);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="text-center mb-4">
            <h1 className="display-5 fw-bold text-primary mb-2">Calculadora Neofax</h1>
            <p className="lead text-muted">
              Cálculo de doses de antibióticos para pacientes neonatais baseado no Neofax
            </p>
            <button 
              className="btn btn-sm btn-outline-info mt-2" 
              onClick={toggleInfo}
            >
              {showInfo ? 'Ocultar Informações' : 'Sobre esta Calculadora'}
            </button>
          </div>

          {showInfo && (
            <div className="card shadow-sm mb-4 border-info">
              <div className="card-body">
                <h5 className="card-title text-info">Sobre a Calculadora Neofax</h5>
                <p>
                  Esta ferramenta calcula doses de antibióticos para pacientes neonatais com base nos seguintes parâmetros:
                </p>
                <ul>
                  <li><strong>Data de Nascimento:</strong> Utilizada para determinar a idade pós-natal exata em dias</li>
                  <li><strong>Idade Gestacional:</strong> Fornecida em semanas e dias para maior precisão nos cálculos</li>
                  <li><strong>Peso Atual:</strong> Usado para calcular a dose exata por peso</li>
                </ul>
                <p>
                  <i className="bi bi-info-circle-fill text-primary me-2"></i>
                  A calculadora utiliza automaticamente a data atual para realizar os cálculos de idade pós-natal e determinar as doses de antibióticos adequadas.
                </p>
                <p>
                  Os algoritmos de cálculo são baseados nas recomendações do Neofax, um guia farmacológico 
                  amplamente utilizado em neonatologia. Atualmente, a calculadora inclui {antibiotics.length} antibióticos:
                </p>
                <div className="row">
                  {antibiotics.map((antibiotic, index) => (
                    <div className="col-md-6" key={antibiotic.id}>
                      <div className="mb-1">
                        <i className="bi bi-capsule me-2"></i>
                        {antibiotic.name}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="alert alert-warning mt-3 mb-0">
                  <strong>Importante:</strong> Esta calculadora é uma ferramenta de apoio e não substitui a avaliação 
                  clínica. Sempre verifique os resultados com a versão oficial do Neofax e consulte um profissional de saúde 
                  qualificado antes de qualquer prescrição.
                </div>
              </div>
            </div>
          )}

          {patientData ? (
            <AntibioticResults patientData={patientData} onReset={handleReset} />
          ) : (
            <PatientForm onSubmit={handleFormSubmit} />
          )}

          <div className="mt-5 pt-3 text-center text-muted">
            <small>
              <strong>Aviso:</strong> Esta ferramenta é apenas uma calculadora de referência. 
              Sempre verifique os resultados com a publicação oficial do Neofax e consulte um profissional 
              de saúde qualificado antes de tomar qualquer decisão de tratamento.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 