process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const password = process.env.SUPABASE_DATABASE_PASSWORD || 'wkC9V1UDszH7yt9U';
  const connectionStrings = [
    `postgresql://postgres:${encodeURIComponent(password)}@db.snhtlukbjrfgmvfbuisj.supabase.co:5432/postgres`,
    `postgresql://postgres.snhtlukbjrfgmvfbuisj:${encodeURIComponent(password)}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres.snhtlukbjrfgmvfbuisj:${encodeURIComponent(password)}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`,
  ];

  let client = null;
  for (const connStr of connectionStrings) {
    try {
      console.log('Attempting connection to Supabase...');
      const c = new Client({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
      });
      await c.connect();
      console.log('Connected to Supabase PostgreSQL database successfully!');
      client = c;
      break;
    } catch (err) {
      console.log('Connection failed:', err.message);
    }
  }

  if (!client) {
    console.log('Direct TCP Postgres connection could not be established.');
    return;
  }

  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../supabase/schema.sql'), 'utf-8');
    console.log('Executing schema.sql on Supabase Paisaan project...');
    await client.query(schemaSql);
    console.log('Schema migration completed successfully! All tables, constraints, and RLS policies created.');

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('Tables created in Supabase:');
    res.rows.forEach(r => console.log(' - ' + r.table_name));
  } catch (err) {
    console.error('Error executing schema:', err.message);
  } finally {
    await client.end();
  }
}

migrate();
