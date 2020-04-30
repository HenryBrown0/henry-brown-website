# Henry Brown Website

## About

Server for my personal website. This project stores a local copy of all my
current GitHub repositories in a PostgreSQL database. The database is updated
by a cron-job every couple of hours.

## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes.

### Prerequisites

You'll need to install the following software:

```
Node.js v12.13.0
Yarn v1.19.1
PostgreSQL v12
```

### Installing

A step by step series of examples that tell you how to get a development env
running

Once the repo has been cloned install the dependencies

```
yarn install
```

Setup the database using the setup command

```
yarn setup
```

Start the project locally on port 3000

```
yarn start
```

Go to [http://localhost:3000](http://localhost:3000) to see the site

## Built With

* [Node.js](https://nodejs.org/) - Environment to run JavaScript server-side
* [Express.js](https://expressjs.com/) - Web framework for Node.js
* [Express-validator](https://express-validator.github.io/) - Express middleware for the validator module
* [GraphQL request](https://github.com/prisma-labs/graphql-request) - GraphQL client
* [HelmetJS](https://helmetjs.github.io/) - Express.js security with HTTP headers
* [ip-cidr](https://github.com/ortexx/ip-cidr/) - Module for working with CIDR (v4, v6)
* [Markdown-it](https://markdown-it.github.io/) - Markdown parser
* [pg](https://node-postgres.com/) - PostgreSQL client - pure javascript & libpq with the same API
* [squirrellyJS](https://squirrelly.js.org/) - JS template engine
* [TinyColor2](https://bgrins.github.io/TinyColor/) - Color manipulation and conversion
* [UUID](https://github.com/uuidjs/uuid/) - RFC4122 (v1, v4, and v5) UUIDs
* [Bulma](https://bulma.io/) - Modern CSS framework based on Flexbox
* [Concurrently](https://github.com/kimmobrunfeldt/concurrently/) - Run commands concurrently
* [ESLint](https://eslint.org/) - An AST-based pattern checker for JavaScript
* [eslint-config-airbnb-base](https://github.com/airbnb/javascript/) - Airbnb's base JS ESLint config, following our styleguide
* [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import/) - Import with sanity
* [node-sass](https://github.com/sass/node-sass/) - Wrapper around libsass
* [nodemon](https://nodemon.io/) - Simple monitor script for use during development of a node.js app
* [TypeScript](https://typescriptlang.org/) - Typed superset of JavaScript

## Versioning

I use [SemVer](https://semver.org/) for versioning. For the versions available,
see the
[tags on this repository](https://github.com/HenryBrown0/henry-brown-website/tags).

## Authors

* **Henry Brown** - *Initial work* -
[HenryBrown0](https://github.com/HenryBrown0)

## License

This project is licensed under the MIT License - see the
[LICENSE.md](https://github.com/HenryBrown0/henry-brown-website/blob/master/LICENSE)
file for details
