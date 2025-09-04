export type ProgramCost = {
  programKey: string;
  items: { label: string; amountCAD: number }[];
};

export function estimateCosts(programKey: string): ProgramCost {
  // Valeurs approximatives (placeholder). On branchera plus tard des données fraîches.
  const common = [
    { label: 'Biométrie', amountCAD: 85 },
    { label: 'Évaluation diplômes (EDE)', amountCAD: 230 },
    { label: 'Tests de langue (moyenne)', amountCAD: 320 }
  ];

  if (programKey === 'express-entry') {
    return {
      programKey,
      items: [
        ...common,
        { label: 'Frais RP (droit + traitement)', amountCAD: 1365 },
        { label: 'Certificats de police (estim.)', amountCAD: 100 },
        { label: 'Visite médicale (estim.)', amountCAD: 275 }
      ]
    };
  }

  if (programKey === 'pnp') {
    return {
      programKey,
      items: [
        ...common,
        { label: 'Frais RP (droit + traitement)', amountCAD: 1365 },
        { label: 'Frais de demande provinciale (estim.)', amountCAD: 250 }
      ]
    };
  }

  return {
    programKey,
    items: [
      { label: 'Frais admission scolaire (estim.)', amountCAD: 120 },
      { label: 'Étude du CAQ/Permis (estim.)', amountCAD: 350 },
      { label: 'Assurance santé étudiant (estim.)', amountCAD: 650 }
    ]
  };
}

export function sumCosts(cost: ProgramCost): number {
  return cost.items.reduce((s, i) => s + i.amountCAD, 0);
}
