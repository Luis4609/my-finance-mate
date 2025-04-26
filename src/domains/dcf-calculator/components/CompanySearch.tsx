import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanySearchProps {
  onSearch: (ticker: string) => void;
  loading: boolean;
}

const CompanySearch: React.FC<CompanySearchProps> = ({ onSearch, loading }) => {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker.trim().toUpperCase());
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Company</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="grid flex-1 gap-2">
             <Label htmlFor="ticker">Company Ticker</Label>
             <Input
              id="ticker"
              type="text"
              placeholder="e.g., ADBE"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              disabled={loading}
             />
          </div>
          <div className="flex items-end"> {/* Align button to the bottom */}
             <Button type="submit" disabled={loading}>
               {loading ? 'Searching...' : 'Search'}
             </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanySearch;