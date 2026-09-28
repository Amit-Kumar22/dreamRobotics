/* All website content, taken from the DreamRoboticsLab PDFs.
   Run `npm run seed` to (re)load it into MongoDB. Edit here or through the API. */

const settings = {
  companyName: 'DreamRobotics',
  tagline: 'Turning Ideas Into Technology',
  shortTagline: 'Robotics • IoT • Drones • 3D Printing • Automation',
  description:
    'DreamRobotics is a technology-driven organization focused on robotics, electronics, IoT, drone technology, automation, and 3D printing.',
  contactPerson: 'Rahul Kumar',
  phone: '+91 7542981219',
  whatsapp: '917542981219',
  email: '',
  address: 'Bokaro Steel City',
  city: 'Bokaro',
  state: 'Jharkhand, India',
  workingHours: 'Mon – Sat, 10:00 AM – 7:00 PM',
  mapEmbedUrl: 'https://www.google.com/maps?q=Bokaro+Steel+City,+Jharkhand&output=embed',
  socials: { facebook: '', instagram: '', youtube: '', linkedin: '' },
};

const pages = [
  {
    slug: 'home',
    title: 'Home',
    metaDescription:
      'DreamRobotics — robotics, electronics, IoT, drones, automation and 3D printing solutions in Bokaro.',
    sections: [
      {
        key: 'hero',
        eyebrow: 'Robotics • IoT • Drones • 3D Printing • Automation',
        title: 'Turning Ideas Into Technology',
        subtitle:
          'We design, develop, prototype, and deliver practical technology solutions for students, educational institutions, startups, businesses, and industries.',
        body: 'Learn. Build. Innovate.',
        ctaText: 'Start Your Project',
        ctaLink: '/contact',
        image: '/images/hero-home.jpg',
      },
      {
        key: 'whatWeDo',
        eyebrow: 'What We Do',
        title: 'Technology under one roof',
        subtitle:
          'From embedded hardware to connected systems, drones and fabrication — we cover the full journey of building technology.',
      },
      {
        key: 'journey',
        eyebrow: 'From Idea to Reality',
        title: 'How an idea becomes a working solution',
        subtitle:
          'We combine hardware, software, engineering, and fabrication to create practical solutions for real-world problems.',
      },
      {
        key: 'products',
        eyebrow: 'Products',
        title: 'Technology products for learning, building & innovation',
        subtitle:
          'Robotics, electronics, and technology products designed for students, makers, educators, engineers, and innovators.',
        body: 'Cannot find what you need? We can help source, design, modify, or develop components according to your project requirements.',
      },
      {
        key: 'projects',
        eyebrow: 'Projects',
        title: 'Building technology for real-world applications',
        subtitle:
          'Our projects combine electronics, programming, mechanical design, robotics, IoT, drones, automation, and 3D printing to create practical solutions.',
      },
      {
        key: 'cta',
        title: "Let's Build Something Amazing",
        subtitle: 'Have an idea, project, or requirement? Talk to us and let’s turn your idea into a working solution.',
        ctaText: 'Talk to Us',
        ctaLink: '/contact',
      },
    ],
  },
  {
    slug: 'about',
    title: 'About Us',
    metaDescription: 'About DreamRobotics — building skills, creating solutions and driving innovation.',
    sections: [
      {
        key: 'hero',
        eyebrow: 'About DreamRobotics',
        title: 'Building Skills. Creating Solutions. Driving Innovation.',
        subtitle:
          'DreamRobotics is a technology-focused organization working in the fields of robotics, electronics, IoT, drone technology, automation, and 3D printing.',
        image: '/images/hero-about.jpg',
      },
      {
        key: 'story',
        eyebrow: 'Who We Are',
        title: 'Making advanced technology accessible',
        body:
          'Our goal is to make advanced technology more accessible through practical learning, innovative products, engineering projects, and customized technology solutions.\n\nWe believe that the best way to understand technology is to build it, test it, improve it, and use it to solve real problems.',
      },
      {
        key: 'mission',
        title: 'Our Mission',
        body: 'To create practical technology solutions and learning experiences that encourage innovation, creativity, engineering skills, and problem-solving.',
      },
      {
        key: 'vision',
        title: 'Our Vision',
        body: 'To build a community where students, makers, engineers, startups, and businesses can learn, experiment, prototype, and develop innovative technology.',
      },
      { key: 'values', eyebrow: 'What We Believe', title: 'The principles behind our work' },
      { key: 'techAreas', eyebrow: 'Our Technology Areas', title: 'What we work with every day' },
      {
        key: 'cta',
        title: 'DreamRobotics — Where Ideas Become Reality.',
        subtitle: 'Have an idea, project, or requirement? Let’s build it together.',
        ctaText: 'Get in Touch',
        ctaLink: '/contact',
      },
    ],
  },
  {
    slug: 'services',
    title: 'Services',
    metaDescription:
      'Robotics & STEM training, project development, IoT, drones, automation, custom electronics and 3D printing services.',
    sections: [
      {
        key: 'hero',
        eyebrow: 'Services',
        title: 'Technology Services From Learning to Development',
        subtitle:
          'DreamRobotics provides technology services covering education, prototyping, engineering, automation, and product development.',
        image: '/images/hero-services.jpg',
      },
      { key: 'services', eyebrow: 'What We Offer', title: 'Our services' },
      { key: 'whyUs', eyebrow: 'Why Work With Us?', title: 'Built to work, not just to present' },
      {
        key: 'printing',
        eyebrow: '3D Printing',
        title: 'From Digital Design to Physical Reality',
        subtitle:
          'We provide 3D printing and rapid prototyping services for students, makers, engineers, startups, designers, and businesses — turning your 3D model or idea into a physical part for testing, demonstration, education, or functional use.',
      },
      { key: 'printingSteps', eyebrow: 'How It Works', title: 'Five steps to your printed part' },
      {
        key: 'cta',
        title: 'Have a Requirement?',
        subtitle: 'Tell us what you want to build. DreamRobotics can help you move from an idea to a working solution.',
        ctaText: 'Get a Quotation',
        ctaLink: '/contact',
      },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact',
    metaDescription: 'Contact DreamRobotics in Bokaro for projects, training, 3D printing and products.',
    sections: [
      {
        key: 'hero',
        eyebrow: 'Contact Us',
        title: 'Let’s turn your idea into a working solution',
        subtitle:
          'Whether you have a concept, college project, prototype requirement, or industrial challenge — send us the details and we will get back to you.',
        image: '/images/hero-contact.jpg',
      },
      {
        key: 'form',
        title: 'Send us your requirement',
        subtitle: 'Share your design, dimensions, image reference, or idea. We usually respond within one working day.',
      },
    ],
  },
];

const i = (type, title, description, icon, extra = {}) => ({ type, title, description, icon, ...extra });

const items = [
  // Home — What We Do
  i('what-we-do', 'Robotics & Electronics', 'Build innovative robotic and electronic systems using modern hardware, embedded technology, and programming.', 'Bot'),
  i('what-we-do', 'IoT & Automation', 'Develop connected systems for monitoring, control, data collection, and automation.', 'Wifi'),
  i('what-we-do', 'Drone Technology', 'Develop and work with drone-based solutions for education, monitoring, agriculture, and other applications.', 'Plane'),
  i('what-we-do', '3D Printing', 'Convert digital designs into physical prototypes, components, models, and functional parts.', 'Printer'),
  i('what-we-do', 'Custom Projects', 'From a simple concept to a working prototype, we help bring technology ideas to life.', 'Lightbulb'),
  i('what-we-do', 'STEM Training', 'Hands-on workshops and courses that teach robotics, coding, and electronics by building real projects.', 'GraduationCap'),

  // Home — journey
  i('journey', 'Idea', 'Share your concept or problem.', 'Lightbulb'),
  i('journey', 'Design', 'Plan the system, circuits and models.', 'PenTool'),
  i('journey', 'Development', 'Build hardware and write software.', 'Code'),
  i('journey', 'Prototype', 'Assemble a working first version.', 'Box'),
  i('journey', 'Testing', 'Validate, measure and improve.', 'FlaskConical'),
  i('journey', 'Solution', 'Deliver a practical, working result.', 'Rocket'),

  // Services
  i('service', 'Robotics & STEM Training', 'Hands-on training programs covering robotics, electronics, Arduino, programming, sensors, motors, and automation.', 'GraduationCap', { featured: true }),
  i('service', 'Project Development', 'Development of student, academic, research, and customized technology projects.', 'Wrench', { featured: true }),
  i('service', 'IoT Solutions', 'Design and development of IoT systems for monitoring, automation, data collection, and remote control.', 'Wifi', { featured: true }),
  i('service', 'Drone Solutions', 'Drone-related development, experimentation, training, and application-focused solutions.', 'Plane'),
  i('service', 'Automation', 'Customized automation systems for monitoring, control, and repetitive processes.', 'Settings'),
  i('service', '3D Printing & Prototyping', 'Rapid prototyping and custom 3D printing for products, projects, mechanical components, and educational applications.', 'Printer', { featured: true }),
  i('service', 'Custom Electronics', 'Development and integration of electronic systems, sensor-based solutions, controllers, and embedded systems.', 'CircuitBoard'),
  i('service', 'Smart Agriculture', 'Technology solutions combining IoT, sensors, automation, and drone-based monitoring for modern agriculture.', 'Sprout'),

  // Why us
  i('why-us', 'Practical Expertise', 'We focus on working solutions rather than only theoretical concepts.', 'Hammer'),
  i('why-us', 'Custom Solutions', 'Every project can be adapted to its specific requirements.', 'Puzzle'),
  i('why-us', 'End-to-End Development', 'From concept and design to prototype and implementation.', 'Workflow'),
  i('why-us', 'Multiple Technologies', 'Robotics, electronics, IoT, drones, automation, and 3D printing under one roof.', 'Layers'),
  i('why-us', 'Local Support', 'Based in Bokaro, so we can meet in person, visit your site, and support you after delivery.', 'MapPin'),
  i('why-us', 'Fair Pricing', 'Clear quotations that fit student, institution, and business budgets.', 'BadgeIndianRupee'),

  // 3D printing services
  i('printing-service', 'Prototype Development', 'Create physical prototypes before moving toward final production.', 'Box'),
  i('printing-service', 'Custom Parts', 'Print brackets, mounts, enclosures, adapters, mechanical parts, and other custom components.', 'Cog'),
  i('printing-service', 'Educational Models', 'Create robotics parts, engineering models, STEM teaching aids, and demonstration models.', 'GraduationCap'),
  i('printing-service', 'Replacement Parts', 'Recreate selected plastic components and parts that are difficult to source.', 'RefreshCw'),
  i('printing-service', 'Product Development', 'Support startups and businesses during the design and prototyping stage.', 'Rocket'),
  i('printing-service', 'Custom 3D Design', "Don't have a 3D model? We can help create a printable design based on your requirements.", 'PenTool'),

  // 3D printing steps
  i('printing-step', 'Share Your Requirement', 'Send your design, dimensions, image, or idea.', 'Send'),
  i('printing-step', 'Design & Review', 'We prepare or review the 3D model.', 'PenTool'),
  i('printing-step', 'Print', 'The part is manufactured using 3D printing.', 'Printer'),
  i('printing-step', 'Quality Check', 'The printed component is inspected before delivery.', 'ShieldCheck'),
  i('printing-step', 'Delivery', 'Receive your finished 3D-printed part.', 'Truck'),

  // Products
  i('product', 'Robotics Kits', 'Hands-on robotics kits for learning electronics, programming, sensors, motors, and automation.', 'Bot', { tags: ['Learning', 'Kits'] }),
  i('product', 'Arduino & Electronics', 'Arduino boards, sensors, modules, motors, displays, electronic components, and development accessories.', 'Cpu', { tags: ['Arduino', 'Sensors'] }),
  i('product', 'IoT Components', 'Microcontrollers, communication modules, sensors, and components for building connected IoT projects.', 'Wifi', { tags: ['IoT', 'Modules'] }),
  i('product', 'Drone Components', 'Selected drone components and accessories for learning, experimentation, and project development.', 'Plane', { tags: ['Drones'] }),
  i('product', 'Educational Kits', 'Project-based technology kits designed to help students learn by building practical projects.', 'GraduationCap', { tags: ['STEM', 'Students'] }),
  i('product', '3D Printed Products', 'Custom-designed and 3D-printed components, models, enclosures, brackets, educational models, and project parts.', 'Printer', { tags: ['Custom', '3D Printing'] }),

  // Projects
  i('project', 'Smart Agriculture', 'IoT-based agriculture solutions for monitoring environmental conditions, soil parameters, water usage, and farm operations.', 'Sprout', { tags: ['IoT', 'Sensors'] }),
  i('project', 'Drone Crop Monitoring', 'Drone-based systems for agricultural monitoring, aerial observation, and technology-assisted crop management.', 'Plane', { tags: ['Drones', 'Agriculture'] }),
  i('project', 'Robotics Projects', 'Custom robotic systems developed for education, experimentation, competitions, research, and practical applications.', 'Bot', { tags: ['Robotics'] }),
  i('project', 'IoT Projects', 'Connected monitoring and automation systems using sensors, microcontrollers, communication networks, and dashboards.', 'Wifi', { tags: ['IoT', 'Dashboards'] }),
  i('project', 'Automation Projects', 'Technology solutions designed to automate repetitive tasks, monitoring, control, and industrial processes.', 'Settings', { tags: ['Automation', 'Industry'] }),
  i('project', 'Educational Projects', 'Hands-on STEM and robotics projects designed to help students understand technology through practical implementation.', 'GraduationCap', { tags: ['STEM'] }),

  // About — values
  i('value', 'Learn by Building', 'Practical experience creates deeper understanding.', 'Hammer'),
  i('value', 'Innovation Through Experimentation', 'Every experiment is an opportunity to learn something new.', 'FlaskConical'),
  i('value', 'Technology With Purpose', 'Technology should solve real problems and create meaningful value.', 'Target'),
  i('value', 'From Learning to Real-World Application', 'We connect education, engineering, and practical applications.', 'Rocket'),
  i('value', 'Quality in Every Detail', 'We test, measure, and refine until the solution works reliably.', 'ShieldCheck'),
  i('value', 'Community & Collaboration', 'We grow by sharing knowledge with students, makers, and partners.', 'Users'),

  // About — technology areas
  ...[
    ['Robotics', 'Bot'],
    ['Arduino & Electronics', 'Cpu'],
    ['IoT', 'Wifi'],
    ['Embedded Systems', 'CircuitBoard'],
    ['Drone Technology', 'Plane'],
    ['Automation', 'Settings'],
    ['3D Design & Printing', 'Printer'],
    ['Prototyping', 'Box'],
    ['Smart Agriculture', 'Sprout'],
    ['STEM Education', 'GraduationCap'],
  ].map(([title, icon]) => i('tech-area', title, '', icon)),
];

// order within each type = position in the list above
const counters = {};
items.forEach((item) => {
  counters[item.type] = (counters[item.type] || 0) + 1;
  item.order = counters[item.type];
});

// Sample contact-form enquiries so the admin panel has data to show
const enquiries = [
  { name: 'Ankit Sharma', phone: '+91 9876543210', email: 'ankit.sharma@example.com', service: 'Project Development', message: 'Need help building a line follower robot for my final year B.Tech project.', status: 'new' },
  { name: 'Priya Verma', phone: '+91 9123456780', email: 'priya.verma@example.com', service: 'Robotics & STEM Training', message: 'Looking for a 2-week robotics summer workshop for class 8–10 students at our school.', status: 'new' },
  { name: 'Rohit Singh', phone: '+91 9988776655', email: 'rohit.singh@example.com', service: '3D Printing & Prototyping', message: 'Want 20 custom enclosures 3D printed for an IoT sensor box. I have the STL file.', status: 'contacted' },
  { name: 'Neha Gupta', phone: '+91 9090909090', email: 'neha.gupta@example.com', service: 'IoT Solutions', message: 'Need a soil moisture monitoring system with mobile alerts for a 2-acre farm.', status: 'new' },
  { name: 'Vikash Kumar', phone: '+91 8877665544', email: 'vikash.kumar@example.com', service: 'Automation', message: 'Can you automate the conveyor counting process in our small packaging unit?', status: 'contacted' },
  { name: 'Sneha Mishra', phone: '+91 7766554433', email: 'sneha.mishra@example.com', service: 'Drone Solutions', message: 'Interested in a drone training session for our college technical club.', status: 'closed' },
];

// Default admin login — override with ADMIN_EMAIL / ADMIN_PASSWORD in .env.local
const admin = {
  name: process.env.ADMIN_NAME || 'Rahul Kumar',
  email: process.env.ADMIN_EMAIL || 'admin@dreamrobotics.in',
  password: process.env.ADMIN_PASSWORD || 'Admin@12345',
};

module.exports = { settings, pages, items, enquiries, admin };
