import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import { responseSuccess } from "../../utils/response.js";
import * as services from "./notes.service.js";
import { getTokenFromHeader } from "../../utils/getTokenFromHeader.js";

const router = Router();

const routes = {
  replace: "/replace",
  all: "/all",
  paginateSort: "/paginate-sort",
  noteByContent: "/note-by-content",
  noteWithUser: "/note-with-user",
  aggregate: "/aggregate",
};

router.get(routes.noteByContent, verifyToken, async (req, res, next) => {
  const { content } = req.query;
  const authHeader = req.headers.authorization;

  const token = getTokenFromHeader(authHeader);

  const service = await services.getNoteByContent({
    content,
    token,
  });
  return responseSuccess(res, 200, "Notes Retrieved Successfully", service);
});

router.get(routes.paginateSort, verifyToken, async (req, res, next) => {
  const { page, limit } = req.query;
  const authHeader = req.headers.authorization;

  const token = getTokenFromHeader(authHeader);

  const service = await services.retrieveNoteService({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    token,
  });
  return responseSuccess(res, 200, "Notes Retrieved Successfully", service);
});

router.get(routes.noteWithUser, verifyToken, async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = getTokenFromHeader(authHeader);

  const service = await services.retrieveAllNotesWithTitleAndUserIdService({
    token,
  });
  return responseSuccess(res, 200, "Notes Retrieved Successfully", service);
});

router.get(routes.aggregate, verifyToken, async (req, res, next) => {
  const { title } = req.query;
  const authHeader = req.headers.authorization;

  const token = getTokenFromHeader(authHeader);

  const service = await services.aggregationNoteService({
    title,
    token,
  });
  return responseSuccess(res, 200, "Notes Retrieved Successfully", service);
});

router.get("/:id", verifyToken, async (req, res, next) => {
  const { id } = req.params;
  const authHeader = req.headers.authorization;

  const token = getTokenFromHeader(authHeader);
  const service = await services.getSingleNoteService({
    id,
    token,
  });
  return responseSuccess(res, 200, "Note Retrieved Successfully", service);
});

router.post("/", verifyToken, async (req, res, next) => {
  const { title, content } = req.body;
  const authHeader = req.headers.authorization;

  const token = getTokenFromHeader(authHeader);

  const service = await services.createNoteService({
    title,
    content,
    token,
  });
  return responseSuccess(res, 201, "Note Created Successfully", service);
});

router.patch(routes.all, verifyToken, async (req, res, next) => {
  const { title } = req.body;
  const authHeader = req.headers.authorization;

  const token = getTokenFromHeader(authHeader);
  const service = await services.updateTitleForAllNotesService({
    title,
    token,
  });
  return responseSuccess(res, 202, "All Notes Updated Successfully", service);
});

router.patch("/single/:noteId", verifyToken, async (req, res, next) => {
  const { title, content } = req.body;
  const { noteId } = req.params;
  const authHeader = req.headers.authorization;

  const token = getTokenFromHeader(authHeader);

  const service = await services.updateNoteService({
    noteId,
    title,
    content,
    token,
  });

  return responseSuccess(res, 202, "Note Updated Successfully", service);
});

router.put(`${routes.replace}/:noteId`, verifyToken, async (req, res, next) => {
  const { title, content } = req.body;
  const { noteId } = req.params;
  const authHeader = req.headers.authorization;

  const token = getTokenFromHeader(authHeader);

  const service = await services.replaceNoteService({
    noteId,
    title,
    content,
    token,
  });
  return responseSuccess(res, 200, "Note Replaced Successfully", service);
});

router.delete("/", verifyToken, async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = getTokenFromHeader(authHeader);

  const service = await services.deleteAllNotesService({
    token,
  });
  return responseSuccess(res, 200, "All Notes Deleted Successfully", service);
});

router.delete("/:noteId", verifyToken, async (req, res, next) => {
  const { noteId } = req.params;
  const authHeader = req.headers.authorization;
  const token = getTokenFromHeader(authHeader);
  const service = await services.deleteNoteService({
    noteId,
    token,
  });
  return responseSuccess(res, 200, "Note Deleted Successfully", service);
});

export default router;
