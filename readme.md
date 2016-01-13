# Build a League Tournament Builder

## Technology:
nodejs, express, AWS DynamoDB

## how to start
1. `npm install` to install modules
2. `grunt` to start server
3. `grunt test` to run test cases

### Part 1 Public APIs

- List of upcoming games: http://localhost:3000/api/game?tournamentId=2015-1016&startTime=20160112&op=gte
- List of past games: http://localhost:3000/api/game?tournamentId=2015-1016&startTime=20160112&op=lt&isAscending=false
- List of Teams: http://localhost:3000/api/teamStanding?tournamentId=2015-1016
- Team Info: http://localhost:3000/api/teamStanding/Manchester United

### Part 2 Admin APIs

- Create/Update/Delete Tournament: http://localhost:3000/api/tournament/:id
- Create/Update/Delete Games: http://localhost:3000/api/game/:id
- Create/Update/Delete Teams: http://localhost:3000/api/teamStanding/:id

### Part 3 Server Side Jobs

- Read and populate Barclays Premier League or any other league tournament info

#### seed data
1. data from https://github.com/openfootball/eng-england/tree/master/2015-16
2. node seed/createTables.js - create dynamodb tables
3. node seed/insert.js - insert all data based on seed/2015-16/*.txt

— feel free to use any available public data, or perform web scraping
- read every 12 hours to get update from: https://github.com/openfootball/eng-england/tree/master/2015-16