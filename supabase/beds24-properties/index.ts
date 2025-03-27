import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return new Response(JSON.stringify({ error: "Token ausente" }), { status: 401 });

  const token = authHeader.replace("Bearer ", "");

  const { data: tokenRecord } = await supabase
    .from("tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (!tokenRecord || new Date(tokenRecord.expires_at) < new Date()) {
    return new Response(JSON.stringify({ error: "Token inválido ou expirado" }), { status: 403 });
  }

  const bedsResponse = await fetch(
    "https://api.beds24.com/v2/properties?includePictures=true&includeTexts=property&includeAllRooms=true",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );

  if (!bedsResponse.ok) {
    const err = await bedsResponse.json();
    return new Response(JSON.stringify({ error: "Erro na API Beds24", details: err }), { status: 500 });
  }

  const bedsData = await bedsResponse.json();
  const result = (bedsData.data || []).map((property: any) => ({
    id: property.id,
    name: property.name,
    city: property.city,
    country: property.country,
    picture: property?.pictures?.[0]?.url || null,
    roomTypes: (property.roomTypes || []).map((room: any) => ({
      id: room.id,
      name: room.name,
      minPrice: room.minPrice
    }))
  }));

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" }
  });
});

