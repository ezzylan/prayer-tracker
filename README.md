# PrayEZ

A simple web-based Islamic prayer tracker built with Nuxt.

## Features

-   Track today's prayers
-   Track missed prayers

## Tech Stack

**Client:** Nuxt + Nuxt UI

**Server:** Turso (LibSQL) + Drizzle ORM, Better Auth

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

-   `NUXT_TURSO_DATABASE_URL`
-   `NUXT_TURSO_AUTH_TOKEN`
-   `BETTER_AUTH_SECRET`
-   `BETTER_AUTH_URL`
-   `NUXT_GOOGLE_CLIENT_ID`
-   `NUXT_GOOGLE_CLIENT_SECRET`
-   `NUXT_GITHUB_CLIENT_ID` (used in dev env only)
-   `NUXT_GITHUB_CLIENT_SECRET` (used in dev env only)

For easy setup, just duplicate the `.env.example` file and start from there.

## Roadmap

-   [ ] PWA support
-   [ ] Show today's prayer times

## License

[MIT](https://choosealicense.com/licenses/mit/)
