// Feature flags
// Frontend: set VITE_CLOUD_PROVIDERS=true in your .env to enable cloud provider UI.
// Backend:  set cloud_providers_enabled = true in config/local.toml [features].
export const CLOUD_PROVIDERS_ENABLED = import.meta.env.VITE_CLOUD_PROVIDERS === "true";
