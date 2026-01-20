import { readFileSync } from 'fs';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function migrate() {
  try {
    const sql = readFileSync('./drizzle/0000_early_sentry.sql', 'utf-8');
    const statements = sql.split('--> statement-breakpoint').filter(s => s.trim());
    
    console.log(`Running ${statements.length} migration statements...`);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await pool.end();
  }
}

migrate();
