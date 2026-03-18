/**
 * generatePDFReport.ts
 * Drop this file into your utils/ folder.
 *
 * Dependencies (add to your project):
 *   npx expo install expo-print expo-sharing
 *
 * Usage:
 *   import { generatePDFReport } from "@/utils/generatePDFReport";
 *   await generatePDFReport({ vendorId, name, industry, score, normalized, rating, status, tips, exceeded, formData });
 */

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PDFReportData {
  vendorId: string;
  name: string;
  industry: string;
  score: number;
  normalized: number;
  rating: string;
  status: string;
  tips: string[];
  exceeded: string[];
  formData: Record<string, string | number>;
  lang?: string;
}

// ─── Carbon offset helpers ─────────────────────────────────────────────────────
function getOffsets(score: number) {
  const s = Math.max(0, score);
  return {
    trees: Math.ceil(s / 21),
    carKm: Math.round(s / 0.21),
    solarMWh: (s / 0.048 / 1000).toFixed(2),
    ledBulbs: Math.ceil(s / 10),
  };
}

function getStarHTML(normalized: number): string {
  const count =
    normalized < 0.3
      ? 5
      : normalized < 0.6
        ? 4
        : normalized < 0.9
          ? 3
          : normalized < 1.2
            ? 2
            : 1;
  return Array.from({ length: 5 })
    .map((_, i) =>
      i < count
        ? `<span style="color:#4CAF50">&#9733;</span>`
        : `<span style="color:#ccc">&#9733;</span>`,
    )
    .join("");
}

function getStatusColor(status: string): string {
  return status.includes("⚠️") ? "#e53935" : "#2e7d32";
}

function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

function getRatingColor(score: number): string {
  if (score < 30) return "#2e7d32";
  if (score < 60) return "#f9a825";
  return "#c62828";
}

// ─── HTML template ────────────────────────────────────────────────────────────
function buildHTML(data: PDFReportData): string {
  const {
    vendorId,
    name,
    industry,
    score,
    normalized,
    rating,
    status,
    tips,
    exceeded,
    formData,
  } = data;

  const offsets = getOffsets(score);
  const statusColor = getStatusColor(status);
  const ratingColor = getRatingColor(score);
  const reportDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formRows = Object.entries(formData)
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#555;font-size:13px">${capitalise(k)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#1a1a1a;font-size:13px;text-align:right">${v}</td>
      </tr>`,
    )
    .join("");

  const exceededRows =
    exceeded.length === 0
      ? `<p style="color:#2e7d32;font-size:13px">No overused resources detected. Excellent compliance!</p>`
      : exceeded
          .map(
            (item) => `
        <div style="background:#fff5f5;border-left:3px solid #e53935;border-radius:6px;padding:10px 14px;margin-bottom:8px;font-size:13px;color:#b71c1c">
          ${item}
        </div>`,
          )
          .join("");

  const tipsHTML = tips
    .map(
      (t, i) => `
    <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px">
      <div style="min-width:22px;height:22px;background:#e8f5e9;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#2e7d32;flex-shrink:0;line-height:22px;text-align:center">${i + 1}</div>
      <p style="font-size:13px;color:#2d4a2d;line-height:1.6;margin:0">${t}</p>
    </div>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Carbon IQ Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #fff; color: #1a1a1a; }
    .page { max-width: 720px; margin: 0 auto; padding: 40px 36px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4CAF50; padding-bottom: 20px; margin-bottom: 28px; }
    .logo-area h1 { font-size: 26px; color: #2e7d32; font-weight: 800; letter-spacing: -0.5px; }
    .logo-area p { font-size: 12px; color: #777; margin-top: 3px; }
    .report-meta { text-align: right; font-size: 12px; color: #888; line-height: 1.7; }
    .report-meta strong { color: #333; }
    .section { margin-bottom: 28px; }
    .section-title { font-size: 15px; font-weight: 700; color: #2e7d32; border-bottom: 1px solid #e8f5e9; padding-bottom: 6px; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    .score-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 0; }
    .score-box { background: #f7faf2; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #dcedc8; }
    .score-box .val { font-size: 28px; font-weight: 800; line-height: 1; }
    .score-box .lbl { font-size: 11px; color: #666; margin-top: 5px; }
    .status-badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
    .info-table { width: 100%; border-collapse: collapse; border-radius: 10px; overflow: hidden; border: 1px solid #f0f0f0; }
    .offset-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .offset-item { background: #f7faf2; border-radius: 10px; padding: 14px 16px; border: 1px solid #dcedc8; }
    .offset-item .num { font-size: 22px; font-weight: 800; color: #2e7d32; }
    .offset-item .unit { font-size: 13px; color: #5a7a5a; font-weight: 500; }
    .offset-item .desc { font-size: 12px; color: #888; margin-top: 3px; }
    .footer { margin-top: 36px; border-top: 1px solid #e0e0e0; padding-top: 16px; text-align: center; font-size: 11px; color: #aaa; }
    .green-text { color: #2e7d32; }
    .stars { font-size: 20px; letter-spacing: 2px; }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="logo-area">
      <h1>Carbon IQ</h1>
      <p>Carbon Emission Report &mdash; Official Record</p>
    </div>
    <div class="report-meta">
      <strong>Report Date:</strong> ${reportDate}<br/>
      <strong>Vendor ID:</strong> ${vendorId}<br/>
      <strong>Industry:</strong> ${capitalise(industry)}
    </div>
  </div>

  <!-- Vendor Info -->
  <div class="section">
    <div class="section-title">Vendor Information</div>
    <table class="info-table">
      <tr><td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#555;font-size:13px">Vendor Name</td><td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;font-size:13px;text-align:right">${name || vendorId}</td></tr>
      <tr><td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#555;font-size:13px">Vendor ID</td><td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;font-size:13px;text-align:right">${vendorId}</td></tr>
      <tr><td style="padding:9px 12px;color:#555;font-size:13px">Industry Type</td><td style="padding:9px 12px;font-weight:600;font-size:13px;text-align:right">${capitalise(industry)}</td></tr>
    </table>
  </div>

  <!-- Score Summary -->
  <div class="section">
    <div class="section-title">Emission Score Summary</div>
    <div class="score-grid">
      <div class="score-box">
        <div class="val" style="color:${ratingColor}">${score.toFixed(1)}</div>
        <div class="lbl">Total Emission Score</div>
      </div>
      <div class="score-box">
        <div class="val" style="color:#1565c0;font-size:22px">${normalized.toFixed(2)}</div>
        <div class="lbl">Normalized (CO2/unit)</div>
      </div>
      <div class="score-box">
        <div class="stars">${getStarHTML(normalized)}</div>
        <div class="lbl" style="margin-top:6px">${rating}</div>
      </div>
    </div>
    <div style="margin-top:14px;text-align:center">
      <span class="status-badge" style="background:${statusColor}18;color:${statusColor};border:1px solid ${statusColor}33">
        ${status}
      </span>
    </div>
  </div>

  <!-- Input Data -->
  <div class="section">
    <div class="section-title">Resource Usage Data</div>
    <table class="info-table">${formRows}</table>
  </div>

  <!-- Overused Resources -->
  <div class="section">
    <div class="section-title">Overused Resources</div>
    ${exceededRows}
  </div>

  <!-- Carbon Offset -->
  <div class="section">
    <div class="section-title">Carbon Offset Equivalents</div>
    <p style="font-size:13px;color:#555;margin-bottom:14px;line-height:1.6">
      To fully offset <strong>${score.toFixed(1)} kg CO2</strong>, the equivalent actions required are:
    </p>
    <div class="offset-grid">
      <div class="offset-item">
        <div class="num">${offsets.trees.toLocaleString()}</div>
        <div class="unit">trees to plant</div>
        <div class="desc">Native trees absorbing CO2 for 1 year</div>
      </div>
      <div class="offset-item">
        <div class="num">${offsets.carKm.toLocaleString()}</div>
        <div class="unit">km car trip avoided</div>
        <div class="desc">Average petrol vehicle emissions</div>
      </div>
      <div class="offset-item">
        <div class="num">${offsets.solarMWh}</div>
        <div class="unit">MWh solar energy</div>
        <div class="desc">Renewable generation to offset footprint</div>
      </div>
      <div class="offset-item">
        <div class="num">${offsets.ledBulbs}</div>
        <div class="unit">LED bulb swaps</div>
        <div class="desc">Switching from incandescent to LED per year</div>
      </div>
    </div>
  </div>

  <!-- Sustainability Tips -->
  <div class="section">
    <div class="section-title">Sustainability Recommendations</div>
    ${tipsHTML}
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>Generated by <strong>Carbon IQ</strong> &mdash; Carbon Emission Reporting Toolkit</p>
    <p style="margin-top:4px">This report is auto-generated based on vendor-submitted data. &copy; ${new Date().getFullYear()} Carbon IQ</p>
  </div>

</div>
</body>
</html>`;
}

// ─── Main export function ──────────────────────────────────────────────────────
export async function generatePDFReport(data: PDFReportData): Promise<void> {
  try {
    const html = buildHTML(data);

    // Generate PDF using expo-print
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    // Share the PDF
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: `Carbon Report — ${data.vendorId}`,
        UTI: "com.adobe.pdf",
      });
    } else {
      console.log("PDF saved to:", uri);
      alert(`PDF saved to:\n${uri}`);
    }
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
}
