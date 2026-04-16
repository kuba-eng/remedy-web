import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Parsování query parametrů
  const { searchParams } = new URL(req.url);
  const service = searchParams.get("service") || "massage";
  const person = searchParams.get("person") || "Kuba";
  
  // Pro účely MVP (Minimum Viable Product) použijeme přesně ta statická
  // testovací data, která byla specifikována v zadání.
  // Později zde bude opravdové načítání dostupnosti z databáze nebo rezervačního API.
  const mockData = {
    person: person,
    service: service,
    slots: [
      { date: "2026-04-21", time: "09:00", timeOfDay: "morning" },
      { date: "2026-04-22", time: "14:00", timeOfDay: "afternoon" },
      { date: "2026-04-24", time: "10:00", timeOfDay: "morning" }
    ]
  };

  // Simulace drobné síťové/databázové prodlevy, aby se testovalo reálné prostředí
  await new Promise((resolve) => setTimeout(resolve, 500));
  return NextResponse.json(mockData);
}
