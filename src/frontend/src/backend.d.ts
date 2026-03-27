import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Player {
    id: bigint;
    active: boolean;
    dateOfBirth: string;
    name: string;
    contactEmail: string;
    enrollmentDate: string;
    teamId?: bigint;
    position: Position;
    parentName: string;
    contactPhone: string;
}
export interface Coach {
    id: bigint;
    active: boolean;
    name: string;
    email: string;
    specialization: Specialization;
    phone: string;
}
export interface TrainingSession {
    id: bigint;
    date: string;
    time: string;
    notes: string;
    teamId: bigint;
    location: string;
}
export interface SummaryStats {
    totalTeams: bigint;
    totalPlayers: bigint;
    totalCoaches: bigint;
    upcomingSessions: bigint;
}
export interface Match {
    id: bigint;
    venue: string;
    goalsFor: bigint;
    notes: string;
    homeOrAway: HomeOrAway;
    goalsAgainst: bigint;
    teamId: bigint;
    opponent: string;
    matchDate: string;
}
export interface UserProfile {
    name: string;
}
export interface Team {
    id: bigint;
    active: boolean;
    name: string;
    coachId: bigint;
    ageGroup: AgeGroup;
}
export enum AgeGroup {
    U8 = "U8",
    U10 = "U10",
    U12 = "U12",
    U14 = "U14",
    U16 = "U16",
    U18 = "U18",
    senior = "senior"
}
export enum HomeOrAway {
    away = "away",
    home = "home"
}
export enum Position {
    goalkeeper = "goalkeeper",
    midfielder = "midfielder",
    forward = "forward",
    defender = "defender"
}
export enum Specialization {
    midfield = "midfield",
    goalkeeping = "goalkeeping",
    defense = "defense",
    fitness = "fitness",
    attacking = "attacking"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCoach(coach: Coach): Promise<bigint>;
    createMatch(match: Match): Promise<bigint>;
    createPlayer(player: Player): Promise<bigint>;
    createTeam(team: Team): Promise<bigint>;
    createTrainingSession(session: TrainingSession): Promise<bigint>;
    deleteCoach(id: bigint): Promise<void>;
    deleteMatch(id: bigint): Promise<void>;
    deletePlayer(id: bigint): Promise<void>;
    deleteTeam(id: bigint): Promise<void>;
    deleteTrainingSession(id: bigint): Promise<void>;
    getAllCoaches(): Promise<Array<Coach>>;
    getAllMatches(): Promise<Array<Match>>;
    getAllPlayers(): Promise<Array<Player>>;
    getAllTeams(): Promise<Array<Team>>;
    getAllTrainingSessions(): Promise<Array<TrainingSession>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCoachById(id: bigint): Promise<Coach>;
    getMatchById(id: bigint): Promise<Match>;
    getPlayerById(id: bigint): Promise<Player>;
    getSummaryStats(): Promise<SummaryStats>;
    getTeamById(id: bigint): Promise<Team>;
    getTrainingSessionById(id: bigint): Promise<TrainingSession>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCoach(id: bigint, coach: Coach): Promise<void>;
    updateMatch(id: bigint, match: Match): Promise<void>;
    updatePlayer(id: bigint, player: Player): Promise<void>;
    updateTeam(id: bigint, team: Team): Promise<void>;
    updateTrainingSession(id: bigint, session: TrainingSession): Promise<void>;
}
