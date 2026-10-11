export const PRODUCT_RULES = {
  id: { minLength: 3, maxLength: 10 },
  name: { minLength: 5, maxLength: 100 },
  description: { minLength: 10, maxLength: 200 },
  revisionYearsAfterRelease: 1,
} as const;
