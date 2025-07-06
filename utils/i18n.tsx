import * as Localization from "expo-localization";
import i18n from "i18n-js";

i18n.translations = {
  en: {
    select_language: "Select Language",
    vendor_id: "Vendor ID",
    name: "Name",
    mobile: "Mobile Number",
    industry: "Industry Type",
    textile: "Textile",
    dairy: "Dairy",
    next: "Next",

    // Textile
    fabric_produced: "Fabric Produced (m)",
    electricity_used: "Electricity Used (kWh)",
    water_used: "Water Consumed (litres)",
    chemicals_used: "Chemicals Used (kg)",
    diesel_used: "Diesel Used (litres)",

    // Dairy
    milk_produced: "Milk Produced (litres)",
    cows: "Number of Cows",
    fodder_used: "Fodder Used (kg)",

    submit: "Submit",
    results: "Results",
    error_saving_data: "Error saving data",

    // Results
    form_data: "Form Data",
    carbon_footprint_results: "Carbon Footprint Results",
    total_emission_score: "Total Emission Score",
    normalized_emission_score: "Normalized Emission Score",
    rating: "Rating",
    status: "Status",
    govt_standard_normalized_score: "Government Standard Normalized Score",
    suggestions: "Suggestions",
    download_csv: "Download CSV",

    status_overuse: "⚠️ Your carbon usage exceeds standard limits.",
    status_within: "✅ Your carbon usage is within standard limits.",

     co2_per_unit: "CO₂ per unit",

    rating_outstanding: "Outstanding",
    rating_excellent: "Excellent",
    rating_good: "Good",
    rating_average: "Average",
    rating_poor: "Poor",

    value: "Value",
    allowed: "Allowed",
    used: "Used",
    exceeded_items: "Overused Resources",
    no_data: "No data available.",

    detailed_analysis: "Detailed Analysis",
    emission_trends: "Emission Trends (Normalized)",
    industry_comparison: "Comparison with Other Vendors",
    no_industry_comparison_data: "No industry comparison data available.",
    no_vendor_history_data: "No vendor history data available.",


    // Tips
    textile_tips: [
      "Use renewable energy",
      "Recycle wastewater",
      "Switch to organic dyes",
      "Reduce fossil fuel transport",
    ],
    dairy_tips: [
      "Switch to solar chillers",
      "Use low-emission fodder",
      "Reduce transport emissions",
      "Manage herd efficiently",
    ],
  },

  hi: {
    select_language: "भाषा चुनें",
    vendor_id: "विक्रेता आईडी",
    name: "नाम",
    mobile: "मोबाइल नंबर",
    industry: "उद्योग का प्रकार",
    textile: "वस्त्र",
    dairy: "डेयरी",
    next: "आगे",

    fabric_produced: "उत्पादित कपड़ा (मीटर)",
    electricity_used: "बिजली की खपत (किलोवाट)",
    water_used: "पानी की खपत (लीटर)",
    chemicals_used: "रसायन उपयोग (किलोग्राम)",
    diesel_used: "डीजल उपयोग (लीटर)",

    milk_produced: "उत्पादित दूध (लीटर)",
    cows: "गायों की संख्या",
    fodder_used: "चारे की खपत (किलोग्राम)",

    submit: "जमा करें",
    results: "परिणाम",
    error_saving_data: "डेटा सहेजने में त्रुटि",

    form_data: "फॉर्म डेटा",
    carbon_footprint_results: "कार्बन फुटप्रिंट परिणाम",
    total_emission_score: "कुल उत्सर्जन स्कोर",
    normalized_emission_score: "सामान्यीकृत उत्सर्जन स्कोर",
    rating: "रेटिंग",
    status: "स्थिति",
    govt_standard_normalized_score: "मानक सामान्यीकृत स्कोर",
    suggestions: "सुझाव",
    download_csv: "CSV डाउनलोड करें",

    status_overuse: "⚠️ आपकी कार्बन खपत मानक सीमा से अधिक है।",
    status_within: "✅ आपकी कार्बन खपत मानक सीमा के भीतर है।",

    co2_per_unit: "प्रति इकाई CO₂",

    rating_outstanding: "उत्कृष्ट",
    rating_excellent: "बहुत अच्छा",
    rating_good: "अच्छा",
    rating_average: "औसत",
    rating_poor: "खराब",

    value: "मान",  
    allowed: "अनुमत",
    used: "उपयोग किया गया",
    exceeded_items: "अधिक उपयोग किए गए संसाधन",

    detailed_analysis: "विस्तृत विश्लेषण",
    emission_trends: "उत्सर्जन प्रवृत्तियाँ (सामान्यीकृत)",
    industry_comparison: "अन्य विक्रेताओं से तुलना",
    no_data: "कोई डेटा उपलब्ध नहीं है।",
    no_industry_comparison_data: "कोई उद्योग तुलना डेटा उपलब्ध नहीं है।",
    no_vendor_history_data: "कोई विक्रेता इतिहास डेटा उपलब्ध नहीं है।",


    // Tips
    textile_tips: [
      "नवीकरणीय ऊर्जा का उपयोग करें",
      "अपशिष्ट जल का पुन: उपयोग करें",
      "जैविक रंगों का उपयोग करें",
      "डीज़ल परिवहन कम करें",
    ],
    dairy_tips: [
      "सौर कूलर का उपयोग करें",
      "कम उत्सर्जन वाला चारा उपयोग करें",
      "परिवहन उत्सर्जन कम करें",
      "गायों का कुशल प्रबंधन करें",
    ],
  },
};

i18n.locale = Localization.getLocales()[0]?.languageTag ?? "en";
i18n.fallbacks = true;

export default i18n;
