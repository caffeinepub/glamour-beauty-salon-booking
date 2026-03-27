import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ─────────────────────────────────────────────────────────────
  // LEGACY MIGRATION: retain old stable vars from soccer academy to allow upgrade
  // ─────────────────────────────────────────────────────────────

  type _LegacyPosition = { #goalkeeper; #defender; #midfielder; #forward };
  type _LegacyPlayer = {
    id : Nat; name : Text; dateOfBirth : Text; position : _LegacyPosition;
    teamId : ?Nat; parentName : Text; contactPhone : Text; contactEmail : Text;
    enrollmentDate : Text; active : Bool;
  };
  type _LegacySpecialization = { #goalkeeping; #defense; #midfield; #attacking; #fitness };
  type _LegacyCoach = { id : Nat; name : Text; specialization : _LegacySpecialization; phone : Text; email : Text; active : Bool };
  type _LegacyAgeGroup = { #U8; #U10; #U12; #U14; #U16; #U18; #senior };
  type _LegacyTeam = { id : Nat; name : Text; ageGroup : _LegacyAgeGroup; coachId : Nat; active : Bool };
  type _LegacySession = { id : Nat; teamId : Nat; date : Text; time : Text; location : Text; notes : Text };
  type _LegacyHomeOrAway = { #home; #away };
  type _LegacyMatch = {
    id : Nat; teamId : Nat; opponent : Text; matchDate : Text; venue : Text;
    homeOrAway : _LegacyHomeOrAway; goalsFor : Nat; goalsAgainst : Nat; notes : Text;
  };
  type _LegacyUserProfile = { name : Text };

  var nextPlayerId = 1;
  var nextCoachId = 1;
  var nextTeamId = 1;
  var nextSessionId = 1;
  var nextMatchId = 1;
  let players = Map.empty<Nat, _LegacyPlayer>();
  let coaches = Map.empty<Nat, _LegacyCoach>();
  let teams = Map.empty<Nat, _LegacyTeam>();
  let sessions = Map.empty<Nat, _LegacySession>();
  let matches = Map.empty<Nat, _LegacyMatch>();
  let userProfiles = Map.empty<Principal, _LegacyUserProfile>();

  // ─────────────────────────────────────────────────────────────
  // TYPES
  // ─────────────────────────────────────────────────────────────

  public type ServiceCategory = { #hair; #nails; #skin; #massage; #other };

  public type Service = {
    id : Nat;
    name : Text;
    description : Text;
    durationMinutes : Nat;
    priceCents : Nat;
    category : ServiceCategory;
    isActive : Bool;
  };

  public type Staff = {
    id : Nat;
    name : Text;
    specialization : Text;
    bio : Text;
    isActive : Bool;
  };

  public type AppointmentStatus = { #pending; #confirmed; #cancelled; #completed };

  public type Appointment = {
    id : Nat;
    clientName : Text;
    clientEmail : Text;
    clientPhone : Text;
    serviceId : Nat;
    staffId : Nat;
    appointmentDate : Text;
    appointmentTime : Text;
    status : AppointmentStatus;
    notes : Text;
    createdAt : Int;
  };

  public type BookingRequest = {
    clientName : Text;
    clientEmail : Text;
    clientPhone : Text;
    serviceId : Nat;
    staffId : Nat;
    appointmentDate : Text;
    appointmentTime : Text;
    notes : Text;
  };

  public type DashboardStats = {
    totalServices : Nat;
    totalStaff : Nat;
    totalAppointments : Nat;
    pendingAppointments : Nat;
  };

  // ─────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────

  var nextServiceId = 1;
  var nextStaffId = 1;
  var nextAppointmentId = 1;

  let services = Map.empty<Nat, Service>();
  let staff = Map.empty<Nat, Staff>();
  let appointments = Map.empty<Nat, Appointment>();

  // ─────────────────────────────────────────────────────────────
  // SERVICES
  // ─────────────────────────────────────────────────────────────

  public query func getAllServices() : async [Service] {
    services.values().toArray();
  };

  public query func getActiveServices() : async [Service] {
    let arr = services.values().toArray();
    Array.filter<Service>(arr, func(s) { s.isActive });
  };

  public shared ({ caller }) func createService(s : Service) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    let id = nextServiceId;
    nextServiceId += 1;
    services.add(id, { s with id });
    id;
  };

  public shared ({ caller }) func updateService(id : Nat, s : Service) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    if (not services.containsKey(id)) Runtime.trap("Not found");
    services.add(id, { s with id });
  };

  public shared ({ caller }) func deleteService(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    services.remove(id);
  };

  // ─────────────────────────────────────────────────────────────
  // STAFF
  // ─────────────────────────────────────────────────────────────

  public query func getAllStaff() : async [Staff] {
    staff.values().toArray();
  };

  public query func getActiveStaff() : async [Staff] {
    let arr = staff.values().toArray();
    Array.filter<Staff>(arr, func(m) { m.isActive });
  };

  public shared ({ caller }) func createStaff(m : Staff) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    let id = nextStaffId;
    nextStaffId += 1;
    staff.add(id, { m with id });
    id;
  };

  public shared ({ caller }) func updateStaff(id : Nat, m : Staff) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    if (not staff.containsKey(id)) Runtime.trap("Not found");
    staff.add(id, { m with id });
  };

  public shared ({ caller }) func deleteStaff(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    staff.remove(id);
  };

  // ─────────────────────────────────────────────────────────────
  // APPOINTMENTS
  // ─────────────────────────────────────────────────────────────

  public shared func bookAppointment(req : BookingRequest) : async Nat {
    let id = nextAppointmentId;
    nextAppointmentId += 1;
    appointments.add(id, {
      id;
      clientName = req.clientName;
      clientEmail = req.clientEmail;
      clientPhone = req.clientPhone;
      serviceId = req.serviceId;
      staffId = req.staffId;
      appointmentDate = req.appointmentDate;
      appointmentTime = req.appointmentTime;
      status = #pending;
      notes = req.notes;
      createdAt = Time.now();
    });
    id;
  };

  public shared ({ caller }) func getAllAppointments() : async [Appointment] {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    appointments.values().toArray();
  };

  public query func getAppointmentsByEmail(email : Text) : async [Appointment] {
    let arr = appointments.values().toArray();
    Array.filter<Appointment>(arr, func(a) { a.clientEmail == email });
  };

  public shared ({ caller }) func updateAppointmentStatus(id : Nat, status : AppointmentStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    switch (appointments.get(id)) {
      case (null) Runtime.trap("Not found");
      case (?appt) appointments.add(id, { appt with status });
    };
  };

  public shared ({ caller }) func deleteAppointment(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    appointments.remove(id);
  };

  // ─────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────

  public shared ({ caller }) func getDashboardStats() : async DashboardStats {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    var pending = 0;
    for (a in appointments.values()) {
      switch (a.status) {
        case (#pending) pending += 1;
        case (_) {};
      };
    };
    {
      totalServices = services.size();
      totalStaff = staff.size();
      totalAppointments = appointments.size();
      pendingAppointments = pending;
    };
  };
};
