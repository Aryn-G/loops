<!-- <div align="center"> -->

# Loops
Loops provide students with easy access to essential shopping, dining, and recreational activities during their time on campus. This app provides student life staff a way to conviently publish and keep track of loops and allows students to securely sign up for these loops.

<!-- </div> -->

## Authors
Aryan Gera

## TODO:

Make site a PWA with new [Next.js 15 PWA Features](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps?utm_source=chatgpt.com)

## Libraries and Equipment
* [Next.js 15](https://nextjs.org) - Industry leading full stack website development framework
* [React 19](https://react.dev) - Library for building highly interactive websites
* [MongoDB](https://www.mongodb.com) - NoSQL Document Database
* [Typescript](https://www.typescriptlang.org) - Typed programming language build on top of Javascript

# Feature List
- [x] UI / UX / Branding
- [X] Authentication
- [x] Admin Role
  - [x] Assigning Roles
  - [x] Assigning Groups
- [x] Student Life Staff Role
  - [x] Posting Loops
  - [x] Editing Signups
- [x] Loops Page
  - [x] Searching Implements `opensearch.xml`
  - [x] Search Functionality using URL Paremeters (`loops.ncssm.edu/loops?q={params}`)
- [x] Student Role
- [ ] SEO
  - [ ] `robots.txt`
  - [ ] `sitemap.tsx`


# Priority List

## Design
|   Status    |    Date    |       Description        |
| :---------: | :--------: | :----------------------: |
|   Started   | 9/10/2024  | Desktop Designs in Figma |
|  Finished   | 10/10/2024 |       Checkpoint 1       |
| Not Started |    N/A     | Mobile Designs in Figma  |


## Authentication / Roles System
|  Status  |    Date    |                         Description                         |
| :------: | :--------: | :---------------------------------------------------------: |
| Started  | 10/16/2024 |                MongoDB / Mongoose Connection                |
| Finished | 10/16/2024 |                MongoDB / Mongoose Connection                |
| Started  | 10/16/2024 |                   Home Page / Login Page                    |
| Finished | 10/19/2024 |               Fixed `next/font/google` issues               |
| Finished | 10/19/2024 |                   Home Page / Login Page                    |
| Started  | 10/19/2024 |              OAuth on personal google account               |
| Finished | 10/21/2024 | OMGGGG FINALLY!!!!!!!! Finished role based OAuth w/ mongodb |
| Started  | 10/21/2024 |        Debugging OAuth Account Already Exists Error         |
| Started  | 10/26/2024 |                   Custom Mongoose Adapter                   |
| Finished | 10/26/2024 |                   Custom Mongoose Adapter                   |
| Started  | 10/26/2024 |                  Found OAuth Root Problem                   |
| Finished | 11/08/2024 |            FINALLYLLYLLYLYLLYY FIXED PROBLEM!!!             |

## Admin Dashboard
|  Status  |    Date    |               Description               |
| :------: | :--------: | :-------------------------------------: |
| Started  | 11/06/2024 |       Setting Users to Loops Role       |
| Finished | 11/06/2024 |       Setting Users to Loops Role       |
| Started  | 11/07/2024 | Managing Existing Users with Loops Role |
| Finished | 11/07/2024 | Managing Existing Users with Loops Role |


## Loops Dashboard
| Status | Date  | Description |
| :----: | :---: | :---------: |

## Loops Page
| Status | Date  | Description |
| :----: | :---: | :---------: |

## Student Dashboard
| Status | Date  | Description |
| :----: | :---: | :---------: |

## Validating All Forms
- A user can always submit a form with fraudulant data
- Validation must take place on the server.

## Deploying
- [Deploying NextJS to Custom VPS](https://www.reddit.com/r/nextjs/comments/usrdr3/what_is_the_best_way_to_deploy_nextjs_website_to/)

# Env Vars
```
MONGODB_URI=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

## Get Started Instructions

First, run `npm i` to install dependencies.

Then, run `npx auth secret`. This creates a `.env.local` file in the root folder and populates the `AUTH_SECRET` enviorment variable.

Then, link MongoDB. I created a free cluster through the MongoDB online dashboard, created an admin user, and copy pasted the connect uri into the `MONGODB_URI` enviorment variable.

Then, go to Google Cloud, create a new project, set up the conset screen, and generate an OAuth2 Key. The JS Origin is `http://localhost:3000`. The redirect is `https://localhost:3000/api/auth/callback/google`. Then, copy the Client ID and paste it into the `AUTH_GOOGLE_ID` enviorment variable. Then, copy the Client Secret and paste it into the `AUTH_GOOGLE_SECRET` enviorment variable.

Finally, run `npm run dev`