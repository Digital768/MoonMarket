import DonutSkeleton from "@/Skeletons/DonutSkeleton";
import TreeMapSkeleton from "@/Skeletons/TreeMapSkeleton";
import { CircularPacking } from "@/components/CircularPackingChart";
import { DonutChart } from "@/components/DonutChart";
import { Treemap } from "@/components/Treemap";
import Leaderboards from "@/components/Leaderboards";

const skeletons = {
  DonutChart: DonutSkeleton,
  Treemap: TreeMapSkeleton,
  Circular: TreeMapSkeleton,
  TableGraph: TreeMapSkeleton,
  Leaderboards: TreeMapSkeleton,
};

const components = {
  DonutChart: DonutChart,
  Treemap: Treemap,
  Circular: CircularPacking,
  Leaderboards: Leaderboards,
};

function DataGraph({ isDataProcessed, selectedGraph, visualizationData }) {
  const Skeleton = skeletons[selectedGraph] || TreeMapSkeleton;
  const GraphComponent = components[selectedGraph];

  if (!isDataProcessed) {
    return <Skeleton />;
  }

  if (!visualizationData ) {
    return <Skeleton />;
  }

  return GraphComponent ? (
    <GraphComponent data={visualizationData} width={1000} height={selectedGraph === "Circular" ? 700 : selectedGraph === "DonutChart" ? 650 : 600} />
  ) : null;
}

export default DataGraph;
