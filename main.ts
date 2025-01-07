import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  // Serve index.html for the root path
  if (url.pathname === "/") {
    const html = await Deno.readFile("./public/views/index.html");
    return new Response(html, {
      headers: {
        "content-type": "text/html",
      },
    });
  }
  
  // Serve CSS files
  if (url.pathname.startsWith("/styles/") && url.pathname.endsWith(".css")) {
    try {
      const css = await Deno.readFile(`./public${url.pathname}`);
      return new Response(css, {
        headers: {
          "content-type": "text/css",
        },
      });
    } catch {
      return new Response("CSS file not found", { status: 404 });
    }
  }

  // Serve PDF files
  if (url.pathname.startsWith("/public/documents/") && url.pathname.endsWith(".pdf")) {
    try {
      const pdf = await Deno.readFile(`.${url.pathname}`);
      return new Response(pdf, {
        headers: {
          "content-type": "application/pdf",
          "content-disposition": "inline",
        },
      });
    } catch (error) {
      console.error("Error serving PDF:", error);
      return new Response("PDF file not found", { status: 404 });
    }
  }
  
  // Return 404 for any other paths
  return new Response("Not Found", { status: 404 });
}

console.log("Server running on http://localhost:8000");
await serve(handler, { port: 8000 });