import dotenv from 'dotenv';

const envPath = '.env.' + process.env.NODE_ENV || '.env';

dotenv.config({ path: envPath });
