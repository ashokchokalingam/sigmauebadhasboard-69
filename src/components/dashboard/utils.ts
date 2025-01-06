export const extractTacticsAndTechniques = (tags: string) => {
  if (!tags) {
    return { tactics: '', techniques: [] };
  }

  const tagArray = tags.split(',').map(tag => tag.trim());
  
  const tactics = tagArray
    .filter(tag => tag.startsWith('attack.') && !tag.startsWith('attack.t'))
    .map(tag => tag.replace('attack.', ''))
    .join(', ');
    
  const techniques = tagArray
    .filter(tag => tag.toLowerCase().includes('t1'))
    .map(tag => {
      // Extract just the technique ID (e.g., T1133) from the tag
      const match = tag.match(/T\d+/i);
      return match ? match[0] : tag;
    });

  return { tactics, techniques };
};

export const sanitizeEntityName = (name?: string): string => {
  if (!name) return '';
  return name.trim().toLowerCase();
};