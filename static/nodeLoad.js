function synchronizeLoad(fileName) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.addEventListener("load", getData);
    httpRequest.open('GET', "/read/" + fileName);
    httpRequest.send();
}

var nodes;
var edges;
var network;
var contentDict = {};
var nodeContentLink = {};

function getData() {
    let rawJSON = this.responseText;
    let dataObject = JSON.parse(rawJSON);
    let nodeList = [];
    let edgeList = [];
    for (let i = 0; i < dataObject["nodes"].length; i ++){
        nodeList.push(
            {
                id: dataObject["nodes"][i]["id"],
                label: dataObject["nodes"][i]["label"],
                color: {
                    background: dataObject["nodes"][i]["style"]["color"]
                }
            }
        );
        console.log(dataObject["nodes"][i]["id"]);
        nodeContentLink[dataObject["nodes"][i]["id"]] = dataObject["nodes"][i]["block"];
    }
    for (let i = 0; i < dataObject["edges"].length; i ++){
        edgeList.push(
            {
                id: dataObject["edges"][i]["id"],
                from: dataObject["edges"][i]["from"],
                to: dataObject["edges"][i]["to"]
            }
        )
    }
    for (const [contentID, contentBlock] of Object.entries(dataObject["contents"])) {
        contentDict[contentID] = contentBlock;
    }
    nodes = new vis.DataSet(nodeList);
    edges = new vis.DataSet(edgeList);
    setupNetwork();
}

function setupNetwork(){
    // provide the data in the vis format
    var data = {
        nodes: nodes,
        edges: edges
    }

    // create a network
    var container = document.getElementById('mynetwork');

    var options = {
        autoResize: true,
        height: '100%',
        width: '100%',
        layout: {
            randomSeed: 424
        },
        physics: {
            enabled: true,
            repulsion: {
                nodeDistance: 300,
                springLength: 600,
                damping: 0.2
            },
            solver: 'repulsion'
        },
        nodes: {
            shape: "box",
            size: 30,
            font: {
            size: 32,
            },
            borderWidth: 2,
            margin: 20,
            shadow: true,
            color: {
                background: "#fefefe",
                border: "rgba(0, 0, 0, 0)",
                hover: {
                    background: "#eeeeee",
                    border: "rgba(0, 0, 0, 0.3)",
                }
            }
        },
        edges: {
            width: 2,
            shadow: true,
            color: {
                color: "#aaaaaa"
            }
        },
        interaction: {
            hover: true,
            multiselect: true
        }
    };
    document.getElementById("networkStatusWindow").innerHTML = '<img src="../static/img/statusSyncFinish.svg" style="display: inline-block; height: 1.5rem; width: 1.5rem; margin-bottom: -0.4rem;"> Online';
    // initialize your network!
    network = new vis.Network(container, data, options);

    eventUpdateScale();

    network.on('doubleClick', function(properties) {
        let displayNode = network.getSelectedNodes();
        window.location.href = "#popupMenu";
        drawOnCanvas(displayNode);
    });

    network.on('zoom', function(properties) {
        eventUpdateScale();
    })
}

function loadFile(fileName) {
    synchronizeLoad(fileName);
}

function renderBlock(contentBlock, contentID){
    return "<div id='" + contentID + "'>" + 
        marked(contentBlock["context"] + "\n\n") + 
        `<div style='display:flex; flex-direction: row; justify-content:space-between'>
            <font size=1>Message Block ID:` + contentID  + `</font>
            <div>
                <button onclick="blockEditor('` + contentID + `')"> <img src="/static/img/edit.svg" style="display: inline-block; height: 1.5rem; width: 1.5rem; margin-bottom: -0.1rem; padding: 3px"></button>
                <button onclick="deleteBlock('` + contentID + `')"><img src="/static/img/delete.svg" style="display: inline-block; height: 1.5rem; width: 1.5rem; margin-bottom: -0.1rem; padding: 3px"></button>
            </div>
        </div>` + 
        "</div>"
}

function addBlockToNodeGUI(nodeID){
    let canvas = document.getElementById("popup_contentArea");
    let newBlockID = addContentBlock(nodeID, "markdown");
    contentDict[newBlockID]["context"] = "*EMPTY BLOCK*"
    canvas.innerHTML += renderBlock(contentDict[newBlockID], newBlockID, nodeID);
}


function drawOnCanvas(displayNode){
    let canvas = document.getElementById("popup_contentArea");
    canvas.innerHTML = `<div style="display: flex; justify-content:space-between;">
    <h1><b>` + nodes.get(displayNode[0]).label + `</b></h1>
    <button onclick="addBlockToNodeGUI('` + displayNode[0] + `')" style="height: 2rem; margin-top: 1rem;"><img src="/static/img/addTextBlock.svg" style="display: inline-block; height: 1.5rem; width: 1.5rem; margin-bottom: -0.1rem; padding: 3px"></button>
    </div>`;
    console.log(displayNode);
    if (displayNode.length > 1 || displayNode.length == 0){
        return 2;
    }
    for (let index = 0; index < nodeContentLink[displayNode[0]].length; index ++){
        let contentID = nodeContentLink[displayNode[0]][index];
        let contentBlock = contentDict[contentID];
        console.log(contentBlock);
        canvas.innerHTML += renderBlock(contentBlock, contentID, displayNode[0])
    }
    MathJax.Hub.Queue(['Typeset',MathJax.Hub]);
}
