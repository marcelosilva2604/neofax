import React, { useState, useEffect } from 'react';

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
}

export interface PatientData {
  birthDate: Date;
  gestationalAge: number;
  gestationalAgeWeeks: number;
  gestationalAgeDays: number;
  weight: number;
  postnatalAge: number;
  currentDate: Date;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit }) => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [gestationalAgeWeeks, setGestationalAgeWeeks] = useState<number | string>('');
  const [gestationalAgeDays, setGestationalAgeDays] = useState<number | string>(0);
  const [weight, setWeight] = useState<number | string>('');

  // Inicializa a data atual para limitar a data de nascimento
  const [maxDate, setMaxDate] = useState<string>('');
  
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // formato YYYY-MM-DD
    setMaxDate(formattedDate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!birthDate || !gestationalAgeWeeks || gestationalAgeDays === '' || !weight) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const birthDateObj = new Date(birthDate);
    const currentDateObj = new Date(); // Usa a data atual do sistema
    
    // Cálculo da idade gestacional total em semanas (semanas + dias/7)
    const weeksValue = Number(gestationalAgeWeeks);
    const daysValue = Number(gestationalAgeDays);
    const totalGestationalAge = weeksValue + (daysValue / 7);
    
    // Cálculo da idade pós-natal mais preciso usando a data atual
    const postnatalAge = calculateDaysBetween(birthDateObj, currentDateObj);

    onSubmit({
      birthDate: birthDateObj,
      gestationalAge: parseFloat(totalGestationalAge.toFixed(1)),
      gestationalAgeWeeks: weeksValue,
      gestationalAgeDays: daysValue,
      weight: Number(weight),
      postnatalAge,
      currentDate: currentDateObj,
    });
  };

  // Função para calcular dias entre duas datas
  const calculateDaysBetween = (startDate: Date, endDate: Date): number => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">Dados do Paciente</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="birthDate" className="form-label">Data de Nascimento</label>
            <input
              type="date"
              className="form-control"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={maxDate}
              required
            />
            <div className="form-text">Data de nascimento do paciente (não pode ser posterior à data atual)</div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Idade Gestacional ao Nascimento</label>
            <div className="row g-2">
              <div className="col-6">
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="gestationalAgeWeeks"
                    placeholder="Semanas"
                    min="23"
                    max="42"
                    value={gestationalAgeWeeks}
                    onChange={(e) => setGestationalAgeWeeks(e.target.value)}
                    required
                  />
                  <span className="input-group-text">semanas</span>
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="gestationalAgeDays"
                    placeholder="Dias"
                    min="0"
                    max="6"
                    value={gestationalAgeDays}
                    onChange={(e) => setGestationalAgeDays(e.target.value)}
                    required
                  />
                  <span className="input-group-text">dias</span>
                </div>
              </div>
            </div>
            <div className="form-text">Idade gestacional no momento do nascimento (ex: 32 semanas e 5 dias)</div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="weight" className="form-label">Peso Atual (kg)</label>
            <input
              type="number"
              step="0.01"
              min="0.5"
              max="10"
              className="form-control"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              placeholder="Ex: 2.4"
            />
            <div className="form-text">Insira o peso atual em quilogramas (ex: 2.4)</div>
          </div>
          
          <button type="submit" className="btn btn-primary w-100">
            <i className="bi bi-calculator me-2"></i>
            Calcular Antibióticos
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientForm; 