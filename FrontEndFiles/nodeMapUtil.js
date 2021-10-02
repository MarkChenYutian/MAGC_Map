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
        syncServerRenameNode(originalNode);
        return 0;
    } catch (error) {
        console.log(error);
        return 1;
    }
}

function coreRemoveNode(){
    /*
        When this function is called, it will detect which node the
        user selected automatically.

        return 0 - remove successfully
        return 1 - remove Fail
        return 2 - remove Fail since the user selected multiple node
    */
    let selectedNodes = network.getSelectedNodes();
    let selecterEdges = network.getSelectedEdges();

    if (selectedNodes.length != 1) { return 2; }
    try {
        nodes.remove(selectedNodes);
        edges.remove(selecterEdges);
        syncServerRemoveNodes(nodes);
        syncServerRemoveEdges(edges);
        return 0;
    } catch (error) {
        console.log(error);
        return 1;
    }
}

function syncServerAddNode(nodeStruct) {
    
}

function syncServerAddEdge(newEdge) {

}

function syncServerRenameNode(nodeStruct) {

}

function syncServerRemoveNodes(nodeIDList) {

}

function syncServerRemoveEdges(edgeIDList) {

}
