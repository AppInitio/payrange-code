# Build a League Tournament Builder

## Technology:
nodejs, express, AWS DynamoDB

## how to start
1. `npm install` to install modules
2. `grunt` to start server
3. `grunt test` to run test cases

### Part 1 Public APIs

- List of upcoming games: http://localhost:3001/api/game?tournamentId=2015%2F2016&startTime=20160112&op=gte&limit=10
- List of past games: http://localhost:3001/api/game?tournamentId=2015%2F2016&startTime=20160112&op=lt&isAscending=false&limit=10
- List of Teams: http://localhost:3001/api/teamStanding?tournamentId=2015%2F2016
- Team Info: http://localhost:3001/api/teamStanding/Manchester United

### Part 2 Admin APIs

- Create/Update/Delete Tournament: http://localhost:3001/api/tournament/:id?token=admin
- Create/Update/Delete Games: http://localhost:3001/api/game/:id?token=admin
- Create/Update/Delete Teams: http://localhost:3001/api/teamStanding/:id?token=admin

### Part 3 Server Side Jobs

- Read and populate Barclays Premier League or any other league tournament info

#### seed data
1. data from https://github.com/openfootball/eng-england/tree/master/2015-16
2. node seed/createTables.js - create dynamodb tables
3. node seed/insert.js - insert all data based on seed/2015-16/*.txt

— feel free to use any available public data, or perform web scraping
- read every 12 hours to get update from: https://github.com/openfootball/eng-england/tree/master/2015-16