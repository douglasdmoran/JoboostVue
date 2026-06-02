import { pool } from './src/db.js';

async function run() {
  try {
    console.log("=== TABLAS ===");
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(tablesRes.rows.map(r => r.table_name));

    console.log("\n=== CONSTRICCIONES UNIQUE Y PRIMARY KEY ===");
    const constraintsRes = await pool.query(`
      SELECT conname, contype, pg_get_constraintdef(c.oid) as def
      FROM pg_constraint c
      JOIN pg_namespace n ON n.oid = c.connamespace
      WHERE n.nspname = 'public'
    `);
    constraintsRes.rows.forEach(r => {
      console.log(`${r.conname} (${r.contype}): ${r.def}`);
    });

    console.log("\n=== COLUMNAS POR TABLA ===");
    for (const t of tablesRes.rows.map(r => r.table_name)) {
      const colsRes = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
      `, [t]);
      console.log(`\nTabla: ${t}`);
      colsRes.rows.forEach(c => {
        console.log(`  - ${c.column_name} (${c.data_type}, nullable: ${c.is_nullable})`);
      });
    }

  } catch (err) {
    console.error("Error during DB audit:", err);
  } finally {
    await pool.end();
  }
}

run();
