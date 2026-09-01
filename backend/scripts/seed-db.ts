import { config } from 'dotenv';
config({ path: '.env' });

import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const universitiesData = [
  { name: 'Bangladesh University of Engineering and Technology', short_name: 'BUET', description: 'Premier engineering university in Bangladesh', location: 'Dhaka', website: 'https://buet.ac.bd', logo: '🏛️', founded_year: 1876, admission_type: 'merit', cutoff_marks: 450 },
  { name: 'University of Dhaka', short_name: 'DU', description: 'The oldest and largest public university in Bangladesh', location: 'Dhaka', website: 'https://du.ac.bd', logo: '🎓', founded_year: 1921, admission_type: 'merit', cutoff_marks: 400 },
  { name: 'Khulna University of Engineering and Technology', short_name: 'KUET', description: 'Leading engineering university in Khulna', location: 'Khulna', website: 'https://kuet.ac.bd', logo: '⚙️', founded_year: 1967, admission_type: 'merit', cutoff_marks: 400 },
  { name: 'Rajshahi University of Engineering and Technology', short_name: 'RUET', description: 'Prominent engineering university in Rajshahi', location: 'Rajshahi', website: 'https://ruet.ac.bd', logo: '🔧', founded_year: 1964, admission_type: 'merit', cutoff_marks: 380 },
];

const programsData: Record<string, { name: string; description: string; duration: string; seats: number; cutoff_marks: number }[]> = {
  BUET: [
    { name: 'Computer Science & Engineering', description: 'BSc in Computer Science and Engineering', duration: '4 years', seats: 120, cutoff_marks: 450 },
    { name: 'Civil Engineering', description: 'BSc in Civil Engineering', duration: '4 years', seats: 100, cutoff_marks: 420 },
    { name: 'Electrical & Electronic Engineering', description: 'BSc in EEE', duration: '4 years', seats: 110, cutoff_marks: 430 },
  ],
  DU: [
    { name: 'Computer Science', description: 'BSc in Computer Science', duration: '4 years', seats: 80, cutoff_marks: 400 },
    { name: 'Faculty of Law', description: 'LLB Program', duration: '4 years', seats: 60, cutoff_marks: 450 },
  ],
  KUET: [
    { name: 'Electrical & Electronic Engineering', description: 'BSc in EEE', duration: '4 years', seats: 90, cutoff_marks: 400 },
    { name: 'Mechanical Engineering', description: 'BSc in Mechanical Engineering', duration: '4 years', seats: 85, cutoff_marks: 390 },
  ],
  RUET: [
    { name: 'Mechanical Engineering', description: 'BSc in Mechanical Engineering', duration: '4 years', seats: 75, cutoff_marks: 380 },
  ],
};

async function main() {
  console.log('Seeding database...');

  for (const u of universitiesData) {
    await pool.query(
      `INSERT INTO universities (name, short_name, description, location, website, logo, founded_year, admission_type, cutoff_marks)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (short_name) DO NOTHING`,
      [u.name, u.short_name, u.description, u.location, u.website, u.logo, u.founded_year, u.admission_type, u.cutoff_marks]
    );
  }
  console.log(`Inserted ${universitiesData.length} universities`);

  for (const uni of universitiesData) {
    const progs = programsData[uni.short_name];
    if (!progs) continue;

    const { rows } = await pool.query('SELECT id FROM universities WHERE short_name = $1', [uni.short_name]);
    if (rows.length === 0) continue;
    const uniId = rows[0].id;

    for (const p of progs) {
      await pool.query(
        `         INSERT INTO programs (university_id, name, description, duration, seats, cutoff_marks)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [uniId, p.name, p.description, p.duration, p.seats, p.cutoff_marks]
      );
    }
    console.log(`Inserted ${progs.length} programs for ${uni.short_name}`);
  }

  await pool.end();
  console.log('Database seeding complete!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
