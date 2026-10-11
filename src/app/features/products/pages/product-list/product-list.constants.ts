export const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export const DEFAULT_PAGE_SIZE: PageSize = 5;
