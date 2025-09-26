#!/usr/bin/env node

/**
 * Railway start script
 * This script initializes the database and starts the Next.js server
 */

import { PostgresService } from '../lib/postgres-service.js';
import { isPostgresConfigured } from '../lib/postgres.js';
import { spawn } from 'child_process';

async function startRailwayApp() {
  console.log('🚀 Starting Railway application...');
  
  // Initialize database if Postgres is configured
  if (isPostgresConfigured()) {
    console.log('📊 Initializing database...');
    try {
      await PostgresService.initializeDatabase();
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.warn('⚠️  Database initialization failed:', error.message);
      console.log('📝 Continuing without database initialization...');
    }
  } else {
    console.log('ℹ️  No Postgres configuration found, skipping database initialization');
  }
  
  // Start Next.js server
  console.log('🌐 Starting Next.js server...');
  
  // Check if standalone build exists (Railway default)
  const fs = await import('fs');
  const path = await import('path');
  
  const standalonePath = path.join(process.cwd(), '.next', 'standalone', 'server.js');
  const isStandalone = fs.existsSync(standalonePath);
  
  let nextProcess;
  if (isStandalone) {
    console.log('📦 Using standalone build...');
    nextProcess = spawn('node', [standalonePath], {
      stdio: 'inherit',
      env: { ...process.env }
    });
  } else {
    console.log('🚀 Using standard Next.js start...');
    nextProcess = spawn('pnpm', ['run', 'start'], {
      stdio: 'inherit',
      env: { ...process.env }
    });
  }
  
  nextProcess.on('error', (error) => {
    console.error('❌ Failed to start Next.js server:', error);
    process.exit(1);
  });
  
  nextProcess.on('exit', (code) => {
    console.log(`📝 Next.js server exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('📝 Received SIGTERM, shutting down gracefully...');
    nextProcess.kill('SIGTERM');
  });
  
  process.on('SIGINT', () => {
    console.log('📝 Received SIGINT, shutting down gracefully...');
    nextProcess.kill('SIGINT');
  });
}

// Start the application
startRailwayApp();
