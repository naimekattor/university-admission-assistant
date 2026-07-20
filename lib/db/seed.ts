import { db, universities, programs, eligibilityCriteria } from './index';

export async function seedDatabase() {
  console.log('Starting database seed...');

  const universityData = [
    {
      name: 'University of Dhaka',
      shortName: 'DU',
      description: 'The oldest university in Bangladesh, established in 1921. Known for excellence in humanities, sciences, and social sciences.',
      location: 'Dhaka',
      website: 'https://www.du.ac.bd',
      logo: '🎓',
      foundedYear: 1921,
      admissionType: 'merit',
      cutoffMarks: 80,
      metadata: { ranking: 1, totalStudents: 30000 },
    },
    {
      name: 'Bangladesh University of Engineering and Technology',
      shortName: 'BUET',
      description: 'Premier engineering university in Bangladesh. Offers undergraduate and postgraduate programs in various engineering disciplines.',
      location: 'Dhaka',
      website: 'https://www.buet.ac.bd',
      logo: '⚙️',
      foundedYear: 1912,
      admissionType: 'merit',
      cutoffMarks: 85,
      metadata: { ranking: 2, totalStudents: 5000 },
    },
    {
      name: 'Jashore University of Science and Technology',
      shortName: 'JUST',
      description: 'Specialized in science and technology education. Offers programs in engineering, science, and technology.',
      location: 'Jessore',
      website: 'https://www.just.edu.bd',
      logo: '🔬',
      foundedYear: 2001,
      admissionType: 'merit',
      cutoffMarks: 70,
      metadata: { ranking: 5, totalStudents: 8000 },
    },
    {
      name: 'Dhaka University of Engineering & Technology',
      shortName: 'DUET',
      description: 'Top-tier engineering university in Bangladesh. Offers diverse engineering programs.',
      location: 'Gazipur',
      website: 'https://www.duet.ac.bd',
      logo: '🏗️',
      foundedYear: 1999,
      admissionType: 'merit',
      cutoffMarks: 78,
      metadata: { ranking: 3, totalStudents: 4000 },
    },
    {
      name: 'Medical University of Bangladesh',
      shortName: 'MUB',
      description: 'Leading medical education institution. Specializes in medicine, nursing, and health sciences.',
      location: 'Dhaka',
      website: 'https://www.mub.ac.bd',
      logo: '⚕️',
      foundedYear: 1998,
      admissionType: 'merit',
      cutoffMarks: 90,
      metadata: { ranking: 4, totalStudents: 2000 },
    },
    {
      name: 'Independent University Bangladesh',
      shortName: 'IUB',
      description: 'Private university offering diverse programs including business, engineering, arts, and sciences.',
      location: 'Dhaka',
      website: 'https://www.iub.edu.bd',
      logo: '📚',
      foundedYear: 1993,
      admissionType: 'merit',
      cutoffMarks: 65,
      metadata: { ranking: 10, totalStudents: 3500 },
    },
  ];

  const programsData = [
    {
      name: 'Computer Science & Engineering',
      description: 'Study the theory and practice of computing and software development.',
      duration: '4 years',
      seats: 60,
      cutoffMarks: 75,
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
    },
    {
      name: 'Electrical Engineering',
      description: 'Focus on power systems, electronics, and telecommunications.',
      duration: '4 years',
      seats: 50,
      cutoffMarks: 72,
      subjects: ['Physics', 'Mathematics'],
    },
    {
      name: 'Civil Engineering',
      description: 'Learn to design and construct infrastructure and buildings.',
      duration: '4 years',
      seats: 45,
      cutoffMarks: 68,
      subjects: ['Physics', 'Mathematics'],
    },
    {
      name: 'Medicine (MBBS)',
      description: 'Comprehensive medical education leading to Bachelor of Medicine.',
      duration: '5 years',
      seats: 30,
      cutoffMarks: 88,
      subjects: ['Biology', 'Chemistry', 'Physics'],
    },
    {
      name: 'Business Administration',
      description: 'Study business management, accounting, and finance.',
      duration: '4 years',
      seats: 80,
      cutoffMarks: 60,
      subjects: ['Any combination'],
    },
    {
      name: 'English Literature',
      description: 'Explore English language, literature, and linguistics.',
      duration: '4 years',
      seats: 40,
      cutoffMarks: 55,
      subjects: ['English'],
    },
    {
      name: 'Physics',
      description: 'Study fundamental laws of nature and matter.',
      duration: '4 years',
      seats: 35,
      cutoffMarks: 70,
      subjects: ['Physics', 'Mathematics'],
    },
    {
      name: 'Chemistry',
      description: 'Explore chemical reactions and molecular structures.',
      duration: '4 years',
      seats: 35,
      cutoffMarks: 68,
      subjects: ['Chemistry', 'Physics', 'Mathematics'],
    },
  ];

  // Seed universities
  const createdUniversities: any[] = [];
  for (const uniData of universityData) {
    const result = await db
      .insert(universities)
      .values({
        name: uniData.name,
        shortName: uniData.shortName,
        description: uniData.description,
        location: uniData.location,
        website: uniData.website,
        logo: uniData.logo,
        foundedYear: uniData.foundedYear,
        admissionType: uniData.admissionType,
        cutoffMarks: uniData.cutoffMarks,
        metadata: uniData.metadata,
      })
      .returning();
    createdUniversities.push(result[0]);
  }

  console.log(`✓ Created ${createdUniversities.length} universities`);

  // Seed programs for each university
  let totalPrograms = 0;
  for (let i = 0; i < createdUniversities.length; i++) {
    const uni = createdUniversities[i];
    const progsForUni = programsData.slice(0, Math.min(4, programsData.length));

    for (const progData of progsForUni) {
      const result = await db
        .insert(programs)
        .values({
          universityId: uni.id,
          name: progData.name,
          description: progData.description,
          duration: progData.duration,
          seats: progData.seats,
          cutoffMarks: progData.cutoffMarks,
          subjects: progData.subjects,
        })
        .returning();

      // Add eligibility criteria
      if (result[0]) {
        await db.insert(eligibilityCriteria).values({
          programId: result[0].id,
          minHscMarks: progData.cutoffMarks,
          minGpa: '2.0',
          requiredSubjects: progData.subjects,
          ageLimit: 'No limit',
        });
      }

      totalPrograms++;
    }
  }

  console.log(`✓ Created ${totalPrograms} programs with eligibility criteria`);
  console.log('Database seeding completed!');
}

// Run seed if this is the main module
if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
