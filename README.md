# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm ci
```

## Add .env file

Rename `.env.example` to `.env`

## Running application

```
npm run docker:up
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing <http://localhost:4000/docs/>.
For more information about OpenAPI/Swagger please visit <https://swagger.io/>.

## Vulnerabilities scanning

```
npm run audit
npm run scan:app
npm run scan:db
```

## Logging & Error Handling and Authentication & Authorization

Running the Application:

To start the application use the following command:

```bash
npm run docker:up
```

Running Tests

```bash
npm run test:auth
npm run test:refresh
```

**Logs**

You can customize the logging level and maximum log file size by modifying the .env file:

- `LOG_LEVEL`: Controls the verbosity of logs (e.g., DEBUG, INFO, WARN, ERROR).
- `LOG_MAX_FILE_SIZE`: Sets the maximum size (in KB) for log files before rotation.

Application logs are saved in the logs directory.
Logs are rotated based on the configured maximum file size. Older logs are archived with timestamped suffixes, ensuring a clean and organized logging system.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: <https://code.visualstudio.com/docs/editor/debugging>
