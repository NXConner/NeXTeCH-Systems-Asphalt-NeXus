
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { JobsContainer } from "@/components/jobs/JobsContainer";

const Jobs = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <JobsContainer />
      </div>
    </ErrorBoundary>
  );
};

export default Jobs;
