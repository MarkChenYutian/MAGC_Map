// create a network
var container = document.getElementById('mynetwork');

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};

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

// initialize your network!
var network = new vis.Network(container, data, options);

network.on( 'selectNode', function(properties) {
    window.location.href = "#" + properties.nodes + '_card';
});

