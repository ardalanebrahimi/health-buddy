import { createApp } from './app';

const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 Health Companion API server running on port ${PORT}`);
  console.log(
    `📖 OpenAPI spec available at http://localhost:${PORT}/api/openapi.yaml`
  );
  console.log(`❤️  Health check available at http://localhost:${PORT}/health`);
});
