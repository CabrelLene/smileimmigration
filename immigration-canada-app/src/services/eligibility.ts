export type BasicAnswers = {
  age?: number;
  education?: 'secondaire' | 'college' | 'bachelor' | 'master' | 'phd' | null;
  yearsExperience?: number;
  canadaExperience?: number;
  language: { test?: string | null; CLB?: number }; // CLB global approx
};

export type SuggestedProgram = {
  key: string;
  title: string;
  score: number;   // 0-100
  reason: string;  // brève explication
  slug: string;
};

export function estimateCLBFromIELTS(avgBand: number): number {
  // approx pédagogique (on raffinera avec des tables exactes plus tard)
  if (avgBand >= 8) return 10;
  if (avgBand >= 7.5) return 9;
  if (avgBand >= 6.5) return 8;
  if (avgBand >= 6) return 7;
  if (avgBand >= 5.5) return 6;
  if (avgBand >= 5) return 5;
  return 4;
}

export function suggestPrograms(a: BasicAnswers): SuggestedProgram[] {
  const suggestions: SuggestedProgram[] = [];

  const clb = a.language.CLB ?? 0;
  // Heuristiques simples (placeholder — on intégrera des règles précises plus tard)
  // Entrée Express (Travailleurs qualifiés)
  let eeScore = 0;
  if ((a.age ?? 0) >= 18 && (a.age ?? 0) <= 35) eeScore += 35;
  if (['bachelor','master','phd'].includes(a.education || '')) eeScore += 25;
  if ((a.yearsExperience ?? 0) >= 1) eeScore += 15;
  if (clb >= 7) eeScore += 25;
  if (eeScore > 0) suggestions.push({
    key: 'express-entry',
    title: 'Entrée Express — Travailleur qualifié',
    score: Math.min(100, eeScore),
    reason: `Âge/études/expérience corrects et CLB≈${clb}+`,
    slug: 'entree-express-travailleur-qualifie'
  });

  // Programmes des candidats des provinces (PNP)
  let pnpScore = 0;
  if ((a.yearsExperience ?? 0) >= 1) pnpScore += 30;
  if ((a.canadaExperience ?? 0) >= 1) pnpScore += 30;
  if (clb >= 6) pnpScore += 20;
  if (['college','bachelor','master','phd'].includes(a.education || '')) pnpScore += 20;
  if (pnpScore > 0) suggestions.push({
    key: 'pnp',
    title: 'Programme des candidats des provinces (PNP)',
    score: Math.min(100, pnpScore),
    reason: `Bon profil provincial (expérience + langue)`,
    slug: 'programme-candidats-provinces'
  });

  // Permis d’études / voie étudiants → RP
  let studyScore = 0;
  if (['college','bachelor','master','phd'].includes(a.education || '')) studyScore += 40;
  if (clb >= 6) studyScore += 20;
  if ((a.age ?? 0) <= 40) studyScore += 40;
  if (studyScore > 0) suggestions.push({
    key: 'study',
    title: 'Études au Canada → Voies vers la résidence permanente',
    score: Math.min(100, studyScore),
    reason: `Projet d’études réaliste (âge + langue)`,
    slug: 'etudes-vers-rp'
  });

  return suggestions.sort((a,b)=>b.score-a.score).slice(0,3);
}
