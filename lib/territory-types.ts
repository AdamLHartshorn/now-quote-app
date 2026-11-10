export const REPS = ["Adam", "Brad", "Dawn", "Jon", "Shawn"] as const;

export type Rep = (typeof REPS)[number];

export type TerritoryRow = {
  zip: string;
  city: string;
  county: string;
  rep: Rep;
};

export type Prospect = {
  id: string;
  name: string;
  category: string;
  reason: string;
  address: string;
  phone?: string;
  website?: string;
};
