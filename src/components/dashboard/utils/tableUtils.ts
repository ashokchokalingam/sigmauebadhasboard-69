export const processTableOptions = (opts: any[]): string[] => {
  const processed = opts.map(opt => {
    if (opt === null || opt === undefined || opt === '') return '—';
    return opt.toString().trim();
  });
  
  return Array.from(new Set(processed)).sort((a, b) => {
    if (a === '—') return 1;
    if (b === '—') return -1;
    return a.localeCompare(b);
  });
};

export const getDefaultColumnWidth = (columnKey: string): string => {
  const widthMap: Record<string, string> = {
    system_time: 'w-[140px]',
    description: 'w-[300px]',
    risk: 'w-[70px]',
    user_id: 'w-[100px]',
    target_user_name: 'w-[100px]',
    default: 'w-[120px]'
  };

  return widthMap[columnKey] || widthMap.default;
};