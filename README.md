# Multiplayer Tag Game
This is an online multiplayer game of tag, set in a pixel art virtual world.

### Tag
**Tag** (also known as *it*) is a playground game dating back to the 4th century BC.

Players (two or more) decide who is going to be "it". 

The player selected to be "it" then chases the others, attempting to "tag" one of them (by touching them with a hand) as the others try to avoid being tagged. A tag makes the tagged player "it".


### Play

This game is available to play online at https://nathanarnold.co.uk/tag

Once there are at least 2 players online, the computer will randomly select one player to be "it". This player must try and tag others by moving towards them using arrow keys.

The other players must avoid being tagged. The game can be ran indefinitely as long as there are 2+ players online. New players can join mid-game just by loading the webpage in their browser. 


## Run the source code yourself

The game requires 2 components:
- Front end built with Javascript and Phaser JS, can be hosted locally or on a web server
- Back end server which supplies a web socket server to facilitate multiplayer

### Front end
`npm run frontend:dev` - Run development server

`npm run frontend:build` - Build server for production

You will also need to edit `src/game.js` on line 151 to supply the IP address of the back end server (wherever that is hosted)

### Back end
`npm run server:dev` - Run dev server

`npm run server:prod` - Run dev server for production (as a daemon with Forever)
