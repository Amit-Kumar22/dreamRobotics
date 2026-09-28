const crypto = require('crypto');
const mongoose = require('mongoose');

// Admin users who can log in at /admin. Passwords are stored as scrypt hashes, never plain text.
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: 'Admin' },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

// Stored format: "<salt hex>:<hash hex>"
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

adminSchema.methods.setPassword = function setPassword(password) {
  this.passwordHash = hashPassword(password);
};

adminSchema.methods.checkPassword = function checkPassword(password) {
  const [salt, hash] = String(this.passwordHash || '').split(':');
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = crypto.scryptSync(String(password), salt, expected.length);
  return crypto.timingSafeEqual(expected, actual);
};

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
module.exports.hashPassword = hashPassword;
