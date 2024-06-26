import van from "vanjs-core"
const t = van.tags
const {div, span, button, textarea, input, a} = t

import { Tabs } from "./io/vanUI"

import AutoComplete from "./io/AutoComplete"
import { blocksToObject } from "./calc/Editor"
import Dexie from "dexie"

import global from "./global/global"
import * as ContextMenu from "./calc/ContextMenu"
import { openRoot, openLastOpenedRoot } from "./calc/App"

/* 
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
codeanywhere에서 변경사항 있을 시 커밋 뿐만 아니라 push도 꼭 해야한다. 하고나서 깃허브에서 잘됬는지 한번더 확인할것
*/

const initMenuData = [
    {name: 'test', 
    action: function() {alert('!')}, 
    children: [
        {name: 'child 1'}, 
        {name: 'child 2', action: function() {alert('child 2')}, 
            children: [{name: 'childrennnn'}]
        }
      ]
    },
    {name: 'Blocks to YAML',
    action: function () {
        console.log(blocksToObject(Array.from(global.Editor.blocks.children)))
      }
    },
    {name: 'Fixed width / 100%',
    action: function () {
        if (global.DOM.InnerView.style.width === "100%") global.DOM.InnerView.style.width = "1000px"
        else global.DOM.InnerView.style.width = "100%"
      }
    },
    {name: 'Tabs / Side to side',
    action: function () {
      global.sessionStatus.InnerView
      if (global.sessionStatus.InnerView === "Side to side") {
        global.DOM.InnerView.append(
          Tabs(
            {
              Editor: global.DOM.Editor,
              RawEditor: global.DOM.RawEditor
            }
          )
        )
        global.sessionStatus.InnerView = "Tabs"
      } else {
        global.DOM.InnerView.append(
          global.DOM.Editor,
          global.DOM.RawEditor
        )
        Array.from(global.DOM.InnerView.children).find(c => c.classList.contains("tabs")).remove()
        for (let c of global.DOM.InnerView.children) c.style.display = "block"
        global.sessionStatus.InnerView = "Side to side"
      }
    }
  }
]

function initDB () {
  //if RootDB already exists in the browser, Dexie will open the existing one
  //otherwise Dexie will create a new one and return it
  //so don't worry about creating duplicated DB
  global.DB = new Dexie("RootsDB");
  global.DB.version(1).stores({
    roots: `
      ++id,
      usage,
      handle`,
  });
}

ContextMenu.stack(-1, initMenuData)
/* global.TextModifiers = div(
  {id: "TextModifiers", class:"main"},
  Group(
    "Syntax",
    [button(
      {onclick: () => {
        let newBlock = Head("Item", null, [global.thisDoc.name, "Item"], global)
        if (global.SelectedBlock) {
          newBlock.depth(Math.max(1, global.SelectedBlock.depth_))
          global.Editor.blocks.insertBefore(newBlock, global.SelectedBlock.nextSibling)
          return
        }
        global.Editor.blocks.append(newBlock)
        newBlock.depth(1)
      }},    
      "#Key"),
    button(
      {onclick: () => {
        let newBlock = Body("body", null, global)
        if (global.SelectedBlock) {
          global.Editor.blocks.insertBefore(newBlock, global.SelectedBlock.nextSibling)
          return
        }
        global.Editor.blocks.append(newBlock)
      }},    
      "Value"),
    button("[link]"),
    button("[tie|link]")]
  ),
  Group(
    "Style",
    [button("!Bold!"),
    button("_Underline_"),
    button("/Italic/"),
    button("~Strike~"),
    button("“quote”"),]
  ),
  Group(
    "Compile",
    [button("?c.compile")]
  ),
) */

//App
const App = div({id: 'App'},
  div({id: "header"},
    global.DOM.rootIO,
    button("◁"),
    button("▷"),
    button({onclick: () => updateFileViewer(path.slice(0, -1))}, "⇑"),
    button("⇓"),
    button("⟳"),
    input({style: "flex-grow: 1;", type: "text", value: "@root", placeholder: "search a thot", 
    onchange: async function (event) {
        let searchResult = global.docs.find((doc) => {
            let docName = pureFilename(doc.name) //removing the extension str
            return docName === event.target.value
        })
        let file = await searchResult.handle.getFile() // get Blob
        let obj = await yaml.parse(await file.text())
        console.log(global.docs, searchResult, await obj)
    },
    oninput: (event) => {
        AutoComplete(event.target, global.docs)
    }
    }),
    button("👁 All"),
  ),
  global.DOM.View, 
  global.DOM.TextModifiers,
  global.DOM.ContextMenu,
  global.DOM.LogPreview,
)

function IOSetUp() {
  global.DOM.InnerView = div({class: "InnerView", style: "width: 100%"},
    global.DOM.Editor,
    global.DOM.RawEditor
  )
  global.DOM.View.append(global.DOM.InnerView)
  global.DOM.rootIO.addEventListener("click", async (event) => {
      const directoryHandle = await window.showDirectoryPicker()
      await directoryHandle.requestPermission()
      openRoot(directoryHandle)
      //save root directory handle to IndexedDB
      global.DB.roots.add({
        usage: "lastOpenedRoot",
        handle: directoryHandle
      })
  })
  global.DOM.LogPreview.addEventListener("click", (event) => {
    if (event.target.style.flexGrow === "2") {
      event.target.style.flexGrow = "0"
      event.target.style.whiteSpace = "pre"
    } else {
      event.target.style.flexGrow = "2"
      event.target.style.whiteSpace = "pre-wrap"
    }
  })
}
    
van.add(document.body, App)
IOSetUp()
initDB()
openLastOpenedRoot()

//debug
console.log("GLOBAL:", global)