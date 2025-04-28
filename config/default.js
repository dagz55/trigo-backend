module.exports = {
  server: {
    port: process.env.PORT || 3002,
    env: process.env.NODE_ENV || 'development',
  },
  cors: {
    origins: process.env.NODE_ENV === 'production' 
      ? ['https://passenger.trigo.com', 'https://driver.trigo.com', 'https://dispatcher.trigo.com'] 
      : '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-development-secret-key-do-not-use-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    anonKey: process.env.SUPABASE_ANON_KEY
  }
};
