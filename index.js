let db = null

const btnCreateDB = document.querySelector("#btnCreateDB")
const btnAddNote = document.querySelector("#btnAddNote")
const btnViewNotes = document.querySelector("#btnViewNotes")

btnCreateDB.addEventListener("click", createDB)
btnAddNote.addEventListener("click", addNote)
btnViewNotes.addEventListener("click", viewNotes)

function createDB() {
  const dbName = document.querySelector("#txtDB").value 
  const dbVersion = document.querySelector("#txtVersion").value 

  const request = indexedDB.open(dbName, dbVersion)

  // on upgrade needed
  request.onupgradeneeded = e => {
    db = e.target.result

    const pNotes = db.createObjectStore("personal_notes", {keyPath: "title"})
    const todoNotes = db.createObjectStore("todo_notes", {keyPath: "title"})
    console.log(`Upgrade: db name ${db.name}, version: ${db.version}`)
  }

  // on success
  request.onsuccess = e => {
    db = e.target.result

    console.log(`Success: db name ${db.name}, version: ${db.version}`)

  }

  // on error
  request.onerror = e => {
    console.log(e)

  }
}

function addNote() {
  const note = {
    title: "note" + Math.random(),
    text: "text"
  }

  const tx = db.transaction('personal_notes', 'readwrite')
  tx.onerror = e => console.log(e.target.error)

  const pNotes = tx.objectStore('personal_notes')
  pNotes.add(note)
}

function viewNotes() {
  const tx = db.transaction("personal_notes", "readonly")

  const pNotes = tx.objectStore("personal_notes")
  const request = pNotes.openCursor()
  request.onsuccess = e => {
    const cursor = e.target.result

    if(cursor){
      console.log(`Note: ${cursor.key} - Text: ${cursor.value.text}`);

      cursor.continue()

    }
  }
}

