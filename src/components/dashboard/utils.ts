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
    .map(tag => tag.trim().toUpperCase());

  return { tactics, techniques };
};