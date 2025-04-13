import React, { useEffect } from 'react';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  // Carrega os scripts do Bootstrap ao iniciar a aplicação
  useEffect(() => {
    // Importa o Bootstrap JS dinamicamente
    const bootstrapJs = document.createElement('script');
    bootstrapJs.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js';
    bootstrapJs.integrity = 'sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4';
    bootstrapJs.crossOrigin = 'anonymous';
    document.body.appendChild(bootstrapJs);

    // Limpeza ao desmontar
    return () => {
      document.body.removeChild(bootstrapJs);
    };
  }, []);

  return (
    <div className="App bg-light min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand">Neofax Antibióticos</span>
        </div>
      </nav>
      <Home />
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0">
            Calculadora Neofax para Antibióticos em Neonatologia
          </p>
          <small className="text-muted">
            Desenvolvido para fins educacionais. Não substitui a consulta médica profissional.
          </small>
        </div>
      </footer>
    </div>
  );
};

export default App;
