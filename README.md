## Task Board - API side (NestJS) + Client (React + TypeScript + Vite)

## Installation

```bash
$ npm install
```

## Running the app
### With only one command
```bash
# For first start app
# create bd container in docker, 
# starts migration and seed, 
# makes a build and starts the app
$ npm run app:first

# Next times
$ npm run app
```

[http://localhost:3000](http://localhost:3000) - Client  
[http://localhost:3000/api](http://localhost:3000/api) - API


## Before runnig app
```bash
# Runs database setup, migration, and seeding processes
# usually for the first start of docker from the database
$ npm run db

# Starts the database container.
$ npm run db:up

# Stops and removes the database container.
$ npm run db:down
```

### Development watch mode
```bash
$ npm run dev
```
[http://localhost:5173](http://localhost:5173) - Client  
[http://localhost:3000](http://localhost:3000) - API

### Production mode
```bash
# build
$ npm run build

# production mode
$ npm run start
```

[http://localhost:3000](http://localhost:3000) - Client  
[http://localhost:3000/api](http://localhost:3000/api) - API