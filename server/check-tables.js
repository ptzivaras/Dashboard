import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:password@localhost:5432/classroom'
});

const query = `
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema='public' 
  ORDER BY table_name
`;

pool.query(query, (err, res) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('📋 Tables in database:');
    res.rows.forEach(row => console.log('  -', row.table_name));
  }
  pool.end();
});
