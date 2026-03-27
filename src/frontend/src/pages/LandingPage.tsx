import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  ChevronRight,
  Clock,
  Facebook,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  type Appointment,
  categoryLabel,
  formatPrice,
  statusLabel,
  useActiveServices,
  useActiveStaff,
  useBookAppointment,
  useGetAppointmentsByEmail,
} from "../hooks/useQueries";

const TIMES = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const STATIC_SERVICES = [
  {
    name: "Hair Cut & Style",
    category: "Hair",
    price: "$85",
    duration: "60 min",
    description:
      "Precision cut and blow-dry styling tailored to your face shape.",
    image: "/assets/generated/service-hair.dim_600x400.jpg",
  },
  {
    name: "Gel Manicure",
    category: "Nails",
    price: "$45",
    duration: "45 min",
    description: "Long-lasting gel polish with cuticle care and hand massage.",
    image: "/assets/generated/service-nails.dim_600x400.jpg",
  },
  {
    name: "Hydrating Facial",
    category: "Skin",
    price: "$110",
    duration: "75 min",
    description: "Deep-moisture facial with premium serums and gentle massage.",
    image: "/assets/generated/service-skin.dim_600x400.jpg",
  },
  {
    name: "Deep Tissue Massage",
    category: "Massage",
    price: "$95",
    duration: "60 min",
    description:
      "Therapeutic massage targeting deep muscle tension and stress.",
    image: "/assets/generated/service-skin.dim_600x400.jpg",
  },
  {
    name: "Balayage Highlights",
    category: "Hair",
    price: "$180",
    duration: "120 min",
    description:
      "Hand-painted highlights for a natural, sun-kissed colour effect.",
    image: "/assets/generated/service-hair.dim_600x400.jpg",
  },
  {
    name: "Classic Pedicure",
    category: "Nails",
    price: "$55",
    duration: "50 min",
    description: "Soak, scrub, and polish for soft, beautiful feet.",
    image: "/assets/generated/service-nails.dim_600x400.jpg",
  },
];

const STYLISTS = [
  {
    name: "Sofia M.",
    role: "Hair Specialist",
    bio: "With over 12 years of experience, Sofia transforms every client with precision cuts and stunning colour work.",
    image: "/assets/generated/stylist-sofia.dim_400x400.jpg",
  },
  {
    name: "Claire B.",
    role: "Nail Artist",
    bio: "Claire's intricate nail art and impeccable technique have earned her a devoted clientele and industry awards.",
    image: "/assets/generated/stylist-claire.dim_400x400.jpg",
  },
  {
    name: "Mia T.",
    role: "Skin & Spa Therapist",
    bio: "Mia brings a holistic approach to skincare, combining expert knowledge with a deeply relaxing touch.",
    image: "/assets/generated/stylist-mia.dim_400x400.jpg",
  },
];

const GALLERY = [
  "/assets/generated/service-hair.dim_600x400.jpg",
  "/assets/generated/service-nails.dim_600x400.jpg",
  "/assets/generated/service-skin.dim_600x400.jpg",
  "/assets/generated/stylist-sofia.dim_400x400.jpg",
  "/assets/generated/stylist-claire.dim_400x400.jpg",
];

function statusColor(s: Appointment["status"]) {
  if ("pending" in s) return "bg-yellow-100 text-yellow-800";
  if ("confirmed" in s) return "bg-green-100 text-green-800";
  if ("cancelled" in s) return "bg-red-100 text-red-800";
  if ("completed" in s) return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-800";
}

export function LandingPage() {
  const { data: services } = useActiveServices();
  const { data: staff } = useActiveStaff();
  const bookMutation = useBookAppointment();
  const lookupMutation = useGetAppointmentsByEmail();

  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    serviceId: "",
    staffId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });
  const [bookingConfirmed, setBookingConfirmed] = useState<bigint | null>(null);
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupResults, setLookupResults] = useState<Appointment[] | null>(
    null,
  );

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.serviceId ||
      !form.staffId ||
      !form.appointmentDate ||
      !form.appointmentTime
    )
      return;
    try {
      const id = await bookMutation.mutateAsync({
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientPhone: form.clientPhone,
        serviceId: BigInt(form.serviceId),
        staffId: BigInt(form.staffId),
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        notes: form.notes,
      });
      setBookingConfirmed(id);
    } catch {
      // error handled via mutation state
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = await lookupMutation.mutateAsync(lookupEmail);
    setLookupResults(results);
  };

  const scrollToBook = () => {
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.965 0.012 70)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border"
        data-ocid="nav.panel"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span
            className="font-display text-2xl tracking-widest font-bold"
            style={{ color: "oklch(0.15 0.005 50)" }}
          >
            SERENE
          </span>
          <nav className="hidden md:flex items-center gap-8">
            {["Services", "Our Team", "Book Now"].map((link) => (
              <button
                type="button"
                key={link}
                data-ocid={`nav.${link.toLowerCase().replace(" ", "_")}.link`}
                onClick={() =>
                  link === "Book Now" ? scrollToBook() : undefined
                }
                className="text-sm tracking-wide font-body hover:opacity-70 transition-opacity"
                style={{ color: "oklch(0.46 0.02 50)" }}
              >
                {link}
              </button>
            ))}
          </nav>
          <Button
            data-ocid="nav.book_appointment.primary_button"
            onClick={scrollToBook}
            className="text-xs tracking-widest font-body"
            style={{ background: "oklch(0.59 0.068 30)", color: "white" }}
          >
            BOOK APPOINTMENT
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section
        className="flex flex-col md:flex-row min-h-[80vh]"
        data-ocid="hero.section"
      >
        <div className="md:w-[58%] relative overflow-hidden min-h-[50vh] md:min-h-[80vh]">
          <img
            src="/assets/generated/salon-hero.dim_1200x800.jpg"
            alt="Serene Salon Interior"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="md:w-[42%] flex items-center px-10 py-16"
          style={{ background: "oklch(0.965 0.012 70)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p
              className="text-xs tracking-[0.25em] font-body mb-4"
              style={{ color: "oklch(0.67 0.075 70)" }}
            >
              LUXURY BEAUTY STUDIO
            </p>
            <h1
              className="font-display text-5xl lg:text-6xl font-bold leading-tight uppercase mb-6"
              style={{ color: "oklch(0.15 0.005 50)" }}
            >
              Elevate
              <br />
              Your
              <br />
              Beauty
            </h1>
            <p
              className="font-body text-base leading-relaxed mb-8"
              style={{ color: "oklch(0.46 0.02 50)" }}
            >
              Indulge in our curated treatments designed to restore, refine, and
              reveal your most radiant self. Book your personal sanctuary today.
            </p>
            <Button
              data-ocid="hero.schedule_visit.primary_button"
              onClick={scrollToBook}
              size="lg"
              className="tracking-widest text-xs font-body"
              style={{ background: "oklch(0.67 0.075 70)", color: "white" }}
            >
              SCHEDULE YOUR VISIT
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Services */}
      <section
        className="py-20 px-6"
        style={{ background: "oklch(0.875 0.038 40)" }}
        data-ocid="services.section"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl text-center mb-12 tracking-wide"
            style={{ color: "oklch(0.15 0.005 50)" }}
          >
            Featured Services
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STATIC_SERVICES.map((svc, i) => (
              <motion.div
                key={svc.name}
                data-ocid={`services.item.${i + 1}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white overflow-hidden"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={svc.image}
                    alt={svc.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <span
                    className="text-xs tracking-[0.2em] font-body"
                    style={{ color: "oklch(0.67 0.075 70)" }}
                  >
                    {svc.category.toUpperCase()}
                  </span>
                  <div className="flex justify-between items-start mt-1 mb-2">
                    <h3
                      className="font-display text-lg font-semibold"
                      style={{ color: "oklch(0.15 0.005 50)" }}
                    >
                      {svc.name}
                    </h3>
                    <span
                      className="font-display text-lg font-bold"
                      style={{ color: "oklch(0.15 0.005 50)" }}
                    >
                      {svc.price}
                    </span>
                  </div>
                  <p
                    className="font-body text-sm mb-3"
                    style={{ color: "oklch(0.46 0.02 50)" }}
                  >
                    {svc.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="flex items-center gap-1 text-xs font-body"
                      style={{ color: "oklch(0.67 0.075 70)" }}
                    >
                      <Clock className="w-3 h-3" />
                      {svc.duration}
                    </span>
                    <button
                      type="button"
                      onClick={scrollToBook}
                      className="text-xs tracking-widest font-body flex items-center gap-1 hover:opacity-70 transition-opacity"
                      style={{ color: "oklch(0.59 0.068 30)" }}
                      data-ocid={`services.book.${i + 1}`}
                    >
                      BOOK NOW <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Expert Stylists */}
      <section
        className="py-20 px-6"
        style={{ background: "oklch(0.965 0.012 70)" }}
        data-ocid="team.section"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl text-center mb-12 tracking-wide"
            style={{ color: "oklch(0.15 0.005 50)" }}
          >
            Our Expert Stylists
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STYLISTS.map((stylist, i) => (
              <motion.div
                key={stylist.name}
                data-ocid={`team.item.${i + 1}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="text-center"
              >
                <div
                  className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-5 border-2"
                  style={{ borderColor: "oklch(0.845 0.012 55)" }}
                >
                  <img
                    src={stylist.image}
                    alt={stylist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3
                  className="font-display text-xl font-semibold mb-1"
                  style={{ color: "oklch(0.15 0.005 50)" }}
                >
                  {stylist.name}
                </h3>
                <p
                  className="text-xs tracking-[0.2em] mb-3 font-body"
                  style={{ color: "oklch(0.67 0.075 70)" }}
                >
                  {stylist.role.toUpperCase()}
                </p>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "oklch(0.46 0.02 50)" }}
                >
                  {stylist.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Favorites Gallery */}
      <section
        className="py-14 px-6 border-t border-b border-border"
        data-ocid="gallery.section"
      >
        <div className="max-w-6xl mx-auto">
          <p
            className="text-center text-xs tracking-[0.3em] font-body mb-8"
            style={{ color: "oklch(0.46 0.02 50)" }}
          >
            CLIENT FAVORITES
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {GALLERY.map((src) => (
              <div
                key={src}
                className="flex-none w-44 h-44 overflow-hidden"
                style={{ borderRadius: 0 }}
              >
                <img
                  src={src}
                  alt="Gallery"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Appointment */}
      <section
        id="book"
        className="py-20 px-6"
        style={{ background: "oklch(0.875 0.038 40)" }}
        data-ocid="booking.section"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="font-display text-3xl text-center mb-2 tracking-wide uppercase"
              style={{ color: "oklch(0.15 0.005 50)" }}
            >
              Reserve Your Appointment
            </h2>
            <p
              className="text-center font-body text-sm mb-10"
              style={{ color: "oklch(0.46 0.02 50)" }}
            >
              Fill in your details and we'll confirm your booking.
            </p>

            {bookingConfirmed !== null ? (
              <div
                className="bg-white p-8 text-center"
                data-ocid="booking.success_state"
              >
                <div className="text-4xl mb-4">✨</div>
                <h3
                  className="font-display text-2xl mb-2"
                  style={{ color: "oklch(0.15 0.005 50)" }}
                >
                  Booking Confirmed!
                </h3>
                <p
                  className="font-body text-sm mb-2"
                  style={{ color: "oklch(0.46 0.02 50)" }}
                >
                  Your appointment has been reserved.
                </p>
                <p
                  className="font-body text-xs"
                  style={{ color: "oklch(0.67 0.075 70)" }}
                >
                  Booking ID: #{Number(bookingConfirmed)}
                </p>
                <Button
                  className="mt-6 text-xs tracking-widest"
                  style={{ background: "oklch(0.67 0.075 70)", color: "white" }}
                  onClick={() => {
                    setBookingConfirmed(null);
                    setForm({
                      clientName: "",
                      clientEmail: "",
                      clientPhone: "",
                      serviceId: "",
                      staffId: "",
                      appointmentDate: "",
                      appointmentTime: "",
                      notes: "",
                    });
                  }}
                  data-ocid="booking.new_booking.button"
                >
                  BOOK ANOTHER
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleBook}
                className="bg-white p-8 space-y-5"
                data-ocid="booking.form"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p
                      className="block text-xs tracking-widest mb-1 font-body"
                      style={{ color: "oklch(0.46 0.02 50)" }}
                    >
                      FULL NAME
                    </p>
                    <Input
                      data-ocid="booking.name.input"
                      value={form.clientName}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, clientName: e.target.value }))
                      }
                      required
                      className="font-body border-border"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <p
                      className="block text-xs tracking-widest mb-1 font-body"
                      style={{ color: "oklch(0.46 0.02 50)" }}
                    >
                      EMAIL
                    </p>
                    <Input
                      data-ocid="booking.email.input"
                      type="email"
                      value={form.clientEmail}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, clientEmail: e.target.value }))
                      }
                      required
                      className="font-body"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <p
                    className="block text-xs tracking-widest mb-1 font-body"
                    style={{ color: "oklch(0.46 0.02 50)" }}
                  >
                    PHONE
                  </p>
                  <Input
                    data-ocid="booking.phone.input"
                    value={form.clientPhone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, clientPhone: e.target.value }))
                    }
                    className="font-body"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p
                      className="block text-xs tracking-widest mb-1 font-body"
                      style={{ color: "oklch(0.46 0.02 50)" }}
                    >
                      SERVICE
                    </p>
                    <Select
                      value={form.serviceId}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, serviceId: v }))
                      }
                    >
                      <SelectTrigger
                        data-ocid="booking.service.select"
                        className="font-body"
                      >
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services?.length
                          ? services.map((s) => (
                              <SelectItem
                                key={String(s.id)}
                                value={String(s.id)}
                              >
                                {s.name} — {formatPrice(s.priceCents)}
                              </SelectItem>
                            ))
                          : STATIC_SERVICES.map((s, i) => (
                              <SelectItem key={s.name} value={String(i + 1)}>
                                {s.name} — {s.price}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p
                      className="block text-xs tracking-widest mb-1 font-body"
                      style={{ color: "oklch(0.46 0.02 50)" }}
                    >
                      STYLIST
                    </p>
                    <Select
                      value={form.staffId}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, staffId: v }))
                      }
                    >
                      <SelectTrigger
                        data-ocid="booking.staff.select"
                        className="font-body"
                      >
                        <SelectValue placeholder="Select a stylist" />
                      </SelectTrigger>
                      <SelectContent>
                        {staff?.length
                          ? staff.map((m) => (
                              <SelectItem
                                key={String(m.id)}
                                value={String(m.id)}
                              >
                                {m.name}
                              </SelectItem>
                            ))
                          : STYLISTS.map((m, i) => (
                              <SelectItem key={m.name} value={String(i + 1)}>
                                {m.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p
                      className="block text-xs tracking-widest mb-1 font-body"
                      style={{ color: "oklch(0.46 0.02 50)" }}
                    >
                      DATE
                    </p>
                    <Input
                      data-ocid="booking.date.input"
                      type="date"
                      value={form.appointmentDate}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          appointmentDate: e.target.value,
                        }))
                      }
                      required
                      className="font-body"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <p
                      className="block text-xs tracking-widest mb-1 font-body"
                      style={{ color: "oklch(0.46 0.02 50)" }}
                    >
                      TIME
                    </p>
                    <Select
                      value={form.appointmentTime}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, appointmentTime: v }))
                      }
                    >
                      <SelectTrigger
                        data-ocid="booking.time.select"
                        className="font-body"
                      >
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <p
                    className="block text-xs tracking-widest mb-1 font-body"
                    style={{ color: "oklch(0.46 0.02 50)" }}
                  >
                    NOTES (OPTIONAL)
                  </p>
                  <Textarea
                    data-ocid="booking.notes.textarea"
                    value={form.notes}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, notes: e.target.value }))
                    }
                    className="font-body"
                    placeholder="Any special requests or notes..."
                    rows={3}
                  />
                </div>
                {bookMutation.isError && (
                  <p
                    className="text-sm text-red-600"
                    data-ocid="booking.error_state"
                  >
                    Booking failed. Please try again.
                  </p>
                )}
                <Button
                  type="submit"
                  data-ocid="booking.submit_button"
                  disabled={bookMutation.isPending}
                  className="w-full tracking-widest text-xs font-body"
                  style={{ background: "oklch(0.67 0.075 70)", color: "white" }}
                >
                  {bookMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      RESERVING...
                    </>
                  ) : (
                    "RESERVE NOW"
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Check My Booking */}
      <section
        className="py-16 px-6"
        style={{ background: "oklch(0.965 0.012 70)" }}
        data-ocid="lookup.section"
      >
        <div className="max-w-xl mx-auto">
          <h2
            className="font-display text-2xl text-center mb-2 tracking-wide"
            style={{ color: "oklch(0.15 0.005 50)" }}
          >
            Check My Booking
          </h2>
          <p
            className="text-center font-body text-sm mb-8"
            style={{ color: "oklch(0.46 0.02 50)" }}
          >
            Enter your email to view your upcoming appointments.
          </p>
          <form
            onSubmit={handleLookup}
            className="flex gap-3 mb-8"
            data-ocid="lookup.form"
          >
            <Input
              data-ocid="lookup.email.input"
              type="email"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="font-body"
            />
            <Button
              type="submit"
              data-ocid="lookup.submit_button"
              disabled={lookupMutation.isPending}
              style={{ background: "oklch(0.67 0.075 70)", color: "white" }}
              className="text-xs tracking-widest font-body whitespace-nowrap"
            >
              {lookupMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "FIND"
              )}
            </Button>
          </form>
          {lookupResults !== null &&
            (lookupResults.length === 0 ? (
              <p
                className="text-center font-body text-sm"
                style={{ color: "oklch(0.46 0.02 50)" }}
                data-ocid="lookup.empty_state"
              >
                No appointments found for this email.
              </p>
            ) : (
              <div className="overflow-x-auto" data-ocid="lookup.table">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border">
                      <th
                        className="text-left py-2 pr-4 text-xs tracking-widest"
                        style={{ color: "oklch(0.67 0.075 70)" }}
                      >
                        DATE
                      </th>
                      <th
                        className="text-left py-2 pr-4 text-xs tracking-widest"
                        style={{ color: "oklch(0.67 0.075 70)" }}
                      >
                        TIME
                      </th>
                      <th
                        className="text-left py-2 pr-4 text-xs tracking-widest"
                        style={{ color: "oklch(0.67 0.075 70)" }}
                      >
                        STATUS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lookupResults.map((appt, i) => (
                      <tr
                        key={Number(appt.id)}
                        className="border-b border-border"
                        data-ocid={`lookup.item.${i + 1}`}
                      >
                        <td
                          className="py-3 pr-4"
                          style={{ color: "oklch(0.15 0.005 50)" }}
                        >
                          {appt.appointmentDate}
                        </td>
                        <td
                          className="py-3 pr-4"
                          style={{ color: "oklch(0.46 0.02 50)" }}
                        >
                          {appt.appointmentTime}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${statusColor(appt.status)}`}
                          >
                            {statusLabel(appt.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-14 px-6"
        style={{ background: "oklch(0.15 0.005 50)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <h4 className="font-display text-white text-lg mb-4">SERENE</h4>
              <ul className="space-y-2">
                {["Services", "Our Team", "Book Now", "Admin"].map((link) => (
                  <li key={link}>
                    <a
                      href={link === "Admin" ? "/admin" : "#"}
                      className="font-body text-sm hover:opacity-70 transition-opacity"
                      style={{ color: "oklch(0.84 0.01 60)" }}
                      data-ocid={`footer.${link.toLowerCase()}.link`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-white text-lg mb-4">
                Social Media
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:border-white transition-colors"
                  data-ocid="footer.instagram.link"
                >
                  <Instagram
                    className="w-4 h-4"
                    style={{ color: "oklch(0.84 0.01 60)" }}
                  />
                </a>
                <a
                  href="https://facebook.com"
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:border-white transition-colors"
                  data-ocid="footer.facebook.link"
                >
                  <Facebook
                    className="w-4 h-4"
                    style={{ color: "oklch(0.84 0.01 60)" }}
                  />
                </a>
                <a
                  href="https://twitter.com"
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:border-white transition-colors"
                  data-ocid="footer.twitter.link"
                >
                  <Twitter
                    className="w-4 h-4"
                    style={{ color: "oklch(0.84 0.01 60)" }}
                  />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-display text-white text-lg mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <MapPin
                    className="w-4 h-4 mt-0.5 flex-none"
                    style={{ color: "oklch(0.67 0.075 70)" }}
                  />
                  <span
                    className="font-body text-sm"
                    style={{ color: "oklch(0.84 0.01 60)" }}
                  >
                    123 Beauty Lane, Suite 4<br />
                    New York, NY 10001
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone
                    className="w-4 h-4"
                    style={{ color: "oklch(0.67 0.075 70)" }}
                  />
                  <span
                    className="font-body text-sm"
                    style={{ color: "oklch(0.84 0.01 60)" }}
                  >
                    +1 (212) 555-0194
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail
                    className="w-4 h-4"
                    style={{ color: "oklch(0.67 0.075 70)" }}
                  />
                  <span
                    className="font-body text-sm"
                    style={{ color: "oklch(0.84 0.01 60)" }}
                  >
                    hello@serene.salon
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div
            className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-2"
            style={{ borderColor: "oklch(0.25 0.01 50)" }}
          >
            <p
              className="font-body text-xs"
              style={{ color: "oklch(0.55 0.01 50)" }}
            >
              © {new Date().getFullYear()} Serene Beauty Studio. All rights
              reserved.
            </p>
            <p
              className="font-body text-xs"
              style={{ color: "oklch(0.55 0.01 50)" }}
            >
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
