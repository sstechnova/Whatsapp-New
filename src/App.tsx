import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Marketing from './pages/Marketing';
import AutoReply from './pages/AutoReply';
import AutoFollowup from './pages/AutoFollowup';
import CampaignList from './pages/CampaignList';
import CampaignCreate from './pages/CampaignCreate';
import Conversations from './pages/Conversations';
import BotBuilder from './pages/BotBuilder';
import ChatBotMenu from './pages/ChatBotMenu';
import Leads from './pages/Leads';
import Templates from './pages/Templates';
import AIAssistant from './pages/AIAssistant';
import Tickets from './pages/Tickets';
import TicketDetails from './pages/TicketDetails';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Subscriptions from './pages/Subscriptions';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="auto-reply" element={<AutoReply />} />
          <Route path="auto-followup" element={<AutoFollowup />} />
          <Route path="marketing/campaigns" element={<CampaignList />} />
          <Route path="marketing/campaigns/create" element={<CampaignCreate />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="bot-builder" element={<BotBuilder />} />
          <Route path="chatbot-menu" element={<ChatBotMenu />} />
          <Route path="leads" element={<Leads />} />
          <Route path="templates" element={<Templates />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="tickets/:id" element={<TicketDetails />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="subscriptions" element={<Subscriptions />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;