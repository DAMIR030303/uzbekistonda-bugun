// Dynamic import for server-side only
let Pool;

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
let pool = null;

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
export const getPostgresPool = async () => {
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
      pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
      });
    } else {
      throw new Error('Postgres can only be used on server-side');
    }
  }
  return pool;
};

// Postgres client-ni olish
export const getPostgresClient = async () => {
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
