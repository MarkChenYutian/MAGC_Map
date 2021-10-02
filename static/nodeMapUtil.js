function uuid4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function coreAddNode(nodeTitle) {
    /*
        if 
        return 0 - node added correctly
        return 1 - node added fail, see console
    */
    let newNode = { id: uuid4(), label: nodeTitle };
    try {
        nodes.update(newNode);
        syncServerAddNode(newNode);  // Tell Server to add Nodes
        return 0;
    } catch (error) {
        console.log(error);
        return 1;
    }
    
}

function coreAddEdge() {
    /*
        This function will automatically get the selected nodes from network
        return 0 - edge added correctly
        return 1 - edge added fail for unknown reason
        retunr 2 - edge added fail since the number of nodes the user selected 
        does NOT equal to 2.
    */
    let selectedNodes = network.getSelectedNodes();
    if (selectedNodes.length != 2) { return 2; }
    try {
        let newEdge = { from: selectedNodes[0], to: selectedNodes[1] };
        edges.update(newEdge);
        syncServerAddEdge(newEdge);
        return 0;
    } catch (error) {
        console.log(error);
        return 1;
    }
}

function coreRenameNode(newName) {
    /*
        This function will automatically get the node selected
        return 0 - rename Success
        return 1 - rename Fail
        return 2 - rename Fail since user select no node / select
        more than one node.
    */
    let selectedNodes = network.getSelectedNodes();
    if (selectedNodes.length != 1) {
        return 2;   // User select more than 1 node to rename
    }
    try {
        let originalNode = nodes.get(selectedNodes[0]);
        originalNode.label = newName;
        nodes.update(originalNode);
        syncServerPropChange(originalNode);
        return 0;
    } catch (error) {
        console.log(error);
        return 1;
    }
}

function coreRemoveNode() {
    /*
        When this function is called, it will detect which node the
        user selected automatically.

        return 0 - remove successfully
        return 1 - remove Fail
        return 2 - remove Fail since the user selected multiple node
    */
    let selectedNodes = network.getSelectedNodes();
    let selectedEdges = network.getSelectedEdges();

    if (selectedNodes.length != 1) { return 2; }
    try {
        nodes.remove(selectedNodes);
        edges.remove(selectedEdges);
        syncServerRemoveNodes(nodes);
        syncServerRemoveEdges(edges);
        return 0;
    } catch (error) {
        console.log(error);
        return 1;
    }
}

function coreRemoveEdge() {
    /*
        When this function is called, it will detect which node the user selecterd automatically

        return 0 - remove successfully
        return 1 - remove Fail (unknown reason)
        return 2 - remove Fail since the user does not select edges
    */
   let selectedEdges = network.getSelectedEdges();
   if (selectedEdges.length == 0) { return 2; }
   try {
       edges.remove(selectedEdges);
       syncServerRemoveEdges(edges);
       return 0;
   } catch (error) {
       console.log(error);
       return 1;
   }
}

function coreChangeColor(colorString) {
    /*
        When this function is called, it will detect which node user selected automatically and
        apply color to it

        colorString is some css-like string like "rgba(220, 220, 220, 0.5)"

        return 0 - colorChanged Successfully
        return 1 - color applied fail (unknown reason)
        return 2 - color applied fail since user has no selected node
    */
    let selectNodes = network.getSelectedNodes();
    if (selectNodes.length == 0) { return 2; }
    try{
        let newNodes = nodes.get(selectNodes);
        for (let i = 0; i < newNodes.length; i ++){
            if (newNodes.color == undefined){
                newNodes[i].color = {background: colorString};
            }
            else {
                newNodes[i].color.background = colorString;
            }
            syncServerPropChange(newNodes[i]);
        }
        nodes.update(newNodes);
        return 0;
    } catch (error) {
        console.log(error);
        return 1;
    }
}

function eventUpdateScale(){
    let scale = network.getScale() * 100;
    let percentage = scale.toFixed(2);
    let updateElem = document.getElementById("curretnScaleDisplay");
    updateElem.innerText = percentage;
}

function zoomInNetwork(){
    network.moveTo({ scale: network.getScale() * 1.5 });
    eventUpdateScale();
}

function zoomOutNetwork(){
    network.moveTo({ scale: network.getScale() / 1.5 });
    eventUpdateScale();
}

function syncServerAddNode(nodeStruct) {
    syncSignalSend(
        {
            "version": uuid4(),
            "operation": "ADD",
            "property": "node",
            "value": JSON.stringify(nodeStruct)
        }
    );
}

function syncServerAddEdge(newEdge) {
    syncSignalSend(
        {
            "version": uuid4(),
            "operation": "ADD",
            "property": "edge",
            "value": JSON.stringify(newEdge)
        }
    );
}

function syncServerRemoveNodes(nodeIDList) {
    syncSignalSend(
        {
            "version": uuid4(),
            "operation": "DEL",
            "property": "node",
            "value": JSON.stringify(nodeIDList)
        }
    );
}

function syncServerRemoveEdges(edgeIDList) {
    syncSignalSend(
        {
            "version": uuid4(),
            "operation": "DEL",
            "property": "edge",
            "value": JSON.stringify(edgeIDList)
        }
    );
}

function syncServerPropChange(nodeStruct){
    syncSignalSend(
        {
            "version": uuid4(),
            "operation": "MOD",
            "property": "node",
            "value": JSON.stringify(nodeStruct)
        }
    );
}

function syncSignalSend(jsonObject){
    fetch("http://172.26.17.47/write", {
        method: 'POST',
        body: JSON.stringify(jsonObject)
    });
}
