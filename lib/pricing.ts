export type PlanId = "6M" | "1Y" | "2Y" | "3Y";

export type PricingPlan = {
  id: PlanId;
  durationLabel: string;
  durationMonths: number;
  pricePerStudentPerMonth: number;
  originalPricePerStudentPerMonth?: number;
  periodLabel: string;
  savingsLabel?: string;
  highlighted?: boolean;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "6M",
    durationLabel: "6 Months",
    durationMonths: 6,
    pricePerStudentPerMonth: 10,
    periodLabel: "per student/month"
  },
  {
    id: "1Y",
    durationLabel: "1 Year",
    durationMonths: 12,
    pricePerStudentPerMonth: 8,
    originalPricePerStudentPerMonth: 10,
    periodLabel: "per student/month",
  },
  {
    id: "2Y",
    durationLabel: "2 Years",
    durationMonths: 24,
    pricePerStudentPerMonth: 6,
    originalPricePerStudentPerMonth: 8,
    periodLabel: "per student/month",
    savingsLabel: "Save 25%",
    highlighted: true,
  },
  {
    id: "3Y",
    durationLabel: "3 Years",
    durationMonths: 36,
    pricePerStudentPerMonth: 5,
    originalPricePerStudentPerMonth: 6,
    periodLabel: "per student/month",
    savingsLabel: "Save 37.5%",
  },
];
