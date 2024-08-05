# Version 1.1.0

## Testing
 To setup testing environment, run these commands on seperate terminals.
- npm run dev
- npm run test-server
- npm run test


## Deprecated
- The api `/webhook` is now changed to `/generative-ai/api/v1/webhook`

## Added
- option to change servers
- request logger

## Changed
- migrated from one gemini session to multiple instances of gemini ai for each user
