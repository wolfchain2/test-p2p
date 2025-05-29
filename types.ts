
export interface NavItem {
  label: string;
  path: string;
  sectionId: string;
}

export interface Stat {
  id: string;
  label: string; // Used as labelBottom in the new design
  targetValue?: number; // For animation if valueString is not provided
  initialValue?: number;
  isCurrency?: boolean; // Still relevant if targetValue is used
  labelTop?: string; // e.g., "VALOR TOTAL" - new
  valueString?: string; // e.g., "$25M+" - new, if present, overrides animation
}

export interface MarketItem {
  id: string;
  user: string;
  purpose: string;
  amount: number;
  terms: string; // e.g., "4 semanas" or "Tasa: 7% (3 sem)"
  risk?: string; // For loan requests
  interest?: string; // For funding offers
  type: 'request' | 'offer';
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface Loan {
  id:string;
  purpose: string;
  amount: number;
  startDate: string;
  dueDate: string;
  status: 'Activo' | 'Pagado' | 'Vencido';
}

export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  method: string;
}

export interface AIMatchProfile {
  id: string;
  risk: string; // For loans, or investor's risk tolerance
  level: string; // For investor level (Gold, Silver) or loan grade (A, B)
  detail: string;
  profileType: 'investor' | 'borrower_loan'; // To distinguish AI match types
  exactInvestmentAmount?: number; // For investors: specific amount they are willing to offer
  preferredTerms?: { interestRate: number; weeks: number; }; // For investors: preferred loan terms
}

export enum RegistrationType {
  Investor = 'inversorReg',
  Borrower = 'prestatarioReg',
  Premium = 'premiumReg',
}

export enum LoanPurpose {
  HomeImprovements = "Mejoras del hogar",
  DebtConsolidation = "Consolidación de deudas",
  MedicalExpenses = "Gastos médicos",
  Education = "Educación",
  Other = "Otro",
}

export interface LoanTermOption {
  value: number; // weeks
  label: string; // e.g., "1 Semana (3% interés)"
  interestRate: number; // e.g., 0.03
}