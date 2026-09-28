/* Loads all website content into MongoDB.  Run: npm run seed
   Sample enquiries are added only when there are none, so real ones are never touched.
   The admin user is created if it does not exist yet. */
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../lib/db');
const Setting = require('../models/Setting');
const Page = require('../models/Page');
const Item = require('../models/Item');
const Enquiry = require('../models/Enquiry');
const Admin = require('../models/Admin');
const { settings, pages, items, enquiries, admin } = require('../lib/seed-data');

(async () => {
  try {
    await connectDB();
    await Promise.all([Setting.deleteMany({}), Page.deleteMany({}), Item.deleteMany({})]);
    await Setting.create(settings);
    await Page.insertMany(pages);
    for (const item of items) await Item.create(item); // create() so the slug hook runs
    console.log(`Seeded: 1 settings, ${pages.length} pages, ${items.length} items`);

    if ((await Enquiry.countDocuments()) === 0) {
      await Enquiry.insertMany(enquiries);
      console.log(`Seeded: ${enquiries.length} sample enquiries`);
    }

    // Created once; after that the password is managed from /admin/profile.
    // Set RESET_ADMIN_PASSWORD=true to force it back to ADMIN_PASSWORD.
    const existing = await Admin.findOne({ email: admin.email.toLowerCase() });
    if (!existing || process.env.RESET_ADMIN_PASSWORD === 'true') {
      const user = existing || new Admin({ email: admin.email, name: admin.name });
      user.setPassword(admin.password);
      await user.save();
      console.log(`Admin login: ${admin.email} / ${admin.password}`);
    } else {
      console.log(`Admin ${admin.email} already exists (password unchanged)`);
    }
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
