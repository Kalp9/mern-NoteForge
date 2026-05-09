import mongoose from "mongoose";
import Note from "../models/Note.model.js";

const isValidNoteId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET ALL NOTES
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user._id }).sort({ createdAt: -1 });
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

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newNote = new Note({
      title,
      content,
      owner: req.user._id,
    });

    await newNote.save();

    res.status(201).json({
      message: "Note created successfully",
      note: newNote,
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

    if (!isValidNoteId(id)) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
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

    if (!isValidNoteId(id)) {
      return res.status(404).json({ message: "Note not found" });
    }

    const deletedNote = await Note.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "Note deleted successfully",
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

    if (!isValidNoteId(id)) {
      return res.status(404).json({ message: "Note not found" });
    }

    const note = await Note.findOne({ _id: id, owner: req.user._id });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
