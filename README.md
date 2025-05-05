<div align="center">

<img src="./public/Logo.png" />

#### Created by Aryan Gera (gera25aryan@ncssm.edu)
Loops provide students with easy access to essential shopping, dining, and recreational activities during their time on campus. This web application provides student life a way to conviently publish and keep track of loops and allows students to securely sign up for these loops.

</div>

## TODO:
VALIDATE ALL QUERY PARAMS SO NO GLITCHES HAPPENED

## Libraries and Equipment
* [Next.js 15](https://nextjs.org) - Industry leading full stack website development framework
* [React 19](https://react.dev) - Library for building highly interactive websites
* [MongoDB](https://www.mongodb.com) - NoSQL Document Database
* [Typescript](https://www.typescriptlang.org) - Typed programming language build on top of Javascript

## Bug Reporting


## How to Contribute


## Env Vars
```
MONGODB_URI=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

### Get Started Instructions

First, run `npm i` to install dependencies.

Then, run `npx auth secret`. This creates a `.env.local` file in the root folder and populates the `AUTH_SECRET` enviorment variable.

Then, link MongoDB. I created a free cluster through the MongoDB online dashboard, created an admin user, and copy pasted the connect uri into the `MONGODB_URI` enviorment variable.

Then, go to Google Cloud, create a new project, set up the conset screen, and generate an OAuth2 Key. The JS Origin is `http://localhost:3000`. The redirect is `https://localhost:3000/api/auth/callback/google`. Then, copy the Client ID and paste it into the `AUTH_GOOGLE_ID` enviorment variable. Then, copy the Client Secret and paste it into the `AUTH_GOOGLE_SECRET` enviorment variable.

Finally, run `npm run dev`