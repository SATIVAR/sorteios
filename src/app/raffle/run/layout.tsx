"use client";

import withAuth from "@/components/withAuth";

function RaffleRunLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}

export default withAuth(RaffleRunLayout);