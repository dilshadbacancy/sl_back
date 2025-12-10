/**
 * Migration: Make updatedAt NOT NULL in shops table
 * Run: npx ts-node src/migrations/001-make-shops-updatedAt-not-null.ts
 */

import { SequelizeConnection } from '../config/database.config';

async function migrate() {
  const sequelize = SequelizeConnection.getInstance();

  try {
    console.log('Starting migration: Make shops.updatedAt NOT NULL...');

    await sequelize.query(`
      ALTER TABLE \`shops\` CHANGE \`updatedAt\` \`updatedAt\` DATETIME NOT NULL;
    `);

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
