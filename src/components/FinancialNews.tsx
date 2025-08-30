
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, ExternalLink, TrendingUp, Clock } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
}

export const FinancialNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock news data - in production, you would fetch from NewsAPI
  const mockFinancialNews: NewsItem[] = [
    {
      id: '1',
      title: 'Women-Focused Investment Funds See 30% Growth This Quarter',
      description: 'Financial institutions are launching more investment products specifically designed for women investors, with focus on ESG and long-term wealth building.',
      url: '#',
      publishedAt: new Date().toISOString(),
      source: 'Financial Express',
      category: 'Investment'
    },
    {
      id: '2',
      title: 'Gold Prices Rise: Smart Time for Emergency Fund Diversification?',
      description: 'With gold touching new highs, financial experts suggest women consider small gold allocations in emergency funds for inflation protection.',
      url: '#',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: 'Economic Times',
      category: 'Markets'
    },
    {
      id: '3',
      title: 'New Government Scheme: Enhanced Maternity Benefits for Working Women',
      description: 'The government announces improved financial support for working mothers, including extended paid leave and childcare allowances.',
      url: '#',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: 'Business Standard',
      category: 'Policy'
    },
    {
      id: '4',
      title: 'Digital Payment Safety: Essential Tips for Women',
      description: 'Cybersecurity experts share crucial tips for safe online financial transactions, especially important for women managing household expenses.',
      url: '#',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: 'Money Control',
      category: 'Digital Finance'
    },
    {
      id: '5',
      title: 'SIP Returns: Small Amounts, Big Returns for Long-term Savers',
      description: 'New study shows how systematic investment plans with as little as ₹500/month can create substantial wealth over 10-15 years.',
      url: '#',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: 'Mint',
      category: 'Investment'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchNews = async () => {
      setLoading(true);
      // In production, you would call NewsAPI here
      // const response = await fetch(`https://newsapi.org/v2/everything?q=women+finance+investment&apiKey=${API_KEY}`);
      
      // Simulate network delay
      setTimeout(() => {
        setNews(mockFinancialNews);
        setLoading(false);
      }, 1000);
    };

    fetchNews();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Investment': 'bg-green-100 text-green-800',
      'Markets': 'bg-blue-100 text-blue-800',
      'Policy': 'bg-purple-100 text-purple-800',
      'Digital Finance': 'bg-orange-100 text-orange-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.default;
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900 flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Financial News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-white rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
      <CardHeader>
        <CardTitle className="text-indigo-900 flex items-center gap-2">
          <Newspaper className="w-5 h-5" />
          Financial News for Women
        </CardTitle>
        <p className="text-sm text-indigo-600">Stay updated with latest financial trends and opportunities</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="p-4 bg-white rounded-lg border border-indigo-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={getCategoryColor(item.category)}>
                  {item.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(item.publishedAt)}
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{item.source}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-800"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Read More
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
            <TrendingUp className="w-4 h-4 mr-2" />
            View More Financial News
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
