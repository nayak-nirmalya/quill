import React from "react";

import { getUserSubscriptionPlan } from "@/lib/stripe";
import { BillingForm } from "@/components/BillingForm";

async function BillingPage() {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return <BillingForm subscriptionPlan={subscriptionPlan} />;
}

export default BillingPage;
