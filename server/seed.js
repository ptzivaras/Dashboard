import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create departments
    console.log('📚 Creating departments...');
    const departments = await pool.query(`
      INSERT INTO departments (code, name, description) VALUES
      ('CS', 'Computer Science', 'Study of computation, algorithms, and information systems'),
      ('EE', 'Electrical Engineering', 'Study of electrical systems, electronics, and electromagnetism'),
      ('ME', 'Mechanical Engineering', 'Study of mechanics, thermodynamics, and materials science'),
      ('CE', 'Civil Engineering', 'Study of infrastructure design and construction'),
      ('MATH', 'Mathematics', 'Study of numbers, structures, and abstract concepts')
      RETURNING id, code, name
    `);
    console.log(`✅ Created ${departments.rows.length} departments`);

    // Create subjects
    console.log('📖 Creating subjects...');
    const subjects = await pool.query(`
      INSERT INTO subjects (department_id, code, name, description) VALUES
      (1, 'CS101', 'Introduction to Programming', 'Learn Python programming fundamentals'),
      (1, 'CS201', 'Data Structures', 'Study of arrays, linked lists, trees, and graphs'),
      (1, 'CS301', 'Algorithms', 'Algorithm design and complexity analysis'),
      (2, 'EE101', 'Circuit Analysis', 'Basic electrical circuit theory'),
      (2, 'EE201', 'Digital Logic', 'Boolean algebra and digital circuits'),
      (3, 'ME101', 'Engineering Mechanics', 'Statics and dynamics fundamentals'),
      (4, 'CE101', 'Structural Engineering', 'Analysis of structures and loads'),
      (5, 'MATH101', 'Calculus I', 'Limits, derivatives, and integrals')
      RETURNING id, code, name
    `);
    console.log(`✅ Created ${subjects.rows.length} subjects`);

    // Create users
    console.log('👥 Creating users...');
    const users = await pool.query(`
      INSERT INTO "user" (id, name, email, role, email_verified) VALUES
      ('admin-1', 'Admin User', 'admin@university.edu', 'admin', true),
      ('teacher-1', 'Dr. John Smith', 'john.smith@university.edu', 'teacher', true),
      ('teacher-2', 'Dr. Sarah Johnson', 'sarah.johnson@university.edu', 'teacher', true),
      ('teacher-3', 'Prof. Michael Brown', 'michael.brown@university.edu', 'teacher', true),
      ('student-1', 'Alice Williams', 'alice.w@student.edu', 'student', true),
      ('student-2', 'Bob Davis', 'bob.d@student.edu', 'student', true),
      ('student-3', 'Charlie Wilson', 'charlie.w@student.edu', 'student', true),
      ('student-4', 'Diana Martinez', 'diana.m@student.edu', 'student', true),
      ('student-5', 'Ethan Anderson', 'ethan.a@student.edu', 'student', true),
      ('student-6', 'Fiona Taylor', 'fiona.t@student.edu', 'student', true)
      RETURNING id, name, role
    `);
    console.log(`✅ Created ${users.rows.length} users`);

    // Create classes
    console.log('🏫 Creating classes...');
    const classes = await pool.query(`
      INSERT INTO classes (subject_id, teacher_id, invite_code, name, capacity, status, schedules) VALUES
      (1, 'teacher-1', 'CS101-FALL', 'Introduction to Programming - Fall 2026', 30, 'active', '{"Monday": "10:00-11:30", "Wednesday": "10:00-11:30"}'),
      (2, 'teacher-1', 'CS201-FALL', 'Data Structures - Fall 2026', 25, 'active', '{"Tuesday": "14:00-15:30", "Thursday": "14:00-15:30"}'),
      (3, 'teacher-2', 'CS301-SPR', 'Algorithms - Spring 2026', 20, 'active', '{"Monday": "13:00-14:30", "Wednesday": "13:00-14:30"}'),
      (4, 'teacher-2', 'EE101-FALL', 'Circuit Analysis - Fall 2026', 28, 'active', '{"Tuesday": "09:00-10:30", "Thursday": "09:00-10:30"}'),
      (5, 'teacher-3', 'EE201-SPR', 'Digital Logic - Spring 2026', 22, 'active', '{"Monday": "15:00-16:30", "Wednesday": "15:00-16:30"}'),
      (8, 'teacher-3', 'MATH101-FALL', 'Calculus I - Fall 2026', 35, 'active', '{"Monday": "08:00-09:30", "Wednesday": "08:00-09:30", "Friday": "08:00-09:30"}')
      RETURNING id, name
    `);
    console.log(`✅ Created ${classes.rows.length} classes`);

    // Create enrollments
    console.log('📝 Creating enrollments...');
    const enrollments = await pool.query(`
      INSERT INTO enrollments (student_id, class_id) VALUES
      ('student-1', 1), ('student-1', 6),
      ('student-2', 1), ('student-2', 4),
      ('student-3', 1), ('student-3', 2),
      ('student-4', 2), ('student-4', 3),
      ('student-5', 4), ('student-5', 6),
      ('student-6', 3), ('student-6', 5)
      RETURNING id
    `);
    console.log(`✅ Created ${enrollments.rows.length} enrollments`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Departments: ${departments.rows.length}`);
    console.log(`   Subjects: ${subjects.rows.length}`);
    console.log(`   Users: ${users.rows.length}`);
    console.log(`   Classes: ${classes.rows.length}`);
    console.log(`   Enrollments: ${enrollments.rows.length}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

seed();
