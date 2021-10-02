function synchronizeLoad(fileName) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.addEventListener("load", getData);
    console.log("---");
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
    console.log(data);
    // initialize your network!
    network = new vis.Network(container, data, options);

    eventUpdateScale();

    network.on('selectNode', function(properties) {
        window.location.href = "#" + properties.nodes;
    });

    network.on('zoom', function(properties) {
        eventUpdateScale();
    })
}

function loadFile(fileName) {
    synchronizeLoad(fileName);
}