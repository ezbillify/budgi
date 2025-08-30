
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, ExternalLink } from 'lucide-react';

export const NewsCard: React.FC = () => {
  return (
    <Card className="bg-white shadow-lg border border-card-bg">
      <CardHeader>
        <CardTitle className="text-main flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-icon-detail" />
          Financial News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Stay updated with the latest financial news and market trends.
        </p>
        
        <div className="space-y-2">
          <div className="p-3 bg-card-bg/30 rounded-lg">
            <p className="text-sm font-medium text-main">💡 Financial Tip</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start investing early to benefit from compound interest over time.
            </p>
          </div>
          
          <div className="p-3 bg-card-bg/30 rounded-lg">
            <p className="text-sm font-medium text-main">📈 Market Insight</p>
            <p className="text-xs text-muted-foreground mt-1">
              Diversify your portfolio across different asset classes to reduce risk.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Connect to a news API for live financial updates
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
