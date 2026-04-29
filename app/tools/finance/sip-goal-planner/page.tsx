import { Metadata } from "next";
import SipGoalPlannerClient from "./SipGoalPlannerClient";

export const metadata: Metadata = {
  title: "SIP Goal Planner | Calculate Monthly SIP to Reach Your Financial Goals",
  description:
    "Use our SIP Goal Planner to determine the monthly investment needed to achieve your future financial target. Input goal amount, current savings, return rate, and time horizon.",
  keywords:
    "SIP goal planner, monthly SIP calculator, goal based investing, financial goal planning, SIP required, target amount",
  openGraph: {
    title: "SIP Goal Planner – Reach Your Dreams with Systematic Investing",
    description:
      "Find out how much to invest monthly to achieve your financial goals. Plan for retirement, education, down payment, and more.",
    type: "website",
    url: "https://revochamp.site/tools/sip-goal-planner",
  },
};

export default function Page() {
  return <SipGoalPlannerClient />;
}