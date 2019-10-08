var tableCss="class=\"w3-table-all\" style=\"width: 500px;\""
var tableHeader = "<table " + tableCss + "><tr><th>Team</th><th>Wins</th><th>Losses</th><th>Diff</th><th>A</th><th>B</th><th>C</th></tr>";
var endTable = "</table>";
var scores = {};
var teams = {};
var current = true;

blankScores=
{
    "A":{"win":0,"loss":0,"diff":0,"A":0,"B":0,"C":0},
    "B":{"win":0,"loss":0,"diff":0,"A":0,"B":0,"C":0},
    "C":{"win":0,"loss":0,"diff":0,"A":0,"B":0,"C":0}
}

function displayTeams() {
    var list = "<li>A: " + teams["A"][0] + " and " + teams["A"][1] + "</li>";
    list += "<li>B: " + teams["B"][0] + " and " + teams["B"][1] + "</li>";
    list += "<li>C: " + teams["C"][0] + " and " + teams["C"][1] + "</li>";
    document.getElementById("teams").innerHTML = list;
}

function displayScores() {
    var table = tableHeader;
    table += "<tr><th>A</th><th>" + scores["A"]["win"] + "</th><th>" + scores["A"]["loss"] + "</th><th>" + scores["A"]["diff"] + "</th><th>" + scores["A"]["A"]  + "</th><th>" + scores["A"]["B"]  + "</th><th>" + scores["A"]["C"] + "</th>";
    table += "<tr><th>B</th><th>" + scores["B"]["win"] + "</th><th>" + scores["B"]["loss"] + "</th><th>" + scores["B"]["diff"] + "</th><th>" + scores["B"]["A"]  + "</th><th>" + scores["B"]["B"]  + "</th><th>" + scores["B"]["C"] + "</th>";
    table += "<tr><th>C</th><th>" + scores["C"]["win"] + "</th><th>" + scores["C"]["loss"] + "</th><th>" + scores["C"]["diff"] + "</th><th>" + scores["C"]["A"]  + "</th><th>" + scores["C"]["B"]  + "</th><th>" + scores["C"]["C"] + "</th>";
    table += endTable
    document.getElementById("scores").innerHTML = table;
}
function sendScores() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        }
    };
    xhttp.open("POST", "/recordGame", true);
    xhttp.send(JSON.stringify(scores));
    displayScores();
}

function validTeam(t) {
    var set = new Set();
    set.add(t["A"][0]);
    set.add(t["A"][1]);
    set.add(t["B"][0]);
    set.add(t["B"][1]);
    set.add(t["C"][0]);
    set.add(t["C"][1]);
    if(set.size == 6) {
        return true;
    }
    else {
        return false;
    }
}

function sendTeam() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        }
    };
    xhttp.open("POST", "/setTeams", true);
    xhttp.send(JSON.stringify(teams));
    displayTeams();
}

function setTeams() {
    var t = {"A":[],"B":[],"C":[]};
    playerElem = document.getElementById("teamA1");
    player = playerElem.options[playerElem.selectedIndex].value,
    t["A"].push(player);
    playerElem = document.getElementById("teamA2");
    player = playerElem.options[playerElem.selectedIndex].value,
    t["A"].push(player);
    playerElem = document.getElementById("teamB1");
    player = playerElem.options[playerElem.selectedIndex].value,
    t["B"].push(player);
    playerElem = document.getElementById("teamB2");
    player = playerElem.options[playerElem.selectedIndex].value,
    t["B"].push(player);
    playerElem = document.getElementById("teamC1");
    player = playerElem.options[playerElem.selectedIndex].value,
    t["C"].push(player);
    playerElem = document.getElementById("teamC2");
    player = playerElem.options[playerElem.selectedIndex].value,
    t["C"].push(player);
    if(!validTeam(t)){
        alert("Invalid team!");
        return;
    }
    teams = t;
    sendTeam();
}

function recordGame() {
    if(!current) {
        alert("Can only record score for current game");
        return;
    }
    wElem = document.getElementById("winner");
    w = wElem.options[wElem.selectedIndex].value,
    lElem = document.getElementById("loser");
    l = lElem.options[lElem.selectedIndex].value;
    diffElem = document.getElementById("diff");
    diffStr = diffElem.options[diffElem.selectedIndex].value;
    diff = parseInt(diffStr);
    if(w == l) {
        //can't play yourself
	return;
    }

    //Adjust scores of the winner
    scores[w]["win"]++;
    scores[w][l]++;
    scores[w]["diff"]+=diff;

    //Adjust scores of the loser
    scores[l]["loss"]++;
    scores[l][w]++;
    scores[l]["diff"]-=diff;
    sendScores();
}


function getScoresHistorical() {
    seasonElem = document.getElementById("season");
    season = seasonElem.options[seasonElem.selectedIndex].value;
    if(season == "current") {
        current = true;
        getScores();
        return;
    }
    current = false;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            scores = JSON.parse(this.responseText);
	    displayScores();
        }
    };
    xhttp.open("POST", "/getScoresHistorical", true);
    xhttp.send(season);
}

function getTeams() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            teams = JSON.parse(this.responseText);
	    displayTeams();
        }
    };
    xhttp.open("POST", "/getTeams", true);
    xhttp.send();
}

function getScores() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            scores = JSON.parse(this.responseText);
	    displayScores();
        }
    };
    xhttp.open("POST", "/getScores", true);
    xhttp.send();
}

function reset() {
    //deep copy blank scores
    if(confirm("Are you sure you want to wipe the scores?")) {
        scores = JSON.parse(JSON.stringify(blankScores));
        sendScores();
    }
}
getTeams();
getScores();
