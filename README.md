# DreamRobotics Website — Next.js Full-Stack

One Next.js project for everything: pages (frontend) + API routes (backend) + MongoDB (Mongoose) + Tailwind CSS.
All page text and every list (services, products, projects, 3D-printing steps, values, contact details) is stored in MongoDB.

- App (website + API): **http://localhost:30010**
- API base: **http://localhost:30010/api**

## Pages
- `/` Home — hero, What We Do, Idea → Solution, Products, Projects
- `/about` About — story, mission, vision, values, technology areas
- `/services` Services — all services, Why Us, 3D printing services + how it works
- `/contact` Contact — Rahul Kumar, 7542981219, Bokaro; enquiry form saved to MongoDB; map

## Setup
Requirements: Node.js 18.18+ and MongoDB (local or MongoDB Atlas).

```bash
npm install
cp .env.example .env.local     # set MONGODB_URI and ADMIN_KEY
npm run seed                   # loads all website content into MongoDB
npm run dev                    # http://localhost:30010
```
Production: `npm run build && npm start`

## How it works
- **Pages** (server components) read MongoDB directly through `lib/queries.js` — no extra HTTP call.
- **API routes** in `app/api/**/route.js` expose the same data for admin tools, mobile apps, etc.
- **Contact form** (client component) posts to `/api/enquiries`.
- Pages render fresh on every request, so DB changes show immediately.

## API
Public:
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/settings` | Company info |
| GET | `/api/pages` · `/api/pages/:slug` | Page text (`home`, `about`, `services`, `contact`) |
| GET | `/api/items?type=product,project` | Lists (`featured=true`, `all=true` optional) |
| GET | `/api/items/:id` · `/api/items/types` | Single item · allowed types |
| POST | `/api/enquiries` | Contact form (`name`, `phone`, `email`, `service`, `message`) |

Admin login: open **/admin** and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` (default `admin@dreamrobotics.in` / `Admin@12345`, created by `npm run seed`).

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` → sets session cookie |
| POST | `/api/auth/logout` | Clears session |
| GET | `/api/auth/me` | Logged-in admin |

Admin (logged-in session cookie, or header `x-admin-key: <ADMIN_KEY>`):
| Method | Endpoint |
|---|---|
| PUT | `/api/settings` |
| POST | `/api/pages`, `/api/items` |
| PUT / DELETE | `/api/pages/:slug`, `/api/items/:id` |
| GET | `/api/enquiries?status=new` |
| PATCH / DELETE | `/api/enquiries/:id` |

Item types: `what-we-do`, `journey`, `service`, `why-us`, `printing-service`, `printing-step`, `product`, `project`, `value`, `tech-area`.
Icons use [lucide](https://lucide.dev/icons) names (`Bot`, `Printer`, `Wifi`, …).

### Examples
```bash
# Add a product
curl -X POST http://localhost:30010/api/items \
  -H "Content-Type: application/json" -H "x-admin-key: change-this-secret-key" \
  -d '{"type":"product","title":"Line Follower Kit","description":"Beginner robot kit","icon":"Bot","tags":["Kits"],"order":7}'

# Add email to company info
curl -X PUT http://localhost:30010/api/settings \
  -H "Content-Type: application/json" -H "x-admin-key: change-this-secret-key" \
  -d '{"email":"info@dreamrobotics.in"}'

# List contact-form enquiries
curl http://localhost:30010/api/enquiries -H "x-admin-key: change-this-secret-key"
```

## Structure
```
app/
  page.js, about/, services/, contact/     website pages
  api/                                     backend (route handlers)
    health, settings, pages/[slug], items/[id], items/types, enquiries/[id]
  layout.js, globals.css, not-found.js
components/   Navbar, Footer, ContactForm, Icon, ui
lib/          db.js (Mongo connection), queries.js (data), http.js (API helpers), seed-data.js
models/       Setting, Page, Item, Enquiry
scripts/      seed.js
```
# dreamRobotics
