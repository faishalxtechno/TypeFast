import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import registerHandler from './api/auth/register';

function apiDevPlugin(env: Record<string, string>) {
  Object.assign(process.env, env);

  return {
    name: 'api-dev-server',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost:5173'}`);

        if (url.pathname === '/api/auth/register') {
          let rawBody = '';
          req.on('data', (chunk: any) => {
            rawBody += chunk;
          });
          req.on('end', async () => {
            try {
              req.body = rawBody ? JSON.parse(rawBody) : {};
            } catch {
              req.body = {};
            }

            res.status = (code: number) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };

            await registerHandler(req, res);
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), apiDevPlugin(env)],
    server: {
      port: 5173,
      host: true
    }
  };
});


