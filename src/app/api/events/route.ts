import { NextResponse } from "next/server"
import supabase from "@/lib/supabase/client";
import {prisma} from "@/lib/prisma";

export async function GET(req: Request) {
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id;
  try {
    const where = userId ? { userId } : {}
    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(events)
  } catch (e) {
    return new NextResponse("Impossible de charger les événements", { status: 500 })
  }
}

export async function POST(req: Request) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return new NextResponse("Non autorisé", { status: 401 })
  }
  
  try {
    const body = await req.json()
    // Ensure the event is associated with the authenticated user
    const eventData = { ...body, userId: user.id }
    const event = await prisma.event.create({ data: eventData })
    return NextResponse.json(event, { status: 201 })
  } catch (e) {
    return new NextResponse("Impossible de créer l'événement", { status: 400 })
  }
}

export async function PATCH(req: Request) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  try {
    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Paramètre 'id' requis" }, { status: 400 })
    }

    const body = await req.json().catch(() => ({} as Record<string, unknown>))
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Corps de requête vide" }, { status: 400 })
    }

    // Interdire la modification de l'ID et du propriétaire
    delete (body as any).id
    delete (body as any).userId

    const result = await prisma.event.updateMany({
      where: { id, userId: user.id },
      data: body as any,
    })

    if (result.count === 0) {
      return NextResponse.json({ error: "Événement introuvable ou non autorisé" }, { status: 404 })
    }

    const updated = await prisma.event.findUnique({ where: { id } })
    return NextResponse.json(updated, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur lors de la mise à jour" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse("Non autorisé", { status: 401 })
  }
  
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Paramètre 'id' requis" }, { status: 400 })
    }

    // Utiliser deleteMany pour garantir la contrainte d'appartenance (id + userId)
    const result = await prisma.event.deleteMany({
      where: { id, userId: user.id }
    })

    if (result.count === 0) {
      return NextResponse.json({ error: "Événement introuvable ou non autorisé" }, { status: 404 })
    }
    
    return new NextResponse(null, { status: 204 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur lors de la suppression" }, { status: 400 })
  }
}