<!-- <div align="center"> -->

# Loops
Loops provide students with easy access to essential shopping, dining, and recreational activities during their time on campus. This app provides student life staff a way to conviently publish and keep track of loops and allows students to securely sign up for these loops.

<!-- </div> -->

## Authors
Aryan Gera

## Libraries and Equipment
* [Next.js 15](https://nextjs.org) - Industry leading full stack website development framework
* [React 19](https://react.dev) - Library for building highly interactive websites
* [MongoDB](https://www.mongodb.com) - NoSQL Document Database
* [Typescript](https://www.typescriptlang.org) - Typed programming language build on top of Javascript

# Feature List
- [x] UI / UX / Branding
- [ ] Authentication
- [ ] Admin Role
  - [ ] Assigning Roles
  - [ ] Assigning Groups
- [ ] Student Life Staff Role
  - [ ] Posting Loops
  - [ ] Editing Signups
- [ ] Loops Page
  - [ ] Searching Implements `opensearch.xml`
  - [ ] Search Functionality using URL Paremeters (`loops.ncssm.edu/loops?q={params}`)
- [ ] Student Role
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

## Admin Dashboard
| Status | Date  | Description |
| :----: | :---: | :---------: |

## Staff Dashboard
| Status | Date  | Description |
| :----: | :---: | :---------: |

## Loops Page
| Status | Date  | Description |
| :----: | :---: | :---------: |

## Student Dashboard
| Status | Date  | Description |
| :----: | :---: | :---------: |


# Env Vars
```
MONGODB_URI=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```