import { supabase } from '../supabase';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export interface LeadsReportData {
  overview: {
    total: number;
    new: number;
    qualified: number;
    converted: number;
    conversionRate: number;
  };
  leadsBySource: Array<{
    source: string;
    count: number;
    percentage: number;
    conversionRate: number;
  }>;
  leadsByStage: Array<{
    stage: string;
    count: number;
    percentage: number;
  }>;
  conversionTimeline: Array<{
    day: string;
    new: number;
    qualified: number;
    converted: number;
  }>;
  topPerformers: Array<{
    name: string;
    leads: number;
    qualified: number;
    converted: number;
    conversionRate: number;
  }>;
  engagementMetrics: {
    avgResponseTime: string;
    avgInteractionsToQualify: number;
    avgDaysToConvert: number;
    followUpRate: number;
  };
}

export async function fetchLeadsReportData(dateRange: string): Promise<LeadsReportData> {
  const now = new Date();
  let startDate = getStartDate(dateRange, now);

  try {
    // Fetch leads data
    const { data: leads, error: leadsError } = await supabase
      .from('contacts')
      .select(`
        *,
        conversations:conversations(
          messages:messages(created_at, sender_type)
        )
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endOfDay(now).toISOString());

    if (leadsError) throw leadsError;

    // Process overview metrics
    const overview = {
      total: leads.length,
      new: leads.filter(l => l.metadata?.stage === 'new').length,
      qualified: leads.filter(l => l.metadata?.stage === 'qualified').length,
      converted: leads.filter(l => l.metadata?.stage === 'converted').length,
      conversionRate: calculateConversionRate(leads)
    };

    // Process leads by source
    const leadsBySource = processLeadsBySource(leads);

    // Process leads by stage
    const leadsByStage = processLeadsByStage(leads);

    // Process conversion timeline
    const conversionTimeline = processConversionTimeline(leads, startDate, now);

    // Process top performers
    const topPerformers = await processTopPerformers(leads);

    // Process engagement metrics
    const engagementMetrics = processEngagementMetrics(leads);

    return {
      overview,
      leadsBySource,
      leadsByStage,
      conversionTimeline,
      topPerformers,
      engagementMetrics
    };
  } catch (error) {
    console.error('Error fetching leads report data:', error);
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

function calculateConversionRate(leads: any[]): number {
  const converted = leads.filter(l => l.metadata?.stage === 'converted').length;
  return leads.length > 0 ? (converted / leads.length) * 100 : 0;
}

function processLeadsBySource(leads: any[]): Array<{
  source: string;
  count: number;
  percentage: number;
  conversionRate: number;
}> {
  const sources = leads.reduce((acc: Record<string, any>, lead) => {
    const source = lead.metadata?.source || 'Unknown';
    if (!acc[source]) {
      acc[source] = {
        count: 0,
        converted: 0
      };
    }
    acc[source].count++;
    if (lead.metadata?.stage === 'converted') {
      acc[source].converted++;
    }
    return acc;
  }, {});

  const total = leads.length;
  return Object.entries(sources).map(([source, data]: [string, any]) => ({
    source,
    count: data.count,
    percentage: (data.count / total) * 100,
    conversionRate: data.count > 0 ? (data.converted / data.count) * 100 : 0
  }));
}

function processLeadsByStage(leads: any[]): Array<{
  stage: string;
  count: number;
  percentage: number;
}> {
  const stages = leads.reduce((acc: Record<string, number>, lead) => {
    const stage = lead.metadata?.stage || 'Unknown';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});

  const total = leads.length;
  return Object.entries(stages).map(([stage, count]) => ({
    stage,
    count,
    percentage: (count / total) * 100
  }));
}

function processConversionTimeline(leads: any[], startDate: Date, endDate: Date): Array<{
  day: string;
  new: number;
  qualified: number;
  converted: number;
}> {
  const days = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    const dayStr = format(currentDate, 'yyyy-MM-dd');
    days.push({
      day: dayStr,
      new: leads.filter(l => 
        format(new Date(l.created_at), 'yyyy-MM-dd') === dayStr && 
        l.metadata?.stage === 'new'
      ).length,
      qualified: leads.filter(l => 
        l.metadata?.qualified_at && 
        format(new Date(l.metadata.qualified_at), 'yyyy-MM-dd') === dayStr
      ).length,
      converted: leads.filter(l => 
        l.metadata?.converted_at && 
        format(new Date(l.metadata.converted_at), 'yyyy-MM-dd') === dayStr
      ).length
    });
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  return days;
}

async function processTopPerformers(leads: any[]): Promise<Array<{
  name: string;
  leads: number;
  qualified: number;
  converted: number;
  conversionRate: number;
}>> {
  const { data: agents, error: agentsError } = await supabase
    .from('agents')
    .select('*');

  if (agentsError) throw agentsError;

  const performanceData = agents.reduce((acc: Record<string, any>, agent) => {
    acc[agent.id] = {
      name: agent.name || agent.email,
      leads: 0,
      qualified: 0,
      converted: 0
    };
    return acc;
  }, {});

  leads.forEach(lead => {
    const agentId = lead.metadata?.assigned_to;
    if (agentId && performanceData[agentId]) {
      performanceData[agentId].leads++;
      if (lead.metadata?.stage === 'qualified') {
        performanceData[agentId].qualified++;
      }
      if (lead.metadata?.stage === 'converted') {
        performanceData[agentId].converted++;
      }
    }
  });

  return Object.values(performanceData)
    .map(data => ({
      ...data,
      conversionRate: data.leads > 0 ? (data.converted / data.leads) * 100 : 0
    }))
    .sort((a, b) => b.conversionRate - a.conversionRate);
}

function processEngagementMetrics(leads: any[]) {
  const metrics = leads.reduce((acc: any, lead) => {
    // Calculate response time
    const conversations = lead.conversations || [];
    conversations.forEach((conversation: any) => {
      const messages = conversation.messages || [];
      const firstMessage = messages[0];
      const firstResponse = messages.find((m: any) => 
        m.sender_type === 'agent' && 
        new Date(m.created_at) > new Date(firstMessage?.created_at)
      );

      if (firstMessage && firstResponse) {
        acc.responseTimes.push(
          new Date(firstResponse.created_at).getTime() - new Date(firstMessage.created_at).getTime()
        );
      }
    });

    // Calculate interactions to qualify
    if (lead.metadata?.stage === 'qualified') {
      acc.interactionsToQualify.push(
        conversations.reduce((sum: number, conv: any) => sum + (conv.messages?.length || 0), 0)
      );
    }

    // Calculate days to convert
    if (lead.metadata?.stage === 'converted' && lead.metadata?.converted_at) {
      const daysToConvert = Math.floor(
        (new Date(lead.metadata.converted_at).getTime() - new Date(lead.created_at).getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      acc.daysToConvert.push(daysToConvert);
    }

    // Calculate follow-up rate
    const hasFollowUp = conversations.some((conv: any) => 
      conv.messages?.length > 1 && 
      conv.messages.some((m: any) => m.sender_type === 'agent')
    );
    if (hasFollowUp) acc.followUps++;

    return acc;
  }, {
    responseTimes: [],
    interactionsToQualify: [],
    daysToConvert: [],
    followUps: 0
  });

  return {
    avgResponseTime: formatDuration(
      metrics.responseTimes.reduce((a: number, b: number) => a + b, 0) / metrics.responseTimes.length
    ),
    avgInteractionsToQualify: metrics.interactionsToQualify.length > 0
      ? Math.round(
          metrics.interactionsToQualify.reduce((a: number, b: number) => a + b, 0) / 
          metrics.interactionsToQualify.length
        )
      : 0,
    avgDaysToConvert: metrics.daysToConvert.length > 0
      ? Math.round(
          metrics.daysToConvert.reduce((a: number, b: number) => a + b, 0) / 
          metrics.daysToConvert.length
        )
      : 0,
    followUpRate: leads.length > 0 ? (metrics.followUps / leads.length) * 100 : 0
  };
}

function formatDuration(milliseconds: number): string {
  if (isNaN(milliseconds)) return 'N/A';
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export async function exportLeadsReportToPDF(data: LeadsReportData) {
  const doc = new jsPDF();
  const title = 'Leads Report';
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
      ['Total Leads', data.overview.total.toString()],
      ['New Leads', data.overview.new.toString()],
      ['Qualified Leads', data.overview.qualified.toString()],
      ['Converted Leads', data.overview.converted.toString()],
      ['Conversion Rate', `${data.overview.conversionRate.toFixed(1)}%`]
    ]
  });

  // Leads by Source
  yPos = (doc as any).lastAutoTable.finalY + 10;
  doc.text('Leads by Source', 20, yPos);
  yPos += 10;
  doc.autoTable({
    startY: yPos,
    head: [['Source', 'Count', 'Percentage', 'Conversion Rate']],
    body: data.leadsBySource.map(source => [
      source.source,
      source.count.toString(),
      `${source.percentage.toFixed(1)}%`,
      `${source.conversionRate.toFixed(1)}%`
    ])
  });

  return doc;
}

export function exportLeadsReportToCSV(data: LeadsReportData) {
  const rows = [
    ['Leads Report'],
    ['Generated on', format(new Date(), 'MMMM d, yyyy')],
    [],
    ['Overview'],
    ['Metric', 'Value'],
    ['Total Leads', data.overview.total],
    ['New Leads', data.overview.new],
    ['Qualified Leads', data.overview.qualified],
    ['Converted Leads', data.overview.converted],
    ['Conversion Rate', `${data.overview.conversionRate.toFixed(1)}%`],
    [],
    ['Leads by Source'],
    ['Source', 'Count', 'Percentage', 'Conversion Rate'],
    ...data.leadsBySource.map(source => [
      source.source,
      source.count,
      `${source.percentage.toFixed(1)}%`,
      `${source.conversionRate.toFixed(1)}%`
    ]),
    [],
    ['Top Performers'],
    ['Name', 'Leads', 'Qualified', 'Converted', 'Conversion Rate'],
    ...data.topPerformers.map(performer => [
      performer.name,
      performer.leads,
      performer.qualified,
      performer.converted,
      `${performer.conversionRate.toFixed(1)}%`
    ])
  ];

  return rows;
}