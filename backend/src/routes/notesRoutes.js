import express from "express"
import { getAllNotes, getNoteById, createNote, deleteNote, updateNote } from "../controllers/notesController.js";

const router = express.Router();

/*This middleware checks if a user is logged in.
- Passport adds a "req.isAuthenticated()" method.
- If true, we let the request continue.
*/
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // User is logged in — continue to the route
    return next();
  } else {
    // User not logged in — block access
    res.status(401).json({ message: "Unauthorized. Please log in first." });
  }
}


//User must be authenticated to hit any routes
router.get("/", isAuthenticated, getAllNotes);
router.get("/:id", isAuthenticated, getNoteById);
router.post("/", isAuthenticated, createNote);
router.put("/:id", isAuthenticated, updateNote);
router.delete("/:id", isAuthenticated, deleteNote);




export default router;
















//API Route GET Request
//(localhost:2222/api/notes)

// app.get("/api/notes", (req,res) => {
//     res.status(200).send("You got 22 notes");
// })

// app.post("/api/notes", (req,res) => {
//     res.status(201).json({message:"Post CREATED successfully!"})
// })

// //Want to know which note it is: Need the id of the note (:id);
// app.put("/api/notes/:id", (req,res) => {
//     res.status(200).json({message:"Post UPDATED successfully!"})
// })

// app.delete("/api/notes/:id", (req,res) => {
//     res.status(200).json({message:"Post DELETED successfully!"})
// })