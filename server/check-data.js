import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkData() {
  try {
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM departments) as departments,
        (SELECT COUNT(*) FROM subjects) as subjects,
        (SELECT COUNT(*) FROM classes) as classes,
        (SELECT COUNT(*) FROM "user") as users,
        (SELECT COUNT(*) FROM enrollments) as enrollments
    `);
    
    console.log('📊 Database record counts:');
    console.log('  Departments:', result.rows[0].departments);
    console.log('  Subjects:', result.rows[0].subjects);
    console.log('  Classes:', result.rows[0].classes);
    console.log('  Users:', result.rows[0].users);
    console.log('  Enrollments:', result.rows[0].enrollments);
    console.log('');
    
    const total = parseInt(result.rows[0].departments) + 
                  parseInt(result.rows[0].subjects) + 
                  parseInt(result.rows[0].classes) + 
                  parseInt(result.rows[0].users) + 
                  parseInt(result.rows[0].enrollments);
    
    if (total === 0) {
      console.log('⚠️  Database is EMPTY - run: node seed.js');
    } else {
      console.log('✅ Database has data!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkData();
