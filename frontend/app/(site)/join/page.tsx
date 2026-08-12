import JoinDetail from "@/Components/Join/JoinDetail";

interface JoinPageProps {
  searchParams: Promise<{
    tier?: string;
  }>;
}

async function Join({ searchParams }: JoinPageProps) {
  const resolvedParams = await searchParams;
  return (
    <>
      <JoinDetail selectedTier={resolvedParams.tier} />
    </>
  );
}

export default Join;
