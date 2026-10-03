export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'insufficient_evidence';

export type DiagnosisStatus = 
  | 'confirmed_issue'
  | 'likely_issue'
  | 'possible_issue'
  | 'not_enough_evidence'
  | 'no_issue_detected';

export type CategoryType = 'auto_detect' | 'electronics' | 'software' | 'physical_object';

export interface DiagnosisResult {
  category: string;
  status: DiagnosisStatus;
  title: string;
  confidence_level: ConfidenceLevel;
  observations: string[];
  primary_issue: string;
  reasoning: string;
  recommended_steps: string[];
  safety_note?: string;
  alternative_causes: string[];
  missing_information: string[];
}

export interface FollowUpMessage {
  id: string;
  question: string;
  answer: string;
  reasoning?: string;
  suggested_steps?: string[];
  timestamp: string;
}

export interface HealthStatus {
  status: string;
  model: string;
  api_configured: boolean;
}
