import mysql from 'mysql2/promise';

const connectToDatabase = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'next_mysql',
});

export default connectToDatabase;
