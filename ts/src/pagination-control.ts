export const getPages = (pageCount: number, currentPage: number, nextCount: number): number[] => {
    if (pageCount < 2) return [];
    let from = Math.max(2, currentPage - nextCount);
    let to = Math.min(pageCount - 1, (2 * nextCount) + from);
    const missing = (2 * nextCount) - (to - from);
    if (missing > 0) from = Math.max(2, from - missing);
    const pages = [1];
    for (let i = from; i <= to; i++) pages.push(i);
    return [...pages, pageCount];
};
