import { supabase } from './supabase';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export interface ReportData {
  ticketsByStatus: Array<{ name: string; value: number; color: string }>;
  ticketsByPriority: Array<{ name: string; value: number; color: string }>;
  ticketTrends: Array<{ name: string; created: number; resolved: number }>;
  responseTimeData: Array<{ name: string; tickets: number }>;
  agentPerformance: Array<{
    name: string;
    resolved: number;
    avgResponse: string;
    satisfaction: number;
  }>;
  commonTags: Array<{ name: string; count: number }>;
  totalTickets: number;
  avgResponseTime: string;
  openTickets: number;
  resolutionRate: number;
}

export async function fetchReportData(dateRange: string): Promise<ReportData> {
  const now = new Date();
  let startDate;

  switch (dateRange) {
    case 'today':
      startDate = startOfDay(now);
      break;
    case 'week':
      startDate = subDays(now, 7);
      break;
    case 'month':
      startDate = subDays(now, 30);
      break;
    case 'quarter':
      startDate = subDays(now, 90);
      break;
    case 'year':
      startDate = subDays(now, 365);
      break;
    default:
      startDate = subDays(now, 7);
  }

  try {
    // Fetch tickets data
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select(`
        *,
        assignee:assignee_id(id, email),
        comments:ticket_comments(created_at),
        activities:ticket_activities(created_at, type)
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endOfDay(now).toISOString());

    if (ticketsError) throw ticketsError;

    // Process tickets by status
    const statusCounts = tickets.reduce((acc: Record<string, number>, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {});

    const ticketsByStatus = [
      { name: 'Open', value: statusCounts.open || 0, color: '#FCD34D' },
      { name: 'In Progress', value: statusCounts.in_progress || 0, color: '#60A5FA' },
      { name: 'Resolved', value: statusCounts.resolved || 0, color: '#34D399' },
      { name: 'Closed', value: statusCounts.closed || 0, color: '#9CA3AF' }
    ];

    // Process tickets by priority
    const priorityCounts = tickets.reduce((acc: Record<string, number>, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {});

    const ticketsByPriority = [
      { name: 'Low', value: priorityCounts.low || 0, color: '#34D399' },
      { name: 'Medium', value: priorityCounts.medium || 0, color: '#FCD34D' },
      { name: 'High', value: priorityCounts.high || 0, color: '#F97316' },
      { name: 'Urgent', value: priorityCounts.urgent || 0, color: '#EF4444' }
    ];

    // Process ticket trends
    const days = Array.from({ length: 7 }, (_, i) => subDays(now, 6 - i));
    const ticketTrends = days.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      
      return {
        name: format(day, 'EEE'),
        created: tickets.filter(t => 
          new Date(t.created_at) >= dayStart && 
          new Date(t.created_at) <= dayEnd
        ).length,
        resolved: tickets.filter(t => 
          t.status === 'resolved' && 
          new Date(t.updated_at) >= dayStart && 
          new Date(t.updated_at) <= dayEnd
        ).length
      };
    });

    // Process response time data
    const responseTimeData = [
      { name: '< 1h', tickets: 0 },
      { name: '1-4h', tickets: 0 },
      { name: '4-8h', tickets: 0 },
      { name: '8-24h', tickets: 0 },
      { name: '> 24h', tickets: 0 }
    ];

    tickets.forEach(ticket => {
      const firstResponse = ticket.comments?.[0]?.created_at;
      if (firstResponse) {
        const responseTime = new Date(firstResponse).getTime() - new Date(ticket.created_at).getTime();
        const hours = responseTime / (1000 * 60 * 60);

        if (hours < 1) responseTimeData[0].tickets++;
        else if (hours < 4) responseTimeData[1].tickets++;
        else if (hours < 8) responseTimeData[2].tickets++;
        else if (hours < 24) responseTimeData[3].tickets++;
        else responseTimeData[4].tickets++;
      }
    });

    // Process agent performance
    const agentStats: Record<string, { resolved: number; responses: number[]; satisfaction: number[] }> = {};
    
    tickets.forEach(ticket => {
      if (ticket.assignee?.email) {
        if (!agentStats[ticket.assignee.email]) {
          agentStats[ticket.assignee.email] = {
            resolved: 0,
            responses: [],
            satisfaction: []
          };
        }

        if (ticket.status === 'resolved') {
          agentStats[ticket.assignee.email].resolved++;
        }

        const firstResponse = ticket.comments?.[0]?.created_at;
        if (firstResponse) {
          const responseTime = new Date(firstResponse).getTime() - new Date(ticket.created_at).getTime();
          agentStats[ticket.assignee.email].responses.push(responseTime);
        }

        // Assuming satisfaction score is stored in ticket metadata
        if (ticket.metadata?.satisfaction) {
          agentStats[ticket.assignee.email].satisfaction.push(ticket.metadata.satisfaction);
        }
      }
    });

    const agentPerformance = Object.entries(agentStats).map(([email, stats]) => ({
      name: email.split('@')[0],
      resolved: stats.resolved,
      avgResponse: formatResponseTime(
        stats.responses.reduce((a, b) => a + b, 0) / stats.responses.length
      ),
      satisfaction: stats.satisfaction.length
        ? Number((stats.satisfaction.reduce((a, b) => a + b, 0) / stats.satisfaction.length).toFixed(1))
        : 0
    }));

    // Process common tags
    const { data: tagRelations, error: tagError } = await supabase
      .from('ticket_tag_relations')
      .select('tag_id, ticket_tags(name)')
      .in('ticket_id', tickets.map(t => t.id));

    if (tagError) throw tagError;

    const tagCounts: Record<string, number> = {};
    tagRelations.forEach(relation => {
      const tagName = relation.ticket_tags?.name;
      if (tagName) {
        tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
      }
    });

    const commonTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate overall metrics
    const totalTickets = tickets.length;
    const openTickets = statusCounts.open || 0;
    const resolvedTickets = statusCounts.resolved || 0;
    const resolutionRate = totalTickets ? resolvedTickets / totalTickets : 0;

    const avgResponseTime = formatResponseTime(
      tickets.reduce((sum, ticket) => {
        const firstResponse = ticket.comments?.[0]?.created_at;
        if (firstResponse) {
          return sum + (new Date(firstResponse).getTime() - new Date(ticket.created_at).getTime());
        }
        return sum;
      }, 0) / tickets.length
    );

    return {
      ticketsByStatus,
      ticketsByPriority,
      ticketTrends,
      responseTimeData,
      agentPerformance,
      commonTags,
      totalTickets,
      avgResponseTime,
      openTickets,
      resolutionRate
    };
  } catch (error) {
    console.error('Error fetching report data:', error);
    throw error;
  }
}

function formatResponseTime(milliseconds: number): string {
  if (isNaN(milliseconds)) return 'N/A';
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export async function exportReportToPDF(data: ReportData, reportType: string) {
  const doc = new jsPDF();
  const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
  const date = format(new Date(), 'MMMM d, yyyy');

  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  doc.setFontSize(12);
  doc.text(`Generated on ${date}`, 20, 30);

  // Add content based on report type
  let yPos = 40;

  if (reportType === 'overview' || reportType === 'all') {
    doc.text('Summary Statistics', 20, yPos);
    yPos += 10;
    doc.autoTable({
      startY: yPos,
      head: [['Metric', 'Value']],
      body: [
        ['Total Tickets', data.totalTickets.toString()],
        ['Open Tickets', data.openTickets.toString()],
        ['Resolution Rate', `${(data.resolutionRate * 100).toFixed(1)}%`],
        ['Average Response Time', data.avgResponseTime]
      ]
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  if (reportType === 'performance' || reportType === 'all') {
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    doc.text('Agent Performance', 20, yPos);
    yPos += 10;
    doc.autoTable({
      startY: yPos,
      head: [['Agent', 'Resolved', 'Avg Response', 'Satisfaction']],
      body: data.agentPerformance.map(agent => [
        agent.name,
        agent.resolved.toString(),
        agent.avgResponse,
        `${agent.satisfaction}/5.0`
      ])
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  if (reportType === 'trends' || reportType === 'all') {
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    doc.text('Ticket Trends', 20, yPos);
    yPos += 10;
    doc.autoTable({
      startY: yPos,
      head: [['Day', 'Created', 'Resolved']],
      body: data.ticketTrends.map(trend => [
        trend.name,
        trend.created.toString(),
        trend.resolved.toString()
      ])
    });
  }

  return doc;
}

export async function exportReportToCSV(data: ReportData, reportType: string) {
  const rows = [];
  
  if (reportType === 'overview' || reportType === 'all') {
    rows.push(['Summary Statistics']);
    rows.push(['Metric', 'Value']);
    rows.push(['Total Tickets', data.totalTickets]);
    rows.push(['Open Tickets', data.openTickets]);
    rows.push(['Resolution Rate', `${(data.resolutionRate * 100).toFixed(1)}%`]);
    rows.push(['Average Response Time', data.avgResponseTime]);
    rows.push([]);
  }

  if (reportType === 'performance' || reportType === 'all') {
    rows.push(['Agent Performance']);
    rows.push(['Agent', 'Resolved', 'Avg Response', 'Satisfaction']);
    data.agentPerformance.forEach(agent => {
      rows.push([agent.name, agent.resolved, agent.avgResponse, agent.satisfaction]);
    });
    rows.push([]);
  }

  if (reportType === 'trends' || reportType === 'all') {
    rows.push(['Ticket Trends']);
    rows.push(['Day', 'Created', 'Resolved']);
    data.ticketTrends.forEach(trend => {
      rows.push([trend.name, trend.created, trend.resolved]);
    });
  }

  return rows;
}