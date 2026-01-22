# Ride Finder

API to find rides based on GBFS data.\
If required, found rides can be clustered by k-means algorithm.

### Installation

Install the dependencies.

```bash
$ bun install
```

### Running the application

Set up the desired port in .env file (PORT - defaults to 8001)

### Development mode

```bash
$ bun run dev
```

After running the command, application should be started on http://localhost:8001

### Production mode

Build the application

```bash
$ bun run build
```

Run the application

```bash
$ bun run start
```

### Deploy to Docker

This application includes definitions for both Docker and docker-compose.

#### docker

```bash
$ docker build -t ride-finder --target deploy .
$ docker run -dp 8001:8001 ride-finder
```

#### docker-compose

```bash
$ docker-compose up --build
```

### Documentation

This application uses [swagger](https://www.npmjs.com/package/swagger) for API Documentation.
After running the application, api documentation can be seen on http://localhost:8001/api-docs

### Health / Metrics

This application uses [prometheus](https://www.npmjs.com/package/prom-client) for metrics data.
After running the application, api documentation can be seen on http://localhost:8001/metrics

### Testing

This application uses [jest](https://www.npmjs.com/package/jest) for testing

#### Run tests

```bash
$ bun run test
```

#### Run tests in watch mode

```bash
$ bun run test:watch
```

#### Run tests in coverage mode

```bash
$ bun run test:coverage
```

#### Formatting

This application uses
[eslint](https://www.npmjs.com/package/eslint),
[prettier](https://www.npmjs.com/package/prettier),
[lint-staged](https://www.npmjs.com/package/lint-staged),
and
[husky](https://www.npmjs.com/package/husky)\
Project files are linted and prettified in every commit with husky (git hooks)\
The following can also be used separately.

```bash
$ bun run lint
$ bun run format
```

#### Further notes

[express](https://www.npmjs.com/package/express),
[dotenv](https://www.npmjs.com/package/dotenv),
[axios](https://www.npmjs.com/package/axios)\
[geolib](https://www.npmjs.com/package/geolib),
[node-kmeans](https://www.npmjs.com/package/node-kmeans),
[node-cache](https://www.npmjs.com/package/node-cache)
