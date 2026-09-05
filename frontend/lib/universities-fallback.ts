export interface ProgramItem {
  id: string;
  name: string;
  degree?: string;
  shortCode?: string;
  duration?: string;
  seats?: number;
  description?: string;
}

export interface CircularItem {
  id: string;
  title: string;
  unit: string;
  year?: number;
  officialUrl?: string;
  summary?: string;
}

export interface FacilityItem {
  title: string;
  icon?: string;
  description: string;
}

export interface UniversityItem {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  location: string;
  logo: string;
  foundedYear?: number;
  admissionType?: string;
  cutoffMarks?: number;
  group?: string;
  website?: string;
  description?: string;
  campusArea?: string;
  studentCount?: string;
  facultyCount?: string;
  hallsCount?: string;
  culture?: string;
  status?: string;
  units?: string;
  seats?: number;
  minGpa?: string;
  testDate?: string;
  applicationWindow?: string;
  circularUrl?: string;
  programs?: ProgramItem[];
  circulars?: CircularItem[];
  facilities?: FacilityItem[];
}

export const FALLBACK_UNIVERSITIES: UniversityItem[] = [
  {
    id: 'buet',
    slug: 'buet',
    name: 'Bangladesh University of Engineering and Technology',
    shortName: 'BUET',
    location: 'Palashi, Dhaka',
    logo: '🏛️',
    foundedYear: 1876,
    admissionType: 'Engineering (Written)',
    cutoffMarks: 450,
    group: 'Science',
    website: 'https://buet.ac.bd',
    description: 'Premier engineering and architecture university in Bangladesh renowned for rigorous academic standards, producing world-class engineers, computer scientists, and architects.',
    campusArea: '87 Acres',
    studentCount: '10,500+',
    facultyCount: '650+',
    hallsCount: '8 Residential Halls',
    culture: 'Intense engineering research, hackathons, robotics competitions, national debating championships, and technical symposiums.',
    status: 'Applications Open',
    units: 'Ka (Engineering & CSE), Kha (Architecture)',
    seats: 1305,
    minGpa: 'SSC 4.00, HSC 4.00 (PHY, CHE, MATH total 270 pts)',
    testDate: 'Feb 28, 2026',
    applicationWindow: 'Jan 15, 2026 – Feb 05, 2026',
    circularUrl: 'https://ugadmission.buet.ac.bd',
    programs: [
      { id: 'cse', name: 'Computer Science and Engineering', degree: 'B.Sc. Engg.', seats: 120, duration: '4 Years', description: 'Algorithms, artificial intelligence, software engineering, systems.' },
      { id: 'eee', name: 'Electrical and Electronic Engineering', degree: 'B.Sc. Engg.', seats: 195, duration: '4 Years', description: 'Power electronics, telecommunications, microelectronics, control systems.' },
      { id: 'me', name: 'Mechanical Engineering', degree: 'B.Sc. Engg.', seats: 180, duration: '4 Years', description: 'Thermodynamics, fluid mechanics, robotics, CAD/CAM.' },
      { id: 'ce', name: 'Civil Engineering', degree: 'B.Sc. Engg.', seats: 195, duration: '4 Years', description: 'Structural design, environmental engineering, geotechnical engineering.' },
      { id: 'arch', name: 'Department of Architecture', degree: 'B.Arch.', seats: 55, duration: '5 Years', description: 'Architectural design, urban planning, visual arts, landscape design.' },
    ],
    circulars: [
      { id: 'c1', title: 'BUET Undergraduate Admission Circular 2025–26', unit: 'Ka & Kha Units', year: 2026, officialUrl: 'https://ugadmission.buet.ac.bd', summary: 'Preliminary MCQ screening followed by final written examination. Strictly no second time.' },
    ],
  },
  {
    id: 'du',
    slug: 'du',
    name: 'University of Dhaka',
    shortName: 'DU',
    location: 'Dhaka',
    logo: '🎓',
    foundedYear: 1921,
    admissionType: 'General Public (MCQ + Written)',
    cutoffMarks: 400,
    group: 'All Groups',
    website: 'https://du.ac.bd',
    description: 'The oldest and highest-ranked general public university in Bangladesh, known as the Oxford of the East, offering over 80 departments spanning science, arts, business, and fine arts.',
    campusArea: '600 Acres',
    studentCount: '37,000+',
    facultyCount: '2,000+',
    hallsCount: '23 Residential Halls',
    culture: 'Vibrant intellectual atmosphere, historical student movements, TSC cultural events, and premier research institutes.',
    status: 'Applications Open',
    units: 'Ka (Science), Kha (Arts/Social Science), Ga (Business Studies), Cha (Fine Arts)',
    seats: 7120,
    minGpa: 'Combined GPA 8.00 (Min 3.50 each in SSC & HSC)',
    testDate: 'Mar 08, 2026',
    applicationWindow: 'Jan 20, 2026 – Feb 15, 2026',
    circularUrl: 'https://admission.eis.du.ac.bd',
    programs: [
      { id: 'du-cse', name: 'Computer Science and Engineering', degree: 'B.Sc.', seats: 60, duration: '4 Years', description: 'Ka Unit merit list.' },
      { id: 'du-pharm', name: 'Pharmacy', degree: 'B.Pharm.', seats: 75, duration: '5 Years', description: 'High merit cutoff in Ka Unit.' },
      { id: 'du-law', name: 'Faculty of Law', degree: 'LL.B. (Hons)', seats: 110, duration: '4 Years', description: 'Kha Unit top rankers.' },
      { id: 'du-fin', name: 'Finance & Banking', degree: 'BBA', seats: 240, duration: '4 Years', description: 'Ga Unit business curriculum.' },
    ],
    circulars: [
      { id: 'c2', title: 'Dhaka University Undergraduate Admission 2025-26', unit: 'All Units', year: 2026, officialUrl: 'https://admission.eis.du.ac.bd', summary: 'Combined 60 MCQ + 40 Written marks exam across 8 divisional cities.' },
    ],
  },
  {
    id: 'medical',
    slug: 'medical',
    name: 'Government Medical & Dental Colleges (DGHS MBBS/BDS)',
    shortName: 'Medical (DGHS)',
    location: 'Nationwide (37 Medical + 12 Dental Colleges)',
    logo: '🏥',
    foundedYear: 1946,
    admissionType: 'Centralized MCQ (100 Marks)',
    cutoffMarks: 280,
    group: 'Science (Biology)',
    website: 'https://dghs.gov.bd',
    description: 'Centralized medical admission examination conducted by the Directorate General of Health Services (DGHS) for 37 public medical colleges including DMC, SSMC, and SOMC.',
    campusArea: 'Various Campuses',
    studentCount: '25,000+',
    facultyCount: '3,000+',
    hallsCount: 'Campus Specific',
    culture: 'Rigorous clinical rotations, patient care training, pathology, surgery, and medical community service.',
    status: 'Applications Open',
    units: 'Central MBBS & BDS Combined Merit',
    seats: 5380,
    minGpa: 'Combined GPA 9.00 (Minimum Biology 4.00 in HSC)',
    testDate: 'Feb 14, 2026',
    applicationWindow: 'Jan 10, 2026 – Jan 30, 2026',
    circularUrl: 'https://dgme.teletalk.com.bd',
    programs: [
      { id: 'mbbs', name: 'Bachelor of Medicine and Bachelor of Surgery', degree: 'MBBS', seats: 4350, duration: '5 Years + 1 Yr Internship', description: 'Clinical medicine, surgery, pharmacology.' },
      { id: 'bds', name: 'Bachelor of Dental Surgery', degree: 'BDS', seats: 1030, duration: '5 Years', description: 'Dental surgery and oral healthcare.' },
    ],
    circulars: [
      { id: 'c3', title: 'MBBS/BDS Admission Circular 2025–26', unit: 'Central Combined', year: 2026, officialUrl: 'https://dgme.teletalk.com.bd', summary: '100 marks MCQ test: Bio 30, Che 25, Phy 20, Eng 15, GK 10.' },
    ],
  },
  {
    id: 'ckruet',
    slug: 'ckruet',
    name: 'Chittagong, Khulna & Rajshahi UET Cluster (CKRUET)',
    shortName: 'CKRUET Cluster',
    location: 'Chittagong, Khulna & Rajshahi',
    logo: '⚙️',
    foundedYear: 2020,
    admissionType: 'Engineering (Combined Written/MCQ)',
    cutoffMarks: 380,
    group: 'Science',
    website: 'https://admissionckruet.ac.bd',
    description: 'Combined engineering admission cluster uniting CUET, KUET, and RUET into a single unified examination for over 3,200 engineering and architecture seats.',
    campusArea: '3 Major Campuses',
    studentCount: '15,000+',
    facultyCount: '900+',
    hallsCount: '22 Halls Across 3 Universities',
    culture: 'Collaborative engineering projects, tech fests, coding hackathons, and industrial internships.',
    status: 'Opening Soon',
    units: 'Ka (Engineering & Tech), Kha (Engineering + Architecture)',
    seats: 3231,
    minGpa: 'SSC 4.00, HSC 4.00 (PHY, CHE, MATH grade points >= 18.5)',
    testDate: 'Mar 15, 2026',
    applicationWindow: 'Feb 01, 2026 – Feb 22, 2026',
    circularUrl: 'https://admissionckruet.ac.bd',
    programs: [
      { id: 'ck-cse', name: 'Computer Science and Engineering', degree: 'B.Sc. Engg.', seats: 360, duration: '4 Years', description: 'Offered across CUET, KUET, and RUET.' },
      { id: 'ck-eee', name: 'Electrical & Electronic Engineering', degree: 'B.Sc. Engg.', seats: 540, duration: '4 Years', description: 'Offered across all 3 engineering universities.' },
      { id: 'ck-me', name: 'Mechanical Engineering', degree: 'B.Sc. Engg.', seats: 540, duration: '4 Years', description: 'Comprehensive mechanical, mechatronics, industrial engineering.' },
    ],
    circulars: [
      { id: 'c4', title: 'CKRUET Combined Engineering Circular 2025–26', unit: 'Ka & Kha Units', year: 2026, officialUrl: 'https://admissionckruet.ac.bd', summary: 'Unified exam held simultaneously at CUET, KUET, and RUET centers.' },
    ],
  },
  {
    id: 'kuet',
    slug: 'kuet',
    name: 'Khulna University of Engineering & Technology',
    shortName: 'KUET',
    location: 'Teligati, Khulna',
    logo: '⚙️',
    foundedYear: 1967,
    admissionType: 'Engineering (CKRUET Combined)',
    cutoffMarks: 380,
    group: 'Science',
    website: 'https://kuet.ac.bd',
    description: 'Premier public engineering university in south-western Bangladesh, renowned for robotics, power systems, computer science, and high graduate employability.',
    campusArea: '101 Acres',
    studentCount: '6,000+',
    facultyCount: '350+',
    hallsCount: '7 Halls',
    culture: 'Tech festivals, autonomous robotics fests, campus coding club, and green campus lake.',
    status: 'Opening Soon',
    units: 'Ka (Engineering & Tech), Kha (Architecture)',
    seats: 1065,
    minGpa: 'SSC 4.00, HSC 4.00 (PHY, CHE, MATH grade points >= 18.5)',
    testDate: 'Mar 15, 2026',
    applicationWindow: 'Feb 01, 2026 – Feb 22, 2026',
    circularUrl: 'https://admissionckruet.ac.bd',
  },
  {
    id: 'cuet',
    slug: 'cuet',
    name: 'Chittagong University of Engineering & Technology',
    shortName: 'CUET',
    location: 'Pahartali, Raozan, Chittagong',
    logo: '⚙️',
    foundedYear: 1968,
    admissionType: 'Engineering (CKRUET Combined)',
    cutoffMarks: 380,
    group: 'Science',
    website: 'https://cuet.ac.bd',
    description: 'Picturesque engineering university situated amid the hills of Chittagong, leading national research in civil, petroleum, computer, and environmental engineering.',
    campusArea: '171 Acres',
    studentCount: '5,000+',
    facultyCount: '300+',
    hallsCount: '6 Halls',
    culture: 'Hilly campus life, tech symposiums, green energy initiatives, and inter-university programming contests.',
    status: 'Opening Soon',
    units: 'Ka (Engineering & Tech), Kha (Architecture)',
    seats: 920,
    minGpa: 'SSC 4.00, HSC 4.00 (PHY, CHE, MATH grade points >= 18.5)',
    testDate: 'Mar 15, 2026',
    applicationWindow: 'Feb 01, 2026 – Feb 22, 2026',
    circularUrl: 'https://admissionckruet.ac.bd',
  },
  {
    id: 'ruet',
    slug: 'ruet',
    name: 'Rajshahi University of Engineering & Technology',
    shortName: 'RUET',
    location: 'Kazla, Rajshahi',
    logo: '⚙️',
    foundedYear: 1964,
    admissionType: 'Engineering (CKRUET Combined)',
    cutoffMarks: 380,
    group: 'Science',
    website: 'https://ruet.ac.bd',
    description: 'Leading engineering institute in northern Bangladesh with renowned faculties of mechanical, electrical, and computer engineering.',
    campusArea: '152 Acres',
    studentCount: '5,500+',
    facultyCount: '320+',
    hallsCount: '7 Halls',
    culture: 'Robotics innovation, programming marathons, mechanical CAD design, and active alumni network.',
    status: 'Opening Soon',
    units: 'Ka (Engineering & Tech), Kha (Architecture)',
    seats: 1235,
    minGpa: 'SSC 4.00, HSC 4.00 (PHY, CHE, MATH grade points >= 18.5)',
    testDate: 'Mar 15, 2026',
    applicationWindow: 'Feb 01, 2026 – Feb 22, 2026',
    circularUrl: 'https://admissionckruet.ac.bd',
  },
  {
    id: 'gst',
    slug: 'gst',
    name: 'General, Science & Technology Cluster (GST 24 Universities)',
    shortName: 'GST 24 Cluster',
    location: 'Nationwide (24 Public Universities)',
    logo: '🌐',
    foundedYear: 2020,
    admissionType: 'Centralized Cluster (MCQ 100 Marks)',
    cutoffMarks: 320,
    group: 'All Groups',
    website: 'https://gstadmission.ac.bd',
    description: 'Centralized cluster admission system connecting 24 public universities across Bangladesh including SUST, JUST, BRUR, MBSTU, and Comilla University.',
    campusArea: '24 Campuses Nationwide',
    studentCount: '80,000+',
    facultyCount: '4,500+',
    hallsCount: 'Over 70 Halls Nationwide',
    culture: 'Diverse regional public university life, multi-disciplinary research, sports, and cultural festivals.',
    status: 'Opening Soon',
    units: 'Unit A (Science), Unit B (Humanities), Unit C (Commerce)',
    seats: 21500,
    minGpa: 'Science: 8.00, Humanities: 7.00, Commerce: 7.50',
    testDate: 'Apr 12, 2026',
    applicationWindow: 'Feb 15, 2026 – Mar 10, 2026',
    circularUrl: 'https://gstadmission.ac.bd',
    programs: [
      { id: 'gst-sci', name: 'Science & Engineering Disciplines', degree: 'B.Sc.', seats: 9500, duration: '4 Years', description: 'CSE, EEE, Physics, Chemistry, Biotechnology across 24 varsities.' },
      { id: 'gst-hum', name: 'Humanities & Social Sciences', degree: 'B.A. / B.S.S.', seats: 7200, duration: '4 Years', description: 'Economics, English, Law, Public Administration.' },
      { id: 'gst-bus', name: 'Business Administration', degree: 'BBA', seats: 4800, duration: '4 Years', description: 'Accounting, Management, Marketing, Finance.' },
    ],
    circulars: [
      { id: 'c5', title: 'GST Central Admission Circular 2025–26', unit: 'Units A, B, C', year: 2026, officialUrl: 'https://gstadmission.ac.bd', summary: '100 marks MCQ test across designated regional test centers.' },
    ],
  },
  {
    id: 'sust',
    slug: 'sust',
    name: 'Shahjalal University of Science and Technology',
    shortName: 'SUST',
    location: 'Kumargaon, Sylhet',
    logo: '🔭',
    foundedYear: 1986,
    admissionType: 'GST Cluster & Autonomous Intake',
    cutoffMarks: 350,
    group: 'All Groups',
    website: 'https://sust.edu',
    description: 'Pioneering science and technology university in Sylhet famous for automated campus IT, software engineering competitions, and picturesque hilly campus.',
    campusArea: '320 Acres',
    studentCount: '11,000+',
    facultyCount: '600+',
    hallsCount: '5 Halls',
    culture: 'Competitive coding, open-source software development, rock culture, and green campus life.',
    status: 'Opening Soon',
    units: 'Unit A (Science), Unit B (Social Science/Humanities)',
    seats: 1720,
    minGpa: 'GST Cluster Merit Eligibility',
    testDate: 'Apr 12, 2026',
    applicationWindow: 'Feb 15, 2026 – Mar 10, 2026',
    circularUrl: 'https://admission.sust.edu',
  },
  {
    id: 'ju',
    slug: 'ju',
    name: 'Jahangirnagar University',
    shortName: 'JU',
    location: 'Savar, Dhaka',
    logo: '🌳',
    foundedYear: 1970,
    admissionType: 'Autonomous (Unit-wise MCQ)',
    cutoffMarks: 370,
    group: 'All Groups',
    website: 'https://juniv.edu',
    description: 'Only fully residential public university in Bangladesh, nestled on a lush green campus with migratory bird sanctuaries, known for drama, literature, and sciences.',
    campusArea: '697 Acres',
    studentCount: '16,000+',
    facultyCount: '800+',
    hallsCount: '16 Halls (100% Residential)',
    culture: 'Theatre festivals, migratory bird conservation, vibrant student politics, cultural debates.',
    status: 'Applications Open',
    units: 'Unit A (Math & Physical Science), Unit B (Social Science), Unit C (Arts), Unit D (Bio Science)',
    seats: 1984,
    minGpa: 'Combined GPA 8.00 (Science Units Require 8.50+)',
    testDate: 'Feb 22, 2026',
    applicationWindow: 'Jan 05, 2026 – Jan 25, 2026',
    circularUrl: 'https://ju-admission.org',
  },
  {
    id: 'ru',
    slug: 'ru',
    name: 'University of Rajshahi',
    shortName: 'RU',
    location: 'Motihar, Rajshahi',
    logo: '🏛️',
    foundedYear: 1953,
    admissionType: 'Autonomous Unit Exam',
    cutoffMarks: 360,
    group: 'All Groups',
    website: 'https://ru.ac.bd',
    description: 'The second oldest public university in Bangladesh, famous for its magnificent Paris Road, expansive faculties, and high research output in northern Bangladesh.',
    campusArea: '753 Acres',
    studentCount: '30,000+',
    facultyCount: '1,200+',
    hallsCount: '17 Halls',
    culture: 'Serene botanical campus, mango orchards, rich academic history, and literary seminars.',
    status: 'Opening Soon',
    units: 'Unit A (Humanities), Unit B (Business), Unit C (Science)',
    seats: 4438,
    minGpa: 'Science: Combined 8.00, Humanities: 7.00, Commerce: 7.50',
    testDate: 'Mar 22, 2026',
    applicationWindow: 'Jan 25, 2026 – Feb 18, 2026',
    circularUrl: 'https://admission.ru.ac.bd',
  },
  {
    id: 'cu',
    slug: 'cu',
    name: 'University of Chittagong',
    shortName: 'CU',
    location: 'Fatehabad, Hathazari, Chittagong',
    logo: '🚂',
    foundedYear: 1966,
    admissionType: 'Autonomous Unit Exam',
    cutoffMarks: 350,
    group: 'All Groups',
    website: 'https://cu.ac.bd',
    description: 'Picturesque hilly campus connected by the iconic campus shuttle train, offering prestigious faculties of science, marine sciences, business, and arts.',
    campusArea: '1753 Acres (Largest in Bangladesh)',
    studentCount: '27,000+',
    facultyCount: '1,000+',
    hallsCount: '14 Halls',
    culture: 'Shuttle train songs, mountain trails, forestry research, and marine biology expeditions.',
    status: 'Opening Soon',
    units: 'Unit A (Science), Unit B (Arts), Unit C (Business), Unit D (Interdisciplinary)',
    seats: 4926,
    minGpa: 'Combined GPA 7.50 to 8.00 (Minimum 3.50 each in SSC & HSC)',
    testDate: 'Mar 28, 2026',
    applicationWindow: 'Jan 28, 2026 – Feb 20, 2026',
    circularUrl: 'https://admission.cu.ac.bd',
  },
  {
    id: 'butex',
    slug: 'butex',
    name: 'Bangladesh University of Textiles',
    shortName: 'BUTEX',
    location: 'Tejgaon, Dhaka',
    logo: '🧵',
    foundedYear: 1950,
    admissionType: 'Autonomous Engineering Exam',
    cutoffMarks: 390,
    group: 'Science',
    website: 'https://butex.edu.bd',
    description: 'Premier specialized textile engineering university in South Asia, powering Bangladesh’s export industry through cutting-edge chemical, machine, and apparel engineering.',
    campusArea: '12 Acres',
    studentCount: '3,000+',
    facultyCount: '180+',
    hallsCount: '3 Halls',
    culture: 'Direct industry linkages with RMG and multinational textile corporations, industrial automation.',
    status: 'Applications Open',
    units: 'Faculty of Textile Engineering',
    seats: 600,
    minGpa: 'SSC 4.00, HSC 4.50 (PHY, CHE, MATH grade points >= 14.0)',
    testDate: 'Mar 06, 2026',
    applicationWindow: 'Jan 18, 2026 – Feb 10, 2026',
    circularUrl: 'https://butex.edu.bd/admission',
  },
];

export function getUniversityBySlug(slug: string): UniversityItem | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  return FALLBACK_UNIVERSITIES.find((u) => {
    const s = (u.slug || u.id || u.shortName).toLowerCase().replace(/[^a-z0-9]/g, '');
    return s === clean || clean.includes(s) || s.includes(clean);
  });
}
