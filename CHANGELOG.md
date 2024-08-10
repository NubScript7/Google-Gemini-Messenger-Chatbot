# Version 1.0.0

## using nodejs as starting point

- vanilla javascript and cjs

# Version 1.2.0

## using eslint

- using eslint to catch compile time errors

## added

- added more commands

# Version 1.3.0

## added

- added `Gemini Session`

## changed

- instead of one session for all clients, each client will now have its own `Gemini Session`

# Version 1.3.1

## changed

- changed the max sessions limit from unlimited to only `10` sessions by default

## adding...

- adding life age on `Gemini Session`, means when idle (no interactions) the session will be destroyed

# Version 1.4.0

## using typescript

- now uses typescript to better catch errors

## added
- added idle session detection, where idle sessions will be destroyed

## fixed

- fixed some weird codes
- fixed some variables that has mixed types

# Version 1.5.0

## debugging
 To setup testing environment, run these commands on their each respective terminals.
- npm run start:dev
- npm run test:server

## deprecated
- The api `/webhook` is now changed to `/generative-ai/api/v1/webhook`

## added
- option to change servers
- webhook debugger/tester
- request logger

# Version 1.5.1

## fixed

- fixed some minor bugs

# Version 1.5.2

## added
- support for frontend using `socket.io`
- webhook based clients and frontend clients are seperate, this means there can be `10` webhook clients (messenger) and `10` socket clients (frontend)

# Version 1.5.3

## changed
- updated the session idle detector, now called `session cleanup worker`

# Version 1.5.4

## using bootstrap
- now using bootstrap to make frontend development faster

# Version 1.5.5

## fixed
- fixed some minor bugs for the frontend