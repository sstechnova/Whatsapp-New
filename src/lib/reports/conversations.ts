import { supabase } from '../supabase';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export interface ConversationReportData {
  overview: {
    total: number;
    active: number;
    resolved: number;
    avgResponseTime: string;
  };
  agentPerformance: Array<{
    name: string;
    conversations: number;
    avgResponseTime: string;
    resolutionRate: number;
    satisfaction: number;
  }>;
  hourlyActivity: Array<{
    hour: number;
    conversations: number;
    responseTime: number;
  }>;
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  responseMetrics: {
    firstResponseTime: string;
    resolutionTime: string;
    messageCount: number;
    automatedResponses: number;
  };
}

export async function fetchConversationReportData(dateRange: string): Promise<ConversationReportData> {
  const now = new Date();
  let startDate = getStartDate(dateRange, now);

  try {
    // Fetch conversations data
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select(`
        *,
        messages:messages(created_at, sender_type),
        agent:agent_id(*)
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endOfDay(now).toISOString());

    if (conversationsError) throw conversationsError;

    // Process overview metrics
    const overview = {
      total: conversations.length,
      active: conversations.filter(c => c.status === 'open').length,
      resolved: conversations.filter(c => c.status === 'resolved').length,
      avgResponseTime: calculateAverageResponseTime(conversations)
    };

    // Process agent performance
    const agentPerformance = processAgentPerformance(conversations);

    // Process hourly activity
    const hourlyActivity = processHourlyActivity(conversations);

    // Process categories
    const topCategories = processTopCategories(conversations);

    // Process response metrics
    const responseMetrics = processResponseMetrics(conversations);

    return {
      overview,
      agentPerformance,
      hourlyActivity,
      topCategories,
      responseMetrics
    };
  } catch (error) {
    console.error('Error fetching conversation report data:', error);
    throw error;
  }
}

function getStartDate(dateRange: string, now: Date): Date {
  switch (dateRange) {
    case 'today':
      return startOfDay(now);
    case 'week':
      return subDays(now, 7);
    case 'month':
      return subDays(now, 30);
    case 'quarter':
      return subDays(now, 90);
    case 'year':
      return subDays(now, 365);
    default:
      return subDays(now, 7);
  }
}

function calculateAverageResponseTime(conversations: any[]): string {
  const responseTimes = conversations.map(conversation => {
    const firstMessage = conversation.messages?.[0];
    const firstResponse = conversation.messages?.find(m => 
      m.sender_type === 'agent' && 
      new Date(m.created_at) > new Date(firstMessage.created_at)
    );
    
    if (firstMessage && firstResponse) {
      return new Date(firstResponse.created_at).getTime() - new Date(firstMessage.created_at).getTime();
    }
    return null;
  }).filter(Boolean);

  const average = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  return formatDuration(average);
}

function processAgentPerformance(conversations: any[]): Array<{
  name: string;
  conversations: number;
  avgResponseTime: string;
  resolutionRate: number;
  satisfaction: number;
}> {
  const agentStats = conversations.reduce((acc: Record<string, any>, conversation) => {
    const agent = conversation.agent;
    if (!agent) return acc;

    if (!acc[agent.id]) {
      acc[agent.id] = {
        name: agent.name || agent.email,
        conversations: 0,
        responseTimes: [],
        resolved: 0,
        satisfaction: []
      };
    }

    acc[agent.id].conversations++;
    if (conversation.status === 'resolved') {
      acc[agent.id].resolved++;
    }
    
    // Calculate response time
    const firstMessage = conversation.messages?.[0];
    const firstResponse = conversation.messages?.find(m => 
      m.sender_type === 'agent' && 
      new Date(m.created_at) > new Date(firstMessage.created_at)
    );
    
    if (firstMessage && firstResponse) {
      acc[agent.id].responseTimes.push(
        new Date(firstResponse.created_at).getTime() - new Date(firstMessage.created_at).getTime()
      );
    }

    // Add satisfaction score if available
    if (conversation.metadata?.satisfaction) {
      acc[agent.id].satisfaction.push(conversation.metadata.satisfaction);
    }

    return acc;
  }, {});

  return Object.values(agentStats).map(agent => ({
    name: agent.name,
    conversations: agent.conversations,
    avgResponseTime: formatDuration(
      agent.responseTimes.reduce((a: number, b: number) => a + b, 0) / agent.responseTimes.length
    ),
    resolutionRate: (agent.resolved / agent.conversations) * 100,
    satisfaction: agent.satisfaction.length
      ? agent.satisfaction.reduce((a: number, b: number) => a + b, 0) / agent.satisfaction.length
      : 0
  }));
}

function processHourlyActivity(conversations: any[]): Array<{
  hour: number;
  conversations: number;
  responseTime: number;
}> {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    conversations: 0,
    responseTime: 0
  }));

  conversations.forEach(conversation => {
    const hour = new Date(conversation.created_at).getHours();
    hours[hour].conversations++;
    
    const firstMessage = conversation.messages?.[0];
    const firstResponse = conversation.messages?.find(m => 
      m.sender_type === 'agent' && 
      new Date(m.created_at) > new Date(firstMessage.created_at)
    );
    
    if (firstMessage && firstResponse) {
      hours[hour].responseTime += 
        new Date(firstResponse.created_at).getTime() - new Date(firstMessage.created_at).getTime();
    }
  });

  return hours.map(hour => ({
    ...hour,
    responseTime: hour.conversations > 0 ? hour.responseTime / hour.conversations : 0
  }));
}

function processTopCategories(conversations: any[]): Array<{
  category: string;
  count: number;
  percentage: number;
}> {
  const categories = conversations.reduce((acc: Record<string, number>, conversation) => {
    const category = conversation.metadata?.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const total = conversations.length;
  return Object.entries(categories)
    .map(([category, count]) => ({
      category,
      count,
      percentage: (count / total) * 100
    }))
    .sort((a, b) => b.count - a.count);
}

function processResponseMetrics(conversations: any[]) {
  const metrics = conversations.reduce((acc: any, conversation) => {
    const messages = conversation.messages || [];
    const firstMessage = messages[0];
    const firstResponse = messages.find(m => 
      m.sender_type === 'agent' && 
      new Date(m.created_at) > new Date(firstMessage.created_at)
    );
    const lastMessage = messages[messages.length - 1];

    acc.messageCount += messages.length;
    acc.automatedResponses += messages.filter(m => m.sender_type === 'bot').length;

    if (firstMessage && firstResponse) {
      acc.firstResponseTimes.push(
        new Date(firstResponse.created_at).getTime() - new Date(firstMessage.created_at).getTime()
      );
    }

    if (conversation.status === 'resolved' && firstMessage && lastMessage) {
      acc.resolutionTimes.push(
        new Date(lastMessage.created_at).getTime() - new Date(firstMessage.created_at).getTime()
      );
    }

    return acc;
  }, {
    messageCount: 0,
    automatedResponses: 0,
    firstResponseTimes: [],
    resolutionTimes: []
  });

  return {
    firstResponseTime: formatDuration(
      metrics.firstResponseTimes.reduce((a: number, b: number) => a + b, 0) / metrics.firstResponseTimes.length
    ),
    resolutionTime: formatDuration(
      metrics.resolutionTimes.reduce((a: number, b: number) => a + b, 0) / metrics.resolutionTimes.length
    ),
    messageCount: metrics.messageCount,
    automatedResponses: metrics.automatedResponses
  };
}

function formatDuration(milliseconds: number): string {
  if (isNaN(milliseconds)) return 'N/A';
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export async function exportConversationReportToPDF(data: ConversationReportData) {
  const doc = new jsPDF();
  const title = 'Conversation Report';
  const date = format(new Date(), 'MMMM d, yyyy');

  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  doc.setFontSize(12);
  doc.text(`Generated on ${date}`, 20, 30);

  // Overview
  let yPos = 40;
  doc.text('Overview', 20, yPos);
  yPos += 10;
  doc.autoTable({
    startY: yPos,
    head: [['Metric', 'Value']],
    body: [
      ['Total Conversations', data.overview.total.toString()],
      ['Active Conversations', data.overview.active.toString()],
      ['Resolved Conversations', data.overview.resolved.toString()],
      ['Average Response Time', data.overview.avgResponseTime]
    ]
  });

  // Agent Performance
  yPos = (doc as any).lastAutoTable.finalY + 10;
  doc.text('Agent Performance', 20, yPos);
  yPos += 10;
  doc.autoTable({
    startY: yPos,
    head: [['Agent', 'Conversations', 'Avg Response Time', 'Resolution Rate', 'Satisfaction']],
    body: data.agentPerformance.map(agent => [
      agent.name,
      agent.conversations.toString(),
      agent.avgResponseTime,
      `${agent.resolutionRate.toFixed(1)}%`,
      agent.satisfaction.toFixed(1)
    ])
  });

  return doc;
}

export function exportConversationReportToCSV(data: ConversationReportData) {
  const rows = [
    ['Conversation Report'],
    ['Generated on', format(new Date(), 'MMMM d, yyyy')],
    [],
    ['Overview'],
    ['Metric', 'Value'],
    ['Total Conversations', data.overview.total],
    ['Active Conversations', data.overview.active],
    ['Resolved Conversations', data.overview.resolved],
    ['Average Response Time', data.overview.avgResponseTime],
    [],
    ['Agent Performance'],
    ['Agent', 'Conversations', 'Avg Response Time', 'Resolution Rate', 'Satisfaction'],
    ...data.agentPerformance.map(agent => [
      agent.name,
      agent.conversations,
      agent.avgResponseTime,
      `${agent.resolutionRate.toFixed(1)}%`,
      agent.satisfaction.toFixed(1)
    ]),
    [],
    ['Response Metrics'],
    ['Metric', 'Value'],
    ['First Response Time', data.responseMetrics.firstResponseTime],
    ['Resolution Time', data.responseMetrics.resolutionTime],
    ['Total Messages', data.responseMetrics.messageCount],
    ['Automated Responses', data.responseMetrics.automatedResponses]
  ];

  return rows;
}