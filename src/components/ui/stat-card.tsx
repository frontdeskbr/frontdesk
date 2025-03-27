
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  isLoading = false
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="text-muted-foreground text-sm font-medium">
            {title}
          </div>
          <div className="bg-primary/10 text-primary p-2 rounded-full">
            {icon}
          </div>
        </div>
        
        {isLoading ? (
          <Skeleton className="h-8 w-24 mb-1" />
        ) : (
          <div className="text-3xl font-bold mb-1">
            {value}
          </div>
        )}
        
        <div className="text-muted-foreground text-sm">
          {description}
        </div>
      </CardContent>
    </Card>
  );
};
