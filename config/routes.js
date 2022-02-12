import express from 'express';

import NoteController from './../src/controllers/note.controller';
import LinkTreeController from './../src/controllers/linkTree.controller';
import UserController from './../src/controllers/user.controller';
import AuthMiddleware from '../src/middlewares/auth'

const routes = express.Router();

routes.get('/', (req, res) => {
  res.json({
    name: 'salvae-api',
    version: '1.0.0',
  });
});

/**
 * @swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         format: uuid
 *         readOnly: true
 *       email:
 *         type: string
 *         format: email
 *       name:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *         writeOnly: true
 *       createdAt:
 *         type: string
 *         format: date-time
 *         readOnly: true
 *       updatedAt:
 *         type: string
 *         format: date-time
 *         readOnly: true
 *   Note:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         format: uuid
 *         readOnly: true
 *       title:
 *         type: string
 *       content:
 *         type: string
 *       userId:
 *         type: string
 *         format: uuid
 *         readOnly: true
 *       createdAt:
 *         type: string
 *         format: date-time
 *         readOnly: true
 *       updatedAt:
 *         type: string
 *         format: date-time
 *         readOnly: true
 *   LinkTree:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         format: uuid
 *         readOnly: true
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       buttonColor:
 *         type: string
 *       links:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             label:
 *               type: string
 *             url:
 *               type: string
 *         description: LinkTree links
 *       userId:
 *         type: string
 *         format: uuid
 *         readOnly: true
 *       createdAt:
 *         type: string
 *         format: date-time
 *         readOnly: true
 *       updatedAt:
 *         type: string
 *         format: date-time
 *         readOnly: true
 *   AuthResponse:
 *     type: object
 *     properties:
 *       user:
 *         $ref: '#/definitions/User'
 *       token:
 *         type: string
 */

// User
/**
 * @swagger
 *
 * /register:
 *   post:
 *     summary: Register user to the application
 *     description: Returns user data and session token
 *     produces:
 *       - application/json
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: User email
 *              name:
 *                type: string
 *                description: User name
 *              password:
 *                type: string
 *                description: User password
 *            required:
 *              - email
 *              - name
 *              - password
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/AuthResponse'
 */
routes.post('/register', UserController.register);
/**
 * @swagger
 *
 * /login:
 *   post:
 *     summary: Login to the application
 *     description: Returns user data and session token
 *     produces:
 *       - application/json
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: User email
 *              password:
 *                type: string
 *                description: User password
 *            required:
 *              - email
 *              - password
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/AuthResponse'
 */
routes.post('/login', UserController.login);

// Notes
routes.use('/notes', AuthMiddleware);

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Gets user notes
 *     description: Returns all user notes
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/definitions/Note'
 */
routes.get('/notes', NoteController.getAll);
/**
 * @swagger
 * /notes/{noteId}:
 *   get:
 *     summary: Gets user note
 *     description: Returns one user note
 *     parameters:
 *       - in: path
 *         name: noteId
 *         schema:
 *            type: string
 *         required: true
 *         description: Unique ID of the note to get
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/Note'
 */
routes.get('/notes/:id', NoteController.get);
/**
 * @swagger
 *
 * /notes:
 *   post:
 *     summary: Creates a note
 *     description: Returns the created note
 *     produces:
 *       - application/json
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: Note title
 *              content:
 *                type: string
 *                description: Note content
 *            required:
 *              - title
 *              - content
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/Note'
 */
routes.post('/notes', NoteController.create);
/**
 * @swagger
 *
 * /notes/{noteId}:
 *   put:
 *     summary: Modifies a note by ID
 *     description: Returns the modified note
 *     parameters:
 *       - in: path
 *         name: noteId
 *         schema:
 *            type: string
 *         required: true
 *         description: Unique ID of the note to modify
 *     produces:
 *       - application/json
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: Note title
 *              content:
 *                type: string
 *                description: Note content
 *            required:
 *              - title
 *              - content
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/Note'
 */
routes.put('/notes/:id', NoteController.update);
/**
 * @swagger
 *
 * /notes/{noteId}:
 *   delete:
 *     summary: Deletes a note by ID
 *     description: Returns the deleted note
 *     parameters:
 *       - in: path
 *         name: noteId
 *         schema:
 *            type: string
 *         required: true
 *         description: Unique ID of the note to delete
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/Note'
 */
routes.delete('/notes/:id', NoteController.delete);

// LinkTrees
routes.use('/linkTrees', AuthMiddleware);

/**
 * @swagger
 * /linkTrees:
 *   get:
 *     summary: Gets user linkTrees
 *     description: Returns all user linkTrees
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/definitions/LinkTree'
 */
routes.get('/linkTrees', LinkTreeController.getAll);
/**
 * @swagger
 * /linkTrees/{linkTreeId}:
 *   get:
 *     summary: Gets user linkTree
 *     description: Returns one user linkTree
 *     parameters:
 *       - in: path
 *         name: linkTreeId
 *         schema:
 *            type: string
 *         required: true
 *         description: Unique ID of the linkTree to get
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/LinkTree'
 */
routes.get('/linkTrees/:id', LinkTreeController.get);
/**
 * @swagger
 *
 * /linkTrees:
 *   post:
 *     summary: Creates a linkTree
 *     description: Returns the created linkTree
 *     produces:
 *       - application/json
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: LinkTree title
 *              description:
 *                type: string
 *                description: LinkTree description
 *              buttonColor:
 *                type: string
 *                description: LinkTree buttons color
 *              links:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    label:
 *                      type: string
 *                    url:
 *                      type: string
 *                description: LinkTree links
 *            required:
 *              - title
 *              - description
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/LinkTree'
 */
routes.post('/linkTrees', LinkTreeController.create);
/**
 * @swagger
 *
 * /linkTrees/{linkTreeId}:
 *   put:
 *     summary: Modifies a linkTree by ID
 *     description: Returns the modified linkTree
 *     parameters:
 *       - in: path
 *         name: linkTreeId
 *         schema:
 *            type: string
 *         required: true
 *         description: Unique ID of the linkTree to modify
 *     produces:
 *       - application/json
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: LinkTree title
 *              description:
 *                type: string
 *                description: LinkTree description
 *              buttonColor:
 *                type: string
 *                description: LinkTree buttons color
 *              links:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    label:
 *                      type: string
 *                    url:
 *                      type: string
 *                description: LinkTree links
 *            required:
 *              - title
 *              - description
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/LinkTree'
 */
routes.put('/linkTrees/:id', LinkTreeController.update);
/**
 * @swagger
 *
 * /linkTrees/{linkTreeId}:
 *   delete:
 *     summary: Deletes a linkTree by ID
 *     description: Returns the deleted linkTree
 *     parameters:
 *       - in: path
 *         name: linkTreeId
 *         schema:
 *            type: string
 *         required: true
 *         description: Unique ID of the linkTree to delete
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/LinkTree'
 */
routes.delete('/linkTrees/:id', LinkTreeController.delete);

/**
 * @swagger
 * /links/{linkTreeId}:
 *   get:
 *     summary: Gets user linkTree
 *     description: Returns one user linkTree
 *     parameters:
 *       - in: path
 *         name: linkTreeId
 *         schema:
 *            type: string
 *         required: true
 *         description: Unique ID of the linkTree to get
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/LinkTree'
 */
 routes.get('/links/:id', LinkTreeController.getPublic);

module.exports = routes;