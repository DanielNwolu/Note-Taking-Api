import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Note-Taking API Documentation',
      version,
      description: 'API documentation for the Note-Taking application',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'https://note-taking-api-hzp3.onrender.com',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Note: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ObjectId',
              example: '60d21b4667d0d8992e610c85'
            },
            title: {
              type: 'string',
              description: 'Title of the note',
              example: 'Meeting Notes'
            },
            content: {
              type: 'string',
              description: 'Content of the note',
              example: 'Discuss project timeline and resource allocation'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of note creation',
              example: '2023-06-22T19:10:14.398Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of last update',
              example: '2023-06-22T19:10:14.398Z'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'fail'
            },
            message: {
              type: 'string',
              example: 'Note with ID 60d21b4667d0d8992e610c99 not found'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']  // Path to the API routes files
};

const specs = swaggerJsdoc(options);

export default specs;