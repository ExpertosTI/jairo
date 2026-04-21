import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const companyStatusEnum = pgEnum('company_status', ['active', 'pending', 'suspended']);
export const relationshipTypeEnum = pgEnum('relationship_type', ['supplier', 'client', 'partner', 'distributor']);
export const relationshipStatusEnum = pgEnum('relationship_status', ['active', 'pending']);
export const userRoleEnum = pgEnum('user_role', ['super_admin', 'admin', 'manager', 'user']);

// Sectors Table
export const sectors = pgTable('sectors', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    icon: varchar('icon', { length: 50 }),
    color: varchar('color', { length: 7 }),
    createdAt: timestamp('created_at').defaultNow(),
});

// Company Types Table
export const companyTypes = pgTable('company_types', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    sectorId: uuid('sector_id').references(() => sectors.id),
    createdAt: timestamp('created_at').defaultNow(),
});

// Companies Table (Multi-tenant)
export const companies = pgTable('companies', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 200 }).notNull(),
    slug: varchar('slug', { length: 100 }).unique().notNull(),
    logo: varchar('logo', { length: 500 }),
    sectorId: uuid('sector_id').references(() => sectors.id),
    typeId: uuid('type_id').references(() => companyTypes.id),
    address: text('address'),
    phone: varchar('phone', { length: 20 }),
    email: varchar('email', { length: 100 }),
    website: varchar('website', { length: 200 }),
    status: companyStatusEnum('status').default('pending'),
    aiMetadata: text('ai_metadata'), // JSON storage for AI insights
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Company Relationships (Engranajes)
export const companyRelationships = pgTable('company_relationships', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyAId: uuid('company_a_id').references(() => companies.id).notNull(),
    companyBId: uuid('company_b_id').references(() => companies.id).notNull(),
    relationshipType: relationshipTypeEnum('relationship_type').notNull(),
    status: relationshipStatusEnum('status').default('pending'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Products Table
export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 200 }).notNull(),
    description: text('description'),
    price: varchar('price', { length: 50 }),
    image: varchar('image', { length: 500 }),
    companyId: uuid('company_id').references(() => companies.id),
    category: varchar('category', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow(),
});

// Event Attendance Table
export const eventAttendance = pgTable('event_attendance', {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: varchar('event_id', { length: 100 }).notNull(),
    guestId: varchar('guest_id', { length: 100 }).notNull(),
    checkinTime: timestamp('checkin_time').defaultNow(),
    metadata: text('metadata'), // JSON stringified for flexible data
    createdAt: timestamp('created_at').defaultNow(),
});

// Type exports
export type Sector = typeof sectors.$inferSelect;
export type CompanyType = typeof companyTypes.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type CompanyRelationship = typeof companyRelationships.$inferSelect;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type EventAttendance = typeof eventAttendance.$inferSelect;
