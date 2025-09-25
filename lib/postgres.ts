// Dynamic import for server-side only
let Pool: any, PoolClient: any;

// Postgres konfiguratsiyasi
const postgresConfig = {
  host: process.env.POSTGRES_HOST || process.env.PGHOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || process.env.PGPORT || '5432'),
  database: process.env.POSTGRES_DB || process.env.PGDATABASE || 'boshqaruv',
  user: process.env.POSTGRES_USER || process.env.PGUSER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Postgres connection pool
let pool: Pool | null = null;

// Postgres mavjudligini tekshirish funksiyasi
export const isPostgresConfigured = () => {
  return !!(
    (process.env.POSTGRES_HOST || process.env.PGHOST) &&
    (process.env.POSTGRES_DB || process.env.PGDATABASE) &&
    (process.env.POSTGRES_USER || process.env.PGUSER) &&
    (process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD)
  );
};

// Postgres pool-ni olish
export const getPostgresPool = async (): Promise<any> => {
  if (!pool) {
    if (!isPostgresConfigured()) {
      throw new Error('Postgres not configured. Please set POSTGRES_* environment variables.');
    }
    
    // Dynamic import for server-side only
    if (typeof window === 'undefined') {
      const pg = await import('pg');
      Pool = pg.Pool;
      pool = new Pool(postgresConfig);
      
      // Pool error handling
      pool.on('error', (err: any) => {
        console.error('Unexpected error on idle client', err);
      });
    } else {
      throw new Error('Postgres can only be used on server-side');
    }
  }
  return pool;
};

// Postgres client-ni olish
export const getPostgresClient = async (): Promise<any> => {
  const pool = await getPostgresPool();
  return await pool.connect();
};

// Postgres connection-ni yopish
export const closePostgresPool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

// Database types (Supabase bilan bir xil)
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          domain: string | null
          logo_url: string | null
          theme_colors: any
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          domain?: string | null
          logo_url?: string | null
          theme_colors?: any
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          domain?: string | null
          logo_url?: string | null
          theme_colors?: any
          settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      branches: {
        Row: {
          id: string
          organization_id: string
          name: string
          slug: string
          address: string | null
          phone: string | null
          email: string | null
          manager_id: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          slug: string
          address?: string | null
          phone?: string | null
          email?: string | null
          manager_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          slug?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          manager_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          organization_id: string
          branch_id: string | null
          first_name: string
          last_name: string
          avatar_url: string | null
          phone: string | null
          role: string
          permissions: any
          status: string
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id: string
          branch_id?: string | null
          first_name: string
          last_name: string
          avatar_url?: string | null
          phone?: string | null
          role: string
          permissions?: any
          status?: string
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          branch_id?: string | null
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          phone?: string | null
          role?: string
          permissions?: any
          status?: string
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          organization_id: string
          branch_id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          status: string
          priority: string
          assigned_to: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          branch_id: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          status?: string
          priority?: string
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          branch_id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          status?: string
          priority?: string
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          organization_id: string
          branch_id: string
          plan_id: string
          title: string
          description: string | null
          scenario: string | null
          status: string
          priority: string
          assigned_to: string | null
          due_date: string | null
          completed_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          branch_id: string
          plan_id: string
          title: string
          description?: string | null
          scenario?: string | null
          status?: string
          priority?: string
          assigned_to?: string | null
          due_date?: string | null
          completed_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          branch_id?: string
          plan_id?: string
          title?: string
          description?: string | null
          scenario?: string | null
          status?: string
          priority?: string
          assigned_to?: string | null
          due_date?: string | null
          completed_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
