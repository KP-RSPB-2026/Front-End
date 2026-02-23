export const formatNumber = (value) => {
  if (value === undefined || value === null) return '';
  return Number(value).toLocaleString('en-US');
};
