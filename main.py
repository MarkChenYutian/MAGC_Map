from flask import Flask, request
from os.path import exists
import json
import time

app = Flask(__name__)


class JSONDumper:
    def __init__(self):
        self.time = time.time()
        self.data = None

    def dump(self, data, pathToJSON):
        if time.time() - self.time > 2.5:
            with open(pathToJSON, 'w') as f:
                json.dump(data, f)
            f.close()
            self.time = time.time()
        else:
            self.data = data


dumper = JSONDumper()


@app.route("/")
def indexRoot():
    with open("./static/nodeMap.html", "r") as f:
        rootHTML = f.read()
        return rootHTML


@app.route("/board/<boardName>")
def indexBoard(boardName):
    with open(f"./static/nodeMap.html", "r") as f:
        boardHTML = f.read().replace("Sample Title", boardName).replace("sample", boardName)
        return boardHTML


@app.route("/write", methods=["POST"])
def writeFile():
    # capture key instruction
    writeCommand = json.loads(request.data)
    writeOperation = writeCommand.get('operation')
    writeProperty = writeCommand.get('property')
    writeValue = writeCommand.get('value')
    writeSrc = writeCommand.get('src')
    # create a new board if non-existent
    if not exists(f"./data/{writeSrc}.json"):
        data = {"nodes": [], "edges": [], "contents": {}}
        dumper.dump(data, f"./data/{writeSrc}.json")

    # ADD Operation
    if writeOperation == "ADD":
        with open(f"./data/{writeSrc}.json", "r") as f:
            data = json.load(f)
        f.close()
        if writeProperty == 'node':
            nodeLst = data.get("nodes")
            nodeLst.append(writeValue)
            data["nodes"] = nodeLst
        elif writeProperty == 'edge':
            edgeLst = data.get("edges")
            edgeLst.append(writeValue)
            data["edges"] = edgeLst
        elif writeProperty == "content":
            contentDic = data.get("contents")
            contentDic.update(writeValue)
            data["contents"] = contentDic
        dumper.dump(data, f"./data/{writeSrc}.json")

    # DEL Operation
    elif writeOperation == "DEL":
        with open(f"./data/{writeSrc}.json", "r") as f:
            data = json.load(f)
        f.close()
        if writeProperty == 'node':
            nodeLst = data.get("nodes")
            nodeLst.remove(writeValue)
        elif writeProperty == 'edge':
            edgeLst = data.get("edges")
            edgeLst.remove(writeValue)
        elif writeProperty == "content":
            contentDic = data.get("contents")
            del contentDic[list(writeValue.keys())[0]]
        dumper.dump(data, f"./data/{writeSrc}.json")

    # MOD Operation
    elif writeOperation == "MOD":
        with open(f"./data/{writeSrc}.json", "r") as f:
            data = json.load(f)
        f.close()
        if writeProperty == 'node':
            nodeLst = data.get("nodes")
            for i in range(len(nodeLst)):
                if nodeLst[i].get('id') == writeValue.get('id'): nodeLst[i] = writeValue
            data["nodes"] = nodeLst
        elif writeProperty == 'edge':
            edgeLst = data.get("edges")
            for i in range(len(edgeLst)):
                if edgeLst[i].get('id') == writeValue.get('id'): edgeLst[i] = writeValue
            data["edges"] = edgeLst
        elif writeProperty == "content":
            contentDic = data.get("contents")
            contentID = list(writeValue.keys())[0]
            contentDic[contentID] = writeValue.get(contentID)
        dumper.dump(data, f"./data/{writeSrc}.json")

    with open(f"./static/nodeMap.html", "r") as f:
        boardHTML = f.read().replace("Sample Title", writeSrc).replace("\"sample\"", writeSrc)
        return boardHTML


@app.route("/read/<boardName>", methods=["GET"])
def readFile(boardName):
    with open(f'./data/{boardName}.json', 'r') as f:
        return f.read()
