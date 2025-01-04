import { useState, useMemo } from 'react';

interface EntityData {
  id: string;
  eventCount: number;
  uniqueTitles: number;
}

export const useEntitySearch = (entities: EntityData[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntities = useMemo(() => {
    if (!searchQuery.trim()) return entities;
    
    const query = searchQuery.toLowerCase().trim();
    return entities.filter(entity => 
      entity.id.toLowerCase().includes(query)
    );
  }, [entities, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredEntities
  };
};