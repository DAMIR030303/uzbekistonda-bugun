import { getPostgresClient, isPostgresConfigured, type Database } from '@/lib/postgres';

type Organization = Database["public"]["Tables"]["organizations"]["Row"];
type Branch = Database["public"]["Tables"]["branches"]["Row"];
type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
type Plan = Database["public"]["Tables"]["plans"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"];

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

  // Organizations
  static async getOrganizations() {
    if (!isPostgresConfigured()) {
      console.warn("Postgres not configured - returning empty organizations");
      return [];
    }

    const client = await this.checkPostgres();
    try {
      const result = await client.query(
        'SELECT * FROM organizations ORDER BY name'
      );
      return result.rows as Organization[];
    } catch (error) {
      console.warn("Failed to fetch organizations:", error);
      return [];
    } finally {
      client.release();
    }
  }

  static async getOrganizationBySlug(slug: string) {
    const client = await this.checkPostgres();
    try {
      const result = await client.query(
        'SELECT * FROM organizations WHERE slug = $1',
        [slug]
      );
      if (result.rows.length === 0) {
        throw new Error('Organization not found');
      }
      return result.rows[0] as Organization;
    } finally {
      client.release();
    }
  }

  // Branches
  static async getBranches(organizationId: string) {
    if (!isPostgresConfigured()) {
      console.warn("Postgres not configured - returning empty branches");
      return [];
    }

    const client = await this.checkPostgres();
    try {
      const result = await client.query(
        'SELECT * FROM branches WHERE organization_id = $1 ORDER BY name',
        [organizationId]
      );
      return result.rows as Branch[];
    } catch (error) {
      console.warn("Failed to fetch branches:", error);
      return [];
    } finally {
      client.release();
    }
  }

  static async getBranchBySlug(organizationId: string, slug: string) {
    const client = await this.checkPostgres();
    try {
      const result = await client.query(
        'SELECT * FROM branches WHERE organization_id = $1 AND slug = $2',
        [organizationId, slug]
      );
      if (result.rows.length === 0) {
        throw new Error('Branch not found');
      }
      return result.rows[0] as Branch;
    } finally {
      client.release();
    }
  }

  // User Profiles
  static async getUserProfile(userId: string) {
    const client = await this.checkPostgres();
    try {
      const result = await client.query(`
        SELECT 
          up.*,
          o.name as organization_name,
          b.name as branch_name
        FROM user_profiles up
        LEFT JOIN organizations o ON up.organization_id = o.id
        LEFT JOIN branches b ON up.branch_id = b.id
        WHERE up.id = $1
      `, [userId]);
      
      if (result.rows.length === 0) {
        throw new Error('User profile not found');
      }
      
      return result.rows[0] as UserProfile & {
        organization_name: string;
        branch_name: string;
      };
    } finally {
      client.release();
    }
  }

  static async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ) {
    const client = await this.checkPostgres();
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
      
      const values = Object.values(updates);
      const query = `
        UPDATE user_profiles 
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await client.query(query, [userId, ...values]);
      return result.rows[0] as UserProfile;
    } finally {
      client.release();
    }
  }

  // Plans
  static async getPlans(organizationId: string, branchId?: string) {
    const client = await this.checkPostgres();
    try {
      let query = `
        SELECT 
          p.*,
          up_assigned.first_name as assigned_first_name,
          up_assigned.last_name as assigned_last_name,
          up_created.first_name as created_first_name,
          up_created.last_name as created_last_name
        FROM plans p
        LEFT JOIN user_profiles up_assigned ON p.assigned_to = up_assigned.id
        LEFT JOIN user_profiles up_created ON p.created_by = up_created.id
        WHERE p.organization_id = $1
      `;
      
      const params = [organizationId];
      
      if (branchId) {
        query += ' AND p.branch_id = $2';
        params.push(branchId);
      }
      
      query += ' ORDER BY p.created_at DESC';
      
      const result = await client.query(query, params);
      return result.rows as (Plan & {
        assigned_first_name: string | null;
        assigned_last_name: string | null;
        created_first_name: string | null;
        created_last_name: string | null;
      })[];
    } finally {
      client.release();
    }
  }

  static async createPlan(
    plan: Database["public"]["Tables"]["plans"]["Insert"]
  ) {
    const client = await this.checkPostgres();
    try {
      const result = await client.query(`
        INSERT INTO plans (
          id, organization_id, branch_id, title, description,
          start_date, end_date, status, priority, assigned_to, created_by,
          created_at, updated_at
        ) VALUES (
          COALESCE($1, gen_random_uuid()), $2, $3, $4, $5,
          $6, $7, COALESCE($8, 'draft'), COALESCE($9, 'medium'), $10, $11,
          NOW(), NOW()
        )
        RETURNING *
      `, [
        plan.id, plan.organization_id, plan.branch_id, plan.title, plan.description,
        plan.start_date, plan.end_date, plan.status, plan.priority, plan.assigned_to, plan.created_by
      ]);
      
      return result.rows[0] as Plan;
    } finally {
      client.release();
    }
  }

  static async updatePlan(planId: string, updates: Partial<Plan>) {
    const client = await this.checkPostgres();
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
      
      const values = Object.values(updates);
      const query = `
        UPDATE plans 
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await client.query(query, [planId, ...values]);
      return result.rows[0] as Plan;
    } finally {
      client.release();
    }
  }

  static async deletePlan(planId: string) {
    const client = await this.checkPostgres();
    try {
      await client.query('DELETE FROM plans WHERE id = $1', [planId]);
    } finally {
      client.release();
    }
  }

  // Tasks
  static async getTasks(
    organizationId: string,
    branchId?: string,
    planId?: string
  ) {
    const client = await this.checkPostgres();
    try {
      let query = `
        SELECT 
          t.*,
          up_assigned.first_name as assigned_first_name,
          up_assigned.last_name as assigned_last_name,
          up_created.first_name as created_first_name,
          up_created.last_name as created_last_name,
          p.title as plan_title
        FROM tasks t
        LEFT JOIN user_profiles up_assigned ON t.assigned_to = up_assigned.id
        LEFT JOIN user_profiles up_created ON t.created_by = up_created.id
        LEFT JOIN plans p ON t.plan_id = p.id
        WHERE t.organization_id = $1
      `;
      
      const params = [organizationId];
      let paramIndex = 2;
      
      if (branchId) {
        query += ` AND t.branch_id = $${paramIndex}`;
        params.push(branchId);
        paramIndex++;
      }
      
      if (planId) {
        query += ` AND t.plan_id = $${paramIndex}`;
        params.push(planId);
        paramIndex++;
      }
      
      query += ' ORDER BY t.created_at DESC';
      
      const result = await client.query(query, params);
      return result.rows as (Task & {
        assigned_first_name: string | null;
        assigned_last_name: string | null;
        created_first_name: string | null;
        created_last_name: string | null;
        plan_title: string;
      })[];
    } finally {
      client.release();
    }
  }

  static async createTask(
    task: Database["public"]["Tables"]["tasks"]["Insert"]
  ) {
    const client = await this.checkPostgres();
    try {
      const result = await client.query(`
        INSERT INTO tasks (
          id, organization_id, branch_id, plan_id, title, description,
          scenario, status, priority, assigned_to, due_date, completed_at, created_by,
          created_at, updated_at
        ) VALUES (
          COALESCE($1, gen_random_uuid()), $2, $3, $4, $5, $6,
          $7, COALESCE($8, 'pending'), COALESCE($9, 'medium'), $10, $11, $12, $13,
          NOW(), NOW()
        )
        RETURNING *
      `, [
        task.id, task.organization_id, task.branch_id, task.plan_id, task.title, task.description,
        task.scenario, task.status, task.priority, task.assigned_to, task.due_date, task.completed_at, task.created_by
      ]);
      
      return result.rows[0] as Task;
    } finally {
      client.release();
    }
  }

  static async updateTask(taskId: string, updates: Partial<Task>) {
    const client = await this.checkPostgres();
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
      
      const values = Object.values(updates);
      const query = `
        UPDATE tasks 
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await client.query(query, [taskId, ...values]);
      return result.rows[0] as Task;
    } finally {
      client.release();
    }
  }

  static async deleteTask(taskId: string) {
    const client = await this.checkPostgres();
    try {
      await client.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    } finally {
      client.release();
    }
  }

  // Database initialization
  static async initializeDatabase() {
    if (!isPostgresConfigured()) {
      console.warn("Postgres not configured - skipping database initialization");
      return;
    }

    const client = await this.checkPostgres();
    try {
      // Create tables if they don't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS organizations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          domain VARCHAR(255),
          logo_url TEXT,
          theme_colors JSONB,
          settings JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS branches (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL,
          address TEXT,
          phone VARCHAR(50),
          email VARCHAR(255),
          manager_id UUID,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(organization_id, slug)
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY,
          organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
          branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          avatar_url TEXT,
          phone VARCHAR(50),
          role VARCHAR(100) NOT NULL,
          permissions JSONB,
          status VARCHAR(50) DEFAULT 'active',
          last_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS plans (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
          branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          status VARCHAR(50) DEFAULT 'draft',
          priority VARCHAR(50) DEFAULT 'medium',
          assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
          created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
          branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
          plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          scenario TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          priority VARCHAR(50) DEFAULT 'medium',
          assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
          due_date TIMESTAMP,
          completed_at TIMESTAMP,
          created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      // Create indexes
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_branches_organization_id ON branches(organization_id);
        CREATE INDEX IF NOT EXISTS idx_user_profiles_organization_id ON user_profiles(organization_id);
        CREATE INDEX IF NOT EXISTS idx_user_profiles_branch_id ON user_profiles(branch_id);
        CREATE INDEX IF NOT EXISTS idx_plans_organization_id ON plans(organization_id);
        CREATE INDEX IF NOT EXISTS idx_plans_branch_id ON plans(branch_id);
        CREATE INDEX IF NOT EXISTS idx_tasks_organization_id ON tasks(organization_id);
        CREATE INDEX IF NOT EXISTS idx_tasks_branch_id ON tasks(branch_id);
        CREATE INDEX IF NOT EXISTS idx_tasks_plan_id ON tasks(plan_id);
      `);

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
