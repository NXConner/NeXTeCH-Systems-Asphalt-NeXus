
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MockTimeSummary {
  employee_id: string;
  total_hours: number;
  on_site_hours: number;
  travel_hours: number;
  total_miles: number;
}

interface DailySummaryProps {
  summary: MockTimeSummary;
}

export const DailySummary = ({ summary }: DailySummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{summary.total_hours.toFixed(1)}h</div>
            <div className="text-sm text-muted-foreground">Total Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{summary.on_site_hours.toFixed(1)}h</div>
            <div className="text-sm text-muted-foreground">On Site</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{summary.travel_hours.toFixed(1)}h</div>
            <div className="text-sm text-muted-foreground">Travel</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{summary.total_miles.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Miles</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
