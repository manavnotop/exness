import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const sqlPath = path.join(__dirname, '../setup_timescaledb.sql');
const setupSql = fs.readFileSync(sqlPath, 'utf-8');

const client = new Client({
  connectionString: "postgresql://postgres:mysecretpassword@localhost:5434/postgres",
});

async function runSetup() {
  console.log('Connecting to database...');
  await client.connect();

  try {
    console.log('Applying TimescaleDB setup...');
    await client.query(setupSql);
    console.log('Setup applied successfully!');
  } catch (err: any) {
    console.error('Failed to apply setup:', err.message);
    console.error('SQL Error Code:', err.code);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Connection closed.');
  }
}

if (require.main === module) {
  runSetup();
}
