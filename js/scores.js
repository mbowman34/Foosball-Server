tableCss="class=\"w3-table-all\" style=\"width: 500px;\""
tableHeader = "<table " + tableCss + "><tr><th>Team</th><th>Wins</th><th>Losses</th><th>Diff</th><th>A</th><th>B</th><th>C</th></tr>";
endTable = "</table>";
scores = {};

blankScores=
{
    "A":{"win":0,"loss":0,"diff":0,"A":0,"B":0,"C":0},
    "B":{"win":0,"loss":0,"diff":0,"A":0,"B":0,"C":0},
    "C":{"win":0,"loss":0,"diff":0,"A":0,"B":0,"C":0}
}

function displayScores() {
    table = tableHeader;
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

function recordGame() {
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
        getScores();
        return;
    }
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
getScores();
