
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const quotes = [
  {
    text: "A woman with money is a woman with choices.",
    author: "Unknown"
  },
  {
    text: "The real measure of your wealth is how much you'd be worth if you lost all your money.",
    author: "Anonymous"
  },
  {
    text: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make.",
    author: "Dave Ramsey"
  },
  {
    text: "Women who seek to be equal with men lack ambition... especially when it comes to building wealth.",
    author: "Financial Wisdom"
  },
  {
    text: "Investing in yourself is the best investment you will ever make.",
    author: "Warren Buffett"
  },
  {
    text: "The habit of saving is itself an education; it fosters every virtue, teaches self-denial.",
    author: "T.T. Munger"
  },
  {
    text: "A budget is telling your money where to go instead of wondering where it went.",
    author: "Dave Ramsey"
  },
  {
    text: "Every woman deserves to live financially free and pursue her dreams.",
    author: "Financial Empowerment"
  },
  {
    text: "The goal isn't more money. The goal is living life on your terms.",
    author: "Chris Brogan"
  },
  {
    text: "Don't save what is left after spending; spend what is left after saving.",
    author: "Warren Buffett"
  }
];

export const DailyQuote: React.FC = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Get quote based on current date to ensure same quote for the day
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % quotes.length;
    setQuote(quotes[quoteIndex]);
  }, []);

  return (
    <Card className="bg-white shadow-lg border border-rose-200">
      <CardContent className="p-6">
        <div className="text-center space-y-3">
          <div className="text-2xl">💭</div>
          <h3 className="text-lg font-semibold text-rose-700">Thought of the Day</h3>
          <blockquote className="text-charcoal italic text-lg leading-relaxed">
            "{quote.text}"
          </blockquote>
          <p className="text-rose-600 font-medium text-sm">— {quote.author}</p>
        </div>
      </CardContent>
    </Card>
  );
};
