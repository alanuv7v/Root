const { Parser } = require("yaml")

function loadLastSession () {
  openLastTree()

}

function createDocument () {

}

class Edit {

  copyNode = (node) => {
    //clipboard.push(node)
    Tree.copyNode()
  }
  
  pasteNode = (parentNodeQueryString) => {
    //let parentNode = Tree.getNode(parentNodeQueryString)
    //parentNode.append(clipboard.lastItem)
    Tree.pasteNode()
  }

  addNode = () => {
    //let parentNode = Tree.selectedNode
    //this.pasteNode(parentNode)
    Tree.addNode()
  }
  deleteNode = () => {
    Tree.deleteNode()
  }
  changeOrder = (change) => {
    Tree.selectedNode.changeOrder(change)
  }
  changeDepth = (change) => {
    Tree.selectedNode.changeDepth(change)
  }
  linkNode = (targetNodeQueryString) => {
    Tree.selectedNode.linkTo(targetNodeQueryString)
  }
}

class Prune {

  hideNode = () => {

  }
  filterNodes = () => {

  }

}

class Navigate {
  stemOut = (parentNode) => {
    parentNode.stemOut()
  }
  search  = (queryString) => {
    Presenter.renderTree(queryString)
  }
  plantNew = (queryString) => {
    Presenter.renderTree(queryString)
  }
}
