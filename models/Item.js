const mongoose = require('mongoose');

// Every list on the website (services, products, projects, process steps, values...) is an Item.
// The "type" field decides where it is displayed.
const ITEM_TYPES = [
  'what-we-do',       // Home: What We Do
  'journey',          // Home: Idea -> Solution steps
  'service',          // Services page
  'why-us',           // Services page: Why Work With Us
  'printing-service', // Services page: 3D printing services
  'printing-step',    // Services page: How 3D printing works
  'product',          // Products
  'project',          // Projects
  'value',            // About: What We Believe
  'tech-area',        // About: Technology Areas
];

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, enum: ITEM_TYPES, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Cpu' }, // lucide-react icon name
    image: String,
    tags: [String],
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

itemSchema.pre('save', function setSlug(next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.models.Item || mongoose.model('Item', itemSchema);
module.exports.ITEM_TYPES = ITEM_TYPES;
