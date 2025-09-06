import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Clock, Calendar as CalendarIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const eventStepSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  time: z.string().min(1, "L'heure est requise"),
});

const eventFormSchema = z.object({
  name: z.string().min(1, "Le titre de l'événement est requis"),
  date: z.string().min(1, "La date est requise"),
  location: z.string().min(1, "Le lieu est requis"),
  description: z.string().optional(),
  steps: z.array(eventStepSchema).min(1, "Au moins une étape est requise"),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EventForm({ initialData, onSubmit, onCancel, isLoading }: EventFormProps) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      date: initialData?.date || "",
      location: initialData?.location || "",
      description: initialData?.description || "",
      steps: initialData?.steps || [{ title: "", time: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  const isEdit = !!initialData && Object.keys(initialData).length > 0;

  const addStep = () => {
    append({ title: "", time: "" });
  };

  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  useEffect(() => {
    reset({
      name: initialData?.name || "",
      date: initialData?.date || "",
      location: initialData?.location || "",
      description: initialData?.description || "",
      steps: initialData?.steps && initialData.steps.length > 0 ? initialData.steps : [{ title: "", time: "" }],
    });
  }, [initialData, reset]);

  const stepsArrayError = errors.steps?.root?.message || (errors.steps as unknown as { message?: string })?.message;

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Titre de l'événement</Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input id="name" placeholder="Ex: Mariage Alice & Bob" {...field} />
              )}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Controller
                control={control}
                name="date"
                render={({ field }) => {
                  const selected = field.value ? new Date(field.value) : undefined;
                  const isValidDate = selected && !isNaN(selected.getTime());
                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                          aria-haspopup="dialog"
                          aria-expanded="false"
                          id="date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {isValidDate ? selected!.toLocaleDateString() : "Choisir une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={isValidDate ? selected : undefined}
                          // On stocke une chaîne AAAA-MM-JJ pour rester compatible avec le schéma
                          onSelect={(d) => {
                            field.onChange(d ? d.toISOString().slice(0, 10) : "");
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  );
                }}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <Controller
                control={control}
                name="location"
                render={({ field }) => (
                  <Input id="location" placeholder="Ex: Château de la Forêt" {...field} />
                )}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea id="description" placeholder="Détails de l'événement..." {...field} />
              )}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Programme / Étapes */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Programme de la journée
            </h3>
            <Button type="button" variant="outline" onClick={addStep}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une étape
            </Button>
          </div>

          {stepsArrayError && (
            <p className="text-sm text-destructive">{stepsArrayError}</p>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-7 space-y-2">
                  <Label htmlFor={`steps.${index}.title`}>Titre</Label>
                  <Controller
                    control={control}
                    name={`steps.${index}.title`}
                    render={({ field }) => (
                      <Input
                        id={`steps.${index}.title`}
                        placeholder="Ex: Cérémonie"
                        {...field}
                      />
                    )}
                  />
                  {errors.steps?.[index]?.title && (
                    <p className="text-sm text-destructive">
                      {errors.steps[index]?.title?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-4 space-y-2">
                  <Label htmlFor={`steps.${index}.time`}>Heure</Label>
                  <Controller
                    control={control}
                    name={`steps.${index}.time`}
                    render={({ field }) => (
                      <Input
                        id={`steps.${index}.time`}
                        type="time"
                        {...field}
                      />
                    )}
                  />
                  {errors.steps?.[index]?.time && (
                    <p className="text-sm text-destructive">
                      {errors.steps[index]?.time?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => remove(index)}
                    aria-label="Supprimer l'étape"
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={!!isLoading} className="btn-glow">
          {isLoading
            ? isEdit
              ? "Enregistrement..."
              : "Création..."
            : isEdit
              ? "Enregistrer les modifications"
              : "Créer l'événement"}
        </Button>
      </div>
    </form>
  );
}