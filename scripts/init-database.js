#!/usr/bin/env node

/**
 * Database initialization script
 * This script creates the necessary tables and initial data
 */

import { PostgresService } from './lib/postgres-service';
import { isPostgresConfigured } from './lib/postgres';

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...');
  
  if (!isPostgresConfigured()) {
    console.log('❌ Postgres not configured. Please set POSTGRES_* environment variables.');
    console.log('📝 See env.template for required variables.');
    process.exit(1);
  }

  try {
    // Initialize database schema
    await PostgresService.initializeDatabase();
    
    // Add some sample data
    console.log('📊 Adding sample data...');
    
    // Sample organizations
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

    for (const org of organizations) {
      try {
        await PostgresService.createPlan({
          organization_id: org.id,
          branch_id: org.id, // Using org id as branch id for simplicity
          title: `${org.name} - Haftalik Reja`,
          description: `${org.name} uchun haftalik ish rejasi`,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'active',
          priority: 'high'
        });
        console.log(`✅ Created sample plan for ${org.name}`);
      } catch (error) {
        console.log(`⚠️  Sample plan for ${org.name} already exists or error:`, error);
      }
    }

    console.log('✅ Database initialization completed successfully!');
    console.log('🎉 You can now start using the application with Postgres.');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
