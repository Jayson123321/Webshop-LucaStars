import mysql from "mysql2/promise";
import { Pool } from "mysql2/promise";

// Create a connection pool
export const pool: Pool = mysql.createPool({
    host: "db.hbo-ict.cloud",
    port: 3366,
    user: "pb4a2324_hiikuuziimuu29",
    password: "MI6kj9peKdASHqCM",
    database: "pb4a2324_hiikuuziimuu29_dev",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
});

export default pool;
