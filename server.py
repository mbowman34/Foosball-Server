import json
from flask import Flask
from flask import send_file
from flask import send_from_directory
from flask import request
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    return send_file("index.html")

@app.route('/favicon.ico')
def favicon():
    return send_file("favicon.ico")

@app.route('/background.jpg')
def background():
    return send_file("background.jpg")

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route("/getTeams", methods=["POST"])
def getTeams():
    with open("./teams.json", 'r') as file:
        teams = json.load(file)
        return json.dumps(teams)

@app.route("/getTeamsHistorical", methods=["POST"])
def getTeamsHistorical():
    with open("./historical/teams" + str(request.data) + ".json", 'r') as file:
        scores = json.load(file)
        return json.dumps(scores)

@app.route("/setTeams", methods=["POST"])
def setTeams():
    with open("./teams.json", "w") as file:
        file.write(request.data)
    return "okay"

@app.route("/getScores", methods=["POST"])
def getScores():
    with open("./scores.json", 'r') as file:
        scores = json.load(file)
        return json.dumps(scores)

@app.route("/getScoresHistorical", methods=["POST"])
def getScoresHistorical():
    with open("./historical/scores" + str(request.data) + ".json", 'r') as file:
        scores = json.load(file)
        return json.dumps(scores)

@app.route("/recordGame", methods=["POST"])
def recordGame():
    with open("./scores.json", "w") as file:
        file.write(request.data)
    return "okay"

@app.route("/endSeason", methods=["POST"])
def endSeason():
    subprocess.call("./newSeason.sh")
    return "okay"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0',port=8080)
