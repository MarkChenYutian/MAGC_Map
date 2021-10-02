from flask import Flask
from flask import request
import json

app = Flask(__name__)


@app.route("/")
def hello_world():
    with open("static/nodeMap.html", "r") as f:
        return f.read()


@app.route("/write", methods=["POST"])
def writeFile():
    # with open('/data/test.json', 'w') as f:
    #     json.dump(request.data, f)
    print(json.dumps(request.data.decode('utf-8')))
    return "static/nodeMap.html"


@app.route("/read/<fileName>", methods=["GET"])
def readFile(fileName):
    with open(f'./data/{fileName}.json', 'r') as f:
        return f.read()
