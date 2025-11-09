import Note from "../models/Note.js"


export const getAllNotes = async (req,res) => {
    try {
        //Notes that belong to logged-in user
        const notes = await Note.find({ user: req.user._id }).sort({createdAt: -1}); //-1 sorts by newest-oldest
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({message:"Error retrieving notes"})
    }
}


export const getNoteById =  async (req,res) => {
    try {
        const note = await Note.findById(req.params.id);
        if(!note || note.user.toString() !== req.user._id.toString()) { 
            return res.status(404).json({message: "Note not found or access denied"});
        }
    } catch (error) {
        console.error("Error in getNoteById controller", error);
        res.status(500).json({message: "Error getting note by ID"})
    }
}


export const createNote = async (req,res) => {
     try {
        const note = new Note({title:title, content:content, user: req.user._id});  //Create note
        const savedNote = await note.save(); //Save note and display it upon creation in Postman
        res.status(201).json(savedNote)
     } catch (error) {
        console.error("Error in createNote controller", error);
        res.status(500).json({message: "Error creating Note"})
     }
 }


 export const updateNote = async (req,res) => {
     try {
        
        const note = await Note.findById(req.params.id);
        if (!note || note.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Note not found or access denied" });
        }

        //Update fields
        note.title = req.body.title || note.title;
        note.content = req.body.content || note.content;

        const updatedNote = await note.save();
        res.status(200).json(updatedNote);
     } catch (error) {
        console.error("Error in updateNote controller", error);
        res.status(500).json({message: "Error updating the note"})
     }
 }

 export const deleteNote = async (req,res) => {
    try {

        const note = await Note.findById(req.params.id);
        if (!note || note.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Note not found or access denied" });
        }
        
        await note.deleteOne();
        res.status(200).json({message: "Note has been deleted successfully"})
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({message: "Internal server error"})
    }
 }