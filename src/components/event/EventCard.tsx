import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/lib/validations/event"

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onView: (event: Event) => void;
}

export function EventCard({ event, onEdit, onDelete, onView }: EventCardProps) {
  const confirmationRate = (event.guestCount || 0) > 0 ? ((event.confirmedCount || 0) / (event.guestCount || 0)) * 100 : 0;
  const steps = event.steps ?? []; // sécurise l'accès aux étapes

  return (
      <Card className="card-elegant hover:shadow-elegant transition-smooth cursor-pointer group">
          <CardHeader>
              <div className="flex justify-between items-start">
                  <div className="flex-1" onClick={() => onView(event)}>
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-smooth">
                          {event.name}
                      </CardTitle>
                      {event.description && (
                          <CardDescription className="mt-1">{event.description}</CardDescription>
                      )}
                  </div>
                  <div className="flex space-x-2">
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                              e.stopPropagation();
                              onEdit(event);
                          }}
                      >
                          <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                              e.stopPropagation();
                              onDelete(event.id);
                          }}
                      >
                          <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                  </div>
              </div>
          </CardHeader>

          <CardContent onClick={() => onView(event)}>
              <div className="space-y-4">
                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{event.location}</span>
                      </div>
                  </div>

                  {/* Guest Stats */}
                  <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">
                {event.confirmedCount || 0}/{event.guestCount || 0} confirmés
              </span>
                      </div>
                      <Badge variant={confirmationRate > 75 ? "default" : "secondary"}>
                          {Math.round(confirmationRate)}% confirmés
                      </Badge>
                  </div>

                  {steps.length > 0 && (
                      <div className="border-t pt-4">
                          <div className="flex items-center space-x-2 mb-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Programme ({steps.length} étapes)</span>
                          </div>
                          <div className="space-y-1">
                              {steps.slice(0, 2).map((step) => (
                                  <div key={step.id} className="flex justify-between text-xs text-muted-foreground">
                                      <span>{step.title}</span>
                                      <span>{step.time}</span>
                                  </div>
                              ))}
                              {steps.length > 2 && (
                                  <div className="text-xs text-muted-foreground">
                                      +{steps.length - 2} autres étapes...
                                  </div>
                              )}
                          </div>
                      </div>
                  )}
              </div>
          </CardContent>
      </Card>
  );
}