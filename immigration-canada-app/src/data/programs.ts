// Petit catalogue local pour démarrer (on branchera le “live data” plus tard)
export type Program = {
  key: 'express-entry' | 'pnp' | 'study';
  slug: string;
  title: string;
  type: 'federal' | 'provincial' | 'etudes';
  provinces: string[];        // vide = fédéral (toutes)
  minCLB: number;             // CLB conseillé (générique)
  minEducation?: 'secondaire' | 'college' | 'bachelor' | 'master' | 'phd';
  hasJobOfferBoost?: boolean; // avantage si offre d’emploi
  description: string;
};

export const PROGRAMS: Program[] = [
  {
    key: 'express-entry',
    slug: 'entree-express-travailleur-qualifie',
    title: 'Entrée Express — Travailleur qualifié',
    type: 'federal',
    provinces: [],
    minCLB: 7,
    minEducation: 'bachelor',
    hasJobOfferBoost: true,
    description: 'Voie rapide basée sur un système de points (CRS). CLB 7+ recommandé, EDE et expérience qualifiée.'
  },
  {
    key: 'pnp',
    slug: 'programme-candidats-provinces',
    title: 'Programme des candidats des provinces (PNP)',
    type: 'provincial',
    provinces: ['QC','ON','BC','AB','MB','SK','NS','NB','PE','NL'],
    minCLB: 6,
    hasJobOfferBoost: true,
    description: 'Voies provinciales alignées sur le marché local. Nomination = gros bonus pour la RP.'
  },
  {
    key: 'study',
    slug: 'etudes-vers-rp',
    title: 'Études au Canada → Voies RP',
    type: 'etudes',
    provinces: [],
    minCLB: 6,
    description: 'Étudier au Canada, puis acquérir une expérience locale (PGWP) vers la résidence permanente.'
  }
];

export const PROVINCES = [
  { code: 'ALL', name: 'Toutes les provinces' },
  { code: 'QC',  name: 'Québec' },
  { code: 'ON',  name: 'Ontario' },
  { code: 'BC',  name: 'Colombie-Britannique' },
  { code: 'AB',  name: 'Alberta' },
  { code: 'MB',  name: 'Manitoba' },
  { code: 'SK',  name: 'Saskatchewan' },
  { code: 'NS',  name: 'Nouvelle-Écosse' },
  { code: 'NB',  name: 'Nouveau-Brunswick' },
  { code: 'PE',  name: 'Î.-P.-Édouard' },
  { code: 'NL',  name: 'T.-N.-Labrador' }
];

export const TYPES = [
  { code: 'all', label: 'Tous' },
  { code: 'federal', label: 'Fédéral' },
  { code: 'provincial', label: 'Provincial' },
  { code: 'etudes', label: 'Études' }
];
