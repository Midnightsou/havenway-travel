// 1. Force Node.js to use cross-fetch globally BEFORE loading Supabase
const crossFetch = require("cross-fetch");
global.fetch = crossFetch;
global.Headers = crossFetch.Headers;
global.Request = crossFetch.Request;
global.Response = crossFetch.Response;

// 2. Now import Supabase and ws
const { createClient } = require("@supabase/supabase-js");
const WebSocket = require("ws");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    realtime: {
      transport: WebSocket
    }
  }
);

module.exports = supabase;