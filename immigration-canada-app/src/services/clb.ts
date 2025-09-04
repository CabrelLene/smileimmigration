// src/services/clb.ts
// Tables & convertisseurs CLB/NCLC pour IELTS, CELPIP, TEF Canada, TCF Canada.
// Références IRCC (tables officielles).
// - TEF Canada : trois époques (avant 2019-09-30, 2019-10-01→2023-12-10, après 2023-12-10)
// - TCF Canada : tableaux officiels (lecture/écoute sur 699, expression sur échelle 1–20)

// -------------------- IELTS / CELPIP (déjà en place) --------------------
export function ieltsToCLB(
  skill: 'listening' | 'reading' | 'writing' | 'speaking',
  band: number
): number {
  const L = [
    { min: 8.5, clb: 10 }, { min: 8.0, clb: 9 }, { min: 7.5, clb: 8 },
    { min: 6.0, clb: 7 }, { min: 5.5, clb: 6 }, { min: 5.0, clb: 5 }, { min: 4.5, clb: 4 }
  ];
  const R = [
    { min: 8.0, clb: 10 }, { min: 7.0, clb: 9 }, { min: 6.5, clb: 8 },
    { min: 6.0, clb: 7 }, { min: 5.0, clb: 6 }, { min: 4.0, clb: 5 }, { min: 3.5, clb: 4 }
  ];
  const W = [
    { min: 7.5, clb: 10 }, { min: 7.0, clb: 9 }, { min: 6.5, clb: 8 },
    { min: 6.0, clb: 7 }, { min: 5.5, clb: 6 }, { min: 5.0, clb: 5 }, { min: 4.0, clb: 4 }
  ];
  const S = [
    { min: 7.5, clb: 10 }, { min: 7.0, clb: 9 }, { min: 6.5, clb: 8 },
    { min: 6.0, clb: 7 }, { min: 5.5, clb: 6 }, { min: 5.0, clb: 5 }, { min: 4.0, clb: 4 }
  ];
  const table = skill === 'listening' ? L : skill === 'reading' ? R : skill === 'writing' ? W : S;
  for (const row of table) if (band >= row.min) return row.clb;
  return 0;
}

export function celpipToCLB(level: number): number {
  if (!level) return 0;
  return Math.max(0, Math.min(level, 12));
}

export type CLBDetail = {
  reading: number; writing: number; listening: number; speaking: number;
  overall: number; // moyenne arrondie
};

export function ieltsAllToCLB(vals: { reading:number; writing:number; listening:number; speaking:number }): CLBDetail {
  const reading = ieltsToCLB('reading', vals.reading);
  const writing = ieltsToCLB('writing', vals.writing);
  const listening = ieltsToCLB('listening', vals.listening);
  const speaking = ieltsToCLB('speaking', vals.speaking);
  const overall = Math.round((reading + writing + listening + speaking) / 4);
  return { reading, writing, listening, speaking, overall };
}

export function celpipAllToCLB(vals: { reading:number; writing:number; listening:number; speaking:number }): CLBDetail {
  const reading = celpipToCLB(vals.reading);
  const writing = celpipToCLB(vals.writing);
  const listening = celpipToCLB(vals.listening);
  const speaking = celpipToCLB(vals.speaking);
  const overall = Math.round((reading + writing + listening + speaking) / 4);
  return { reading, writing, listening, speaking, overall };
}

export function fromDirectCLB(vals: { reading:number; writing:number; listening:number; speaking:number }): CLBDetail {
  const { reading, writing, listening, speaking } = vals;
  const overall = Math.round((reading + writing + listening + speaking) / 4);
  return { reading, writing, listening, speaking, overall };
}

// -------------------- TEF Canada (officiel IRCC) --------------------
export type TefEra =
  | 'after_2023_12_10'
  | 'era_2019_10_to_2023_12_10'
  | 'before_2019_09_30';

// Tables: chaque entrée = [min, max, clb]
type Range = { min: number; max: number; clb: number };
type TefTables = Record<'reading'|'writing'|'listening'|'speaking', Range[]>;

const tef_after_2023_12_10: TefTables = {
  // NCLC 10→4
  reading: [
    { min: 546, max: 699, clb: 10 }, { min: 503, max: 545, clb: 9 },
    { min: 462, max: 502, clb: 8 }, { min: 434, max: 461, clb: 7 },
    { min: 393, max: 433, clb: 6 }, { min: 352, max: 392, clb: 5 },
    { min: 306, max: 351, clb: 4 },
  ],
  writing: [
    { min: 558, max: 699, clb: 10 }, { min: 512, max: 557, clb: 9 },
    { min: 472, max: 511, clb: 8 }, { min: 428, max: 471, clb: 7 },
    { min: 379, max: 427, clb: 6 }, { min: 330, max: 378, clb: 5 },
    { min: 268, max: 329, clb: 4 },
  ],
  listening: [
    { min: 546, max: 699, clb: 10 }, { min: 503, max: 545, clb: 9 },
    { min: 462, max: 502, clb: 8 }, { min: 434, max: 461, clb: 7 },
    { min: 393, max: 433, clb: 6 }, { min: 352, max: 392, clb: 5 },
    { min: 306, max: 351, clb: 4 },
  ],
  speaking: [
    { min: 556, max: 699, clb: 10 }, { min: 518, max: 555, clb: 9 },
    { min: 494, max: 517, clb: 8 }, { min: 456, max: 493, clb: 7 },
    { min: 422, max: 455, clb: 6 }, { min: 387, max: 421, clb: 5 },
    { min: 328, max: 386, clb: 4 },
  ],
};

const tef_2019_10_to_2023_12_10: TefTables = {
  reading: [
    { min: 566, max: 699, clb: 10 }, { min: 533, max: 565, clb: 9 },
    { min: 500, max: 532, clb: 8 }, { min: 450, max: 499, clb: 7 },
    { min: 400, max: 449, clb: 6 }, { min: 350, max: 399, clb: 5 },
    { min: 300, max: 349, clb: 4 },
  ],
  writing: [
    { min: 566, max: 699, clb: 10 }, { min: 533, max: 565, clb: 9 },
    { min: 500, max: 532, clb: 8 }, { min: 450, max: 499, clb: 7 },
    { min: 400, max: 449, clb: 6 }, { min: 350, max: 399, clb: 5 },
    { min: 300, max: 349, clb: 4 },
  ],
  listening: [
    { min: 566, max: 699, clb: 10 }, { min: 533, max: 565, clb: 9 },
    { min: 500, max: 532, clb: 8 }, { min: 450, max: 499, clb: 7 },
    { min: 400, max: 449, clb: 6 }, { min: 350, max: 399, clb: 5 },
    { min: 300, max: 349, clb: 4 },
  ],
  speaking: [
    { min: 566, max: 699, clb: 10 }, { min: 533, max: 565, clb: 9 },
    { min: 500, max: 532, clb: 8 }, { min: 450, max: 499, clb: 7 },
    { min: 400, max: 449, clb: 6 }, { min: 350, max: 399, clb: 5 },
    { min: 300, max: 349, clb: 4 },
  ],
};

const tef_before_2019_09_30: TefTables = {
  // Équivalence "ancien score"
  reading: [
    { min: 263, max: 300, clb: 10 }, { min: 248, max: 262, clb: 9 },
    { min: 233, max: 247, clb: 8 }, { min: 207, max: 232, clb: 7 },
    { min: 181, max: 206, clb: 6 }, { min: 151, max: 180, clb: 5 },
    { min: 121, max: 150, clb: 4 },
  ],
  listening: [
    { min: 316, max: 360, clb: 10 }, { min: 298, max: 315, clb: 9 },
    { min: 280, max: 297, clb: 8 }, { min: 249, max: 279, clb: 7 },
    { min: 217, max: 248, clb: 6 }, { min: 181, max: 216, clb: 5 },
    { min: 145, max: 180, clb: 4 },
  ],
  writing: [
    { min: 393, max: 450, clb: 10 }, { min: 371, max: 392, clb: 9 },
    { min: 349, max: 370, clb: 8 }, { min: 310, max: 348, clb: 7 },
    { min: 271, max: 309, clb: 6 }, { min: 226, max: 270, clb: 5 },
    { min: 181, max: 225, clb: 4 },
  ],
  speaking: [
    { min: 393, max: 450, clb: 10 }, { min: 371, max: 392, clb: 9 },
    { min: 349, max: 370, clb: 8 }, { min: 310, max: 348, clb: 7 },
    { min: 271, max: 309, clb: 6 }, { min: 226, max: 270, clb: 5 },
    { min: 181, max: 225, clb: 4 },
  ],
};

function pickTefTable(era: TefEra): TefTables {
  if (era === 'after_2023_12_10') return tef_after_2023_12_10;
  if (era === 'era_2019_10_to_2023_12_10') return tef_2019_10_to_2023_12_10;
  return tef_before_2019_09_30;
}

export function tefToCLB(
  ability: 'reading'|'writing'|'listening'|'speaking',
  score: number,
  era: TefEra
): number {
  const table = pickTefTable(era)[ability];
  for (const r of table) if (score >= r.min && score <= r.max) return r.clb;
  // en-dehors des plages connues → extrapolation prudente
  if (score > table[0].max) return table[0].clb; // au-dessus → max
  return 0; // en-dessous → <CLB4
}

export function tefAllToCLB(
  vals: { reading:number; writing:number; listening:number; speaking:number },
  era: TefEra
): CLBDetail {
  const reading = tefToCLB('reading', vals.reading, era);
  const writing = tefToCLB('writing', vals.writing, era);
  const listening = tefToCLB('listening', vals.listening, era);
  const speaking = tefToCLB('speaking', vals.speaking, era);
  const overall = Math.round((reading + writing + listening + speaking) / 4);
  return { reading, writing, listening, speaking, overall };
}

// -------------------- TCF Canada (officiel IRCC) --------------------
// Lecture/écoute: score 331–699 ; Expression écrite/orale : niveau 1–20
type Band = { min: number; max: number; clb: number };
const tcf_reading: Band[] = [
  { min: 549, max: 699, clb: 10 }, { min: 524, max: 548, clb: 9 },
  { min: 499, max: 523, clb: 8 }, { min: 453, max: 498, clb: 7 },
  { min: 406, max: 452, clb: 6 }, { min: 375, max: 405, clb: 5 },
  { min: 342, max: 374, clb: 4 },
];
const tcf_listening: Band[] = [
  { min: 549, max: 699, clb: 10 }, { min: 523, max: 548, clb: 9 },
  { min: 503, max: 522, clb: 8 }, { min: 458, max: 502, clb: 7 },
  { min: 398, max: 457, clb: 6 }, { min: 369, max: 397, clb: 5 },
  { min: 331, max: 368, clb: 4 },
];
// Échelle 1–20 pour expression (écrite/orale)
const tcf_expr_scale: { min: number; max: number; clb: number }[] = [
  { min: 16, max: 20, clb: 10 },
  { min: 14, max: 15, clb: 9 },
  { min: 12, max: 13, clb: 8 },
  { min: 10, max: 11, clb: 7 },
  { min: 7,  max: 9,  clb: 6 },
  { min: 6,  max: 6,  clb: 5 },
  { min: 4,  max: 5,  clb: 4 },
];

export function tcfToCLB(
  ability: 'reading'|'listening'|'writing'|'speaking',
  score: number
): number {
  const table =
    ability === 'reading' ? tcf_reading :
    ability === 'listening' ? tcf_listening :
    tcf_expr_scale;
  for (const r of table) if (score >= r.min && score <= r.max) return r.clb;
  if (score > table[0].max) return table[0].clb;
  return 0;
}

export function tcfAllToCLB(vals: { reading:number; writing:number; listening:number; speaking:number }): CLBDetail {
  const reading = tcfToCLB('reading', vals.reading);
  const writing = tcfToCLB('writing', vals.writing);
  const listening = tcfToCLB('listening', vals.listening);
  const speaking = tcfToCLB('speaking', vals.speaking);
  const overall = Math.round((reading + writing + listening + speaking) / 4);
  return { reading, writing, listening, speaking, overall };
}
