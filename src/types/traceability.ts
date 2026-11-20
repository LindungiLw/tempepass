export type Locale = "id" | "en";

export type BatchStatus =
  | "fermenting"
  | "quality_check"
  | "packaged"
  | "dispatched";

export type DistributionChannel =
  | "local_market"
  | "modern_retail"
  | "export_consignment";

export type BatchGrade = "export_vacuum" | "retail_fresh" | "artisan_leaf";

export interface ProducerPreset {
  id: string;
  label: string;
  soybeanOrigin: string;
  soybeanOriginEn: string;
  soybeanVariety: string;
  nonGmoVerified: boolean;
  ragiBrandAndStrain: string;
  waterSource: string;
  waterSourceEn: string;
  packagingType: string;
  packagingTypeEn: string;
  defaultFermentationHours: number;
  defaultWeightGrams: number;
}

export interface ProducerProfile {
  id: string;
  code: string;
  name: string;
  ownerName: string;
  email: string;
  pin: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  foundedYear: number;
  pirtNumber: string;
  halalNumber: string;
  nibNumber: string;
  cppbStatus: "Tersertifikasi CPPB-IRT" | "Dalam Pembinaan CPPB";
  cppbStatusEn: "CPPB-IRT Certified" | "CPPB Guided Compliance";
  storyId: string;
  storyEn: string;
  dailyCapacityKg: number;
  presets: ProducerPreset[];
}

export interface ProductionStageLog {
  key: "soaking" | "boiling" | "inoculation" | "fermentation" | "packaging";
  titleId: string;
  titleEn: string;
  hourMark: string;
  timestamp: string | null;
  temperatureC: number | null;
  humidityPct: number | null;
  completed: boolean;
  noteId: string;
  noteEn: string;
}

export interface CppbChecklist {
  waterBoiledAndFiltered: boolean;
  utensilsSanitized: boolean;
  fermentationRackClean: boolean;
  handlerHygieneGear: boolean;
  pestFreeStorage: boolean;
  inspectorName: string;
  checkedAt: string;
}

export interface TempeBatch {
  id: string;
  producerId: string;
  productName: string;
  productNameEn: string;
  netWeightGrams: number;
  quantityPacks: number;
  status: BatchStatus;
  grade: BatchGrade;
  fermentationProgressPct: number;
  rawMaterials: {
    soybeanOrigin: string;
    soybeanOriginEn: string;
    soybeanVariety: string;
    nonGmoVerified: boolean;
    soybeanLotNumber: string;
    ragiBrandAndStrain: string;
    ragiLotNumber: string;
    waterSource: string;
    waterSourceEn: string;
  };
  production: {
    productionDate: string;
    inoculationTime: string;
    fermentationHours: number;
    fermentationTempC: number;
    fermentationHumidityPct: number;
    packagingType: string;
    packagingTypeEn: string;
    packagedAt: string | null;
    bestBeforeRoom: string;
    bestBeforeChilled: string;
  };
  cppbChecklist: CppbChecklist;
  distribution: {
    channel: DistributionChannel;
    destination: string;
    destinationEn: string;
    coldChainRequired: boolean;
    dispatchDate: string | null;
  };
  stages: ProductionStageLog[];
  scanCount: number;
  createdAt: string;
}

export interface BuyerFeedback {
  id: string;
  batchId: string;
  producerId: string;
  senderName: string;
  senderRole: "consumer" | "retail_buyer" | "export_importer";
  organization: string;
  rating: number;
  message: string;
  createdAt: string;
}
