const bcrypt = require('bcryptjs');

const password = 'socialengagementgroup';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('--- Fresh Hash Generation ---');
console.log('Password:', password);
console.log('New Hash:', hash);
console.log('Verification Match:', bcrypt.compareSync(password, hash));
