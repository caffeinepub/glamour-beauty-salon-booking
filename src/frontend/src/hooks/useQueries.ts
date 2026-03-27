import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

// Beauty salon types (frontend-only, actor calls use any cast)
export interface SalonService {
  id: bigint;
  name: string;
  description: string;
  durationMinutes: bigint;
  priceCents: bigint;
  category: ServiceCategory;
  isActive: boolean;
}

export interface SalonStaff {
  id: bigint;
  name: string;
  specialization: string;
  bio: string;
  isActive: boolean;
}

export interface Appointment {
  id: bigint;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: bigint;
  staffId: bigint;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: bigint;
}

export interface BookingRequest {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: bigint;
  staffId: bigint;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
}

export interface DashboardStats {
  totalServices: bigint;
  totalStaff: bigint;
  totalAppointments: bigint;
  pendingAppointments: bigint;
}

export type ServiceCategory =
  | { hair: null }
  | { nails: null }
  | { skin: null }
  | { massage: null }
  | { other: null };

export type AppointmentStatus =
  | { pending: null }
  | { confirmed: null }
  | { cancelled: null }
  | { completed: null };

export function categoryLabel(cat: ServiceCategory): string {
  if ("hair" in cat) return "Hair";
  if ("nails" in cat) return "Nails";
  if ("skin" in cat) return "Skin";
  if ("massage" in cat) return "Massage";
  return "Other";
}

export function statusLabel(s: AppointmentStatus): string {
  if ("pending" in s) return "Pending";
  if ("confirmed" in s) return "Confirmed";
  if ("cancelled" in s) return "Cancelled";
  if ("completed" in s) return "Completed";
  return "Unknown";
}

export function formatPrice(priceCents: bigint): string {
  return `$${(Number(priceCents) / 100).toFixed(2)}`;
}

// ─── Admin check ──────────────────────────────────────────────────────────────
export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return (actor as any).isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Services ─────────────────────────────────────────────────────────────────
export function useActiveServices() {
  const { actor, isFetching } = useActor();
  return useQuery<SalonService[]>({
    queryKey: ["activeServices"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getActiveServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllServices() {
  const { actor, isFetching } = useActor();
  return useQuery<SalonService[]>({
    queryKey: ["allServices"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (s: SalonService) => (actor as any).createService(s),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allServices"] }),
  });
}

export function useUpdateService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, service }: { id: bigint; service: SalonService }) =>
      (actor as any).updateService(id, service),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allServices"] }),
  });
}

export function useDeleteService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => (actor as any).deleteService(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allServices"] }),
  });
}

// ─── Staff ────────────────────────────────────────────────────────────────────
export function useActiveStaff() {
  const { actor, isFetching } = useActor();
  return useQuery<SalonStaff[]>({
    queryKey: ["activeStaff"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getActiveStaff();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllStaff() {
  const { actor, isFetching } = useActor();
  return useQuery<SalonStaff[]>({
    queryKey: ["allStaff"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllStaff();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateStaff() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (s: SalonStaff) => (actor as any).createStaff(s),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allStaff"] }),
  });
}

export function useUpdateStaff() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, staff }: { id: bigint; staff: SalonStaff }) =>
      (actor as any).updateStaff(id, staff),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allStaff"] }),
  });
}

export function useDeleteStaff() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => (actor as any).deleteStaff(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allStaff"] }),
  });
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export function useAllAppointments() {
  const { actor, isFetching } = useActor();
  return useQuery<Appointment[]>({
    queryKey: ["allAppointments"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookAppointment() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: (req: BookingRequest) =>
      (actor as any).bookAppointment(req) as Promise<bigint>,
  });
}

export function useGetAppointmentsByEmail() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: (email: string) =>
      (actor as any).getAppointmentsByEmail(email) as Promise<Appointment[]>,
  });
}

export function useUpdateAppointmentStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: bigint; status: AppointmentStatus }) =>
      (actor as any).updateAppointmentStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allAppointments"] }),
  });
}

export function useDeleteAppointment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => (actor as any).deleteAppointment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allAppointments"] }),
  });
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────
export function useDashboardStats() {
  const { actor, isFetching } = useActor();
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return (actor as any).getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}
