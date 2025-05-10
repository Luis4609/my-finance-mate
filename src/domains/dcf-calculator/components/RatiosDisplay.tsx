// src/components/financial/RatiosDisplay.tsx
import React from "react";
import type { RatiosData } from "@/shared/models/Financial";

interface RatiosDisplayProps {
    ratios: RatiosData | null;
  }
  
  const RatioItem: React.FC<{ label: string; value: number | string | null | undefined }> = ({ label, value }) => (
    <div>
      <span className="font-medium">{label}:</span>{" "}
      {/* Check for null, undefined, or actual "NaN" string */}
      {(value === null || value === undefined || String(value) === "NaN") ? "N/A" : String(value)}
    </div>
  );
  
  
  const RatiosDisplay: React.FC<RatiosDisplayProps> = ({ ratios }) => {
    if (!ratios) {
      // Optionally, show a loading state or placeholder if ratios are expected but not yet loaded
      // For now, returning null keeps it clean if there's no data.
      return null;
    }
  
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Key Ratios (TTM)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RatioItem label="PER" value={ratios.per} />
          <RatioItem label="EV/EBITDA" value={ratios.ev_ebitda} />
          <RatioItem label="P/FCF" value={ratios.ev_fcf} /> {/* Changed label to reflect source */}
          <RatioItem label="EV/EBIT" value={ratios.ev_ebit} />
          {/* You can add more items here if you expanded RatiosData */}
          {ratios.priceToSalesRatioTTM !== undefined && <RatioItem label="P/S" value={ratios.priceToSalesRatioTTM} />}
          {ratios.priceToBookRatioTTM !== undefined && <RatioItem label="P/B" value={ratios.priceToBookRatioTTM} />}
          {ratios.roeTTM !== undefined && <RatioItem label="ROE" value={ratios.roeTTM} />}
          {ratios.debtToEquityRatioTTM !== undefined && <RatioItem label="D/E" value={ratios.debtToEquityRatioTTM} />}
        </div>
      </div>
    );
  };
  
  export default React.memo(RatiosDisplay);