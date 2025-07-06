import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import i18n from "@/utils/i18n";

export const exportCSV = async ({
  vendorId,
  industry,
  formData,
  score,
  normalized,
  rating,
  status,
  tips,
  exceeded,
}: {
  vendorId: string;
  industry: string;
  formData: Record<string, any>;
  score: number;
  normalized: number;
  rating: string;
  status: string;
  tips: string[];
  exceeded: string[];
}) => {
  try {
    console.log("⏳ Generating CSV...");

    // Start CSV with localized headers
    let csv = `${i18n.t("vendor_id")},${vendorId}\n${i18n.t("industry")},${i18n.t(industry)}\n\n${i18n.t("form_data")},${i18n.t("value")}\n`;

    // Localized form fields
    Object.entries(formData).forEach(([key, value]) => {
      csv += `${i18n.t(key)},${value}\n`;
    });

    csv += `\n${i18n.t("total_emission_score")},${score}\n`;
    csv += `${i18n.t("normalized_emission_score")},${normalized} ${i18n.t("co2_per_unit")}\n`;
    csv += `${i18n.t("rating")},${rating}\n`;
    csv += `${i18n.t("status")},${status}\n`;

    // Add government standard normalized score
    csv += `${i18n.t("govt_standard_normalized_score")},${
      industry === "textile" ? "0.6" : "0.8"
    } ${i18n.t("co2_per_unit")}\n`;

    // Add exceeded items
    if (exceeded.length > 0) {
      csv += `\n${i18n.t("exceeded_items")}\n`;
      exceeded.forEach((item) => {
        csv += `• ${item}\n`;
      });
    }

    // Add suggestions/tips
    csv += `\n${i18n.t("suggestions")}\n`;
    tips.forEach((tip) => {
      csv += `• ${tip}\n`;
    });

    const fileUri = FileSystem.documentDirectory + "carbon_result.csv";

    console.log("📁 Saving file to:", fileUri);

    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const sharingAvailable = await Sharing.isAvailableAsync();
    console.log("📤 Sharing available:", sharingAvailable);

    if (sharingAvailable) {
      console.log("✅ Sharing CSV...");
      await Sharing.shareAsync(fileUri);
    } else {
      console.warn("❌ Sharing not available on this device");
    }
  } catch (error) {
    console.error("🚨 Error exporting CSV:", error);
  }
};
