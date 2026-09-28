const mongoose = require('mongoose');

// Text content of each page, split into named sections.
// e.g. page "home" -> sections.hero = { eyebrow, title, subtitle, body }
const sectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    eyebrow: String,
    title: String,
    subtitle: String,
    body: String,
    ctaText: String,
    ctaLink: String,
    image: String, // background image URL, e.g. /images/hero-home.jpg
  },
  { _id: false }
);

const pageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    metaDescription: String,
    sections: [sectionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Page || mongoose.model('Page', pageSchema);
