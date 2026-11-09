import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileTabBar } from './components/layout/MobileTabBar';

import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { GamesPage } from './pages/GamesPage';
import { GuidePage } from './pages/GuidePage';
import { ScenarioDetailPage } from './pages/ScenarioDetailPage';
import { RolesPage } from './pages/RolesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PlayersPage } from './pages/PlayersPage';
import { PlayerProfilePage } from './pages/PlayerProfilePage';
import { LearnPage } from './pages/LearnPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { WalletPage } from './pages/WalletPage';
import { GodGamePage } from './pages/GodGamePage';
import { PaymentCallbackPage } from './pages/PaymentCallbackPage';

// Admin
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminWalletPage } from './pages/admin/AdminWalletPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ui-background text-ui-text-primary transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pb-24 lg:pb-8 min-w-0">
        <Outlet />
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/electronic" element={<GamesPage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/guide/scenarios/:slug" element={<ScenarioDetailPage />} />
              <Route path="/guide/roles" element={<RolesPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/leaderboard/:categorySlug" element={<LeaderboardPage />} />
              <Route path="/players" element={<PlayersPage />} />
              <Route path="/players/:username" element={<PlayerProfilePage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/learn/:slug" element={<ArticleDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/account/wallet" element={<WalletPage />} />
              <Route path="/payment/callback" element={<PaymentCallbackPage />} />
              <Route path="/host/god-game" element={<GodGamePage />} />

              {/* Admin Panel */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="events" element={<AdminEventsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="wallet" element={<AdminWalletPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
