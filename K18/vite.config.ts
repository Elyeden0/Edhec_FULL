import { defineConfig } from "vite";

import type { ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  // Dev-only small plugin to suppress broken dependency .map requests that cause console noise
  // Some prebundled deps include invalid source maps which Firefox reports as "No sources are declared".
  // We simply return 404 for those .map files under the optimized deps folder to avoid the warnings.
  ...(mode === "development"
    ? [
        {
          name: "sourcemap-cleaner",
          configureServer(server: ViteDevServer) {
            server.middlewares.use((req: any, res: any, next: any) => {
              try {
                const url = req.url || "";
                // Match .map requests under the optimized deps folder, including querystrings
                const re = /^\/node_modules\/\.vite\/deps\/.*\.map($|\?)/;
                if (re.test(url)) {
                  res.statusCode = 404;
                  res.end();
                  return;
                }
              } catch (e) {
                // ignore
              }
              next();
            });
          },
        },
      ]
    : []),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
