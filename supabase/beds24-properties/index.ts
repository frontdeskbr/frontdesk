
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browsers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Allow both authorization header and token parameter
    const authHeader = req.headers.get("authorization");
    const url = new URL(req.url);
    const tokenParam = url.searchParams.get("token");
    
    let token = tokenParam;
    
    if (authHeader) {
      token = authHeader.replace("Bearer ", "");
    }
    
    if (!token) {
      // Check for an active token in the database
      const { data: tokenRecord, error: tokenError } = await supabase
        .from("beds24_tokens")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (tokenError || !tokenRecord) {
        return new Response(
          JSON.stringify({ error: "Token ausente. Configure nas Configurações do sistema." }), 
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Verify expiration
      if (new Date(tokenRecord.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: "Token expirado. Atualize nas Configurações do sistema." }), 
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      token = tokenRecord.token;
    }

    // Extract endpoint path from the URL
    const path = url.pathname.split("/").slice(3).join("/") || "properties";
    
    // Forward query parameters
    const queryString = Array.from(url.searchParams.entries())
      .filter(([key]) => key !== "token") // Remove token parameter
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
      
    // Default parameters for properties endpoint
    let apiPath = path;
    if (path === "properties" && !queryString.includes("includePictures")) {
      apiPath += "?includePictures=true&includeTexts=property&includeAllRooms=true";
      if (queryString) {
        apiPath += `&${queryString}`;
      }
    } else if (queryString) {
      apiPath += `?${queryString}`;
    }

    // Make request to Beds24 API
    console.log(`Making request to Beds24 API: ${apiPath}`);
    const bedsResponse = await fetch(
      `https://api.beds24.com/v2/${apiPath}`,
      {
        method: req.method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: req.method !== "GET" && req.method !== "HEAD" 
          ? await req.text() 
          : undefined,
      }
    );

    // Get response data
    const responseData = await bedsResponse.json();
    
    // Check for Beds24 API errors
    if (!bedsResponse.ok) {
      const errorMessage = responseData.message || "Erro na API Beds24";
      console.error(`Beds24 API error (${bedsResponse.status}): ${errorMessage}`);
      
      return new Response(
        JSON.stringify({ error: errorMessage, status: bedsResponse.status }),
        { 
          status: bedsResponse.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Erro interno no servidor" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
