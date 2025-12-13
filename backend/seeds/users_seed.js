const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  // Hash password "123456" 
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Inserts seed entries
  await knex('users').insert([
    { id: 1, name: 'Admin User', email: 'admin@example.com', password_hash: hashedPassword, role: 'admin' },
    { id: 2, name: 'Manager User', email: 'manager@example.com', password_hash: hashedPassword, role: 'manager' },
    { id: 3, name: 'Assembler User', email: 'assembler@example.com', password_hash: hashedPassword, role: 'assembler' },
    { id: 4, name: 'Client User', email: 'client@example.com', password_hash: hashedPassword, role: 'client' },
    { id: 5, name: 'Guest User', email: 'guest@example.com', password_hash: hashedPassword, role: 'guest' }
  ]);
};