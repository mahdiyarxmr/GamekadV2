export type Gender = 'boy' | 'girl';
export type TargetGender = 'boys' | 'girls' | 'mixed';
export type UserRole = 'user' | 'admin';
export type MembershipType = 'ROKAD' | 'EXTERNAL';
export type PayType = 'full' | 'deposit' | 'venue';
export type EventStatus = 'draft' | 'open' | 'full' | 'ongoing' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'venue_due' | 'failed' | 'refunded';
export type RoleSide = 'CITIZEN' | 'MAFIA' | 'INDEPENDENT';
export type PersonaTheme = 'ecosystem' | 'male' | 'female' | 'college' | 'club';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  gender: Gender;
  avatar: string;
  phone?: string;
  bio?: string;
  role: UserRole;
  membership: MembershipType;
  godGameAllowed: boolean;
  isSuspended: boolean;
  walletBalance: number;
  createdAt: string;
}

export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  type: 'TABLE' | 'ELECTRONIC';
  icon?: string;
  description?: string;
}

export interface Scenario {
  id: string;
  categoryId: string;
  category?: GameCategory;
  title: string;
  slug: string;
  minPlayers: number;
  maxPlayers: number;
  description: string;
  rules: string;
  victoryCitizen: string;
  victoryMafia: string;
  dayPhaseRules: string;
  nightPhaseRules: string;
  roles?: Role[];
}

export interface Role {
  id: string;
  scenarioId: string;
  name: string;
  side: RoleSide;
  description: string;
  abilities: string;
  nightOrder?: number | null;
  tips?: string;
  icon?: string;
}

export interface ElectronicGame {
  id: string;
  categoryId: string;
  category?: GameCategory;
  title: string;
  platform: string;
  mode: string;
  description?: string;
  coverImage?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  categoryId: string;
  category?: GameCategory;
  hostId?: string;
  host?: {
    id: string;
    displayName: string;
    avatar: string;
  };
  targetGender: TargetGender;
  payType: PayType;
  price: number;
  depositAmount: number;
  venueAddress: string;
  startTime: string;
  endTime: string;
  capacity: number;
  reservedCount: number;
  remainingSeats?: number;
  status: EventStatus;
}

export interface Reservation {
  id: string;
  eventId: string;
  event?: EventItem;
  userId: string;
  seats: number;
  totalPrice: number;
  paidOnline: number;
  venueDue: number;
  paymentStatus: PaymentStatus;
  holdUntil?: string | null;
  attended: boolean;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'reserve_event' | 'admin_adjust' | 'refund';
  amount: number;
  balanceAfter: number;
  referenceCode: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface GodGameSeat {
  id: string;
  sessionId: string;
  seatNumber: number;
  playerId?: string | null;
  playerName: string;
  roleId?: string | null;
  roleName?: string | null;
  roleSide?: RoleSide | null;
  isAlive: boolean;
  warningsCount: number;
  isNominated: boolean;
  votesCount: number;
  isKicked: boolean;
}

export interface GodGameSession {
  id: string;
  title: string;
  scenarioId: string;
  scenario?: Scenario;
  hostId: string;
  hostDisplayName?: string;
  targetGender: TargetGender;
  seatsCount: number;
  currentPhase: 'SETUP' | 'DAY' | 'DEFENSE' | 'VOTING' | 'NIGHT' | 'FINISHED';
  dayNumber: number;
  timerSeconds: number;
  timerRunning: boolean;
  winnerSide?: RoleSide | null;
  isImported: boolean;
  createdAt: string;
  seats?: GodGameSeat[];
  logs?: { id: string; phase: string; text: string; createdAt: string }[];
}

export interface Medal {
  id: string;
  title: string;
  slug: string;
  icon: string;
  description: string;
}

export interface PlayerStat {
  id: string;
  userId: string;
  categoryId: string;
  score: number;
  matches: number;
  wins: number;
  losses: number;
  reasoning: number;
  bluff: number;
  negotiation: number;
  leadership: number;
  shooting: number;
  teamwork: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  type: string;
  isPublished: boolean;
  authorName: string;
  createdAt: string;
}
