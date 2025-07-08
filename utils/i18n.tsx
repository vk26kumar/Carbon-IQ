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
    vendor_registration: "Vendor Registration",
    toolkit_subtitle: "Walmart Carbon Reporting Toolkit",
    agriculture: "Agriculture",
    manufacturing: "Manufacturing",
    fill_all_fields: "Please fill all fields.",
    carbon_toolkit_title: "Carbon Reporting Toolkit",
    carbon_toolkit_subtitle:
      "Helping vendors like you track, compare and report emissions with ease.",
    vendor_id_placeholder: "WAL12345",
    name_placeholder: "John Doe",
    mobile_placeholder: "9876543210",

    fabric_produced: "Fabric Produced (m)",
    electricity_used: "Electricity Used (kWh)",
    water_used: "Water Consumed (litres)",
    chemicals_used: "Chemicals Used (kg)",
    diesel_used: "Diesel Used (litres)",

    milk_produced: "Milk Produced (litres)",
    cows: "Number of Cows",
    fodder_used: "Fodder Used (kg)",
    land_area: "Land Area (acres)",
    fertilizer_used: "Fertilizer Used (kg)",
    crop_yield: "Crop Yield (kg)",
    units_produced: "Units Produced",

    submit: "Submit",
    results: "Results",
    error_saving_data: "Error saving data",

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

    result_summary: "Carbon Report Summary",
    unknown: "Unknown",

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
    agriculture_tips: [
      "Use organic fertilizers to reduce chemical emissions",
      "Adopt precision farming to optimize resource use",
      "Maintain soil health for long-term carbon absorption",
    ],
    manufacturing_tips: [
      "Upgrade to energy-efficient machines",
      "Optimize water recycling systems",
      "Reduce chemical usage with green alternatives",
    ],
    emission_distribution: "Emission Distribution",
    view_message: " Message",

    carbon_usage_summary: "Carbon Usage Summary",
    simple_carbon_message:
      "Your carbon footprint has been calculated based on your recent inputs. Continue following sustainable practices to reduce emissions and contribute to a greener future.",
    go_home: "Go to Home",
    feature_tracking: "Accurate Tracking",
    feature_comparison: "Industry Comparison",
    feature_insights: "Actionable Insights",

    why_use_toolkit: "Why use this Toolkit?",
    home_purpose:
      "Empowers vendors to track, compare,\nand report emissions accurately.\nSupports transparency and sustainability.",

    how_it_works: "How It Works",
    register: "Register your business.",
    fill_form: "Submit usage data.",
    get_report: "Get your score and tips.",
    food_processing: "Food Processing",
    logistics: "Logistics",
    electronics: "Electronics",
    pharmaceuticals: "Pharmaceuticals",

    emission_breakdown: "Emission Breakdown",
    overused_resources: "Overused Resources",
    no_overuse_detected: "No overused resources detected. Great job!",
    emission_reduction_tips: "Tips to Reduce Emissions",
    no_tips_available: "No tips available at this time.",
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
    vendor_registration: "विक्रेता पंजीकरण",
    toolkit_subtitle: "वॉलमार्ट कार्बन रिपोर्टिंग टूलकिट",
    agriculture: "कृषि",
    manufacturing: "निर्माण",
    fill_all_fields: "कृपया सभी फ़ील्ड भरें।",
    carbon_toolkit_title: "कार्बन रिपोर्टिंग टूलकिट",
    carbon_toolkit_subtitle:
      "आप जैसे विक्रेताओं को उत्सर्जन को ट्रैक, तुलना और रिपोर्ट करने में मदद करता है।",
    vendor_id_placeholder: "WAL12345",
    name_placeholder: "राम कुमार",
    mobile_placeholder: "९८७६५४३२१०",

    fabric_produced: "उत्पादित कपड़ा (मीटर)",
    electricity_used: "बिजली की खपत (किलोवाट)",
    water_used: "पानी की खपत (लीटर)",
    chemicals_used: "रसायन उपयोग (किलोग्राम)",
    diesel_used: "डीजल उपयोग (लीटर)",

    milk_produced: "उत्पादित दूध (लीटर)",
    cows: "गायों की संख्या",
    fodder_used: "चारे की खपत (किलोग्राम)",
    land_area: "भूमि क्षेत्रफल (एकड़)",
    fertilizer_used: "उर्वरक उपयोग (किग्रा)",
    crop_yield: "फसल उपज (किग्रा)",
    units_produced: "उत्पादित इकाइयाँ",

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
    no_data: "कोई डेटा उपलब्ध नहीं है।",

    detailed_analysis: "विस्तृत विश्लेषण",
    emission_trends: "उत्सर्जन प्रवृत्तियाँ (सामान्यीकृत)",
    industry_comparison: "अन्य विक्रेताओं से तुलना",
    no_industry_comparison_data: "कोई उद्योग तुलना डेटा उपलब्ध नहीं है।",
    no_vendor_history_data: "कोई विक्रेता इतिहास डेटा उपलब्ध नहीं है।",

    result_summary: "कार्बन रिपोर्ट सारांश",
    unknown: "अज्ञात",

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
    agriculture_tips: [
      "रासायनिक उत्सर्जन कम करने के लिए जैविक उर्वरकों का उपयोग करें",
      "संसाधनों के उपयोग को अनुकूलित करने के लिए सटीक खेती अपनाएं",
      "दीर्घकालिक कार्बन अवशोषण के लिए मिट्टी की गुणवत्ता बनाए रखें",
    ],
    manufacturing_tips: [
      "ऊर्जा दक्ष मशीनों का उपयोग करें",
      "जल पुनर्चक्रण प्रणालियों को अनुकूलित करें",
      "हरित विकल्पों के साथ रसायनों का उपयोग कम करें",
    ],
    emission_distribution: "उत्सर्जन वितरण",
    view_message: " संदेश ",

    carbon_usage_summary: "कार्बन उपयोग सारांश",
    simple_carbon_message:
      "आपके हाल के इनपुट के आधार पर आपका कार्बन पदचिह्न गणना किया गया है। उत्सर्जन कम करने और हरित भविष्य में योगदान देने के लिए सतत प्रथाओं का पालन करते रहें।",
    go_home: "मुखपृष्ठ पर जाएँ",

    feature_tracking: "सटीक ट्रैकिंग",
    feature_comparison: "उद्योग तुलना",
    feature_insights: "व्यावहारिक सुझाव",

    why_use_toolkit: "यह टूलकिट क्यों उपयोग करें?",
    home_purpose:
      "विक्रेताओं को उत्सर्जन को ट्रैक,\nतुलना और रिपोर्ट करने में सक्षम बनाता है।\nपारदर्शिता और स्थिरता को समर्थन करता है।",

    how_it_works: "यह कैसे काम करता है",
    register: "अपना व्यवसाय पंजीकृत करें।",
    fill_form: "उपयोग डेटा जमा करें।",
    get_report: "अपना स्कोर और सुझाव प्राप्त करें।",

    food_processing: "खाद्य प्रसंस्करण",
    logistics: "लॉजिस्टिक्स",
    electronics: "इलेक्ट्रॉनिक्स",
    pharmaceuticals: "दवा उद्योग",
  },

  es: {
    select_language: "Seleccionar idioma",
    vendor_id: "ID del proveedor",
    name: "Nombre",
    mobile: "Número de móvil",
    industry: "Tipo de industria",
    textile: "Textil",
    dairy: "Lácteos",
    next: "Siguiente",
    vendor_registration: "Registro de proveedor",
    toolkit_subtitle: "Kit de herramientas de informes de carbono de Walmart",
    agriculture: "Agricultura",
    manufacturing: "Manufactura",
    fill_all_fields: "Por favor, complete todos los campos.",
    carbon_toolkit_title: "Kit de Herramientas de Reporte de Carbono",
    carbon_toolkit_subtitle:
      "Ayudando a proveedores como usted a rastrear, comparar y reportar emisiones fácilmente.",
    vendor_id_placeholder: "WAL12345",
    name_placeholder: "Juan Pérez",
    mobile_placeholder: "9876543210",

    fabric_produced: "Tela producida (m)",
    electricity_used: "Electricidad utilizada (kWh)",
    water_used: "Agua consumida (litros)",
    chemicals_used: "Químicos utilizados (kg)",
    diesel_used: "Diésel utilizado (litros)",

    milk_produced: "Leche producida (litros)",
    cows: "Número de vacas",
    fodder_used: "Forraje utilizado (kg)",
    land_area: "Área de terreno (acres)",
    fertilizer_used: "Fertilizante usado (kg)",
    crop_yield: "Rendimiento de cultivo (kg)",
    units_produced: "Unidades producidas",

    submit: "Enviar",
    results: "Resultados",
    error_saving_data: "Error al guardar los datos",

    form_data: "Datos del formulario",
    carbon_footprint_results: "Resultados de huella de carbono",
    total_emission_score: "Puntuación total de emisiones",
    normalized_emission_score: "Puntuación de emisiones normalizada",
    rating: "Calificación",
    status: "Estado",
    govt_standard_normalized_score: "Estándar normalizado del gobierno",
    suggestions: "Sugerencias",
    download_csv: "Descargar CSV",

    status_overuse: "⚠️ Su uso de carbono excede los límites estándar.",
    status_within: "✅ Su uso de carbono está dentro de los límites estándar.",

    co2_per_unit: "CO₂ por unidad",

    rating_outstanding: "Excelente",
    rating_excellent: "Muy bueno",
    rating_good: "Bueno",
    rating_average: "Promedio",
    rating_poor: "Malo",

    value: "Valor",
    allowed: "Permitido",
    used: "Usado",
    exceeded_items: "Recursos sobreutilizados",
    no_data: "No hay datos disponibles.",

    detailed_analysis: "Análisis detallado",
    emission_trends: "Tendencias de emisión (normalizadas)",
    industry_comparison: "Comparación con otros proveedores",
    no_industry_comparison_data: "No hay datos de comparación disponibles.",
    no_vendor_history_data: "No hay historial del proveedor disponible.",

    result_summary: "Resumen del Informe de Carbono",
    unknown: "Desconocido",

    textile_tips: [
      "Usar energía renovable",
      "Reciclar aguas residuales",
      "Usar tintes orgánicos",
      "Reducir el transporte de combustibles fósiles",
    ],
    dairy_tips: [
      "Usar enfriadores solares",
      "Usar forraje de bajas emisiones",
      "Reducir emisiones de transporte",
      "Gestionar eficientemente el ganado",
    ],
    agriculture_tips: [
      "Utilice fertilizantes orgánicos para reducir las emisiones químicas",
      "Adopte la agricultura de precisión para optimizar el uso de recursos",
      "Mantenga la salud del suelo para una absorción de carbono a largo plazo",
    ],
    manufacturing_tips: [
      "Actualice a máquinas eficientes en energía",
      "Optimice los sistemas de reciclaje de agua",
      "Reduzca el uso de productos químicos con alternativas ecológicas",
    ],
    emission_distribution: "Distribución de Emisiones",
    view_message: "Ver Mensaje de Emisión",

    carbon_usage_summary: "Resumen del Uso de Carbono",
    simple_carbon_message:
      "Tu huella de carbono se ha calculado según tus entradas recientes. Sigue aplicando prácticas sostenibles para reducir emisiones y contribuir a un futuro más verde.",
    go_home: "Ir a Inicio",

    feature_tracking: "Seguimiento preciso",
    feature_comparison: "Comparación industrial",
    feature_insights: "Consejos prácticos",

    why_use_toolkit: "¿Por qué usar esta herramienta?",
    home_purpose:
      "Permite a los proveedores rastrear,\ncomparar y reportar emisiones con precisión.\nApoya la transparencia y la sostenibilidad.",

    how_it_works: "Cómo funciona",
    register: "Registre su negocio.",
    fill_form: "Envíe los datos de uso.",
    get_report: "Obtenga su puntuación y consejos.",
  },

  fr: {
    select_language: "Choisir la langue",
    vendor_id: "ID fournisseur",
    name: "Nom",
    mobile: "Numéro de mobile",
    industry: "Type d'industrie",
    textile: "Textile",
    dairy: "Produits laitiers",
    next: "Suivant",
    vendor_registration: "Enregistrement du fournisseur",
    toolkit_subtitle: "Boîte à outils de reporting carbone Walmart",
    agriculture: "Agriculture",
    manufacturing: "Fabrication",
    fill_all_fields: "Veuillez remplir tous les champs.",
    carbon_toolkit_title: "Outil de Rapport Carbone",
    carbon_toolkit_subtitle:
      "Aider les fournisseurs comme vous à suivre, comparer et déclarer les émissions facilement.",
    vendor_id_placeholder: "WAL12345",
    name_placeholder: "Jean Dupont",
    mobile_placeholder: "9876543210",

    fabric_produced: "Tissu produit (m)",
    electricity_used: "Électricité utilisée (kWh)",
    water_used: "Eau consommée (litres)",
    chemicals_used: "Produits chimiques utilisés (kg)",
    diesel_used: "Diesel utilisé (litres)",

    milk_produced: "Lait produit (litres)",
    cows: "Nombre de vaches",
    fodder_used: "Fourrage utilisé (kg)",
    land_area: "Superficie du terrain (acres)",
    fertilizer_used: "Engrais utilisé (kg)",
    crop_yield: "Rendement des cultures (kg)",
    units_produced: "Unités produites",

    submit: "Soumettre",
    results: "Résultats",
    error_saving_data: "Erreur lors de l'enregistrement des données",

    form_data: "Données du formulaire",
    carbon_footprint_results: "Résultats empreinte carbone",
    total_emission_score: "Score total des émissions",
    normalized_emission_score: "Score d'émissions normalisé",
    rating: "Évaluation",
    status: "Statut",
    govt_standard_normalized_score: "Score standard du gouvernement",
    suggestions: "Suggestions",
    download_csv: "Télécharger le CSV",

    status_overuse:
      "⚠️ Votre utilisation du carbone dépasse les limites standard.",
    status_within:
      "✅ Votre utilisation du carbone est dans les limites standard.",

    co2_per_unit: "CO₂ par unité",

    rating_outstanding: "Exceptionnel",
    rating_excellent: "Excellent",
    rating_good: "Bon",
    rating_average: "Moyenne",
    rating_poor: "Faible",

    value: "Valeur",
    allowed: "Autorisé",
    used: "Utilisé",
    exceeded_items: "Ressources surutilisées",
    no_data: "Aucune donnée disponible.",

    detailed_analysis: "Analyse détaillée",
    emission_trends: "Tendances des émissions (normalisées)",
    industry_comparison: "Comparaison avec d'autres fournisseurs",
    no_industry_comparison_data: "Aucune donnée de comparaison disponible.",
    no_vendor_history_data: "Aucune donnée d'historique disponible.",

    result_summary: "Résumé du Rapport Carbone",
    unknown: "Inconnu",

    textile_tips: [
      "Utiliser des énergies renouvelables",
      "Recycler les eaux usées",
      "Utiliser des colorants biologiques",
      "Réduire le transport fossile",
    ],
    dairy_tips: [
      "Utiliser des refroidisseurs solaires",
      "Utiliser un fourrage à faibles émissions",
      "Réduire les émissions de transport",
      "Gérer efficacement le troupeau",
    ],
    agriculture_tips: [
      "Utilisez des engrais biologiques pour réduire les émissions chimiques",
      "Adoptez l'agriculture de précision pour optimiser l'utilisation des ressources",
      "Maintenez la santé des sols pour une absorption du carbone à long terme",
    ],
    manufacturing_tips: [
      "Passez à des machines écoénergétiques",
      "Optimisez les systèmes de recyclage de l'eau",
      "Réduisez l'utilisation de produits chimiques avec des alternatives écologiques",
    ],
    emission_distribution: "Répartition des Émissions",
    view_message: "Voir le Message d'Émission",

    carbon_usage_summary: "Résumé de l’Utilisation du Carbone",
    simple_carbon_message:
      "Votre empreinte carbone a été calculée en fonction de vos récentes saisies. Continuez à adopter des pratiques durables pour réduire les émissions et contribuer à un avenir plus vert.",
    go_home: "Aller à l’accueil",

    feature_tracking: "Suivi précis",
    feature_comparison: "Comparaison sectorielle",
    feature_insights: "Conseils exploitables",

    why_use_toolkit: "Pourquoi utiliser cet outil ?",
    home_purpose:
      "Permet aux fournisseurs de suivre,\ncomparer et déclarer les émissions.\nFavorise la transparence et la durabilité.",

    how_it_works: "Comment ça fonctionne",
    register: "Enregistrez votre entreprise.",
    fill_form: "Soumettez les données d’utilisation.",
    get_report: "Recevez votre score et vos conseils.",
  },

  zh: {
    select_language: "选择语言",
    vendor_id: "供应商 ID",
    name: "名称",
    mobile: "手机号码",
    industry: "行业类型",
    textile: "纺织",
    dairy: "乳制品",
    next: "下一步",
    vendor_registration: "供应商注册",
    toolkit_subtitle: "沃尔玛碳排放报告工具包",
    agriculture: "农业",
    manufacturing: "制造业",
    fill_all_fields: "请填写所有字段。",
    carbon_toolkit_title: "碳排放报告工具包",
    carbon_toolkit_subtitle:
      "帮助像您这样的供应商轻松跟踪、比较并报告排放情况。",
    vendor_id_placeholder: "WAL12345",
    name_placeholder: "张伟",
    mobile_placeholder: "9876543210",

    fabric_produced: "生产的布料 (米)",
    electricity_used: "用电量 (千瓦时)",
    water_used: "用水量 (升)",
    chemicals_used: "使用化学品 (千克)",
    diesel_used: "使用柴油 (升)",

    milk_produced: "产奶量 (升)",
    cows: "奶牛数量",
    fodder_used: "饲料使用量 (千克)",
    land_area: "土地面积（英亩）",
    fertilizer_used: "使用的肥料（千克）",
    crop_yield: "作物产量（千克）",
    units_produced: "生产单位数",

    submit: "提交",
    results: "结果",
    error_saving_data: "保存数据出错",

    form_data: "表单数据",
    carbon_footprint_results: "碳足迹结果",
    total_emission_score: "总排放评分",
    normalized_emission_score: "标准化排放评分",
    rating: "评分",
    status: "状态",
    govt_standard_normalized_score: "政府标准化评分",
    suggestions: "建议",
    download_csv: "下载 CSV",

    status_overuse: "⚠️ 您的碳排放超出标准限制。",
    status_within: "✅ 您的碳排放在标准范围内。",

    co2_per_unit: "每单位 CO₂",

    rating_outstanding: "杰出",
    rating_excellent: "优秀",
    rating_good: "良好",
    rating_average: "一般",
    rating_poor: "差",

    value: "数值",
    allowed: "允许",
    used: "已使用",
    exceeded_items: "超出使用的资源",
    no_data: "暂无数据",

    detailed_analysis: "详细分析",
    emission_trends: "排放趋势（标准化）",
    industry_comparison: "与其他供应商比较",
    no_industry_comparison_data: "暂无行业比较数据",
    no_vendor_history_data: "暂无供应商历史数据",

    result_summary: "碳排放报告摘要",
    unknown: "未知",

    textile_tips: [
      "使用可再生能源",
      "回收废水",
      "使用有机染料",
      "减少化石燃料运输",
    ],
    dairy_tips: [
      "使用太阳能冷却器",
      "使用低排放饲料",
      "减少运输排放",
      "高效管理牛群",
    ],
    agriculture_tips: [
      "使用有机肥料以减少化学排放",
      "采用精准农业优化资源利用",
      "保持土壤健康以实现长期碳吸收",
    ],
    manufacturing_tips: [
      "升级为节能设备",
      "优化水循环系统",
      "使用绿色替代品减少化学品使用",
    ],
    emission_distribution: "排放分布",
    view_message: "查看排放信息",
    carbon_usage_summary: "碳排放使用概览",
    simple_carbon_message:
      "根据您最近的输入，系统已计算出您的碳足迹。请继续遵循可持续的做法，以减少排放并助力绿色未来。",
    go_home: "返回首页",

    feature_tracking: "精准追踪",
    feature_comparison: "行业对比",
    feature_insights: "实用建议",

    why_use_toolkit: "为什么使用此工具包？",
    home_purpose:
      "帮助供应商准确追踪、\n比较和报告碳排放。\n支持透明度与可持续性。",

    how_it_works: "工作原理",
    register: "注册您的企业。",
    fill_form: "提交使用数据。",
    get_report: "获取评分与建议。",
  },
  ar: {
    select_language: "اختر اللغة",
    vendor_id: "معرّف المورد",
    name: "الاسم",
    mobile: "رقم الجوال",
    industry: "نوع الصناعة",
    textile: "المنسوجات",
    dairy: "الألبان",
    next: "التالي",
    vendor_registration: "تسجيل المورد",
    toolkit_subtitle: "مجموعة أدوات تقارير الكربون من وول مارت",
    agriculture: "الزراعة",
    manufacturing: "التصنيع",
    fill_all_fields: "يرجى ملء جميع الحقول.",
    carbon_toolkit_title: "أداة تقارير الكربون",
    carbon_toolkit_subtitle:
      "مساعدة الموردين مثلك على تتبع الانبعاثات ومقارنتها والإبلاغ عنها بسهولة.",
    vendor_id_placeholder: "وال12345",
    name_placeholder: "محمد أحمد",
    mobile_placeholder: "٩٨٧٦٥٤٣٢١٠",

    fabric_produced: "القماش المنتج (متر)",
    electricity_used: "الكهرباء المستخدمة (كيلوواط ساعة)",
    water_used: "الماء المستهلك (لتر)",
    chemicals_used: "المواد الكيميائية المستخدمة (كجم)",
    diesel_used: "الديزل المستخدم (لتر)",

    milk_produced: "الحليب المنتج (لتر)",
    cows: "عدد الأبقار",
    fodder_used: "العلف المستخدم (كجم)",
    land_area: "مساحة الأرض (فدان)",
    fertilizer_used: "الأسمدة المستخدمة (كجم)",
    crop_yield: "إنتاج المحاصيل (كجم)",
    units_produced: "الوحدات المنتجة",

    submit: "إرسال",
    results: "النتائج",
    error_saving_data: "حدث خطأ أثناء حفظ البيانات",

    form_data: "بيانات النموذج",
    carbon_footprint_results: "نتائج البصمة الكربونية",
    total_emission_score: "إجمالي درجة الانبعاثات",
    normalized_emission_score: "درجة الانبعاثات المعيارية",
    rating: "التقييم",
    status: "الحالة",
    govt_standard_normalized_score: "الدرجة المعيارية الحكومية",
    suggestions: "الاقتراحات",
    download_csv: "تنزيل CSV",

    status_overuse: "⚠️ استهلاك الكربون الخاص بك يتجاوز الحدود المسموح بها.",
    status_within: "✅ استهلاك الكربون الخاص بك ضمن الحدود المسموح بها.",

    co2_per_unit: "CO₂ لكل وحدة",

    rating_outstanding: "ممتاز جدًا",
    rating_excellent: "ممتاز",
    rating_good: "جيد",
    rating_average: "متوسط",
    rating_poor: "ضعيف",

    value: "القيمة",
    allowed: "المسموح به",
    used: "المستخدم",
    exceeded_items: "الموارد المستخدمة بشكل مفرط",
    no_data: "لا توجد بيانات متاحة.",

    detailed_analysis: "تحليل مفصل",
    emission_trends: "اتجاهات الانبعاثات (المعيارية)",
    industry_comparison: "مقارنة مع الموردين الآخرين",
    no_industry_comparison_data: "لا توجد بيانات مقارنة صناعية متاحة.",
    no_vendor_history_data: "لا توجد بيانات تاريخ المورد متاحة.",

    result_summary: "ملخص تقرير الكربون",
    unknown: "غير معروف",

    textile_tips: [
      "استخدم الطاقة المتجددة",
      "أعد استخدام مياه الصرف",
      "استخدم الأصباغ العضوية",
      "قلل من النقل المعتمد على الوقود الأحفوري",
    ],
    dairy_tips: [
      "استخدم مبردات شمسية",
      "استخدم علفًا منخفض الانبعاثات",
      "قلل من انبعاثات النقل",
      "أدر القطيع بكفاءة",
    ],
    agriculture_tips: [
      "استخدم الأسمدة العضوية لتقليل الانبعاثات الكيميائية",
      "اعتمد الزراعة الدقيقة لتحسين استخدام الموارد",
      "حافظ على صحة التربة لامتصاص الكربون على المدى الطويل",
    ],
    manufacturing_tips: [
      "قم بترقية المعدات إلى آلات موفرة للطاقة",
      "حسّن أنظمة إعادة تدوير المياه",
      "قلل من استخدام المواد الكيميائية باستخدام بدائل صديقة للبيئة",
    ],
    emission_distribution: "توزيع الانبعاثات",
    view_message: "عرض رسالة الانبعاث",

    carbon_usage_summary: "ملخص استخدام الكربون",
    simple_carbon_message:
      "تم حساب بصمتك الكربونية بناءً على بياناتك الأخيرة. استمر في اتباع الممارسات المستدامة لتقليل الانبعاثات والمساهمة في مستقبل أكثر خضرة.",
    go_home: "العودة إلى الرئيسية",

    feature_tracking: "تتبع دقيق",
    feature_comparison: "مقارنة صناعية",
    feature_insights: "نصائح قابلة للتنفيذ",

    why_use_toolkit: "لماذا تستخدم هذه الأداة؟",
    home_purpose:
      "تمكّن البائعين من تتبع،\nومقارنة، والإبلاغ عن الانبعاثات بدقة.\nتدعم الشفافية والاستدامة.",

    how_it_works: "كيف تعمل",
    register: "سجّل نشاطك التجاري.",
    fill_form: "أدخل بيانات الاستخدام.",
    get_report: "احصل على النتائج والنصائح.",
  },
};

i18n.locale = Localization.getLocales()[0]?.languageTag ?? "en";
i18n.fallbacks = true;

export default i18n;
