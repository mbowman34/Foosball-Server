tableHeader = "<table><tr><th>Team</th><th>Wins</th><th>Losses</th><th>Diff A</th><th>Diff B</th><th>Diff C</th></tr>";
endTable = "</table>";
scores = {};

function displayScores() {
    table = tableHeader;
    table += "<tr><th>A</th><th>" + scores["A"]["win"] + "</th><th>" + scores["A"]["loss"] + "</th><th>" + scores["A"]["A"]  + "</th><th>" + scores["A"]["B"]  + "</th><th>" + scores["A"]["C"] + "</th>" 
    table += "<tr><th>B</th><th>" + scores["B"]["win"] + "</th><th>" + scores["B"]["loss"] + "</th><th>" + scores["B"]["A"]  + "</th><th>" + scores["B"]["B"]  + "</th><th>" + scores["B"]["C"] + "</th>" 
    table += "<tr><th>C</th><th>" + scores["C"]["win"] + "</th><th>" + scores["C"]["loss"] + "</th><th>" + scores["C"]["A"]  + "</th><th>" + scores["C"]["B"]  + "</th><th>" + scores["C"]["C"] + "</th>" 
    table += endTable
    document.getElementById("scores").innerHTML = table;
}

function recordGame() {
    wElem = document.getElementById("winner");
    w = wElem.options[wElem.selectedIndex].value,
    lElem = document.getElementById("loser");
    l = lElem.options[lElem.selectedIndex].value;
    if(w == l) {
        //can't play yourself
	return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        }
    };
    xhttp.open("POST", "/recordGame", true);
    
    scores[w]["win"]++;
    scores[w][l]++;
    scores[l]["loss"]++;
    scores[l][w]--;
    msg = {"winner": w, "loser": l};
    xhttp.send(JSON.stringify(scores));
    displayScores();
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

getScores();
