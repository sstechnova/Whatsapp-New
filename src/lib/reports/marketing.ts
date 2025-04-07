import { supabase } from '../supabase';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export interface MarketingReportData {
  campaignStats: {
    total: number;
    active: number;
    completed: number;
    scheduled: number;
  };
  campaignPerformance: Array<{
    name: string;
    sent: number;
    delivered: number;
    opened: number;
    responded: number;
    date: string;
  }>;
  audienceReach: {
    total: number;
    newContacts: number;
    activeContacts: number;
    inactiveContacts: number;
  };
  responseRates: Array<{
    campaign: string;
    rate: number;
  }>;
  messageTypes: Array<{
    type: string;
    count: number;
    successRate: number;
  }>;
  deliveryTimes: Array<{
    hour: number;
    count: number;
    successRate: number;
  }>;
}

export async function fetchMarketingReportData(dateRange: string): Promise<MarketingReportData> {
  const now = new Date();
  let startDate = getStartDate(dateRange, now);

  try {
    // Fetch campaigns data
    const { data: campaigns, error: campaignsError } = await supabase
      .from('broadcasts')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endOfDay(now).toISOString());

    if (campaignsError) throw campaignsError;

    // Process campaign statistics
    const campaignStats = {
      total: campaigns.length,
      active: campaigns.filter(c => c.status === 'active').length,
      completed: campaigns.filter(c => c.status === 'completed').length,
      scheduled: campaigns.filter(c => c.status === 'scheduled').length
    };

    // Process campaign performance
    const campaignPerformance = campaigns.map(campaign => ({
      name: campaign.name,
      sent: campaign.metadata?.sent || 0,
      delivered: campaign.metadata?.delivered || 0,
      opened: campaign.metadata?.opened || 0,
      responded: campaign.metadata?.responded || 0,
      date: format(new Date(campaign.created_at), 'yyyy-MM-dd')
    }));

    // Fetch contacts data
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (contactsError) throw contactsError;

    // Process audience reach
    const audienceReach = {
      total: contacts.length,
      newContacts: contacts.filter(c => 
        new Date(c.created_at) >= startDate
      ).length,
      activeContacts: contacts.filter(c => 
        c.metadata?.last_activity && 
        new Date(c.metadata.last_activity) >= startDate
      ).length,
      inactiveContacts: contacts.filter(c => 
        !c.metadata?.last_activity || 
        new Date(c.metadata.last_activity) < startDate
      ).length
    };

    // Calculate response rates
    const responseRates = campaigns.map(campaign => ({
      campaign: campaign.name,
      rate: calculateResponseRate(campaign)
    }));

    // Analyze message types
    const messageTypes = analyzeMessageTypes(campaigns);

    // Analyze delivery times
    const deliveryTimes = analyzeDeliveryTimes(campaigns);

    return {
      campaignStats,
      campaignPerformance,
      audienceReach,
      responseRates,
      messageTypes,
      deliveryTimes
    };
  } catch (error) {
    console.error('Error fetching marketing report data:', error);
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

function calculateResponseRate(campaign: any): number {
  const sent = campaign.metadata?.sent || 0;
  const responded = campaign.metadata?.responded || 0;
  return sent > 0 ? (responded / sent) * 100 : 0;
}

function analyzeMessageTypes(campaigns: any[]): Array<{ type: string; count: number; successRate: number }> {
  const types = campaigns.reduce((acc: Record<string, { count: number; success: number }>, campaign) => {
    const type = campaign.metadata?.type || 'unknown';
    if (!acc[type]) {
      acc[type] = { count: 0, success: 0 };
    }
    acc[type].count++;
    acc[type].success += calculateResponseRate(campaign);
    return acc;
  }, {});

  return Object.entries(types).map(([type, data]) => ({
    type,
    count: data.count,
    successRate: data.count > 0 ? data.success / data.count : 0
  }));
}

function analyzeDeliveryTimes(campaigns: any[]): Array<{ hour: number; count: number; successRate: number }> {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: 0,
    successRate: 0
  }));

  campaigns.forEach(campaign => {
    const hour = new Date(campaign.scheduled_at || campaign.created_at).getHours();
    hours[hour].count++;
    hours[hour].successRate += calculateResponseRate(campaign);
  });

  return hours.map(hour => ({
    ...hour,
    successRate: hour.count > 0 ? hour.successRate / hour.count : 0
  }));
}

export async function exportMarketingReportToPDF(data: MarketingReportData) {
  const doc = new jsPDF();
  const title = 'Marketing Campaign Report';
  const date = format(new Date(), 'MMMM d, yyyy');

  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  doc.setFontSize(12);
  doc.text(`Generated on ${date}`, 20, 30);

  // Campaign Stats
  let yPos = 40;
  doc.text('Campaign Statistics', 20, yPos);
  yPos += 10;
  doc.autoTable({
    startY: yPos,
    head: [['Metric', 'Value']],
    body: [
      ['Total Campaigns', data.campaignStats.total.toString()],
      ['Active Campaigns', data.campaignStats.active.toString()],
      ['Completed Campaigns', data.campaignStats.completed.toString()],
      ['Scheduled Campaigns', data.campaignStats.scheduled.toString()]
    ]
  });

  // Campaign Performance
  yPos = (doc as any).lastAutoTable.finalY + 10;
  doc.text('Campaign Performance', 20, yPos);
  yPos += 10;
  doc.autoTable({
    startY: yPos,
    head: [['Campaign', 'Sent', 'Delivered', 'Opened', 'Responded']],
    body: data.campaignPerformance.map(campaign => [
      campaign.name,
      campaign.sent.toString(),
      campaign.delivered.toString(),
      campaign.opened.toString(),
      campaign.responded.toString()
    ])
  });

  return doc;
}

export function exportMarketingReportToCSV(data: MarketingReportData) {
  const rows = [
    ['Marketing Campaign Report'],
    ['Generated on', format(new Date(), 'MMMM d, yyyy')],
    [],
    ['Campaign Statistics'],
    ['Metric', 'Value'],
    ['Total Campaigns', data.campaignStats.total],
    ['Active Campaigns', data.campaignStats.active],
    ['Completed Campaigns', data.campaignStats.completed],
    ['Scheduled Campaigns', data.campaignStats.scheduled],
    [],
    ['Campaign Performance'],
    ['Campaign', 'Sent', 'Delivered', 'Opened', 'Responded', 'Date'],
    ...data.campaignPerformance.map(campaign => [
      campaign.name,
      campaign.sent,
      campaign.delivered,
      campaign.opened,
      campaign.responded,
      campaign.date
    ]),
    [],
    ['Audience Reach'],
    ['Metric', 'Value'],
    ['Total Contacts', data.audienceReach.total],
    ['New Contacts', data.audienceReach.newContacts],
    ['Active Contacts', data.audienceReach.activeContacts],
    ['Inactive Contacts', data.audienceReach.inactiveContacts]
  ];

  return rows;
}