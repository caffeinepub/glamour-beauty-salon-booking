// @ts-nocheck
export const idlFactory = ({ IDL }) => {
  const ServiceCategory = IDL.Variant({
    hair: IDL.Null,
    nails: IDL.Null,
    skin: IDL.Null,
    massage: IDL.Null,
    other: IDL.Null,
  });
  const Service = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    description: IDL.Text,
    durationMinutes: IDL.Nat,
    priceCents: IDL.Nat,
    category: ServiceCategory,
    isActive: IDL.Bool,
  });
  const Staff = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    specialization: IDL.Text,
    bio: IDL.Text,
    isActive: IDL.Bool,
  });
  const AppointmentStatus = IDL.Variant({
    pending: IDL.Null,
    confirmed: IDL.Null,
    cancelled: IDL.Null,
    completed: IDL.Null,
  });
  const Appointment = IDL.Record({
    id: IDL.Nat,
    clientName: IDL.Text,
    clientEmail: IDL.Text,
    clientPhone: IDL.Text,
    serviceId: IDL.Nat,
    staffId: IDL.Nat,
    appointmentDate: IDL.Text,
    appointmentTime: IDL.Text,
    status: AppointmentStatus,
    notes: IDL.Text,
    createdAt: IDL.Int,
  });
  const BookingRequest = IDL.Record({
    clientName: IDL.Text,
    clientEmail: IDL.Text,
    clientPhone: IDL.Text,
    serviceId: IDL.Nat,
    staffId: IDL.Nat,
    appointmentDate: IDL.Text,
    appointmentTime: IDL.Text,
    notes: IDL.Text,
  });
  const DashboardStats = IDL.Record({
    totalServices: IDL.Nat,
    totalStaff: IDL.Nat,
    totalAppointments: IDL.Nat,
    pendingAppointments: IDL.Nat,
  });
  const UserRole = IDL.Variant({
    admin: IDL.Null,
    user: IDL.Null,
    guest: IDL.Null,
  });
  return IDL.Service({
    _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
    assignCallerUserRole: IDL.Func([IDL.Principal, UserRole], [], []),
    getCallerUserRole: IDL.Func([], [UserRole], ['query']),
    isCallerAdmin: IDL.Func([], [IDL.Bool], ['query']),
    getAllServices: IDL.Func([], [IDL.Vec(Service)], ['query']),
    getActiveServices: IDL.Func([], [IDL.Vec(Service)], ['query']),
    createService: IDL.Func([Service], [IDL.Nat], []),
    updateService: IDL.Func([IDL.Nat, Service], [], []),
    deleteService: IDL.Func([IDL.Nat], [], []),
    getAllStaff: IDL.Func([], [IDL.Vec(Staff)], ['query']),
    getActiveStaff: IDL.Func([], [IDL.Vec(Staff)], ['query']),
    createStaff: IDL.Func([Staff], [IDL.Nat], []),
    updateStaff: IDL.Func([IDL.Nat, Staff], [], []),
    deleteStaff: IDL.Func([IDL.Nat], [], []),
    bookAppointment: IDL.Func([BookingRequest], [IDL.Nat], []),
    getAllAppointments: IDL.Func([], [IDL.Vec(Appointment)], []),
    getAppointmentsByEmail: IDL.Func([IDL.Text], [IDL.Vec(Appointment)], ['query']),
    updateAppointmentStatus: IDL.Func([IDL.Nat, AppointmentStatus], [], []),
    deleteAppointment: IDL.Func([IDL.Nat], [], []),
    getDashboardStats: IDL.Func([], [DashboardStats], []),
  });
};
export const init = ({ IDL }) => [];
