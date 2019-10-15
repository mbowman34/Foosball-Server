#!/bin/bash

season=$(cat currentSeason)
echo "read the season as" $season
cp scores.json "./historical/scores${season}.json"
cp teams.json "./historical/teams${season}.json"
season=$((season+1))
echo $season > currentSeason
cp defaultScores.json scores.json
