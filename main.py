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
    data = json.loads(request.data.decode('utf-8'))
    with open("./data/temp.json", "a") as f:
        json.dump(data, f, indent=4)
        f.write("\n")
    return ""


@app.route("/read/<fileName>", methods=["GET"])
def readFile(fileName):
    with open(f'./data/{fileName}.json', 'r') as f:
        return f.read()
