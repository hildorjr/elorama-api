import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import routes from './routes';

import errorHandler from '../src/middlewares/errorHandler';
import notFound from '../src/middlewares/notFound';

const app = express();
dotenv.config();

const parseOrigins = (origins = '') =>
  origins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = parseOrigins(
  process.env.CORS_ALLOWED_ORIGINS || process.env.FRONTEND_URL || ''
);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 204,
};

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Salvae API',
      version: '1.0.0',
      description: 'Salvae REST API documentation.',
      contact: {
        name: 'Hildor Júnior',
        url: 'https://hildor.com.br',
        email: 'hildorjunior@gmail.com',
      },
      servers: ['http://localhost']
    }
  },
  apis: [
    './config/routes.js',
  ],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(express.json());
app.use(morgan('combined'));
app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(routes);
app.use(notFound);
app.use(errorHandler);

export default app;
