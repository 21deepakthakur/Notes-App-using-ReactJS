import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"
import {notesCollection, db} from "./firebase"
import { onSnapshot, addDoc, deleteDoc, doc, setDoc, collection, orderBy, query} from "firebase/firestore"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState("")

    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]


    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    React.useEffect(function(){
        if(currentNote){
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])

    React.useEffect(function(){
        const timeoutId = setTimeout(function(){
            if(tempNoteText !== currentNote.body)
                updateNote(tempNoteText)
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    React.useEffect(() => {

        const unsubscribe = onSnapshot(notesCollection, function(snapshot){

            // docs is array of documents
            const notesArr = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))

            setNotes(notesArr)
        })

        return unsubscribe

    }, [])

    async function createNewNote() {

        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        // addDoc pushes the new document to the firebase
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    React.useEffect(function(){
        if(!currentNoteId){
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        setDoc(docRef, {body : text, updatedAt: Date.now()}, {merge : true})
    }

    async function deleteNote(noteId) {
        
       const docRef = doc(db, "notes", noteId)
       await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        <Editor
                            tempNoteText={tempNoteText}
                            setTempNoteText={setTempNoteText}
                        />
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
