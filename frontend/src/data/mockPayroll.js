// Replace with external payroll API when integrated.

export const SALARY_OVERVIEW = {
  currentCTC: 1200000,
  netMonthly: 85000,
};

export const SALARY_STRUCTURE = {
  basic: 600000,
  hra: 300000,
  specialAllowance: 200000,
  otherAllowances: 100000,
  deductions: {
    pf: 72000,
    tds: 48000,
    other: 0,
  },
};

export const TAX_DETAILS = {
  financialYear: '2024-25',
  taxableIncome: 1000000,
  tdsDeducted: 48000,
  taxSlab: 'Old regime',
};

export const COMPLIANCE_FORMS = [
  { id: 1, title: 'PF statement', period: 'Apr 2024 - Mar 2025', downloadUrl: '#' },
  { id: 2, title: 'TDS certificate (Form 16)', period: 'FY 2024-25', downloadUrl: '#' },
  { id: 3, title: 'Investment declaration', period: 'FY 2024-25', downloadUrl: '#' },
];

export const PAYSLIPS = [
  { id: 1, month: 'January 2025', netPay: 85000, downloadUrl: '#' },
  { id: 2, month: 'December 2024', netPay: 85000, downloadUrl: '#' },
  { id: 3, month: 'November 2024', netPay: 82000, downloadUrl: '#' },
];

export const COMPENSATION_HISTORY = [
  { year: 2024, type: 'Hike', amount: '10%', note: 'Annual appraisal' },
  { year: 2024, type: 'Bonus', amount: '1x', note: 'Performance bonus' },
  { year: 2023, type: 'Hike', amount: '8%', note: 'Annual appraisal' },
];
