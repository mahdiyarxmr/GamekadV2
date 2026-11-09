const API_BASE = (import.meta.env.VITE_API_BASE as string) || (import.meta.env.VITE_API_URL as string) || '/api/v1';

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('gamekad_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || 'خطایی در ارتباط با سرور رخ داد.';
    throw new Error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  register: (dto: any) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(dto) }),
  login: (dto: any) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(dto) }),
  getMe: () => apiFetch('/auth/me'),
  updateMe: (dto: any) => apiFetch('/auth/me', { method: 'PUT', body: JSON.stringify(dto) }),

  // Homepage
  getHomepage: () => apiFetch('/homepage'),
  reorderHomepage: (blocks: any[]) => apiFetch('/homepage/reorder', { method: 'POST', body: JSON.stringify({ blocks }) }),
  resetHomepage: () => apiFetch('/homepage/reset', { method: 'POST' }),

  // Events
  getEvents: (params?: { status?: string; gender?: string; categoryId?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return apiFetch(`/events${q ? `?${q}` : ''}`);
  },
  getEvent: (id: string) => apiFetch(`/events/${id}`),
  createEvent: (data: any) => apiFetch('/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id: string, data: any) => apiFetch(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id: string) => apiFetch(`/events/${id}`, { method: 'DELETE' }),

  // Reservations
  createReservation: (data: { eventId: string; seats: number }) =>
    apiFetch('/reservations', { method: 'POST', body: JSON.stringify(data) }),
  getMyReservations: () => apiFetch('/reservations/my'),
  payReservationSandbox: (id: string) => apiFetch(`/reservations/${id}/pay-sandbox`, { method: 'POST' }),
  cancelReservation: (id: string) => apiFetch(`/reservations/${id}/cancel`, { method: 'POST' }),
  getAdminReservations: () => apiFetch('/reservations/admin'),
  toggleAttendance: (id: string) => apiFetch(`/reservations/${id}/attendance`, { method: 'POST' }),

  // Wallet
  getMyWallet: () => apiFetch('/wallet'),
  createDepositIntent: (amount: number) => apiFetch('/wallet/deposit-intent', { method: 'POST', body: JSON.stringify({ amount }) }),
  requestZarinpal: (amount: number) => apiFetch('/wallet/zarinpal/request', { method: 'POST', body: JSON.stringify({ amount }) }),
  verifyZarinpal: (data: { authority: string; status?: string }) =>
    apiFetch('/wallet/zarinpal/verify', { method: 'POST', body: JSON.stringify(data) }),
  verifySandboxDeposit: (data: { trackingCode: string; amount: number }) =>
    apiFetch('/wallet/verify-sandbox', { method: 'POST', body: JSON.stringify(data) }),
  adminAdjustWallet: (data: { userId: string; amount: number; reason: string }) =>
    apiFetch('/wallet/admin/adjust', { method: 'POST', body: JSON.stringify(data) }),

  // Games
  getCategories: () => apiFetch('/games/categories'),
  getScenarios: () => apiFetch('/games/scenarios'),
  getScenarioBySlug: (slug: string) => apiFetch(`/games/scenarios/${slug}`),
  getRoles: (scenarioId?: string) => apiFetch(`/games/roles${scenarioId ? `?scenarioId=${scenarioId}` : ''}`),
  getElectronicGames: () => apiFetch('/games/electronic'),
  createScenario: (data: any) => apiFetch('/games/admin/scenarios', { method: 'POST', body: JSON.stringify(data) }),
  createRole: (data: any) => apiFetch('/games/admin/roles', { method: 'POST', body: JSON.stringify(data) }),
  createElectronicGame: (data: any) => apiFetch('/games/admin/electronic', { method: 'POST', body: JSON.stringify(data) }),

  // God Game
  getGodGameSessions: () => apiFetch('/god-game/sessions'),
  getGodGameSession: (id: string) => apiFetch(`/god-game/sessions/${id}`),
  createGodGameSession: (data: any) => apiFetch('/god-game/sessions', { method: 'POST', body: JSON.stringify(data) }),
  distributeGodGameRoles: (id: string) => apiFetch(`/god-game/sessions/${id}/distribute-roles`, { method: 'POST' }),
  updateGodGamePhase: (id: string, data: any) => apiFetch(`/god-game/sessions/${id}/phase`, { method: 'POST', body: JSON.stringify(data) }),
  updateGodGameSeat: (sessionId: string, seatNumber: number, data: any) =>
    apiFetch(`/god-game/sessions/${sessionId}/seats/${seatNumber}`, { method: 'PUT', body: JSON.stringify(data) }),
  addGodGameLog: (sessionId: string, text: string) => apiFetch(`/god-game/sessions/${sessionId}/log`, { method: 'POST', body: JSON.stringify({ text }) }),
  importGodGameStats: (id: string, data: { winnerSide: string }) =>
    apiFetch(`/god-game/sessions/${id}/import-stats`, { method: 'POST', body: JSON.stringify(data) }),

  // Leaderboard & Players
  getLeaderboard: (categorySlug?: string, gender?: string) => {
    const q = new URLSearchParams({ categorySlug: categorySlug || 'mafia', gender: gender || 'all' }).toString();
    return apiFetch(`/leaderboard?${q}`);
  },
  getPlayers: (params?: any) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/players${q ? `?${q}` : ''}`);
  },
  getPlayerProfile: (username: string) => apiFetch(`/players/${username}`),

  // Articles
  getArticles: () => apiFetch('/articles'),
  getArticleBySlug: (slug: string) => apiFetch(`/articles/${slug}`),
  createArticle: (data: any) => apiFetch('/articles', { method: 'POST', body: JSON.stringify(data) }),

  // Admin
  getAdminDashboard: () => apiFetch('/admin/dashboard'),
  getAdminUsers: (search?: string) => apiFetch(`/admin/users${search ? `?search=${search}` : ''}`),
  createAdminUser: (data: any) => apiFetch('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminUser: (id: string, data: any) => apiFetch(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getAdminMedals: () => apiFetch('/admin/medals'),
  awardAdminMedal: (data: { userId: string; medalId: string; note?: string }) =>
    apiFetch('/admin/medals/award', { method: 'POST', body: JSON.stringify(data) }),
  getAdminMvp: () => apiFetch('/admin/mvp'),
  createAdminMvp: (data: any) => apiFetch('/admin/mvp', { method: 'POST', body: JSON.stringify(data) }),
  getAdminSettings: () => apiFetch('/admin/settings'),
  updateAdminSettings: (data: any) => apiFetch('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
  getAdminAuditLogs: () => apiFetch('/admin/audit-logs'),
};
