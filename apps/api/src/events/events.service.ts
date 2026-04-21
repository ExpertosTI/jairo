import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { eventAttendance } from '../database/schema';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class EventsService {
  constructor(private readonly db: DatabaseService) {}

  async recordAttendance(data: { eventId: string; guestId: number; metadata: any }) {
    return await this.db.drizzle.insert(eventAttendance).values({
      eventId: data.eventId,
      guestId: data.guestId.toString(),
      checkinTime: new Date(),
      metadata: JSON.stringify(data.metadata),
    }).returning();
  }

  async getAttendanceStatus() {
    // Simulación de métricas reales basadas en DB
    // En un escenario real, haríamos un count de invitados vs count de attendance
    const attendanceCount = await this.db.drizzle
      .select({ count: sql<number>`count(*)` })
      .from(eventAttendance);

    return {
      totalManifest: 70, // Harcoding para el MVP según la captura, pero puede ser dinámico
      cleared: Number(attendanceCount[0]?.count || 0),
      pendingEntry: 70 - Number(attendanceCount[0]?.count || 0),
      timestamp: new Date().toISOString()
    };
  }

  async generateAIProfile(guestId: number) {
    const matches = [
        { 
            score: 98, 
            summary: "Alta sinergia detectada. Este invitado lidera una empresa con excedente de capacidad en logística que coincide perfectamente con tus necesidades actuales de distribución en el norte.",
            tags: ["High-Value Match", "Logistics", "Strategic Ally"] 
        },
        { 
            score: 85, 
            summary: "Perfil tecnológico complementario. Buscan expansión en servicios cloud, sector donde tu empresa tiene certificaciones premium.",
            tags: ["Tech Synergy", "Expansion", "B2B Lead"] 
        }
    ];

    const result = matches[guestId % matches.length];

    return {
      guestId,
      matchScore: result.score,
      aiSummary: result.summary,
      networkingTags: result.tags,
      timestamp: new Date().toISOString()
    };
  }

  async getEventAttendance(eventId: string) {
    return await this.db.drizzle.select().from(eventAttendance).where(eq(eventAttendance.eventId, eventId));
  }
}
