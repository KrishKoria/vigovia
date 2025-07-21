function getBackendUrl(): string {
  const isDev = process.env.NODE_ENV === "development";

  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }

  return isDev ? "http://localhost:8080" : "https://api.example.com";
}

export const config = {
  backend: {
    url: getBackendUrl(),
    timeout: 30000,
  },
  features: {
    backendPdfGeneration: true,
    clientSidePdfGeneration: true,
  },
};

export default config;
