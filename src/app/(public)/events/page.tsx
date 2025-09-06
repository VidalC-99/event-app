"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/hooks/use-auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EventForm } from "@/components/event/EventForm"
import type { Event, CreateEvent } from "@/lib/validations/event"
import { useRouter } from "next/navigation"

export default function EventPage() {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  const auth = useAuth()
  const userId = auth.user?.id

  const {
    data: events = [],
    isLoading,
    isError,
    error,
  } = useQuery<Event[]>({
    queryKey: ["events", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(`/api/events`, {
        headers: { Accept: "application/json" },
      })
      if (!res.ok) {
        throw new Error("Impossible de charger les événements")
      }
      return res.json()
    },
  })

  const createEventMutation = useMutation({
    mutationFn: async (payload: CreateEvent) => {
      const res = await fetch(`/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...payload, userId }),
      })
      if (!res.ok) {
        const msg = await res.text().catch(() => "")
        throw new Error(msg || "Impossible de créer l'événement")
      }
      return res.json() as Promise<Event>
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events", userId] })
      handleCloseForm()
    },
  })
  const updateEventMutation = useMutation({
    mutationFn: async (payload: Event) => {
      const res = await fetch(`/api/events/${encodeURIComponent(payload.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const msg = await res.text().catch(() => "")
        throw new Error(msg || "Impossible de mettre à jour l'événement")
      }
      return res.json() as Promise<Event>
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events", userId] })
      handleCloseForm()
    },
  })
// ... existing code ...
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const res = await fetch(`/api/events/${encodeURIComponent(eventId)}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        const msg = await res.text().catch(() => "")
        throw new Error(msg || "Impossible de supprimer l'événement")
      }
      return true
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events", userId] })
    },
  })

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setIsFormOpen(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    deleteEventMutation.mutate(eventId)
  }

  const handleViewEvent = (eventId: string) => {
    router.push(`/events/${eventId}`)
  }

  const handleCreateEvent = (data: CreateEvent) => {
    createEventMutation.mutate(data)
  }

  const handleUpdateEvent = (data: Event | CreateEvent) => {
    if (!editingEvent) return
    updateEventMutation.mutate({ ...(data as Event), id: editingEvent.id })
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingEvent(null)
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mes Événements</h1>
            <p className="text-muted-foreground mt-1">Gérez vos mariages et événements</p>
          </div>
          <Button
            onClick={() => {
              setEditingEvent(null)
              setIsFormOpen(true)
            }}
            className="btn-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </Button>
        </div>

        {/* États de chargement / erreur / vide */}
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement des événements...
          </div>
        ) : isError ? (
          <div className="p-4 rounded-md border border-red-200 bg-red-50 text-red-700">
            {(error as Error)?.message || "Une erreur est survenue lors du chargement"}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center border border-dashed rounded-lg p-8 text-muted-foreground">
            <p className="text-lg font-medium">Aucun événement créé</p>
            <p className="mt-1">Commencez par créer votre premier événement de mariage</p>
            <Button className="mt-4" onClick={() => setIsFormOpen(true)}>
              Créer mon premier événement
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 space-y-3">
                <div className="font-semibold">{event.name || "Événement sans titre"}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewEvent(event.id)}>
                    Voir
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleEditEvent(event)}>
                    Éditer
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id)}
                    disabled={deleteEventMutation.isPending}
                  >
                    {deleteEventMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Suppression...
                      </>
                    ) : (
                      "Supprimer"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open)
            if (!open) {
              // Nettoyage pour éviter de rouvrir avec de vieilles données
              setEditingEvent(null)
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Modifier l'événement" : "Créer un nouvel événement"}
              </DialogTitle>
            </DialogHeader>
            <EventForm
              key={editingEvent?.id || "new"}
              initialData={editingEvent || undefined}
              onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
              onCancel={handleCloseForm}
              isLoading={
                createEventMutation.isPending ||
                updateEventMutation.isPending
              }
            />
          </DialogContent>
        </Dialog>

        {/* À implémenter: afficher le formulaire/modale quand isFormOpen est true */}
        {/* {isFormOpen && <EventForm onClose={() => setIsFormOpen(false)} initialData={editingEvent} />} */}
      </div>
    </>
  )
}