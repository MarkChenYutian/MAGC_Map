from flask import Flask
from flask import request
import json

app = Flask(__name__)


@app.route("/")
def index():
    with open("static/nodeMap.html", "r") as f:
        return f.read()


@app.route("/write", methods=["POST"])
def writeFile():
    writeCommand = json.loads(request.data)
    writeOperation = writeCommand.get('operation')
    writeProperty = writeCommand.get('property')
    writeValue = writeCommand.get('value')
    fileID = writeValue.get('id')

    if writeOperation == "ADD":
        with open("./data/sample.json", "r") as f:
            data = json.load(f)
        f.close()
        if writeProperty == 'node':
            nodeLst = data.get("nodes")
            nodeLst.append(writeValue)
            data["nodes"] = nodeLst
        elif writeProperty == 'edge':
            nodeLst = data.get("edges")
            nodeLst.append(writeValue)
            data["edges"] = nodeLst
        with open("./data/sample.json", "w") as f:
            json.dump(data, f)
        f.close()

    elif writeOperation == "DEL":
        with open("./data/sample.json", "r") as f:
            data = json.load(f)
        f.close()
        if writeProperty == 'node':
            nodeLst = data.get("nodes")
            nodeLst.remove(writeValue)
        elif writeProperty == 'edge':
            nodeLst = data.get("edges")
            nodeLst.remove(writeValue)
        with open("./data/sample.json", "w") as f:
            json.dump(data, f)
        f.close()

    elif writeOperation == "MOD":
        with open("./data/sample.json", "r") as f:
            data = json.load(f)
        f.close()
        if writeProperty == 'node':
            nodeLst = data.get("nodes")
            for i in range(len(nodeLst)):
                if nodeLst[i].get('id') == fileID:
                    nodeLst.pop(i)
                    nodeLst.append(writeValue)
            data["nodes"] = nodeLst
        elif writeProperty == 'edge':
            nodeLst = data.get("edges")
            for i in range(len(nodeLst)):
                if nodeLst[i].get('id') == fileID:
                    nodeLst.pop(i)
                    nodeLst.append(writeValue)
            data["edges"] = nodeLst
        with open("./data/sample.json", "w") as f:
            json.dump(data, f)
        f.close()

    with open("static/nodeMap.html", "r") as f:
        return f.read()


@app.route("/read/<fileID>", methods=["GET"])
def readFile(fileID):
    with open(f'./data/{fileID}.json', 'r') as f:
        return f.read()
