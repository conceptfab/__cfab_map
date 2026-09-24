import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" — ten sam build ma działać pod adresem URL i z dysku (rozdz. 12.3).
export default defineConfig({
  base: "./",
  plugins: [react()],
});
