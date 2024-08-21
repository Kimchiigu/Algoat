"use client";

import withAuth from "@/hoc/withAuth";
import ConstellationProgress from "../material/constellation";

function PracticePage() {
  return (
    <div className="flex flex-col">
      <ConstellationProgress />
    </div>
  );
}

export default withAuth(PracticePage, true);
