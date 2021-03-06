## Let's debate  ##

**Let's debate** is a prototype that aims to allow a debate between a large number of users.

Even if many features deserve to be added, the heart of the application is fully operational

This software is based on technologies : vue.js (v2), nodejs, express and neo4j as a database

ps: even if the site is in French the code is in English

### installation : ###
1° you need to install node.js, npm and neo4j for the database
2° download this package and run `npm install` in both directory `back` and `front`
3° rename `back/config/secret model.js` to `back/config/secret.js` and adapt it to your own environment
4° in `back` directory execute `npm run initDB` with a clean neo4j database
5° finnaly execute `npm run start` in both directory `back` and `front`
then you can test this software (administrateur: "admin"; "admin")

