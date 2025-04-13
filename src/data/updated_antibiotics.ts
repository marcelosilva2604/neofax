export interface Antibiotic {
  id: string;
  name: string;
  neofaxPage: number;
  description: string;
  dosageCalculation: (
    weight: number,
    gestationalAge: number,
    postnatalAge: number,
    birthDate: Date
  ) => {
    dosage: string;
    interval: string;
    notes?: string;
  };
}

export const antibiotics: Antibiotic[] = [
  {
    id: "ampicillin",
    name: "Ampicilina",
    neofaxPage: 104, // Página correta do Neofax
    description: "Antibiótico beta-lactâmico de amplo espectro eficaz contra grupo B Streptococcus, Listeria monocytogenes e cepas suscetíveis de E. coli.",
    dosageCalculation: (weight, gestationalAge, postnatalAge) => {
      let dosage: string;
      let interval: string;
      let notes: string = "";

      // Dosagem baseada na idade gestacional e pós-natal conforme Neofax (página 104)
      if (gestationalAge <= 29) {
        if (postnatalAge <= 28) {
          dosage = "50 mg/kg/dose";
          interval = "12 horas";
        } else {
          dosage = "50 mg/kg/dose";
          interval = "8 horas";
        }
      } else if (gestationalAge <= 36) {
        if (postnatalAge <= 14) {
          dosage = "50 mg/kg/dose";
          interval = "12 horas";
        } else {
          dosage = "50 mg/kg/dose";
          interval = "8 horas";
        }
      } else if (gestationalAge <= 44) {
        if (postnatalAge <= 7) {
          dosage = "50 mg/kg/dose";
          interval = "12 horas";
        } else {
          dosage = "50 mg/kg/dose";
          interval = "8 horas";
        }
      } else {
        dosage = "50 mg/kg/dose";
        interval = "6 horas";
      }

      // Ajuste para meningite
      if (dosage === "50 mg/kg/dose") {
        notes = "Para meningite: 100 mg/kg/dose IV a cada 8 horas para recém-nascidos ≤ 7 dias ou 75 mg/kg/dose IV a cada 6 horas para > 7 dias.\n";
      }

      // Cálculo da dose total
      const dosePerKg = parseFloat(dosage.split(" ")[0]);
      const totalDosePerDay = (dosePerKg * weight * 24) / parseInt(interval.split(" ")[0]);
      notes += `Dose total diária: ${totalDosePerDay.toFixed(1)} mg/dia`;

      // Notas adicionais
      notes += "\n\nUsos: Sepse neonatal precoce (com aminoglicosídeo), infecções por estreptococos do grupo B, Listeria monocytogenes e E. coli suscetível.";
      notes += "\nAmpicilina é o antibiótico alternativo após penicilina G para doença por estreptococos do grupo B.";

      return { dosage, interval, notes };
    },
  },
  {
    id: "gentamicin",
    name: "Gentamicina",
    neofaxPage: 400, // Tentativa aproximada (precisaria da página exata)
    description: "Antibiótico aminoglicosídeo usado para tratar infecções causadas por bactérias gram-negativas. Frequentemente utilizado em combinação com ampicilina para sepse neonatal.",
    dosageCalculation: (weight, gestationalAge, postnatalAge) => {
      let dosage: string;
      let interval: string;
      let notes: string = "";

      // Dosagem baseada na idade gestacional e pós-natal
      if (gestationalAge <= 29) {
        if (postnatalAge <= 7) {
          dosage = "5 mg/kg/dose";
          interval = "48 horas";
        } else if (postnatalAge <= 28) {
          dosage = "4 mg/kg/dose";
          interval = "36 horas";
        } else {
          dosage = "4 mg/kg/dose";
          interval = "24 horas";
        }
      } else if (gestationalAge <= 34) {
        if (postnatalAge <= 7) {
          dosage = "4.5 mg/kg/dose";
          interval = "36 horas";
        } else {
          dosage = "4 mg/kg/dose";
          interval = "24 horas";
        }
      } else {
        if (postnatalAge <= 7) {
          dosage = "4 mg/kg/dose";
          interval = "24 horas";
        } else {
          dosage = "4 mg/kg/dose";
          interval = "18 horas";
        }
      }

      // Cálculo da dose total
      const dosePerKg = parseFloat(dosage.split(" ")[0]);
      const totalDosePerDay = (dosePerKg * weight * 24) / parseInt(interval.split(" ")[0]);
      notes = `Dose total diária aproximada: ${totalDosePerDay.toFixed(1)} mg/dia\n`;
      notes += "Monitorização recomendada: Concentração de pico (1h após término da infusão) 6-12 mcg/mL, vale (pré-dose) <2 mcg/mL.\n";
      notes += "Infundir durante 30 minutos. Não misturar com penicilinas na mesma infusão.";
      notes += "\n\nAtenção: Risco de nefrotoxicidade e ototoxicidade, especialmente com uso prolongado ou em combinação com outros medicamentos nefrotóxicos.";

      return { dosage, interval, notes };
    },
  },
  {
    id: "amikacin",
    name: "Amicacina",
    neofaxPage: 59, // Página correta do Neofax
    description: "Antibiótico aminoglicosídeo usado para tratar infecções graves por bactérias gram-negativas resistentes a outros aminoglicosídeos. Maior espectro de atividade contra Pseudomonas e outros organismos resistentes.",
    dosageCalculation: (weight, gestationalAge, postnatalAge) => {
      let dosage: string;
      let interval: string;
      let notes: string = "";

      // Dosagem baseada no peso e idade pós-natal conforme Neofax (página 59)
      if (weight <= 800) {
        if (postnatalAge < 14) {
          dosage = "16 mg/kg/dose";
          interval = "48 horas";
        } else {
          dosage = "20 mg/kg/dose";
          interval = "42 horas";
        }
      } else if (weight <= 1200) {
        if (postnatalAge < 14) {
          dosage = "16 mg/kg/dose";
          interval = "42 horas";
        } else {
          dosage = "20 mg/kg/dose";
          interval = "36 horas";
        }
      } else if (weight <= 2000) {
        if (postnatalAge < 14) {
          dosage = "15 mg/kg/dose";
          interval = "36 horas";
        } else {
          dosage = "18 mg/kg/dose";
          interval = "30 horas";
        }
      } else if (weight <= 2800) {
        if (postnatalAge < 14) {
          dosage = "15 mg/kg/dose";
          interval = "36 horas";
        } else {
          dosage = "18 mg/kg/dose";
          interval = "24 horas";
        }
      } else {
        if (postnatalAge < 14) {
          dosage = "15 mg/kg/dose";
          interval = "30 horas";
        } else {
          dosage = "18 mg/kg/dose";
          interval = "20 horas";
        }
      }

      // Cálculo da dose total
      const dosePerKg = parseFloat(dosage.split(" ")[0]);
      const totalDosePerDay = (dosePerKg * weight * 24) / parseInt(interval.split(" ")[0]);
      notes = `Dose total diária aproximada: ${totalDosePerDay.toFixed(1)} mg/dia\n`;
      notes += "Concentrações-alvo: Pico (1h após término da infusão): >24 mg/L, Vale (pré-dose): <3 mg/L\n";
      notes += "Diluir para concentração final de 2,5-10 mg/mL e administrar por infusão IV em 60-120 minutos.\n";
      notes += "Administrar separadamente de compostos contendo penicilina.";

      return { dosage, interval, notes };
    },
  },
  {
    id: "vancomycin",
    name: "Vancomicina",
    neofaxPage: 898, // Página correta do Neofax
    description: "Antibiótico glicopeptídeo usado principalmente para infecções por bactérias gram-positivas resistentes, como Staphylococcus aureus resistente à meticilina (MRSA).",
    dosageCalculation: (weight, gestationalAge, postnatalAge) => {
      let dosage: string;
      let interval: string;
      let notes: string = "";

      // Dosagem para vancomicina com maior precisão
      if (postnatalAge <= 7) {
        if (weight < 1.2) {
          dosage = "15 mg/kg/dose";
          interval = "24 horas";
        } else if (gestationalAge < 32) {
          dosage = "15 mg/kg/dose";
          interval = "18 horas";
        } else if (gestationalAge <= 36) {
          dosage = "15 mg/kg/dose";
          interval = "12 horas";
        } else {
          dosage = "15 mg/kg/dose";
          interval = "8 horas";
        }
      } else if (postnatalAge <= 28) {
        if (weight < 1.2) {
          dosage = "15 mg/kg/dose";
          interval = "18 horas";
        } else if (gestationalAge < 32) {
          dosage = "15 mg/kg/dose";
          interval = "12 horas";
        } else if (gestationalAge <= 36) {
          dosage = "15 mg/kg/dose";
          interval = "8 horas";
        } else {
          dosage = "15 mg/kg/dose";
          interval = "6 horas";
        }
      } else {
        // Para bebês com mais de 28 dias
        if (weight < 1.2) {
          dosage = "15 mg/kg/dose";
          interval = "12 horas";
        } else {
          dosage = "15 mg/kg/dose";
          interval = "8 horas";
        }
      }

      // Cálculo da dose total
      const dosePerKg = parseFloat(dosage.split(" ")[0]);
      const totalDosePerDay = (dosePerKg * weight * 24) / parseInt(interval.split(" ")[0]);
      notes = `Dose total diária aproximada: ${totalDosePerDay.toFixed(1)} mg/dia\n`;
      notes += "Infusão: administrar durante 60 minutos.\n";
      notes += "Ajuste com base nos níveis séricos. Concentrações-alvo: vale 5-15 mcg/mL para infecções comuns; 15-20 mcg/mL para infecções graves.\n";
      notes += "Monitorar função renal. Risco aumentado de toxicidade com outros medicamentos nefrotóxicos.";

      return { dosage, interval, notes };
    },
  },
  {
    id: "cefotaxime",
    name: "Cefotaxima",
    neofaxPage: 209, // Página aproximada do Neofax
    description: "Cefalosporina de terceira geração com amplo espectro contra bactérias gram-negativas e gram-positivas. Boa penetração no líquido cefalorraquidiano.",
    dosageCalculation: (weight, gestationalAge, postnatalAge) => {
      let dosage: string;
      let interval: string;
      let notes: string = "";

      // Dosagem básica para infecções comuns
      if (postnatalAge <= 7) {
        if (gestationalAge < 32) {
          dosage = "50 mg/kg/dose";
          interval = "12 horas";
        } else {
          dosage = "50 mg/kg/dose";
          interval = "8 horas";
        }
      } else if (postnatalAge <= 21) {
        if (gestationalAge < 32) {
          dosage = "50 mg/kg/dose";
          interval = "8 horas";
        } else {
          dosage = "50 mg/kg/dose";
          interval = "6 horas";
        }
      } else {
        // Para bebês com mais de 21 dias
        dosage = "50 mg/kg/dose";
        interval = "6 horas";
      }

      // Para meningite, a dose é maior
      notes = "Para meningite, utilize dose de 50 mg/kg/dose a cada 6-8 horas independente da idade gestacional.\n";

      // Cálculo da dose total
      const dosePerKg = parseFloat(dosage.split(" ")[0]);
      const totalDosePerDay = (dosePerKg * weight * 24) / parseInt(interval.split(" ")[0]);
      notes += `Dose total diária: ${totalDosePerDay.toFixed(1)} mg/dia\n`;
      notes += "Frequentemente utilizado em combinação com ampicilina para cobertura de meningite bacteriana neonatal.\n";
      notes += "Boa cobertura contra organismos gram-negativos, incluindo E. coli e Klebsiella.";

      return { dosage, interval, notes };
    },
  },
  {
    id: "meropenem",
    name: "Meropenem",
    neofaxPage: 550, // Página aproximada do Neofax
    description: "Antibiótico carbapenêmico de amplo espectro com atividade contra gram-positivos, gram-negativos e anaeróbios. Útil para infecções graves, incluindo infecções resistentes.",
    dosageCalculation: (weight, gestationalAge, postnatalAge) => {
      let dosage: string;
      let interval: string;
      let notes: string = "";

      // Dosagem padrão (infecções comuns)
      if (gestationalAge < 32 && postnatalAge <= 14) {
        dosage = "20 mg/kg/dose";
        interval = "12 horas";
      } else if (gestationalAge >= 32 && postnatalAge <= 7) {
        dosage = "20 mg/kg/dose";
        interval = "12 horas";
      } else if (gestationalAge >= 32 && postnatalAge > 7) {
        dosage = "20 mg/kg/dose";
        interval = "8 horas";
      } else {
        dosage = "20 mg/kg/dose";
        interval = "8 horas";
      }

      // Nota sobre meningite
      notes = "Para meningite e infecções graves por Pseudomonas, utilize 40 mg/kg/dose mantendo o mesmo intervalo.\n";
      
      // Infusão
      notes += "Administrar durante 30 minutos por infusão intravenosa.\n";

      // Cálculo da dose total
      const dosePerKg = parseFloat(dosage.split(" ")[0]);
      const totalDosePerDay = (dosePerKg * weight * 24) / parseInt(interval.split(" ")[0]);
      notes += `Dose total diária aproximada: ${totalDosePerDay.toFixed(1)} mg/dia\n`;
      notes += "Preferido para tratamento de infecções graves do sistema nervoso central por seu excelente perfil de segurança e penetração no líquido cefalorraquidiano.";

      return { dosage, interval, notes };
    },
  },
  {
    id: "piperacillin_tazobactam",
    name: "Piperacilina-Tazobactam",
    neofaxPage: 770, // Página aproximada do Neofax
    description: "Combinação de piperacilina (penicilina de amplo espectro) com tazobactam (inibidor de beta-lactamase). Ativo contra muitos organismos gram-positivos, gram-negativos e anaeróbios.",
    dosageCalculation: (weight, gestationalAge, postnatalAge) => {
      let dosage: string;
      let interval: string;
      let notes: string = "";

      // Dosagem com base na idade gestacional e pós-natal
      if (gestationalAge <= 32 && postnatalAge <= 7) {
        dosage = "100 mg/kg/dose de piperacilina";
        interval = "12 horas";
      } else if (gestationalAge <= 32 && postnatalAge > 7) {
        dosage = "100 mg/kg/dose de piperacilina";
        interval = "8 horas";
      } else if (gestationalAge > 32 && postnatalAge <= 7) {
        dosage = "100 mg/kg/dose de piperacilina";
        interval = "8 horas";
      } else {
        dosage = "100 mg/kg/dose de piperacilina";
        interval = "6 horas";
      }

      // Infusão
      notes = "Administrar durante 30 minutos por infusão intravenosa.\n";
      notes += "A dose é expressa como o componente piperacilina, com tazobactam em proporção fixa de 8:1.\n";

      // Cálculo da dose total
      const dosePerKg = parseFloat(dosage.split(" ")[0]);
      const totalDosePerDay = (dosePerKg * weight * 24) / parseInt(interval.split(" ")[0]);
      notes += `Dose total diária aproximada: ${totalDosePerDay.toFixed(1)} mg/dia de piperacilina\n`;
      notes += "Útil para infecções nosocomiais e infecções por patógenos resistentes. Boa cobertura contra Pseudomonas aeruginosa.";

      return { dosage, interval, notes };
    },
  }
];

// Função auxiliar para calcular a idade pós-natal em dias
export const calculatePostnatalAge = (birthDate: Date): number => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Função para calcular a idade corrigida (para prematuros)
export const calculateCorrectedAge = (birthDate: Date, gestationalAge: number): number => {
  const chronologicalAgeWeeks = calculatePostnatalAge(birthDate) / 7;
  return chronologicalAgeWeeks + gestationalAge - 40; // Idade corrigida em semanas (40 semanas = termo)
};

// Função para encontrar um antibiótico pelo ID
export const findAntibiotic = (id: string): Antibiotic | undefined => {
  return antibiotics.find(antibiotic => antibiotic.id === id);
}; 