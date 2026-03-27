/* eslint-disable */
// @ts-nocheck
// This file was automatically generated.

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export type ServiceCategory = { 'hair': null } | { 'nails': null } | { 'skin': null } | { 'massage': null } | { 'other': null };
export type AppointmentStatus = { 'pending': null } | { 'confirmed': null } | { 'cancelled': null } | { 'completed': null };
export type UserRole = { 'admin': null } | { 'user': null } | { 'guest': null };

export interface Service {
  'id': bigint;
  'name': string;
  'description': string;
  'durationMinutes': bigint;
  'priceCents': bigint;
  'category': ServiceCategory;
  'isActive': boolean;
}

export interface Staff {
  'id': bigint;
  'name': string;
  'specialization': string;
  'bio': string;
  'isActive': boolean;
}

export interface Appointment {
  'id': bigint;
  'clientName': string;
  'clientEmail': string;
  'clientPhone': string;
  'serviceId': bigint;
  'staffId': bigint;
  'appointmentDate': string;
  'appointmentTime': string;
  'status': AppointmentStatus;
  'notes': string;
  'createdAt': bigint;
}

export interface BookingRequest {
  'clientName': string;
  'clientEmail': string;
  'clientPhone': string;
  'serviceId': bigint;
  'staffId': bigint;
  'appointmentDate': string;
  'appointmentTime': string;
  'notes': string;
}

export interface DashboardStats {
  'totalServices': bigint;
  'totalStaff': bigint;
  'totalAppointments': bigint;
  'pendingAppointments': bigint;
}

export interface _SERVICE {
  '_initializeAccessControlWithSecret': ActorMethod<[string], undefined>;
  'assignCallerUserRole': ActorMethod<[Principal, UserRole], undefined>;
  'getCallerUserRole': ActorMethod<[], UserRole>;
  'isCallerAdmin': ActorMethod<[], boolean>;

  // Services
  'getAllServices': ActorMethod<[], Array<Service>>;
  'getActiveServices': ActorMethod<[], Array<Service>>;
  'createService': ActorMethod<[Service], bigint>;
  'updateService': ActorMethod<[bigint, Service], undefined>;
  'deleteService': ActorMethod<[bigint], undefined>;

  // Staff
  'getAllStaff': ActorMethod<[], Array<Staff>>;
  'getActiveStaff': ActorMethod<[], Array<Staff>>;
  'createStaff': ActorMethod<[Staff], bigint>;
  'updateStaff': ActorMethod<[bigint, Staff], undefined>;
  'deleteStaff': ActorMethod<[bigint], undefined>;

  // Appointments
  'bookAppointment': ActorMethod<[BookingRequest], bigint>;
  'getAllAppointments': ActorMethod<[], Array<Appointment>>;
  'getAppointmentsByEmail': ActorMethod<[string], Array<Appointment>>;
  'updateAppointmentStatus': ActorMethod<[bigint, AppointmentStatus], undefined>;
  'deleteAppointment': ActorMethod<[bigint], undefined>;

  // Dashboard
  'getDashboardStats': ActorMethod<[], DashboardStats>;
}

export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
