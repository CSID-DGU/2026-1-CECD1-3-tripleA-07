export type AdHistory = {
  id: number;
  productId: number;
  eventType: string; // "NEW" | "DISCOUNT"
  adUrl: string;
  adContent: string;
  createdAt: string; // e.g. "2026-05-25T01:08:23.302455"
};
