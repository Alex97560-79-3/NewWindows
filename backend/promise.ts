import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'newwindows'
  }
});

async function main() {
  const products = await db('products').select('*');
  console.log(products);

  const product = await db('products').where({ id: 1 }).first();
  console.log(product);
}

main().catch(err => console.error(err));
