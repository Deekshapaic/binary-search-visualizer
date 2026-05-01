export const createArrayFromInput = (input) => {
  return input
    .split(',')
    .map((a) => parseInt(a, 10))
    .filter((n) => !Number.isNaN(n));
};

export const getCellItemClass = (meta = {}, index) => {
  if (!meta || typeof meta !== 'object') return '';
  if (meta.mid === index) return 'bg-success';
  if (meta.upperBound === index) return 'bg-warning';
  if (meta.lowerBound === index) return 'bg-danger';
  return '';
};
