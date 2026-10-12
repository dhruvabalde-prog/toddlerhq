export interface CityHub {
  city: string;
  state: string;
  localities: {
    locality: string;
    pincode: string;
    tier: string;
  }[];
}

export const INDIAN_PRESCHOOL_HUBS: CityHub[] = [
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    localities: [
      { locality: 'Koramangala 4th Block', pincode: '560034', tier: 'Prime Tier-1' },
      { locality: 'Indiranagar 100ft Road', pincode: '560038', tier: 'Prime Tier-1' },
      { locality: 'Whitefield (ITPL Road)', pincode: '560066', tier: 'High-Growth Tech Corridor' },
      { locality: 'HSR Layout Sector 2', pincode: '560102', tier: 'High-Density Residential' },
      { locality: 'Jayanagar 4th T Block', pincode: '560041', tier: 'Established Heritage' },
      { locality: 'Sarjapur Road (Near Wipro)', pincode: '560035', tier: 'Young Families Corridor' }
    ]
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    localities: [
      { locality: 'Bandra West (Pali Hill)', pincode: '400050', tier: 'Prime Tier-1' },
      { locality: 'Juhu Scheme', pincode: '400049', tier: 'Prime Tier-1' },
      { locality: 'Powai (Hiranandani Gardens)', pincode: '400076', tier: 'High-Tech Urban' },
      { locality: 'Andheri West (Lokhandwala)', pincode: '400053', tier: 'Dense Residential' },
      { locality: 'Thane West (Ghodbunder Road)', pincode: '400615', tier: 'New Families Suburb' }
    ]
  },
  {
    city: 'Delhi NCR',
    state: 'Delhi / Haryana',
    localities: [
      { locality: 'Gurugram Sector 54 (Golf Course Rd)', pincode: '122002', tier: 'Prime Corporate' },
      { locality: 'South Delhi (Vasant Vihar)', pincode: '110057', tier: 'Diplomatic & Ultra-Prime' },
      { locality: 'Noida Sector 50', pincode: '201301', tier: 'Planned Residential' },
      { locality: 'Gurugram Sector 57 (Hong Kong Bazaar)', pincode: '122003', tier: 'Young Families Hub' },
      { locality: 'Faridabad Sector 15', pincode: '121007', tier: 'Mature Urban' }
    ]
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    localities: [
      { locality: 'Jubilee Hills Check Post', pincode: '500033', tier: 'Ultra-Prime' },
      { locality: 'Gachibowli Financial District', pincode: '500032', tier: 'High-Tech Corridor' },
      { locality: 'Madhapur (Hitec City)', pincode: '500081', tier: 'Tech Professionals' },
      { locality: 'Kondapur (Botanical Garden)', pincode: '500084', tier: 'Young Family Hub' }
    ]
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    localities: [
      { locality: 'Kalyani Nagar', pincode: '411006', tier: 'Prime Residential' },
      { locality: 'Baner (High Street)', pincode: '411045', tier: 'Tech & Modern Families' },
      { locality: 'Wakad (Datta Mandir)', pincode: '411057', tier: 'High-Growth Tech' },
      { locality: 'Koregaon Park (Lane 7)', pincode: '411001', tier: 'Heritage Prime' }
    ]
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    localities: [
      { locality: 'Adyar (Gandhi Nagar)', pincode: '600020', tier: 'Prime Coastal' },
      { locality: 'Anna Nagar West', pincode: '600040', tier: 'Established Metro' },
      { locality: 'OMR (Thoraipakkam)', pincode: '600097', tier: 'IT Expressway Corridor' },
      { locality: 'Velachery Bypass', pincode: '600042', tier: 'Dense Family Hub' }
    ]
  }
];

export interface RecommendedVendorCategory {
  category: string;
  name: string;
  recommendedSpecs: string;
  mandatorySafetyStandard: string;
  leadTimeWeeks: number;
  estimatedCostRange: string;
  typicalItems: string[];
}

export const RECOMMENDED_VENDOR_CATEGORIES: RecommendedVendorCategory[] = [
  {
    category: 'EVA Foam Flooring',
    name: 'High-Density Anti-Microbial Interlocking Foam Tiles',
    recommendedSpecs: '25mm thickness, 45 Shore C density, anti-fungal, non-porous washable surface with puzzle border bevels',
    mandatorySafetyStandard: 'EN71 Part 3, ASTM F963-17 non-toxic heavy metal free, RoHS Compliant',
    leadTimeWeeks: 1,
    estimatedCostRange: '₹45,000 - ₹90,000 per 1000 sq ft',
    typicalItems: [
      '25mm Dual-Tone EVA Interlocking Tiles (1m x 1m)',
      'Beveled Edge Ramp Borders for Wheelchair & Toddler Stroller Entry',
      'Tactile Sensory Texture Foam Mats'
    ]
  },
  {
    category: 'Childproofing Hardware',
    name: 'Specialist Preschool Edge & Pinch Guard Systems',
    recommendedSpecs: 'Continuous transparent accordion hinge guards, NBR extra-thick foam corner bumpers, magnetic hidden latches',
    mandatorySafetyStandard: 'BIS IS 9873 compliant, 3M industrial double-stick non-residue mounting',
    leadTimeWeeks: 1,
    estimatedCostRange: '₹22,000 - ₹45,000 per campus',
    typicalItems: [
      'Door Pinch Guards (Hinge-side 180° continuous bellows)',
      'Cabinet Magnetic Childproof Latches with Key Dongle',
      'Soft Rubber Corner Cushions for Low Tables and Window Sills',
      'IP54 Spring-Loaded Safety Electrical Socket Cover Plates'
    ]
  },
  {
    category: 'Multi-Split ACs & HEPA Filtration',
    name: 'Classroom Air Quality & Climate Conditioning Units',
    recommendedSpecs: '5-Star Inverter 1.5T units with integrated PM2.5 filter mesh and silent whisper mode (<24dB)',
    mandatorySafetyStandard: 'BEE 5-Star Energy Star, Anti-Viral Ionizer Cert',
    leadTimeWeeks: 2,
    estimatedCostRange: '₹1,60,000 - ₹3,20,000 (3-5 units)',
    typicalItems: [
      '1.5 Ton Inverter Multi-Split Air Conditioning Units',
      'Medical Grade True HEPA H13 Air Purifiers for Sleeping Nap Lounges',
      'Continuous Digital Indoor Air Quality (AQI) Sensor Displays'
    ]
  },
  {
    category: 'Fire Safety Refills & Suppression',
    name: 'Campus Fire NOC & Evacuation Gear',
    recommendedSpecs: 'ABC Dry Chemical Powder 4kg & Clean Agent Fire Extinguishers, photoluminescent exit signage',
    mandatorySafetyStandard: 'IS 15683, National Building Code (NBC) 2016 Part 4 Educational Occupancy',
    leadTimeWeeks: 1,
    estimatedCostRange: '₹18,000 - ₹35,000 per campus',
    typicalItems: [
      '4kg ABC MAP 90 Dry Powder Fire Extinguishers (Every 500 sq ft)',
      '2kg CO2 Clean Agent Extinguisher for Server & Kitchen Station',
      'Low-Level Photoluminescent Glow-in-the-Dark Emergency Evacuation Signs',
      'Battery-Backed Standalone Photoelectric Optical Smoke Alarms'
    ]
  },
  {
    category: 'Child-Safe Wooden Play Furniture',
    name: 'Ergonomic Birch Plywood Tables, Storage Cubbies & Chairs',
    recommendedSpecs: 'FSC-certified Birch Multiplex with rounded 20mm edge fillets, food-grade water-based non-toxic lacquer',
    mandatorySafetyStandard: 'EN 1729-1 (Educational Furniture for Preschools), Zero Formaldehyde E0',
    leadTimeWeeks: 3,
    estimatedCostRange: '₹1,20,000 - ₹2,80,000',
    typicalItems: [
      'Crescent & Flower Shaped Adjustable Sensory Group Tables',
      'Montessori Open Wooden Low-Height Toy Shelves (3-tier)',
      'Ergonomic Posture Wooden Chairs (Seat Height 26cm)',
      'Individual Toddler Cubby Lockers with Photo Inserts'
    ]
  },
  {
    category: 'CCTV & Biometric Campus Gate',
    name: 'Zero-Blindspot Surveillance & Access Management',
    recommendedSpecs: '4MP IP Dome Cameras with audio recording, 30-day continuous cloud/NVR storage, parent app link',
    mandatorySafetyStandard: 'MeitY Safety Certification, NDAA Compliant hardware',
    leadTimeWeeks: 2,
    estimatedCostRange: '₹75,000 - ₹1,50,000',
    typicalItems: [
      '4MP Wide-Angle IP Dome Night-Vision Cameras (Classrooms, Passages, Gates)',
      'RFID & Biometric Magnetic Turnstile Lock for Main Entry Gate',
      'NVR 16-Channel with 4TB Surveillance Hard Drives'
    ]
  }
];

export const LOCAL_HIRING_POOLS = [
  {
    role: 'Montessori / ECCE Lead Educator',
    qualification: 'Certified Early Childhood Care & Education (ECCE) or AMI Montessori Diploma with minimum 2 years classroom experience',
    compensationBenchmark: '₹28,000 - ₹42,000 / month',
    verificationsRequired: ['Aadhaar Card', 'Police Clearance Certificate', 'Medical Fitness Cert', 'Degree Verification']
  },
  {
    role: 'Assistant Educator / Co-Teacher',
    qualification: 'Bachelor’s degree with NTT (Nursery Teacher Training) certification and fluency in English and local vernacular',
    compensationBenchmark: '₹18,000 - ₹26,000 / month',
    verificationsRequired: ['Aadhaar Card', 'Police Clearance Certificate', 'Prior School Reference']
  },
  {
    role: 'Ayah / Daycare Caregiver (Support Staff)',
    qualification: 'Experienced in infant handling, diaper changing protocols, hygiene sanitization, and warm demeanor',
    compensationBenchmark: '₹14,000 - ₹19,000 / month',
    verificationsRequired: ['Aadhaar Card', 'Police Background Verification (MANDATORY)', 'Hepatitis B Vaccination Proof', 'Medical Screening']
  },
  {
    role: 'Campus Security Guard',
    qualification: 'Ex-paramilitary or licensed security agency verified guard with rigorous training in visitor entry protocol',
    compensationBenchmark: '₹16,000 - ₹22,000 / month',
    verificationsRequired: ['Agency Police Verification', 'Drug Screening', 'Aadhaar Verification', 'Gate Log Training']
  }
];
