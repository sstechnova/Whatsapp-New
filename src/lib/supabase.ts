import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];

// Helper types
export type Ticket = Tables['tickets']['Row'];
export type TicketComment = Tables['ticket_comments']['Row'];
export type TicketTag = Tables['ticket_tags']['Row'];
export type TicketActivity = Tables['ticket_activities']['Row'];

export type TicketStatus = Enums['ticket_status'];
export type TicketPriority = Enums['ticket_priority'];
export type TicketActivityType = Enums['ticket_activity_type'];