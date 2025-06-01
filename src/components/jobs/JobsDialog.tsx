
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateJobForm from "@/components/CreateJobForm";

interface JobsDialogProps {
  onCreateJob: (jobData: any) => void;
}

export const JobsDialog = ({ onCreateJob }: JobsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <CreateJobForm onSubmit={onCreateJob} />
      </DialogContent>
    </Dialog>
  );
};
