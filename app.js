const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

const path = require("path");

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const intializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000);
  } catch (e) {
    console.log(`Database error: ${e.message}`);
    process.exit(1);
  }
};

intializeDBandServer();

// table name = cricket_team

// Retrieving all player list

app.get("/players/", async (request, response) => {
  const getAllPlayerQuery = `
    SELECT *
    FROM cricket_team
    `;
  const dbResponse = await db.all(getAllPlayerQuery);
  response.send(dbResponse);
});

// Adding a single player

app.post("/players/", async (request, response) => {
  const playerToBeAdded = {
    playerName: "Vishal",
    jerseyNumber: 17,
    role: "Bowler",
  };

  const addPlayerQuery = `
  INSERT  INTO
  cricket_team (player_name,jersey_number,role)
  VALUES (
      ${playerToBeAdded.playerName},
      ${playerToBeAdded.jerseyNumber},
      ${playerToBeAdded.role}
  )`;

  const dbResponse = await db.run(addPlayerQuery);
  //   console.log(dbResponse);
  response.send("Player Added to Team");
});

// Getting single player

app.get("players/: playerId/", async (request, response) => {
  const { playerId } = request.params;
  console.log(playerId);
  const getPlayerQuery = `
  SELECT * 
  FROM cricket_team 
  WHERE 
  player_id = ${playerId}
  `;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

app.put("player/:playerId/", async (request, response) => {
  const upDatedPlayerDetails = {
    playerName: "Maneesh",
    jerseyNumber: 54,
    role: "All-rounder",
  };
  const { playerId } = request.params;

  const upDatePlayerQuery = `
  UPDATE 
    cricket_team 
  SET 
    player_name = ${upDatedPlayerDetails.playerName},
    jersey_number = ${upDatedPlayerDetails.jerseyNumber},
    role = ${upDatedPlayerDetails.role}
  WHERE 
  player_id = ${playerId}
  `;
  await db.run(upDatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("player/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const deletePlayer = `
  DELETE FROM 
    cricket_team 
   WHERE 
    player_id = ${playerId}
  `;
  await db.run(deletePlayer);
  response.send("Player Removed");
});

module.exports = app;
