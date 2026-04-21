import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('attendance')
  async recordAttendance(@Body() data: { eventId: string; guestId: number; metadata: any }) {
    return this.eventsService.recordAttendance(data);
  }

  @Get('attendance/status')
  async getAttendanceStatus() {
    return this.eventsService.getAttendanceStatus();
  }

  @Post('ai/profile')
  async generateAIProfile(@Body() data: { guestId: number }) {
    return this.eventsService.generateAIProfile(data.guestId);
  }

  @Get(':id/attendance')
  async getEventAttendance(@Param('id') eventId: string) {
    return this.eventsService.getEventAttendance(eventId);
  }
}
