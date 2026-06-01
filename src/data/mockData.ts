export type Score = 'A' | 'B' | 'C';

export interface Equipment {
  id: string;
  name: string;
  icon: string;
  total: number;
  available: number;
  reserved: number;
  maintenance: number;
}

export interface AuditSection {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  points: AuditPoint[];
}

export interface AuditPoint {
  id: string;
  label: string;
  response: 'O' | 'N' | 'NA' | null;
  observation: string;
}

export interface Venue {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  postalCode: string;
  score: Score;
  scoreValue: number;
  rating: number;
  reviewCount: number;
  equipment: Equipment[];
  sections: AuditSection[];
  bgColor: string;
  bgColor2: string;
  photo: string;
  description: string;
  accessibilityFeatures: string[];
  distance: string;
  lat: number;
  lng: number;
}

export interface Reservation {
  id: string;
  visitorName: string;
  visitorEmail: string;
  venueId: string;
  venueName: string;
  equipmentId: string;
  equipmentName: string;
  equipmentIcon: string;
  date: string;
  time: string;
  status: 'confirmée' | 'en attente' | 'annulée' | 'terminée';
  qrCode: string;
}

export interface AuditMission {
  id: string;
  venueId: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  date: string;
  auditorName: string;
  status: 'assignée' | 'en cours' | 'terminée';
  sectionsCompleted: number;
  sectionsTotal: number;
  score: Score;
  scoreValue: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// GRILLE D'AUDIT ACCESISTE — 41 points réglementaires (Ad'AP / ERP)
// ─────────────────────────────────────────────────────────────────────────────

type R = 'O' | 'N' | 'NA' | null;

const S1_LABELS = [
  "Place(s) PMR réservée(s) à ≤ 50 m de l'entrée",
  'Dimensions conformes de la place PMR (largeur ≥ 3,30 m)',
  "Signalétique directionnelle du parking vers l'entrée",
  'Revêtement du cheminement stable, dur et non meuble',
  'Cheminement extérieur sans obstacle ni pente excessive',
  "Dévers du sol ≤ 2 % sur le cheminement d'accès",
  'Éclairage nocturne suffisant sur le cheminement',
  "Entrée PMR clairement signalée si différente de l'entrée principale",
];

const S2_LABELS = [
  "Accès à l'entrée sans marche (plain-pied ou rampe conforme)",
  "Porte d'entrée : passage utile ≥ 83 cm",
  'Porte manœuvrable ou automatique depuis un fauteuil roulant',
  "Comptoir d'accueil avec section basse ≤ 80 cm",
  "Espace de manœuvre Ø ≥ 1,50 m devant l'accueil",
  'Boucle magnétique (ou AFILS) disponible à la caisse / billetterie',
  "Signalétique visible depuis l'entrée vers l'accueil",
  'Personnel sensibilisé à l\'accueil des personnes handicapées',
  'Documentation ou plan accessible (braille, relief, grands caractères)',
];

const S3_LABELS = [
  'Largeur des circulations ≥ 1,40 m (min. 1,20 m)',
  'Absence d\'obstacles saillants dans les circulations',
  'Tous les dénivelés sont traités (rampes, ascenseur ou plan incliné)',
  'Pente des rampes ≤ 5 % (8 % max en cas exceptionnel)',
  'Main courante des deux côtés sur les rampes et escaliers',
  'Ascenseur disponible si le lieu comporte plusieurs niveaux',
  'Cabine d\'ascenseur conforme (≥ 1,00 m × 1,30 m)',
  'Commandes en relief et/ou annonce sonore des niveaux',
  'Bandes de guidage podotactiles aux points stratégiques',
  'Espaces de repos (assises) disponibles en cours de parcours',
];

const S4_LABELS = [
  'WC adapté PMR présent sur le site',
  'Accès au WC PMR de plain-pied, porte ≥ 90 cm',
  'Espace de rotation libre Ø ≥ 1,50 m dans le WC PMR',
  'Barre d\'appui latérale rabattable côté transfert installée',
  'Hauteur de cuvette adaptée (40–45 cm)',
  'Lavabo accessible en position assise (vide sous vasque ≤ 70 cm)',
  "Dispositif d'appel d'urgence présent dans le WC PMR",
];

const S5_LABELS = [
  'Hauteur des éléments consultables ≤ 130 cm (panneaux, vitrines, bornes)',
  'Éclairage suffisant et non éblouissant (≥ 200 lux recommandé)',
  'Signalétique en grands caractères contrastés (ratio ≥ 7:1)',
  'Contenus disponibles en braille, relief ou FALC',
  'Audioguide ou médiation sonore disponible',
  'Assises disponibles dans les espaces de visite',
  'Allées libres ≥ 1,40 m dans les espaces de visite',
];

function buildSections(
  r1: R[], r2: R[], r3: R[], r4: R[], r5: R[],
  obs: Partial<Record<string, string>> = {}
): AuditSection[] {
  const mk = (
    id: string, name: string, labels: string[], maxScore: number, responses: R[]
  ): AuditSection => {
    const points: AuditPoint[] = labels.map((label, i) => {
      const pid = `${id}_${i + 1}`;
      return { id: pid, label, response: responses[i] ?? null, observation: obs[pid] ?? '' };
    });
    const oN = points.filter(p => p.response === 'O').length;
    const nN = points.filter(p => p.response === 'N').length;
    const t = oN + nN;
    return { id, name, score: t > 0 ? Math.round((oN / t) * maxScore) : 0, maxScore, points };
  };

  return [
    mk('s1', 'Arrivée et stationnement',  S1_LABELS, 8,  r1),
    mk('s2', 'Accueil et billetterie',     S2_LABELS, 9,  r2),
    mk('s3', 'Circulation intérieure',     S3_LABELS, 10, r3),
    mk('s4', 'Sanitaires',                 S4_LABELS, 7,  r4),
    mk('s5', 'Espaces de visite',          S5_LABELS, 7,  r5),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// VENUES
// ─────────────────────────────────────────────────────────────────────────────

export const venues: Venue[] = [
  {
    id: '1',
    name: 'Palais des Beaux-Arts de Lille',
    type: 'Musée',
    address: '18 Pl. de la République',
    city: 'Lille',
    postalCode: '59000',
    score: 'A',
    scoreValue: 92,
    rating: 4.8,
    reviewCount: 247,
    bgColor: '#8FA0D8',
    bgColor2: '#6B7EC8',
    photo: '/images/venue-1.jpg',
    description: "Le Palais des Beaux-Arts de Lille est l'un des plus grands musées de France. Il offre une expérience culturelle complète et entièrement accessible à toutes les personnes en situation de handicap.",
    accessibilityFeatures: ['Fauteuil roulant', 'Non-voyant', 'Malentendant', 'Cognitif'],
    distance: '0.3 km',
    lat: 50.63264,
    lng: 3.06099,
    equipment: [
      { id: 'e1', name: 'Fauteuil roulant', icon: '♿', total: 8, available: 5, reserved: 3, maintenance: 0 },
      { id: 'e2', name: 'Fauteuil électrique', icon: '🦽', total: 3, available: 2, reserved: 1, maintenance: 0 },
      { id: 'e3', name: 'Guide audio', icon: '🎧', total: 20, available: 14, reserved: 6, maintenance: 0 },
      { id: 'e4', name: 'Boucle magnétique', icon: '🔊', total: 5, available: 5, reserved: 0, maintenance: 0 },
    ],
    // A — 92 % : 38 O / 3 N
    sections: buildSections(
      ['O','O','O','O','O','N','O','O'],         // s1 : 7O 1N (dévers légèrement > 2 %)
      ['O','O','O','O','O','O','O','O','N'],      // s2 : 8O 1N (plan braille non disponible)
      ['O','O','O','O','O','O','O','O','N','O'],  // s3 : 9O 1N (podotactiles partiels)
      ['O','O','O','O','O','O','O'],              // s4 : 7O
      ['O','O','O','O','O','O','O'],              // s5 : 7O
      {
        's1_6': 'Dévers mesuré à 2,3 % sur le passage principal',
        's2_9': 'Plan en braille non disponible — à commander',
        's3_9': 'Bandes podotactiles présentes au RDC uniquement',
      }
    ),
  },
  {
    id: '2',
    name: 'Cinéma UGC Ciné Cité Lille',
    type: 'Cinéma',
    address: '40 Av. du Peuple Belge',
    city: 'Lille',
    postalCode: '59000',
    score: 'A',
    scoreValue: 88,
    rating: 4.5,
    reviewCount: 183,
    bgColor: '#FF8400',
    bgColor2: '#E67600',
    photo: '/images/venue-2.jpg',
    description: "Cinéma moderne équipé de toutes les technologies d'accessibilité : boucles magnétiques, places réservées, sous-titres SME, audiodescription.",
    accessibilityFeatures: ['Fauteuil roulant', 'Malentendant', 'Non-voyant'],
    distance: '0.8 km',
    lat: 50.63802,
    lng: 3.05918,
    equipment: [
      { id: 'e5', name: 'Fauteuil roulant', icon: '♿', total: 6, available: 4, reserved: 2, maintenance: 0 },
      { id: 'e6', name: 'Boucle magnétique', icon: '🔊', total: 10, available: 8, reserved: 2, maintenance: 0 },
      { id: 'e7', name: 'Guide audio', icon: '🎧', total: 15, available: 10, reserved: 5, maintenance: 0 },
    ],
    // A — 88 % : 36 O / 5 N
    sections: buildSections(
      ['O','N','O','O','O','O','O','N'],         // s1 : 6O 2N (pas de place PMR dédiée)
      ['O','O','O','O','O','O','O','O','N'],      // s2 : 8O 1N
      ['O','O','O','O','O','O','O','O','O','N'],  // s3 : 9O 1N (pas d'assises dans les couloirs)
      ['O','O','O','O','O','O','O'],              // s4 : 7O
      ['O','O','O','N','O','O','O'],              // s5 : 6O 1N (contenus FALC inexistants)
      {
        's1_2': 'Pas de place PMR marquée — utilise places riveraines',
        's1_8': 'Entrée PMR non signalée — même entrée que le public',
        's3_10': 'Aucune assise dans les couloirs menant aux salles',
        's5_4': 'Aucun contenu en braille ou FALC disponible',
      }
    ),
  },
  {
    id: '3',
    name: "Piscine de l'Ilot",
    type: 'Piscine',
    address: '2 Rue du Lombard',
    city: 'Amiens',
    postalCode: '80000',
    score: 'B',
    scoreValue: 65,
    rating: 3.9,
    reviewCount: 94,
    bgColor: '#22C55E',
    bgColor2: '#16A34A',
    photo: '/images/venue-3.jpg',
    description: 'Piscine municipale avec équipements adaptés. Certains aménagements sont en cours de mise aux normes PMR.',
    accessibilityFeatures: ['Fauteuil roulant', 'Cognitif'],
    distance: '2.1 km',
    lat: 49.89476,
    lng: 2.29813,
    equipment: [
      { id: 'e8', name: 'Fauteuil roulant', icon: '♿', total: 4, available: 2, reserved: 1, maintenance: 1 },
      { id: 'e9', name: 'Déambulateur', icon: '🦯', total: 3, available: 3, reserved: 0, maintenance: 0 },
    ],
    // B — 65 % : 27 O / 14 N
    sections: buildSections(
      ['O','N','O','O','N','N','O','O'],          // s1 : 5O 3N
      ['O','O','N','N','O','N','O','O','N'],       // s2 : 5O 4N
      ['O','O','N','N','N','O','N','O','N','O'],   // s3 : 5O 5N
      ['O','O','O','O','O','N','O'],               // s4 : 6O 1N
      ['O','O','O','O','N','O','N'],               // s5 : 5O 2N
      {
        's1_2': 'Place PMR trop étroite — 2,80 m mesurés',
        's1_5': 'Pente > 5 % sur le cheminement principal',
        's1_6': 'Dévers non conforme sur 15 m',
        's2_3': 'Porte d\'entrée : ouverture manuelle, poignée difficile',
        's2_4': 'Comptoir à hauteur standard uniquement (90 cm)',
        's2_6': 'Boucle magnétique absente à la caisse',
        's2_9': 'Aucun document accessible disponible',
        's3_3': 'Vestiaires PMR au sous-sol sans ascenseur',
        's3_4': 'Rampe d\'accès aux vestiaires à 9 % — non conforme',
        's3_5': 'Main courante d\'un seul côté',
        's3_7': 'Pas d\'ascenseur — vestiaires inaccessibles si escalier',
        's3_9': 'Aucune bande podotactile',
        's4_6': 'Lavabo sans espace libre sous la vasque',
        's5_5': 'Aucun guide audio ni médiation sonore',
        's5_7': 'Allées partiellement encombrées de matériel',
      }
    ),
  },
  {
    id: '4',
    name: 'Théâtre du Nord',
    type: 'Théâtre',
    address: 'Pl. du Général de Gaulle',
    city: 'Lille',
    postalCode: '59000',
    score: 'A',
    scoreValue: 90,
    rating: 4.7,
    reviewCount: 312,
    bgColor: '#8B5CF6',
    bgColor2: '#7C3AED',
    photo: '/images/venue-4.jpg',
    description: 'Théâtre national du Nord, pleinement accessible. Spectacles avec audiodescription, surtitres et interprétation en LSF disponibles.',
    accessibilityFeatures: ['Fauteuil roulant', 'Non-voyant', 'Malentendant', 'LSF'],
    distance: '0.5 km',
    lat: 50.63659,
    lng: 3.06369,
    equipment: [
      { id: 'e10', name: 'Fauteuil roulant', icon: '♿', total: 10, available: 7, reserved: 3, maintenance: 0 },
      { id: 'e11', name: 'Boucle magnétique', icon: '🔊', total: 8, available: 6, reserved: 2, maintenance: 0 },
      { id: 'e12', name: 'Guide audio', icon: '🎧', total: 25, available: 20, reserved: 5, maintenance: 0 },
    ],
    // A — 90 % : 37 O / 4 N
    sections: buildSections(
      ['O','O','O','O','O','O','O','N'],          // s1 : 7O 1N (signalétique entrée PMR absente)
      ['O','O','O','O','O','O','O','O','O'],       // s2 : 9O
      ['O','O','O','O','O','O','O','O','N','O'],   // s3 : 9O 1N
      ['O','O','O','O','O','O','O'],               // s4 : 7O
      ['O','O','O','O','N','O','N'],               // s5 : 5O 2N
      {
        's1_8': 'Entrée PMR non signalée depuis la place du Général de Gaulle',
        's3_9': 'Podotactiles absents à l\'entrée des rangs',
        's5_5': 'Audiodescription disponible uniquement sur certains spectacles',
        's5_7': 'Allées de 1,20 m entre les rangs — en deçà des 1,40 m',
      }
    ),
  },
  {
    id: '5',
    name: 'Médiathèque Jean Lévy',
    type: 'Médiathèque',
    address: '32 bis Rue Edouard Delesalle',
    city: 'Lille',
    postalCode: '59000',
    score: 'B',
    scoreValue: 72,
    rating: 4.2,
    reviewCount: 156,
    bgColor: '#F59E0B',
    bgColor2: '#D97706',
    photo: '/images/venue-5.jpg',
    description: 'Médiathèque centrale de Lille avec fonds adaptés : livres braille, audio, FALC. Accessibilité partielle, travaux prévus en 2025.',
    accessibilityFeatures: ['Fauteuil roulant', 'Non-voyant', 'Cognitif'],
    distance: '1.2 km',
    lat: 50.62897,
    lng: 3.06694,
    equipment: [
      { id: 'e13', name: 'Fauteuil roulant', icon: '♿', total: 3, available: 3, reserved: 0, maintenance: 0 },
      { id: 'e14', name: 'Guide audio', icon: '🎧', total: 8, available: 5, reserved: 3, maintenance: 0 },
    ],
    // B — 72 % : 30 O / 11 N
    sections: buildSections(
      ['O','O','N','O','O','N','O','N'],          // s1 : 5O 3N
      ['O','O','O','N','O','N','O','O','N'],       // s2 : 6O 3N
      ['O','O','O','N','O','O','N','O','N','O'],   // s3 : 7O 3N
      ['O','O','O','O','O','O','N'],               // s4 : 6O 1N
      ['O','O','O','N','O','O','O'],               // s5 : 6O 1N
      {
        's1_3': 'Signalétique directionnelle absente depuis le parking',
        's1_6': 'Dévers non mesuré — probablement non conforme côté rue',
        's1_8': 'Entrée PMR non distincte mais non signalée',
        's2_4': 'Comptoir sans section basse — travaux prévus',
        's2_6': 'Boucle magnétique absente à l\'accueil',
        's2_9': 'Plan du lieu non disponible en braille',
        's3_4': 'Rampe accès à l\'étage : pente estimée à 6 %',
        's3_7': 'Ascenseur parfois hors service — alternative non prévue',
        's3_9': 'Aucune bande podotactile',
        's4_7': "Pas de bouton d'appel d'urgence dans les WC PMR",
        's5_4': 'Fonds FALC et braille présents mais non mis en avant',
      }
    ),
  },
  {
    id: '6',
    name: 'Musée de la Chartreuse',
    type: 'Musée',
    address: 'Rue de la Chartreuse',
    city: 'Douai',
    postalCode: '59500',
    score: 'C',
    scoreValue: 38,
    rating: 3.2,
    reviewCount: 67,
    bgColor: '#EF4444',
    bgColor2: '#DC2626',
    photo: '/images/venue-6.jpg',
    description: "Musée dans un bâtiment historique du XVIe siècle. L'accessibilité est limitée en raison des contraintes architecturales du patrimoine classé.",
    accessibilityFeatures: ['Partiel'],
    distance: '32 km',
    lat: 50.37152,
    lng: 3.07683,
    equipment: [
      { id: 'e15', name: 'Fauteuil roulant', icon: '♿', total: 2, available: 1, reserved: 0, maintenance: 1 },
    ],
    // C — 38 % : 16 O / 25 N  (bâtiment classé, contraintes fortes)
    sections: buildSections(
      ['O','N','O','O','O','N','O','N'],          // s1 : 5O 3N
      ['N','O','N','N','O','N','N','O','N'],       // s2 : 3O 6N
      ['O','N','N','N','N','N','N','N','N','N'],   // s3 : 1O 9N (escaliers historiques, pas d'ascenseur)
      ['N','N','N','N','N','N','N'],               // s4 : 0O 7N (WC PMR inexistants)
      ['O','O','O','N','N','O','O'],               // s5 : 5O 2N
      {
        's1_2': 'Place PMR absent — rue pavée sans marquage',
        's1_6': 'Pavés irréguliers — dévers impossible à mesurer',
        's1_8': 'Aucune signalétique PMR visible',
        's2_1': 'Escalier de 5 marches à l\'entrée principale — rampe absente',
        's2_3': 'Porte ancienne étroite (72 cm de passage utile)',
        's2_4': 'Comptoir d\'accueil non adapté — hauteur 95 cm',
        's2_5': 'Espace de manœuvre insuffisant (couloir 1,10 m)',
        's2_6': 'Boucle magnétique absente',
        's2_9': 'Aucun document accessible',
        's3_2': 'Seuils et ressauts multiples dans tout le bâtiment',
        's3_3': 'Niveaux non traités — escaliers uniquement',
        's3_4': 'Rampe provisoire à 12 % — non conforme',
        's3_5': 'Main courante d\'un seul côté',
        's3_6': 'Ascenseur impossible à installer — bâtiment classé MH',
        's3_7': 'Sans objet (pas d\'ascenseur)',
        's3_8': 'Sans objet',
        's3_9': 'Aucune bande podotactile',
        's3_10': 'Aucune assise dans les circulations',
        's4_1': 'WC PMR inexistant',
        's4_2': 'WC standard uniquement — porte 65 cm',
        's4_3': 'Espace insuffisant (WC standard)',
        's4_4': 'Barre d\'appui absente',
        's4_5': 'Hauteur standard non adaptée',
        's4_6': 'Lavabo standard — espace libre insuffisant',
        's4_7': "Dispositif d'appel absent",
        's5_4': 'Aucun contenu braille ou FALC',
        's5_5': 'Aucun audioguide disponible',
      }
    ),
  },
  {
    id: '7',
    name: 'Stade Pierre-Mauroy',
    type: 'Stade',
    address: '261 Bd de Tournai',
    city: "Villeneuve-d'Ascq",
    postalCode: '59650',
    score: 'A',
    scoreValue: 95,
    rating: 4.9,
    reviewCount: 423,
    bgColor: '#0B0829',
    bgColor2: '#1A1640',
    photo: '/images/venue-7.jpg',
    description: "Stade moderne de 50 000 places, modèle d'accessibilité en France. Places PMR réparties sur tous les secteurs, rampes automatiques.",
    accessibilityFeatures: ['Fauteuil roulant', 'Non-voyant', 'Malentendant', 'Cognitif'],
    distance: '5.2 km',
    lat: 50.61226,
    lng: 3.13024,
    equipment: [
      { id: 'e16', name: 'Fauteuil roulant', icon: '♿', total: 20, available: 15, reserved: 5, maintenance: 0 },
      { id: 'e17', name: 'Fauteuil électrique', icon: '🦽', total: 5, available: 4, reserved: 1, maintenance: 0 },
      { id: 'e18', name: 'Boucle magnétique', icon: '🔊', total: 15, available: 12, reserved: 3, maintenance: 0 },
      { id: 'e19', name: 'Guide audio', icon: '🎧', total: 30, available: 25, reserved: 5, maintenance: 0 },
    ],
    // A — 95 % : 39 O / 2 N
    sections: buildSections(
      ['O','O','O','O','O','O','O','O'],          // s1 : 8O
      ['O','O','O','O','O','O','O','O','N'],       // s2 : 8O 1N
      ['O','O','O','O','O','O','O','O','O','O'],   // s3 : 10O
      ['O','O','O','O','O','O','O'],               // s4 : 7O
      ['O','O','O','N','O','O','O'],               // s5 : 6O 1N
      {
        's2_9': 'Plan en braille non fourni — plans visuels haute qualité disponibles',
        's5_4': 'Contenus FALC absents — audiodescription et commentaire vocal disponibles',
      }
    ),
  },
  {
    id: '8',
    name: 'Forum des Sciences',
    type: 'Centre culturel',
    address: "1 Pl. de l'Hôtel de Ville",
    city: "Villeneuve-d'Ascq",
    postalCode: '59650',
    score: 'B',
    scoreValue: 70,
    rating: 4.1,
    reviewCount: 128,
    bgColor: '#06B6D4',
    bgColor2: '#0891B2',
    photo: '/images/venue-8.jpg',
    description: "Centre de culture scientifique avec ateliers adaptés. Accessibilité correcte mais certaines salles restent difficiles d'accès.",
    accessibilityFeatures: ['Fauteuil roulant', 'Cognitif'],
    distance: '4.8 km',
    lat: 50.61581,
    lng: 3.14127,
    equipment: [
      { id: 'e20', name: 'Fauteuil roulant', icon: '♿', total: 5, available: 3, reserved: 1, maintenance: 1 },
      { id: 'e21', name: 'Déambulateur', icon: '🦯', total: 4, available: 4, reserved: 0, maintenance: 0 },
      { id: 'e22', name: 'Guide audio', icon: '🎧', total: 12, available: 8, reserved: 4, maintenance: 0 },
    ],
    // B — 70 % : 29 O / 12 N
    sections: buildSections(
      ['O','O','O','N','O','N','O','N'],          // s1 : 5O 3N
      ['O','O','O','O','O','N','O','N','N'],       // s2 : 6O 3N
      ['O','O','O','O','N','O','O','N','N','O'],   // s3 : 7O 3N
      ['O','O','O','O','O','O','N'],               // s4 : 6O 1N
      ['O','O','O','N','O','O','N'],               // s5 : 5O 2N
      {
        's1_4': 'Revêtement de sol glissant par temps de pluie',
        's1_6': 'Dévers estimé à 3 % sur le parvis côté nord',
        's1_8': 'Signalétique entrée PMR présente mais peu visible',
        's2_6': 'Boucle magnétique en panne depuis mars — signalement effectué',
        's2_8': 'Personnel non formé dans l\'aile est',
        's2_9': 'Plan accessible non disponible',
        's3_5': 'Main courante absente du côté gauche de l\'escalier principal',
        's3_9': 'Bandes podotactiles absentes dans l\'aile est',
        's3_10': 'Assises insuffisantes — une seule zone de repos',
        's4_7': "Bouton d'appel d'urgence présent mais non testé lors de la visite",
        's5_4': 'Aucun contenu en braille ni FALC',
        's5_7': 'Allées < 1,40 m dans l\'exposition temporaire',
      }
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RESERVATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const reservations: Reservation[] = [
  {
    id: 'r1',
    visitorName: 'Marie Dupont',
    visitorEmail: 'marie.dupont@email.fr',
    venueId: '1',
    venueName: 'Palais des Beaux-Arts de Lille',
    equipmentId: 'e1',
    equipmentName: 'Fauteuil roulant',
    equipmentIcon: '♿',
    date: '2026-04-25',
    time: '14:00',
    status: 'confirmée',
    qrCode: 'QR-2026-R1-PBA',
  },
  {
    id: 'r2',
    visitorName: 'Marie Dupont',
    visitorEmail: 'marie.dupont@email.fr',
    venueId: '4',
    venueName: 'Théâtre du Nord',
    equipmentId: 'e12',
    equipmentName: 'Guide audio',
    equipmentIcon: '🎧',
    date: '2026-05-03',
    time: '20:00',
    status: 'en attente',
    qrCode: 'QR-2026-R2-TDN',
  },
  {
    id: 'r3',
    visitorName: 'Marie Dupont',
    visitorEmail: 'marie.dupont@email.fr',
    venueId: '2',
    venueName: 'Cinéma UGC Ciné Cité Lille',
    equipmentId: 'e6',
    equipmentName: 'Boucle magnétique',
    equipmentIcon: '🔊',
    date: '2026-04-30',
    time: '18:30',
    status: 'confirmée',
    qrCode: 'QR-2026-R3-UGC',
  },
  {
    id: 'r4',
    visitorName: 'Marie Dupont',
    visitorEmail: 'marie.dupont@email.fr',
    venueId: '7',
    venueName: 'Stade Pierre-Mauroy',
    equipmentId: 'e16',
    equipmentName: 'Fauteuil roulant',
    equipmentIcon: '♿',
    date: '2026-03-15',
    time: '15:00',
    status: 'terminée',
    qrCode: 'QR-2026-R4-SPM',
  },
  {
    id: 'r5',
    visitorName: 'Marie Dupont',
    visitorEmail: 'marie.dupont@email.fr',
    venueId: '5',
    venueName: 'Médiathèque Jean Lévy',
    equipmentId: 'e14',
    equipmentName: 'Guide audio',
    equipmentIcon: '🎧',
    date: '2026-03-08',
    time: '10:00',
    status: 'terminée',
    qrCode: 'QR-2026-R5-MJL',
  },
  {
    id: 'r6',
    visitorName: 'Paul Martin',
    visitorEmail: 'paul.martin@email.fr',
    venueId: '1',
    venueName: 'Palais des Beaux-Arts de Lille',
    equipmentId: 'e3',
    equipmentName: 'Guide audio',
    equipmentIcon: '🎧',
    date: '2026-04-19',
    time: '16:00',
    status: 'confirmée',
    qrCode: 'QR-2026-R6-PBA',
  },
];

export const managerReservations: Reservation[] = [
  {
    id: 'mr1',
    visitorName: 'Sophie Bernard',
    visitorEmail: 'sophie.b@email.fr',
    venueId: '1',
    venueName: 'Palais des Beaux-Arts de Lille',
    equipmentId: 'e1',
    equipmentName: 'Fauteuil roulant',
    equipmentIcon: '♿',
    date: '2026-04-19',
    time: '14:00',
    status: 'confirmée',
    qrCode: 'QR-MR1',
  },
  {
    id: 'mr2',
    visitorName: 'Antoine Leroy',
    visitorEmail: 'a.leroy@email.fr',
    venueId: '1',
    venueName: 'Palais des Beaux-Arts de Lille',
    equipmentId: 'e3',
    equipmentName: 'Guide audio',
    equipmentIcon: '🎧',
    date: '2026-04-19',
    time: '16:00',
    status: 'confirmée',
    qrCode: 'QR-MR2',
  },
  {
    id: 'mr3',
    visitorName: 'Isabelle Moreau',
    visitorEmail: 'i.moreau@email.fr',
    venueId: '1',
    venueName: 'Palais des Beaux-Arts de Lille',
    equipmentId: 'e2',
    equipmentName: 'Fauteuil électrique',
    equipmentIcon: '🦽',
    date: '2026-04-20',
    time: '10:00',
    status: 'en attente',
    qrCode: 'QR-MR3',
  },
  {
    id: 'mr4',
    visitorName: 'François Petit',
    visitorEmail: 'f.petit@email.fr',
    venueId: '1',
    venueName: 'Palais des Beaux-Arts de Lille',
    equipmentId: 'e1',
    equipmentName: 'Fauteuil roulant',
    equipmentIcon: '♿',
    date: '2026-04-20',
    time: '14:00',
    status: 'en attente',
    qrCode: 'QR-MR4',
  },
  {
    id: 'mr5',
    visitorName: 'Claire Dubois',
    visitorEmail: 'c.dubois@email.fr',
    venueId: '1',
    venueName: 'Palais des Beaux-Arts de Lille',
    equipmentId: 'e4',
    equipmentName: 'Boucle magnétique',
    equipmentIcon: '🔊',
    date: '2026-04-18',
    time: '15:00',
    status: 'terminée',
    qrCode: 'QR-MR5',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MISSIONS D'AUDIT
// ─────────────────────────────────────────────────────────────────────────────

export const auditMissions: AuditMission[] = [
  {
    id: 'am1',
    venueId: '6',
    venueName: 'Musée de la Chartreuse',
    venueAddress: 'Rue de la Chartreuse',
    venueCity: 'Douai',
    date: '2026-04-22',
    auditorName: 'Thomas Audibert',
    status: 'assignée',
    sectionsCompleted: 0,
    sectionsTotal: 5,
    score: 'C',
    scoreValue: 38,
  },
  {
    id: 'am2',
    venueId: '3',
    venueName: "Piscine de l'Ilot",
    venueAddress: '2 Rue du Lombard',
    venueCity: 'Amiens',
    date: '2026-04-20',
    auditorName: 'Thomas Audibert',
    status: 'en cours',
    sectionsCompleted: 3,
    sectionsTotal: 5,
    score: 'B',
    scoreValue: 65,
  },
  {
    id: 'am3',
    venueId: '5',
    venueName: 'Médiathèque Jean Lévy',
    venueAddress: '32 bis Rue Edouard Delesalle',
    venueCity: 'Lille',
    date: '2026-04-15',
    auditorName: 'Thomas Audibert',
    status: 'en cours',
    sectionsCompleted: 2,
    sectionsTotal: 5,
    score: 'B',
    scoreValue: 72,
  },
  {
    id: 'am4',
    venueId: '8',
    venueName: 'Forum des Sciences',
    venueAddress: "1 Pl. de l'Hôtel de Ville",
    venueCity: "Villeneuve-d'Ascq",
    date: '2026-03-28',
    auditorName: 'Thomas Audibert',
    status: 'terminée',
    sectionsCompleted: 5,
    sectionsTotal: 5,
    score: 'B',
    scoreValue: 70,
  },
  {
    id: 'am5',
    venueId: '1',
    venueName: 'Palais des Beaux-Arts de Lille',
    venueAddress: '18 Pl. de la République',
    venueCity: 'Lille',
    date: '2026-03-10',
    auditorName: 'Thomas Audibert',
    status: 'terminée',
    sectionsCompleted: 5,
    sectionsTotal: 5,
    score: 'A',
    scoreValue: 92,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AVIS VISITEURS
// ─────────────────────────────────────────────────────────────────────────────

export const reviews = [
  {
    id: 'rev1',
    venueId: '1',
    author: 'Hélène M.',
    rating: 5,
    date: '2026-03-15',
    comment: "Accueil exceptionnel, les fauteuils roulants sont en parfait état et le personnel est très attentionné. Je recommande vivement !",
    accessibilityType: 'Fauteuil roulant',
  },
  {
    id: 'rev2',
    venueId: '1',
    author: 'Pierre G.',
    rating: 5,
    date: '2026-02-28',
    comment: "L'audioguide est d'excellente qualité pour les personnes malvoyantes. Toutes les œuvres sont bien décrites.",
    accessibilityType: 'Non-voyant',
  },
  {
    id: 'rev3',
    venueId: '2',
    author: 'Lucie K.',
    rating: 4,
    date: '2026-03-20',
    comment: 'Boucle magnétique fonctionnelle dans toutes les salles. Très bonne expérience pour les malentendants.',
    accessibilityType: 'Malentendant',
  },
  {
    id: 'rev4',
    venueId: '3',
    author: 'Jean-Paul R.',
    rating: 4,
    date: '2026-01-10',
    comment: "Bonne accessibilité pour la piscine, mais le parking PMR est trop loin de l'entrée. À améliorer.",
    accessibilityType: 'Fauteuil roulant',
  },
];
