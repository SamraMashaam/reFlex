// backend/scripts/checkPassword.js
const bcrypt = require('bcryptjs');

const hashedPassword = '$2b$10$e4Ri1Bd2kvuwPQ5UcN/lVeWVd5HvhqbFSlXpNP3rIozcbgnUPpeP2';
const testPasswords = ['Password123!', 'password', '12345678', '22I-0798'];

for (const testPassword of testPasswords) {
  bcrypt.compare(testPassword, hashedPassword).then(isMatch => {
    console.log(`Password "${testPassword}" matches: ${isMatch}`);
  }).catch(err => console.error('Error:', err));
}