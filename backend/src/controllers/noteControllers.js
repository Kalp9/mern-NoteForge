import Note from '../models/Note.model.js';

// GET ALL NOTES
export const getAllNotes = async (req, res) => {
   try {
     const notes = await Note.find(); 
     res.status(200).json(notes);
   } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Server error" });
   }
};


// CREATE NOTE
export const createNote = async (req, res) => {
   try {
       const { title, content } = req.body;

       const newNote = new Note({
         title,
         content
       });

       await newNote.save();

       res.status(201).json({
         message: "Note created successfully",
         note: newNote
       });

   } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Server error" });
   }
};

// UPDATE NOTE
export const updateNote = async (req, res) => {
   try {
      const id = req.params.id;
      const { title, content } = req.body;

      const updatedNote = await Note.findByIdAndUpdate(
         id,
         { title, content },
         { new: true }
      );

      if (!updatedNote) {
         return res.status(404).json({ message: "Note not found" });
      }

      res.status(200).json({
         message: "Note updated successfully",
         note: updatedNote
      });

   } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Server error" });
   }
};

// DELETE NOTE
export const deleteNote = async (req, res) => {
   try {
      const id = req.params.id;

      const deletedNote = await Note.findByIdAndDelete(id);

      if (!deletedNote) {
         return res.status(404).json({ message: "Note not found" });
      }

      res.status(200).json({
         message: "Note deleted successfully"
      });

   } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Server error" });
   }
};

// GET NOTE BY ID
export const getNoteById = async (req, res) => {
    try {
        const id = req.params.id;
        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}