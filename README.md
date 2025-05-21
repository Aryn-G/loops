<div align="center">

<img src="./public/Logo.png" />

#### Created by Aryan Gera (gera25aryan@ncssm.edu)
Loops provide students with easy access to essential shopping, dining, and recreational activities during their time on campus. This web application provides student life a way to conviently publish and keep track of loops and allows students to securely sign up for these loops.

</div>

## Libraries and Equipment
* [Next.js 15](https://nextjs.org) - Industry leading full stack website development framework
* [React 19](https://react.dev) - Library for building highly interactive websites
* [MongoDB Atlas](https://www.mongodb.com) - NoSQL Document Database
* [Typescript](https://www.typescriptlang.org) - Typed programming language build on top of Javascript
* [Auth.js V5](https://authjs.dev/) - A customizable library for authentication and session managmeent. 

## Prerequisites
```
node --version  # >= 20.18.0
npm --version   # >= 10.9.0 (or pnpm 9 or yarn 4)
```
Tools I used: VSCode + Prettier + TailwindCSS IntelliSense

## Get Started

### Env Vars
`.env.local`
```
AUTH_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_TRUST_HOST=true
MONGODB_URI=
```
`.env`
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```
*The VAPID keys were used for PWA push-notifications, but as of now, this feature is shelved. You can ignore creating these for now.*

### Set-up

First, run install dependencies:
```
npm install
```

Then, run the following command:
```
npx auth secret
```
This creates a `.env.local` file in the root folder and populates the `AUTH_SECRET` enviorment variable.

Then, go to Google Cloud, create a new project, set up the conset screen, and generate an OAuth2 Key. Set the JS Origin in the Cloud Console to whatever `AUTH_URL` is. If you are running a local deployment, then that will be `http://localhost:3000`. The redirect origin will be the `AUTH_URL` concatonated with  `/api/auth/callback/google`. If you are running a local deployment, that will look like `https://localhost:3000/api/auth/callback/google`. 

Then, copy the Client ID and paste it into the `AUTH_GOOGLE_ID` enviorment variable. Then, copy the Client Secret and paste it into the `AUTH_GOOGLE_SECRET` enviorment variable.

Then, link MongoDB. You can either do this in the online dashboard or run a local instance of MongoDB on your own computer. Either way, create a cluster and an admin user. Then, copy the Connection URI into the `MONGODB_URI` enviorment variable.

(OPTIONAL) You may have noticed the `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` enviorment variables. These can be left empty, as they are unused. The original purpose was for push notification in PWAs, but that feature was scrappped due to implementation issues. 

### Running Application

To start the application in development mode, run:
```
npm run dev
```

To run the application in production mode, run:
```
npm run build
npm run start
```

### Admin Accounts

If the account you are trying to grant access to has registered into the application, skip to the next section.

#### Creating an account

Go into the terminal and run:
```
npm run createAccount
```
Go through the prompts and set the user's role to Admin. When the users logs in to the account, they will have the role.

#### Granting access to an account that has already registered into the application.

Go into the terminal and run:
```
npm run accountRoles
```

Go through the prompts and change the account's role to Admin.

### Project Structure
```
repo/
├─ public/                  # Static assets
├─ src/
│  ├─ app/                  # App Router
│  │  ├─ page.tsx           # Landing page
│  │  ├─ api/...            # only for Auth.js
│  │  ├─ dashboard/...      # Admin + Loops UI
│  │  ├─ loops/...          # Loops pages
│  │  ├─ ...
│  │  ├─ _components/...    # Shared Components
│  │  ├─ _db/...            # Mongoose models and query helper functions
│  │  ├─ _lib/...           # Utilities
│  │  └─ globals.css        # Tailwind base styles
├─ scripts/                 # Node CLI helpers
├─ middleware.ts             
...
```