import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, ShieldOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type AppointmentStatus,
  type SalonService,
  type SalonStaff,
  type ServiceCategory,
  categoryLabel,
  formatPrice,
  statusLabel,
  useAllAppointments,
  useAllServices,
  useAllStaff,
  useCreateService,
  useCreateStaff,
  useDashboardStats,
  useDeleteAppointment,
  useDeleteService,
  useDeleteStaff,
  useIsAdmin,
  useUpdateAppointmentStatus,
  useUpdateService,
  useUpdateStaff,
} from "../hooks/useQueries";

const CATEGORIES: { value: string; label: string; obj: ServiceCategory }[] = [
  { value: "hair", label: "Hair", obj: { hair: null } },
  { value: "nails", label: "Nails", obj: { nails: null } },
  { value: "skin", label: "Skin", obj: { skin: null } },
  { value: "massage", label: "Massage", obj: { massage: null } },
  { value: "other", label: "Other", obj: { other: null } },
];

const STATUSES: { value: string; label: string; obj: AppointmentStatus }[] = [
  { value: "pending", label: "Pending", obj: { pending: null } },
  { value: "confirmed", label: "Confirmed", obj: { confirmed: null } },
  { value: "cancelled", label: "Cancelled", obj: { cancelled: null } },
  { value: "completed", label: "Completed", obj: { completed: null } },
];

function categoryKey(cat: ServiceCategory): string {
  if ("hair" in cat) return "hair";
  if ("nails" in cat) return "nails";
  if ("skin" in cat) return "skin";
  if ("massage" in cat) return "massage";
  return "other";
}

function statusKey(s: AppointmentStatus): string {
  if ("pending" in s) return "pending";
  if ("confirmed" in s) return "confirmed";
  if ("cancelled" in s) return "cancelled";
  if ("completed" in s) return "completed";
  return "pending";
}

function statusBadgeClass(s: AppointmentStatus) {
  if ("pending" in s) return "bg-yellow-100 text-yellow-800";
  if ("confirmed" in s) return "bg-green-100 text-green-800";
  if ("cancelled" in s) return "bg-red-100 text-red-800";
  if ("completed" in s) return "bg-blue-100 text-blue-800";
  return "";
}

// ─── Service Form ─────────────────────────────────────────────────────────────
function ServiceDialog({
  open,
  onClose,
  service,
}: { open: boolean; onClose: () => void; service?: SalonService }) {
  const isEdit = !!service;
  const create = useCreateService();
  const update = useUpdateService();

  const [form, setForm] = useState({
    name: service?.name ?? "",
    description: service?.description ?? "",
    category: service ? categoryKey(service.category) : "hair",
    durationMinutes: service ? Number(service.durationMinutes) : 60,
    priceCents: service ? Number(service.priceCents) : 5000,
    isActive: service?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = CATEGORIES.find((c) => c.value === form.category)?.obj ?? {
      other: null,
    };
    const payload: SalonService = {
      id: service?.id ?? BigInt(0),
      name: form.name,
      description: form.description,
      category: catObj,
      durationMinutes: BigInt(form.durationMinutes),
      priceCents: BigInt(form.priceCents),
      isActive: form.isActive,
    };
    try {
      if (isEdit) {
        await update.mutateAsync({ id: service!.id, service: payload });
        toast.success("Service updated");
      } else {
        await create.mutateAsync(payload);
        toast.success("Service created");
      }
      onClose();
    } catch {
      toast.error("Failed to save service");
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent data-ocid="service.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Edit Service" : "Add Service"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              data-ocid="service.name.input"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              data-ocid="service.description.textarea"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger data-ocid="service.category.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration (min)</Label>
              <Input
                data-ocid="service.duration.input"
                type="number"
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    durationMinutes: Number(e.target.value),
                  }))
                }
                min={1}
                required
              />
            </div>
          </div>
          <div>
            <Label>Price (cents, e.g. 8500 = $85.00)</Label>
            <Input
              data-ocid="service.price.input"
              type="number"
              value={form.priceCents}
              onChange={(e) =>
                setForm((p) => ({ ...p, priceCents: Number(e.target.value) }))
              }
              min={0}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              data-ocid="service.active.switch"
              checked={form.isActive}
              onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: v }))}
            />
            <Label>Active</Label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="service.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="service.save_button"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Staff Form ───────────────────────────────────────────────────────────────
function StaffDialog({
  open,
  onClose,
  staff,
}: { open: boolean; onClose: () => void; staff?: SalonStaff }) {
  const isEdit = !!staff;
  const create = useCreateStaff();
  const update = useUpdateStaff();

  const [form, setForm] = useState({
    name: staff?.name ?? "",
    specialization: staff?.specialization ?? "",
    bio: staff?.bio ?? "",
    isActive: staff?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SalonStaff = {
      id: staff?.id ?? BigInt(0),
      name: form.name,
      specialization: form.specialization,
      bio: form.bio,
      isActive: form.isActive,
    };
    try {
      if (isEdit) {
        await update.mutateAsync({ id: staff!.id, staff: payload });
        toast.success("Staff updated");
      } else {
        await create.mutateAsync(payload);
        toast.success("Staff member added");
      }
      onClose();
    } catch {
      toast.error("Failed to save staff");
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent data-ocid="staff.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Edit Staff" : "Add Staff"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              data-ocid="staff.name.input"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label>Specialization</Label>
            <Input
              data-ocid="staff.specialization.input"
              value={form.specialization}
              onChange={(e) =>
                setForm((p) => ({ ...p, specialization: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea
              data-ocid="staff.bio.textarea"
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              data-ocid="staff.active.switch"
              checked={form.isActive}
              onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: v }))}
            />
            <Label>Active</Label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="staff.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="staff.save_button"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Admin Inner App ──────────────────────────────────────────────────────────
function AdminInner() {
  const { data: stats } = useDashboardStats();
  const { data: services, isLoading: servicesLoading } = useAllServices();
  const { data: staff, isLoading: staffLoading } = useAllStaff();
  const { data: appointments, isLoading: apptLoading } = useAllAppointments();
  const updateStatus = useUpdateAppointmentStatus();
  const deleteAppt = useDeleteAppointment();
  const deleteService = useDeleteService();
  const deleteStaff = useDeleteStaff();

  const [serviceDialog, setServiceDialog] = useState<{
    open: boolean;
    item?: SalonService;
  }>({ open: false });
  const [staffDialog, setStaffDialog] = useState<{
    open: boolean;
    item?: SalonStaff;
  }>({ open: false });

  const statCards = [
    {
      label: "Total Services",
      value: stats ? Number(stats.totalServices) : "—",
    },
    { label: "Total Staff", value: stats ? Number(stats.totalStaff) : "—" },
    {
      label: "Total Appointments",
      value: stats ? Number(stats.totalAppointments) : "—",
    },
    {
      label: "Pending",
      value: stats ? Number(stats.pendingAppointments) : "—",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.965 0.012 70)" }}
    >
      {/* Admin Header */}
      <header className="bg-white border-b border-border px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span
            className="font-display text-xl tracking-widest font-bold"
            style={{ color: "oklch(0.15 0.005 50)" }}
          >
            SERENE
          </span>
          <span
            className="text-xs tracking-widest font-body"
            style={{ color: "oklch(0.67 0.075 70)" }}
          >
            ADMIN PORTAL
          </span>
        </div>
        <a
          href="/"
          className="text-xs font-body hover:opacity-70"
          style={{ color: "oklch(0.46 0.02 50)" }}
          data-ocid="admin.back_to_site.link"
        >
          ← Back to site
        </a>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" data-ocid="admin.tabs">
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard" data-ocid="admin.dashboard.tab">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="services" data-ocid="admin.services.tab">
              Services
            </TabsTrigger>
            <TabsTrigger value="staff" data-ocid="admin.staff.tab">
              Staff
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              data-ocid="admin.appointments.tab"
            >
              Appointments
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" data-ocid="admin.dashboard.panel">
            <h2
              className="font-display text-2xl mb-6"
              style={{ color: "oklch(0.15 0.005 50)" }}
            >
              Dashboard
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="bg-white p-5 border border-border"
                >
                  <p
                    className="text-xs tracking-widest font-body mb-2"
                    style={{ color: "oklch(0.67 0.075 70)" }}
                  >
                    {card.label.toUpperCase()}
                  </p>
                  <p
                    className="font-display text-3xl font-bold"
                    style={{ color: "oklch(0.15 0.005 50)" }}
                  >
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Services */}
          <TabsContent value="services" data-ocid="admin.services.panel">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="font-display text-2xl"
                style={{ color: "oklch(0.15 0.005 50)" }}
              >
                Services
              </h2>
              <Button
                data-ocid="services.add.primary_button"
                onClick={() => setServiceDialog({ open: true })}
                style={{ background: "oklch(0.67 0.075 70)", color: "white" }}
                className="text-xs tracking-widest"
              >
                <Plus className="h-4 w-4 mr-1" /> ADD SERVICE
              </Button>
            </div>
            {servicesLoading ? (
              <div
                className="flex justify-center py-12"
                data-ocid="services.loading_state"
              >
                <Loader2
                  className="h-6 w-6 animate-spin"
                  style={{ color: "oklch(0.67 0.075 70)" }}
                />
              </div>
            ) : (
              <div
                className="bg-white border border-border overflow-hidden"
                data-ocid="services.table"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-body">Name</TableHead>
                      <TableHead className="font-body">Category</TableHead>
                      <TableHead className="font-body">Duration</TableHead>
                      <TableHead className="font-body">Price</TableHead>
                      <TableHead className="font-body">Status</TableHead>
                      <TableHead className="font-body">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services?.length === 0 && (
                      <TableRow data-ocid="services.empty_state">
                        <TableCell
                          colSpan={6}
                          className="text-center font-body py-8"
                          style={{ color: "oklch(0.46 0.02 50)" }}
                        >
                          No services yet.
                        </TableCell>
                      </TableRow>
                    )}
                    {services?.map((svc, i) => (
                      <TableRow
                        key={Number(svc.id)}
                        data-ocid={`services.item.${i + 1}`}
                      >
                        <TableCell className="font-body font-medium">
                          {svc.name}
                        </TableCell>
                        <TableCell className="font-body">
                          {categoryLabel(svc.category)}
                        </TableCell>
                        <TableCell className="font-body">
                          {Number(svc.durationMinutes)} min
                        </TableCell>
                        <TableCell className="font-body">
                          {formatPrice(svc.priceCents)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-2 py-1 font-body ${svc.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}
                          >
                            {svc.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setServiceDialog({ open: true, item: svc })
                              }
                              data-ocid={`services.edit_button.${i + 1}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700"
                              onClick={async () => {
                                await deleteService.mutateAsync(svc.id);
                                toast.success("Deleted");
                              }}
                              data-ocid={`services.delete_button.${i + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Staff */}
          <TabsContent value="staff" data-ocid="admin.staff.panel">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="font-display text-2xl"
                style={{ color: "oklch(0.15 0.005 50)" }}
              >
                Staff
              </h2>
              <Button
                data-ocid="staff.add.primary_button"
                onClick={() => setStaffDialog({ open: true })}
                style={{ background: "oklch(0.67 0.075 70)", color: "white" }}
                className="text-xs tracking-widest"
              >
                <Plus className="h-4 w-4 mr-1" /> ADD STAFF
              </Button>
            </div>
            {staffLoading ? (
              <div
                className="flex justify-center py-12"
                data-ocid="staff.loading_state"
              >
                <Loader2
                  className="h-6 w-6 animate-spin"
                  style={{ color: "oklch(0.67 0.075 70)" }}
                />
              </div>
            ) : (
              <div
                className="bg-white border border-border overflow-hidden"
                data-ocid="staff.table"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-body">Name</TableHead>
                      <TableHead className="font-body">
                        Specialization
                      </TableHead>
                      <TableHead className="font-body">Bio</TableHead>
                      <TableHead className="font-body">Status</TableHead>
                      <TableHead className="font-body">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff?.length === 0 && (
                      <TableRow data-ocid="staff.empty_state">
                        <TableCell
                          colSpan={5}
                          className="text-center font-body py-8"
                          style={{ color: "oklch(0.46 0.02 50)" }}
                        >
                          No staff members yet.
                        </TableCell>
                      </TableRow>
                    )}
                    {staff?.map((m, i) => (
                      <TableRow
                        key={Number(m.id)}
                        data-ocid={`staff.item.${i + 1}`}
                      >
                        <TableCell className="font-body font-medium">
                          {m.name}
                        </TableCell>
                        <TableCell className="font-body">
                          {m.specialization}
                        </TableCell>
                        <TableCell
                          className="font-body text-sm max-w-xs truncate"
                          style={{ color: "oklch(0.46 0.02 50)" }}
                        >
                          {m.bio}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-2 py-1 font-body ${m.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}
                          >
                            {m.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setStaffDialog({ open: true, item: m })
                              }
                              data-ocid={`staff.edit_button.${i + 1}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700"
                              onClick={async () => {
                                await deleteStaff.mutateAsync(m.id);
                                toast.success("Deleted");
                              }}
                              data-ocid={`staff.delete_button.${i + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Appointments */}
          <TabsContent
            value="appointments"
            data-ocid="admin.appointments.panel"
          >
            <h2
              className="font-display text-2xl mb-6"
              style={{ color: "oklch(0.15 0.005 50)" }}
            >
              Appointments
            </h2>
            {apptLoading ? (
              <div
                className="flex justify-center py-12"
                data-ocid="appointments.loading_state"
              >
                <Loader2
                  className="h-6 w-6 animate-spin"
                  style={{ color: "oklch(0.67 0.075 70)" }}
                />
              </div>
            ) : (
              <div
                className="bg-white border border-border overflow-hidden"
                data-ocid="appointments.table"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-body">Client</TableHead>
                      <TableHead className="font-body">Email</TableHead>
                      <TableHead className="font-body">Date</TableHead>
                      <TableHead className="font-body">Time</TableHead>
                      <TableHead className="font-body">Status</TableHead>
                      <TableHead className="font-body">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments?.length === 0 && (
                      <TableRow data-ocid="appointments.empty_state">
                        <TableCell
                          colSpan={6}
                          className="text-center font-body py-8"
                          style={{ color: "oklch(0.46 0.02 50)" }}
                        >
                          No appointments yet.
                        </TableCell>
                      </TableRow>
                    )}
                    {appointments?.map((appt, i) => (
                      <TableRow
                        key={Number(appt.id)}
                        data-ocid={`appointments.item.${i + 1}`}
                      >
                        <TableCell className="font-body font-medium">
                          {appt.clientName}
                        </TableCell>
                        <TableCell
                          className="font-body text-sm"
                          style={{ color: "oklch(0.46 0.02 50)" }}
                        >
                          {appt.clientEmail}
                        </TableCell>
                        <TableCell className="font-body">
                          {appt.appointmentDate}
                        </TableCell>
                        <TableCell className="font-body">
                          {appt.appointmentTime}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={statusKey(appt.status)}
                            onValueChange={async (v) => {
                              const statusObj = STATUSES.find(
                                (s) => s.value === v,
                              )?.obj ?? { pending: null };
                              await updateStatus.mutateAsync({
                                id: appt.id,
                                status: statusObj,
                              });
                              toast.success("Status updated");
                            }}
                          >
                            <SelectTrigger
                              className={`h-7 text-xs w-32 ${statusBadgeClass(appt.status)}`}
                              data-ocid={`appointments.status.${i + 1}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                            onClick={async () => {
                              await deleteAppt.mutateAsync(appt.id);
                              toast.success("Deleted");
                            }}
                            data-ocid={`appointments.delete_button.${i + 1}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <ServiceDialog
        open={serviceDialog.open}
        onClose={() => setServiceDialog({ open: false })}
        service={serviceDialog.item}
      />
      <StaffDialog
        open={staffDialog.open}
        onClose={() => setStaffDialog({ open: false })}
        staff={staffDialog.item}
      />

      <footer
        className="border-t border-border mt-12 py-4 px-8 text-center text-xs font-body"
        style={{ color: "oklch(0.46 0.02 50)" }}
      >
        © {new Date().getFullYear()} Serene Beauty Studio. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-70"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

export function AdminPage() {
  const { login, isLoggingIn, loginStatus, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  const isAuthenticated = loginStatus === "success";

  if (isInitializing || (isAuthenticated && adminLoading)) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "oklch(0.965 0.012 70)" }}
        data-ocid="admin.loading_state"
      >
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "oklch(0.67 0.075 70)" }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.875 0.038 40)" }}
      >
        <div
          className="bg-white p-10 max-w-sm w-full mx-4 text-center"
          data-ocid="admin.login.panel"
        >
          <span
            className="font-display text-3xl tracking-widest font-bold block mb-2"
            style={{ color: "oklch(0.15 0.005 50)" }}
          >
            SERENE
          </span>
          <p
            className="font-body text-xs tracking-widest mb-6"
            style={{ color: "oklch(0.67 0.075 70)" }}
          >
            ADMIN PORTAL
          </p>
          <p
            className="font-body text-sm mb-6"
            style={{ color: "oklch(0.46 0.02 50)" }}
          >
            Sign in to manage services, staff, and appointments.
          </p>
          <Button
            data-ocid="admin.login.primary_button"
            className="w-full tracking-widest text-xs"
            style={{ background: "oklch(0.67 0.075 70)", color: "white" }}
            onClick={() => login()}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                SIGNING IN...
              </>
            ) : (
              "SIGN IN"
            )}
          </Button>
          <div className="mt-4">
            <a
              href="/"
              className="text-xs font-body"
              style={{ color: "oklch(0.67 0.075 70)" }}
              data-ocid="admin.back.link"
            >
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "oklch(0.965 0.012 70)" }}
      >
        <div
          className="text-center max-w-sm px-6"
          data-ocid="admin.access_denied.panel"
        >
          <ShieldOff
            className="h-12 w-12 mx-auto mb-4"
            style={{ color: "oklch(0.46 0.02 50)" }}
          />
          <h2
            className="font-display text-xl mb-2"
            style={{ color: "oklch(0.15 0.005 50)" }}
          >
            Access Denied
          </h2>
          <p
            className="font-body text-sm"
            style={{ color: "oklch(0.46 0.02 50)" }}
          >
            You don't have admin access to this dashboard.
          </p>
          <a
            href="/"
            className="block mt-4 text-xs font-body"
            style={{ color: "oklch(0.67 0.075 70)" }}
          >
            ← Back to site
          </a>
        </div>
      </div>
    );
  }

  return <AdminInner />;
}
