import { z } from "zod";

// Event Schemas
export const eventStepSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Le titre est requis"),
  time: z.string().min(1, "L'heure est requise"),
});

export const createEventStepSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  time: z.string().min(1, "L'heure est requise"),
});

export const eventSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Le titre de l'événement est requis"),
  date: z.string().min(1, "La date est requise"),
  location: z.string().min(1, "Le lieu est requis"),
  description: z.string().optional(),
  steps: z.array(eventStepSchema).min(1, "Au moins une étape est requise"),
  guestCount: z.number().optional(),
  confirmedCount: z.number().optional(),
});

export const createEventSchema = z.object({
  name: z.string().min(1, "Le titre de l'événement est requis"),
  date: z.string().min(1, "La date est requise"),
  location: z.string().min(1, "Le lieu est requis"),
  description: z.string().optional(),
  steps: z.array(createEventStepSchema).min(1, "Au moins une étape est requise"),
  guestCount: z.number().optional(),
  confirmedCount: z.number().optional(),
});

// Guest Schemas
export const guestSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, "Le nom est requis"),
  lastName: z.string().min(1, "Le prénom est requis"),
  phone: z.string().min(1, "Le numéro de téléphone est requis").nullable().optional(),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  eventId: z.string().min(1, "L'événement est requis"),
  eventTitle: z.string().optional(),
  status: z.preprocess(
    (val) => (typeof val === "string" ? val.toLowerCase() : val),
    z.enum(["PENDING", "CONFIRMED", "DECLINED", "EXPIRED"]).optional()
  ),
  qrCode: z.string().optional(),
  token: z.string().optional(),
  menuChoice: z.enum(["VEGAN", "CLASSIC", "FISH", "CHILD"]).optional(),
});

export const bulkGuestSchema = z.object({
  eventId: z.string().min(1, "L'événement est requis"),
  guests: z.array(z.object({
    name: z.string().min(1, "Le nom est requis"),
    phone: z.string().min(1, "Le numéro de téléphone est requis"),
    email: z.string().email("Email invalide").min(1, "L'email est requis"),
  })).min(1, "Au moins un invité est requis"),
});

// Invitation Schemas
export const invitationResponseSchema = z.object({
  confirmed: z.boolean(),
  selectedMenu: z.string().optional(),
});

// Types
export type EventStep = z.infer<typeof eventStepSchema>;
export type CreateEventStep = z.infer<typeof createEventStepSchema>;
export type Event = z.infer<typeof eventSchema>;
export type CreateEvent = z.infer<typeof createEventSchema>;
export type Guest = z.infer<typeof guestSchema>;
export type InvitationResponse = z.infer<typeof invitationResponseSchema>;