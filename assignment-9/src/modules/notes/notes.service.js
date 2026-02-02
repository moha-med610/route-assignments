import { Notes } from "../../db/models/notes.model.js";
import { ServerError } from "../../utils/serverError.js";
import jwt from "jsonwebtoken";
import { Users } from "../../db/models/users.model.js";
import mongoose from "mongoose";

export const createNoteService = async ({ title, content, token }) => {
  const userData = jwt.verify(token, process.env.JWT_SECRET);

  const findUser = await Users.findById(userData.id);
  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }

  const newNote = await Notes.create({
    title,
    content,
    userId: userData.id,
  });

  return newNote;
};

export const updateNoteService = async ({ noteId, title, content, token }) => {
  const userData = jwt.verify(token, process.env.JWT_SECRET);
  const findUser = await Users.findById(userData.id);
  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }

  const findNote = await Notes.findOne({ _id: noteId, userId: userData.id });
  if (!findNote) {
    throw new ServerError(
      false,
      404,
      "You are not the owner of this note or note does not exist",
    );
  }

  const updatedNote = await Notes.findByIdAndUpdate(
    noteId,
    { title, content },
    { new: true },
  );

  return updatedNote;
};

export const replaceNoteService = async ({ noteId, title, content, token }) => {
  const userData = jwt.verify(token, process.env.JWT_SECRET);
  const findUser = await Users.findById(userData.id);
  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }

  const findNote = await Notes.findOne({ _id: noteId, userId: userData.id });
  if (!findNote) {
    throw new ServerError(
      false,
      404,
      "You are not the owner of this note or note does not exist",
    );
  }

  const replacedNote = await Notes.findOneAndReplace(
    { _id: noteId },
    { title, content, userId: userData.id },
    { new: true },
  );

  return replacedNote;
};

export const updateTitleForAllNotesService = async ({ title, token }) => {
  const userData = jwt.verify(token, process.env.JWT_SECRET);

  const findUser = await Users.findById(userData.id);

  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }

  const updatedNotes = await Notes.updateMany(
    { userId: userData.id },
    { title },
  );
  return updatedNotes;
};

export const deleteNoteService = async ({ noteId, token }) => {
  const userData = jwt.verify(token, process.env.JWT_SECRET);
  const findUser = await Users.findById(userData.id);
  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }

  const findNote = await Notes.findOne({ _id: noteId, userId: userData.id });
  if (!findNote) {
    throw new ServerError(
      false,
      404,
      "You are not the owner of this note or note does not exist",
    );
  }

  const deletedNote = await Notes.findByIdAndDelete(noteId);

  return deletedNote;
};

export const retrieveNoteService = async ({ page, limit, token }) => {
  const userData = jwt.verify(token, process.env.JWT_SECRET);
  const findUser = await Users.findById(userData.id);
  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }
  const notes = await Notes.find({ userId: userData.id })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  return notes;
};

export const getSingleNoteService = async ({ id, token }) => {
  const userData = jwt.verify(token, process.env.JWT_SECRET);

  const findUser = await Users.findById(userData.id);
  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }

  const note = await Notes.findOne({ _id: id, userId: userData.id });
  if (!note) {
    throw new ServerError(
      false,
      404,
      "Note not found or you are not the owner",
    );
  }
  return note;
};

export const getNoteByContent = async ({ content, token }) => {
  const userData = jwt.verify(token, process.env.JWT_SECRET);

  const findUser = await Users.findById(userData.id);
  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }

  const notes = await Notes.find({
    content: { $regex: content, $options: "i" },
    userId: userData.id,
  });
  return notes;
};

export const retrieveAllNotesWithTitleAndUserIdService = async ({ token }) => {
  const userData = jwt.verify(token, process.env.JWT_SECRET);
  const findUser = await Users.findById(userData.id);
  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }
  const notes = await Notes.find(
    { userId: userData.id },
    { title: 1, createdAt: 1 },
  ).populate("userId", "email -_id");
  return notes;
};

export const aggregationNoteService = async ({ title, token }) => {
  const userData = jwt.verify(token, process.env.JWT_SECRET);

  const matchStage = {
    userId: new mongoose.Types.ObjectId(userData.id),
  };

  if (title) {
    matchStage.title = { $regex: title, $options: "i" };
  }

  const notes = await Notes.aggregate([
    { $match: matchStage },

    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: "$user",
    },

    {
      $project: {
        title: 1,
        createdAt: 1,
        "user.name": 1,
        "user.email": 1,
      },
    },
  ]);

  if (!notes.length) {
    throw new ServerError(false, 404, "No notes found");
  }

  return notes;
};

export const deleteAllNotesService = async ({ token }) => {
  const userData = jwt.verify(token, process.env.JWT_SECRET);

  const findUser = await Users.findById(userData.id);
  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }
  const deletedNotes = await Notes.deleteMany({ userId: userData.id });
  return deletedNotes;
};
