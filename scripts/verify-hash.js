const bcrypt = require('bcryptjs');

const password = 'socialengagementgroup';
const hash = '$2a$10$7R9r.N3f5fXoYpD.mYyNze5S6Hw7j9Y3v.WfQ/J6Q0Y2fW1g0n3/y';

const isMatch = bcrypt.compareSync(password, hash);
console.log('Password:', password);
console.log('Hash:', hash);
console.log('Match:', isMatch);
