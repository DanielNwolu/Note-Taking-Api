import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNotesByCategory
} from '../controllers/noteController';
import { validateRequest, validateNote, validateNoteUpdate } from '../middleware/validationMiddleware';
import { requestLogger } from '../middleware/loggingMiddleware';

const router = Router();

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Retrieve all notes
 *     description: Retrieve a list of all notes sorted by last updated.
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: A list of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                   example: 2
 *                 data:
 *                   type: object
 *                   properties:
 *                     notes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Note'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/')
  .get(getAllNotes)
  /**
   * @swagger
   * /api/notes:
   *   post:
   *     summary: Create a new note
   *     description: Create a new note with title and content.
   *     tags: [Notes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - content
   *             properties:
   *               title:
   *                 type: string
   *                 description: Title of the note
   *                 example: Task List
   *               content:
   *                 type: string
   *                 description: Content of the note
   *                 example: Complete API documentation and unit tests
   *     responses:
   *       201:
   *         description: Note created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: object
   *                   properties:
   *                     note:
   *                       $ref: '#/components/schemas/Note'
   *       400:
   *         description: Bad request - Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  .post(validateRequest(validateNote), createNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a specific note
 *     description: Retrieve a specific note by its ID.
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the note to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     note:
 *                       $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a note
 *     description: Delete a specific note by its ID.
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the note to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Note deleted successfully (No Content)
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     summary: Update a note
 *     description: Update an existing note by ID.
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the note to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Task List
 *               content:
 *                 type: string
 *                 example: Updated API documentation
 *               categoryId:
 *                 type: string
 *                 example: 5f8d04b3ab35b428f8611098
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     note:
 *                       $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/:id')
  .get(getNoteById)
  .delete(deleteNote)
  .patch(validateRequest(validateNoteUpdate), updateNote);


/**
 * @swagger
 * /api/notes/categories/{categoryId}:
 *   get:
 *     summary: Retrieve notes by category
 *     description: Retrieve a list of notes filtered by category ID, sorted by last updated
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID of the category to filter notes
 *         schema:
 *           type: string
 *           example: 5f8d04b3ab35b428f8611098
 *     responses:
 *       200:
 *         description: List of notes in the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: string
 *                       example: 5f8d04b3ab35b428f8611098
 *                     notes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Note'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/categories/:categoryId')
  .get(getNotesByCategory);



export default router;