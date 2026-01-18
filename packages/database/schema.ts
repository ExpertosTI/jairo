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

// Users Table
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    name: varchar('name', { length: 200 }),
    role: userRoleEnum('role').default('user'),
    companyId: uuid('company_id').references(() => companies.id),
    createdAt: timestamp('created_at').defaultNow(),
});

// Type exports
export type Sector = typeof sectors.$inferSelect;
export type CompanyType = typeof companyTypes.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type CompanyRelationship = typeof companyRelationships.$inferSelect;
export type User = typeof users.$inferSelect;
