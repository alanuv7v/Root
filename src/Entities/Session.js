import Tree from "./Tree"

export default class Session {
    
    constructor (data) {
        if (data) {
            for (let e of Object.entries(data)) {
                this[e[0]] = e[1]
            }
        }
    }

    autosave = false

    root = null 

    docs = null

    tree = new Tree(this.data?.treeData)
    
}