import { JournalInsightToDownload } from '@/types/journal';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import { toTitleCase } from './format';

function sortInsightsByDate(
  insights: JournalInsightToDownload[],
): JournalInsightToDownload[] {
  return [...insights].sort(
    (a, b) =>
      new Date(a.jrnl_created_at).getTime() -
      new Date(b.jrnl_created_at).getTime(),
  );
}

export function formatJournalInsightsAsText(
  insights: JournalInsightToDownload[],
): string {
  const sorted = sortInsightsByDate(insights);
  return sorted
    .map((e) => {
      const dateStr = format(
        new Date(e.jrnl_created_at),
        'dd/MMMM/yyyy, h:mm a',
      );
      const moodLine = e.mood_name ? `Mood: ${toTitleCase(e.mood_name)}\n` : '';
      const exerciseLine = e.exc_name
        ? `Recommended Exercise: ${e.exc_name}\n`
        : '';
      return `Date: ${dateStr}\n${moodLine}${exerciseLine}\n${e.entryText}\n\n${'-'.repeat(40)}\n`;
    })
    .join('\n');
}

export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

// convert to PDF
export function downloadInsightsAsPdf(
  insights: JournalInsightToDownload[],
  filename: string,
) {
  const sorted = sortInsightsByDate(insights);
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  doc.setFontSize(16);
  doc.text('CaratMind Journal Entries', margin, y);
  y += 10;

  sorted.forEach((entry, index) => {
    const dateStr = format(
      new Date(entry.jrnl_created_at),
      'dd MMMM yyyy, h:mm a',
    );

    // date heading
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(dateStr, margin, y);
    y += 7;

    // entry text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(entry.entryText, maxWidth);
    lines.forEach((line: string) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 6;
    });

    // mood + exercise
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const info = [];
    if (entry.mood_name) info.push(`Mood: ${toTitleCase(entry.mood_name)}`);
    if (entry.exc_name) info.push(`Exercise: ${entry.exc_name}`);
    if (info.length > 0) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(info.join('   |   '), margin, y);
      y += 7;
    }

    y += 8; // spacing between entries
    if (index < sorted.length - 1 && y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  });

  doc.save(filename);
}
