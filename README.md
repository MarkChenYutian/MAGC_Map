# MAGC Map

An interactive Knowledge Map

## Update Protocol v2

The Update Protocol (UP) is a set of data transfer protocol used to transfer data between client and server.

### Protocol Format

```json
{
    "version": "string (uuid)",
    "operation": "string {ADD, DEL, MOD, SYC, NOP, NEW}",
    "property": "string {node, edge, content}",
    "value": "string",
   	"src": "string [Board Name]"
}
```

### Protocol Operation Definition

In the following passage, we call `node`, `edge`, `content`

| Operation | Client to Server                       | Server to Client                                             |
| --------- | -------------------------------------- | ------------------------------------------------------------ |
| `ADD`     | Ask server to add a new entity         | Server require Client add new entity                         |
| `DEL`     | Remove an entity from server storage   | Remove an expired entity from Client                         |
| `MOD`     | Modify (overwrite) an entity in Server | Modify (overwrite) an entity in Client                       |
| `SYC`     | Request sync from Server               | Provide later versions to client                             |
| `NOP`     | --                                     | Do nothing, client is already up-to-date                     |
| `NEW`     | Create a new Board                     | Completely Reload the JSON File and refresh all (since client is 100+ version behind server) |
