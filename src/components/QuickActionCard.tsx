
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }: QuickActionCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="text-center">
        <div className={`mx-auto p-3 rounded-lg w-fit ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" variant="outline">
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionCard;
