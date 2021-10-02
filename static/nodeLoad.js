function loadFile(fileName) {
    fetch("172.26.17.47/read/{}".format(fileName)).then(
        (response) => {
            parseJSON(response.json()).then(
                (result) => {
                    var nodes = result[0];
                    var edges = result[1];
                }
            )
        }
    ).catch(
        console.log("Failed to Fetch from Source.")
    )
}

function parseJSON(jsonText) {
    return [
        [
            {id: "1", label: 'Node 1'},
            {id: "2", label: 'Node 2'},
            {id: "3", label: 'Node 3'},
            {id: "4", label: 'Node 4'},
            {id: "5", label: 'Node 5'}
        ],
        [
            {from: "1", to: "3"},
            {from: "3", to: "1"},
            {from: "1", to: "2"},
            {from: "2", to: "4"},
            {from: "2", to: "5"}
        ]
    ]
}