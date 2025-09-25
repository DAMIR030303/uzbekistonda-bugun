import { getPostgresClient, isPostgresConfigured } from './postgres.js';

// Database types
const Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: 'string',
          name: 'string',
          slug: 'string',
          domain: 'string',
          logo_url: 'string',
          theme_colors: 'object',
          settings: 'object',
          created_at: 'string',
          updated_at: 'string'
        }
      },
      branches: {
        Row: {
          id: 'string',
          organization_id: 'string',
          name: 'string',
          slug: 'string',
          address: 'string',
          phone: 'string',
          email: 'string',
          status: 'string',
          created_at: 'string',
          updated_at: 'string'
        }
      },
      user_profiles: {
        Row: {
          id: 'string',
          organization_id: 'string',
          branch_id: 'string',
          name: 'string',
          email: 'string',
          role: 'string',
          status: 'string',
          created_at: 'string',
          updated_at: 'string'
        }
      },
      plans: {
        Row: {
          id: 'string',
          organization_id: 'string',
          branch_id: 'string',
          title: 'string',
          description: 'string',
          start_date: 'string',
          end_date: 'string',
          status: 'string',
          priority: 'string',
          created_at: 'string',
          updated_at: 'string'
        }
      },
      tasks: {
        Row: {
          id: 'string',
          plan_id: 'string',
          title: 'string',
          description: 'string',
          status: 'string',
          priority: 'string',
          assigned_to: 'string',
          due_date: 'string',
          created_at: 'string',
          updated_at: 'string'
        }
      }
    }
  }
};

// Type definitions
const Organization = Database.public.Tables.organizations.Row;
const Branch = Database.public.Tables.branches.Row;
const UserProfile = Database.public.Tables.user_profiles.Row;
const Plan = Database.public.Tables.plans.Row;
const Task = Database.public.Tables.tasks.Row;

export class PostgresService {
  // Helper method to check if Postgres is available
  static async checkPostgres() {
    if (!isPostgresConfigured()) {
      throw new Error("Postgres not configured");
    }
    // Check if we're on server-side
    if (typeof window !== 'undefined') {
      throw new Error("Postgres can only be used on server-side");
    }
    return await getPostgresClient();
  }

  // Initialize database schema
  static async initializeDatabase() {
    const client = await this.checkPostgres();
    try {
      // Create organizations table
      await client.query(`
        CREATE TABLE IF NOT EXISTS organizations (
          id VARCHAR PRIMARY KEY,
          name VARCHAR NOT NULL,
          slug VARCHAR UNIQUE NOT NULL,
          domain VARCHAR,
          logo_url VARCHAR,
          theme_colors JSONB,
          settings JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create branches table
      await client.query(`
        CREATE TABLE IF NOT EXISTS branches (
          id VARCHAR PRIMARY KEY,
          organization_id VARCHAR REFERENCES organizations(id),
          name VARCHAR NOT NULL,
          slug VARCHAR NOT NULL,
          address VARCHAR,
          phone VARCHAR,
          email VARCHAR,
          status VARCHAR DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(organization_id, slug)
        )
      `);

      // Create user_profiles table
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_profiles (
          id VARCHAR PRIMARY KEY,
          organization_id VARCHAR REFERENCES organizations(id),
          branch_id VARCHAR REFERENCES branches(id),
          name VARCHAR NOT NULL,
          email VARCHAR UNIQUE NOT NULL,
          role VARCHAR DEFAULT 'user',
          status VARCHAR DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create plans table
      await client.query(`
        CREATE TABLE IF NOT EXISTS plans (
          id VARCHAR PRIMARY KEY,
          organization_id VARCHAR REFERENCES organizations(id),
          branch_id VARCHAR REFERENCES branches(id),
          title VARCHAR NOT NULL,
          description TEXT,
          start_date DATE,
          end_date DATE,
          status VARCHAR DEFAULT 'active',
          priority VARCHAR DEFAULT 'medium',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create tasks table
      await client.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id VARCHAR PRIMARY KEY,
          plan_id VARCHAR REFERENCES plans(id),
          title VARCHAR NOT NULL,
          description TEXT,
          status VARCHAR DEFAULT 'pending',
          priority VARCHAR DEFAULT 'medium',
          assigned_to VARCHAR,
          due_date DATE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      console.log('✅ Database schema created successfully');
    } finally {
      client.release();
    }
  }

  // Organizations
  static async getOrganizations() {
    if (!isPostgresConfigured()) {
      console.warn("Postgres not configured - returning empty organizations");
      return [];
    }
    const client = await this.checkPostgres();
    try {
      const res = await client.query('SELECT * FROM organizations ORDER BY name');
      return res.rows;
    } finally {
      client.release();
    }
  }

  static async getOrganizationBySlug(slug) {
    const client = await this.checkPostgres();
    try {
      const res = await client.query('SELECT * FROM organizations WHERE slug = $1', [slug]);
      return res.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Branches
  static async getBranches(organizationId) {
    const client = await this.checkPostgres();
    try {
      const res = await client.query(
        'SELECT * FROM branches WHERE organization_id = $1 ORDER BY name',
        [organizationId]
      );
      return res.rows;
    } finally {
      client.release();
    }
  }

  static async getBranchBySlug(organizationId, slug) {
    const client = await this.checkPostgres();
    try {
      const res = await client.query(
        'SELECT * FROM branches WHERE organization_id = $1 AND slug = $2',
        [organizationId, slug]
      );
      return res.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // User Profiles
  static async getUserProfiles(organizationId, branchId) {
    const client = await this.checkPostgres();
    try {
      const res = await client.query(
        'SELECT * FROM user_profiles WHERE organization_id = $1 AND branch_id = $2 ORDER BY name',
        [organizationId, branchId]
      );
      return res.rows;
    } finally {
      client.release();
    }
  }

  // Plans
  static async getPlans(organizationId, branchId) {
    const client = await this.checkPostgres();
    try {
      const res = await client.query(
        'SELECT * FROM plans WHERE organization_id = $1 AND branch_id = $2 ORDER BY created_at DESC',
        [organizationId, branchId]
      );
      return res.rows;
    } finally {
      client.release();
    }
  }

  static async createPlan(planData) {
    const client = await this.checkPostgres();
    try {
      const { id, organization_id, branch_id, title, description, start_date, end_date, status, priority } = planData;
      const res = await client.query(
        `INSERT INTO plans (id, organization_id, branch_id, title, description, start_date, end_date, status, priority)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [id, organization_id, branch_id, title, description, start_date, end_date, status, priority]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  }

  // Tasks
  static async getTasks(planId) {
    const client = await this.checkPostgres();
    try {
      const res = await client.query(
        'SELECT * FROM tasks WHERE plan_id = $1 ORDER BY created_at DESC',
        [planId]
      );
      return res.rows;
    } finally {
      client.release();
    }
  }

  static async createTask(taskData) {
    const client = await this.checkPostgres();
    try {
      const { id, plan_id, title, description, status, priority, assigned_to, due_date } = taskData;
      const res = await client.query(
        `INSERT INTO tasks (id, plan_id, title, description, status, priority, assigned_to, due_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [id, plan_id, title, description, status, priority, assigned_to, due_date]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  }

  static async updateTaskStatus(taskId, status) {
    const client = await this.checkPostgres();
    try {
      const res = await client.query(
        'UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [status, taskId]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  }
}
