#!/usr/bin/env node

/**
 * Railway Database initialization script
 * This script creates the necessary tables and initial data for Railway Postgres
 */

import { PostgresService } from './lib/postgres-service';
import { isPostgresConfigured } from './lib/postgres';

async function initializeRailwayDatabase() {
  console.log('🚀 Starting Railway database initialization...');
  
  if (!isPostgresConfigured()) {
    console.log('❌ Postgres not configured. Please check Railway environment variables.');
    console.log('📝 Required variables: PGHOST, PGDATABASE, PGUSER, PGPASSWORD');
    process.exit(1);
  }

  try {
    // Initialize database schema
    console.log('📊 Creating database schema...');
    await PostgresService.initializeDatabase();
    
    // Add sample organizations
    console.log('🏢 Adding sample organizations...');
    
    const organizations = [
      {
        id: 'navoiy-org',
        name: 'Navoiyda Bugun',
        slug: 'navoiy',
        domain: 'navoiyda-bugun.uz',
        logo_url: '/images/logos/navoiyda-bugun-logo.jpg',
        theme_colors: { primary: '#3B82F6', secondary: '#1E40AF' },
        settings: { timezone: 'Asia/Tashkent', currency: 'UZS' }
      },
      {
        id: 'samarqand-org',
        name: 'Samarqandda Bugun',
        slug: 'samarqand',
        domain: 'samarqandda-bugun.uz',
        logo_url: '/images/logos/samarqandda-bugun-logo.png',
        theme_colors: { primary: '#10B981', secondary: '#047857' },
        settings: { timezone: 'Asia/Tashkent', currency: 'UZS' }
      },
      {
        id: 'toshkent-org',
        name: 'Toshkentda Bugun',
        slug: 'toshkent',
        domain: 'toshkentda-bugun.uz',
        logo_url: '/images/logos/toshkentda-bugun-logo.jpg',
        theme_colors: { primary: '#8B5CF6', secondary: '#7C3AED' },
        settings: { timezone: 'Asia/Tashkent', currency: 'UZS' }
      }
    ];

    // Insert organizations
    for (const org of organizations) {
      try {
        const client = await PostgresService.checkPostgres();
        await client.query(`
          INSERT INTO organizations (id, name, slug, domain, logo_url, theme_colors, settings, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          ON CONFLICT (id) DO NOTHING
        `, [org.id, org.name, org.slug, org.domain, org.logo_url, JSON.stringify(org.theme_colors), JSON.stringify(org.settings)]);
        client.release();
        console.log(`✅ Organization ${org.name} created/updated`);
      } catch (error) {
        console.log(`⚠️  Organization ${org.name} error:`, error);
      }
    }

    // Add sample branches
    console.log('🏪 Adding sample branches...');
    for (const org of organizations) {
      try {
        const client = await PostgresService.checkPostgres();
        await client.query(`
          INSERT INTO branches (id, organization_id, name, slug, address, phone, email, status, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', NOW(), NOW())
          ON CONFLICT (organization_id, slug) DO NOTHING
        `, [
          `${org.slug}-branch`,
          org.id,
          `${org.name} Filiali`,
          org.slug,
          `${org.name} shahri`,
          '+998 90 123 45 67',
          `info@${org.slug}.uz`
        ]);
        client.release();
        console.log(`✅ Branch for ${org.name} created/updated`);
      } catch (error) {
        console.log(`⚠️  Branch for ${org.name} error:`, error);
      }
    }

    // Add sample plans
    console.log('📋 Adding sample plans...');
    for (const org of organizations) {
      try {
        const client = await PostgresService.checkPostgres();
        await client.query(`
          INSERT INTO plans (id, organization_id, branch_id, title, description, start_date, end_date, status, priority, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', 'high', NOW(), NOW())
          ON CONFLICT (id) DO NOTHING
        `, [
          `${org.slug}-plan-1`,
          org.id,
          `${org.slug}-branch`,
          `${org.name} - Haftalik Reja`,
          `${org.name} uchun haftalik ish rejasi va vazifalar`,
          new Date().toISOString().split('T')[0],
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        ]);
        client.release();
        console.log(`✅ Sample plan for ${org.name} created/updated`);
      } catch (error) {
        console.log(`⚠️  Sample plan for ${org.name} error:`, error);
      }
    }

    console.log('✅ Railway database initialization completed successfully!');
    console.log('🎉 Your application is now ready to use with Railway Postgres.');
    console.log('🌐 Visit your Railway deployment URL to see the application.');
    
  } catch (error) {
    console.error('❌ Railway database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initializeRailwayDatabase();
