import { serve } from "https://deno.land/std@0.210.0/http/server.ts";

const handler = () => new Response("Hello World");

await serve(handler, { port: 8000 });