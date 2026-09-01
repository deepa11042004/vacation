import JoinDetail from "@/Components/Join/JoinDetail";

interface JoinPageProps {
  searchParams: Promise<{
    tier?: string;
    buyNewPlan?: string;
    plan?: string;
    tenure?: string;
  }>;
}

async function Join({ searchParams }: JoinPageProps) {
  const resolvedParams = await searchParams;
  return (
    <>
      <JoinDetail
        selectedTier={resolvedParams.tier}
        buyNewPlan={resolvedParams.buyNewPlan}
        initialPlanKey={resolvedParams.plan}
        initialTenure={resolvedParams.tenure}
      />
    </>
  );
}

export default Join;

