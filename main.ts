import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// File paths
const asciiLogoPath = "./public/extras/ascii-art.txt";
const indexFilePath = "./public/views/index.html";

// Cache ASCII art in memory
const asciiLogo = await Deno.readTextFile(asciiLogoPath);

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let path: string;

  // Route files based on their actual location
  if (url.pathname.startsWith("/src/")) {
    path = `.${url.pathname}`; // Serve directly from ./src/
  } else {
    path = `./public${url.pathname}`; // Serve from ./public/ for everything else
  }

  // Default to index.html for root requests
  if (url.pathname === "/") {
    path = indexFilePath;

    try {
      // Read and replace the ASCII art placeholder in index.html
      let htmlContent = await Deno.readTextFile(path);
      htmlContent = htmlContent.replace("{{ASCII_LOGO}}", asciiLogo);

      return new Response(htmlContent, {
        headers: { "Content-Type": "text/html" },
      });
    } catch (error) {
      console.error("Error serving index.html:", error.message);
      return new Response("Error loading index.html", { status: 500 });
    }
  }

  try {
    const file = await Deno.readFile(path);
    const ext = path.split(".").pop();

    // Set correct MIME types
    const contentType = {
      "html": "text/html",
      "css": "text/css",
      "js": "application/javascript",
      "ts": "application/javascript", // Serve TypeScript as JavaScript
      "txt": "text/plain",
      "pdf": "application/pdf",
    }[ext] || "text/plain";

    return new Response(file, {
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    console.error(`Error serving file ${path}:`, error.message);
    // Handle 404 errors
    return new Response("File not found", { status: 404 });
  }
}

console.log("Server running on http://localhost:8000");
serve(handler, { port: 8000 });