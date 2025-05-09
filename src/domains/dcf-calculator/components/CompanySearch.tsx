import React, { useState } from "react";
import { Input } from "@/components/ui/input"; // Assuming shadcn Input component
import { Button } from "@/components/ui/button"; // Assuming shadcn Button component
import { Label } from "@/components/ui/label"; // Assuming shadcn Label component

interface CompanySearchProps {
  onSearch: (ticker: string) => void;
  loading?: boolean;
}

/**
 * Component for searching a company by ticker.
 * @param {CompanySearchProps} props - Component props.
 * @param {function(string): void} props.onSearch - Callback function when search button is clicked.
 * @param {boolean} [props.loading=false] - Indicates if a search is in progress.
 */
const CompanySearch: React.FC<CompanySearchProps> = ({
  onSearch,
  loading = false,
}) => {
  const [ticker, setTicker] = useState("");

  const handleSearch = () => {
    if (ticker.trim()) {
      onSearch(ticker.trim().toUpperCase());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-6 rounded-lg shadow-md">
      <div className="flex-1 space-y-2">
        <Label htmlFor="company-ticker" className="text-gray-300">
          Company Ticker
        </Label>
        <Input
          id="company-ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="MSFT"
          disabled={loading}
          className="text-white"
        />
      </div>
      <div className="flex items-end">
        <Button
          onClick={handleSearch}
          disabled={loading}
          className="w-full sm:w-aut text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>
    </div>
  );
};

export default CompanySearch;
