export type QuoteArchiveEntry = {
  id: string;
  customerName: string;
  quoteType: string;
  amount: number;
  summary: Record<string, string | number | boolean>;
  rateVersion: number;
  createdAt: string;
};

export type SaveQuoteInput = Omit<QuoteArchiveEntry, "id" | "createdAt">;
