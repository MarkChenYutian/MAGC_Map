from flask import Flask, request, jsonify
from os.path import exists
import json
import time
import os

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
    with open("./static/mainpage.html", "r") as f:
        rootHTML = f.read()
        return rootHTML


@app.route("/board/<boardName>")
def indexBoard(boardName):
    with open(f"./stats/totVisit.json", "r") as f:
        data = json.load(f)

    if boardName in data.keys(): data[boardName] += 1
    else: data[boardName] = 1

    with open(f"./stats/totVisit.json", "w") as f:
        json.dump(data, f)

    with open(f"./static/nodeMap.html", "r") as f:
        boardHTML = f.read().replace("Sample Title", boardName).replace("sample", boardName)
        return boardHTML


@app.route("/getBoard", methods=["POST", "GET"])
def getBoard():
    with open(f"./stats/totVisit.json", "r") as f:
        data = json.load(f)

    boardStat = []
    for _ in os.listdir("./data"):
        boardStat.append((_.split(".json")[0], data.get(_.split(".json")[0])))
    return json.dumps(boardStat)

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
            contentDic.update(writeValue[0])

            nodeLst = data.get("nodes")
            for node in nodeLst:
                if node["id"] == writeValue[1]: node["block"].append(list(writeValue[0].keys())[0])

            data["contents"] = contentDic
            data["nodes"] = nodeLst

        dumper.dump(data, f"./data/{writeSrc}.json")

    # DEL Operation
    elif writeOperation == "DEL":
        with open(f"./data/{writeSrc}.json", "r") as f:
            data = json.load(f)
        f.close()
        if writeProperty == 'node':
            nodeLst = data.get("nodes")
            try: nodeLst.remove(writeValue)
            except ValueError: None
        elif writeProperty == 'edge':
            edgeLst = data.get("edges")
            try: edgeLst.remove(writeValue)
            except ValueError: None
        elif writeProperty == "content":
            contentDic = data.get("contents")
            del contentDic[list(writeValue.keys())[0]]

            nodeLst = data["nodes"]
            for node in nodeLst:
                node["block"].remove(list(writeValue.keys())[0])
            data["nodes"] = nodeLst

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

@app.route("/read/<filename>", methods=["GET"])
def readFile(filename):
    with open("./data/{}.json".format(filename), "r") as f: return f.read()
