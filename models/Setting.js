const mongoose = require('mongoose');

// Single document holding company-wide information shown in header, footer and contact page.
const settingSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    tagline: String,
    shortTagline: String,
    description: String,
    contactPerson: String,
    phone: String,
    whatsapp: String,
    email: String,
    address: String,
    city: String,
    state: String,
    workingHours: String,
    mapEmbedUrl: String,
    socials: {
      facebook: String,
      instagram: String,
      youtube: String,
      linkedin: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Setting || mongoose.model('Setting', settingSchema);
