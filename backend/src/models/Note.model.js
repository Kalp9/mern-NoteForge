import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content :{
        type:String,
        required:true // it means that this field is mandatory and must be provided when creating a new note
    }
},{
    timestamps:true // Automatically adds createdAt and updatedAt fields
})

const Note = mongoose.model('Note',noteSchema);

export default Note;