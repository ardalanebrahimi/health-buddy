import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import pinoHttp from 'pino-http';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// Import module routers
import authRouter from './modules/auth';
import usersRouter from './modules/users';
import nutritionRouter from './modules/nutrition';
import biometricsRouter from './modules/biometrics';
import companionRouter from './modules/companion';
import dashboardRouter from './modules/dashboard';
import plansRouter from './modules/plans';
import adherenceRouter from './modules/adherence';
import insightsRouter from './modules/insights';
import recommendationsRouter from './modules/recommendations';
import integrationsRouter from './modules/integrations';
import aiRouter from './modules/ai';
import hydrationRouter from './modules/hydration';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

export function createApp() {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Logging middleware
  app.use(pinoHttp({ logger }));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // Serve OpenAPI spec
  app.get('/api/openapi.yaml', (req, res) => {
    const openApiPath = path.join(__dirname, '..', 'openapi.yaml');
    if (fs.existsSync(openApiPath)) {
      res.type('text/yaml');
      res.sendFile(openApiPath);
    } else {
      res.status(404).json({ error: 'OpenAPI spec not found' });
    }
  });

  // Swagger UI documentation
  const openApiPath = path.join(__dirname, '..', 'openapi.yaml');
  if (fs.existsSync(openApiPath)) {
    const swaggerDocument = YAML.load(openApiPath);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  // API v1 routes
  const v1Router = express.Router();

  // Health check endpoint (under /api/v1)
  v1Router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Mount module routers
  v1Router.use('/auth', authRouter);
  v1Router.use('/', usersRouter); // Profile and goals endpoints
  v1Router.use('/nutrition', nutritionRouter); // Nutrition endpoints
  v1Router.use('/biometrics', biometricsRouter); // Biometrics endpoints
  v1Router.use('/companion', companionRouter); // Companion endpoints
  v1Router.use('/', dashboardRouter); // Dashboard endpoints
  v1Router.use('/hydration', hydrationRouter);
  v1Router.use('/plans', plansRouter);
  v1Router.use('/adherence', adherenceRouter);
  v1Router.use('/insights', insightsRouter);
  v1Router.use('/recommendations', recommendationsRouter);
  v1Router.use('/integrations', integrationsRouter);
  v1Router.use('/ai', aiRouter);

  app.use('/api/v1', v1Router);

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // Error handler
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      logger.error(err, 'Unhandled error');
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
        },
      });
    }
  );

  return app;
}
