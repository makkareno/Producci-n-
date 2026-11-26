import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  // PGlite trae su propio binario WebAssembly: se carga desde node_modules, sin empaquetar.
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default config;
