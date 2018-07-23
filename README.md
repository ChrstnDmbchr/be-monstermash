## MonsterMash
#### Northcoders Final Project

Back end for my final project at Northcoders. An Express, Node and Mongo backend which exposes a REST api to the React frontend found [here](https://github.com/ChrstnDmbchr/fe-monstermash)

The Back end of the project is hosted on [Heroku](https://damp-journey-26965.herokuapp.com/api)

## Prerequisites

#### Database connections
The database connections strings are in the `dbconnection` directory and this is where the information is sourced depending on whether the `process.env.NODE_ENV` variable has been set to dev or test. 

If you wish to change the name of the databases created this can be modified in `dbconnection/index.js` as follows:
```
exports.dev = 'mongodb://localhost:27017/<NEW DB NAME>'
exports.test = 'mongodb://localhost:27017/<NEW DB NAME'
```

By default the databases will be named `monstermash` and `monstermash-test` respectively.

If you wish to re host this app on Heroku set an environment variable of the hosted database connection string as `MONGODB_URI`.

#### Database seeding

Seeding scripts have been provided to seed both dev and test databases.

To seed the dev database run:
```
npm run seed-dev
```
To seed the test database run :
```
npm run seed-test
```
NOTE: Only the dev seed script is required before the app runs, the test database will be seeded before every test block.

## API Routes

NOTE: Any endpoints with `PROTECTED` in the descriptions requires the authorisation token aquired after log in to be sent in the header for the http request. The header will need to be set as `Authorisation` with the value being `Bearer ${token}`.

``` http
GET /api
```

Endpoint is used to determine if the backend is running and responsive.

#### User endpoints

```http
GET /api/user
```
PROTECTED - Returns the ID and username of the user

```http
POST /api/signin
```
Route requires a JSON body with the username and password as key value pairs e.g: `{username: testuser, password: testpassword}`. Route returns the authorisation token upon successful login

```http
POST /api/signup
```
Route requires a JSON body with the username and password as key value pairs e.g: `{username: testuser, password: testpassword}`. Route returns the authorisation token upon successful user creation

#### Monster Mash endpoints

```http
GET /api/mash/all
```
Returns all Monster Mash data

```http
GET /api/mash/getmash/:mashid
```
Returns information for the Monster Mash with the ID specified in this parametric endpoint

```http
POST /api/mash/newmash
```
PROTECTED - Route requires a JSON body with an `imageData` property which should be the base64 string of an image e.g: `{imageData: *base64 string*}`

```http
GET /api/mash/continuemash
```
PROTECTED - Route will return the oldest Monster Mash in the database that is not set to completed and that the user making the call has not contributed to

```http
POST /api/mash/continuemash/:id
```
PROTECTED - Route requires a JSON body with an `imageData` and a `currPhase` property. imageData should contain a base64 image string and the currPhase is the current phase of the image you have drawn (phase can either be body or legs). Endpoint will update the Monster Mash with the id specified in the parametric endpoint

## Testing

All API enpoints have been tested against the data that was seeded with the test database.

The test database is re-seeded everytime before the test suite is ran.

To run the test suite run the script `npm test`

