# React + Vite

## Local development

Run `node index.js` from `server/` and `npm run dev` from the project root
in separate terminals. The Vite development server proxies `/api` requests
to `http://127.0.0.1:5000`, so backend errors appear in the local server terminal.
Restart Vite after changing its configuration.

The admin dashboard is available at `/admin`. Its default password is
`Admin123` (case-sensitive); set `ADMIN_TOKEN` in the server environment to
change it. Copy the root `.env.example` to `server/.env` and set the Supabase
credentials there; the server loads its environment from its working directory.
Before using the catalog editor, run `server/schema.sql` in the Supabase SQL
editor. This also creates the public `catalog-images` Storage bucket used for
hotel, room, and car photos. Re-run the updated schema if your Supabase
`admin_cars` table already existed so it gains the `images` column. In the admin dashboard, choose **Import current
listings** once to populate the editable hotel, room, flight, car, activity,
and package catalog. After that, customer-facing pages load the saved catalog
from the API. Hotel, room, and car photos can be selected from a phone or
computer; the first photo is the cover image, and each upload is limited to 7 MB.
Use the admin **Itinerary** section to add, edit, or remove events for arrival,
explore, free, and departure days. Saved itinerary templates are stored in the
existing `admin_settings` table and are published to customer trip pages.
The same schema also creates the protected `admin_settings` table. Use the
admin **Payment Settings** section to update the Bitcoin receiving address;
new payment sessions and unpaid pending sessions use the saved address when
their payment page is opened again. Payments already detected or confirmed
keep their assigned address. The `BTC_RECEIVING_ADDRESS` server environment
variable remains the fallback until an address is saved in admin.
After deploying the frontend, deploy or restart the Express backend as well;
the payment settings API route must be live before the admin can save changes.

## Supabase inactivity keep-alive

The repository includes a GitHub Actions workflow that makes a small authenticated
database read once per day through the server. Configure `SUPABASE_KEEPALIVE_TOKEN`
as an environment variable on the API server and as a GitHub Actions repository
secret with the same long, random value. Do not commit the token. The API server
must be deployed with `/api/keepalive` available for the workflow to run.

This best-effort request may help show regular activity, but GitHub schedules can
be delayed and Supabase does not guarantee that pings prevent a Free project from
being paused. Supabase documents upgrading to Pro as the way to guarantee no
inactivity pause.

Production builds default to `https://api.havenway-travels.cv`.
To use a different backend, set `VITE_API_BASE_URL` in `.env.local` and restart
Vite (or rebuild for production). This URL is public configuration; never put
server credentials in a `VITE_` variable.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
