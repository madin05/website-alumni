import { buildApp } from './app.js';
import { env } from './config/env.js';

async function start() {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    // eslint-disable-next-line no-console
    console.log(`\n🚀 Server berjalan di http://${env.HOST}:${env.PORT}`);
    console.log(`📚 API Prefix: ${env.API_PREFIX}`);
    console.log(`🌐 CORS: ${env.corsOrigins.join(', ')}\n`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();