import { useMemo } from 'react';

interface SearchableItem {
  [key: string]: any;
}

export const useSearch = <T extends SearchableItem>(
  data: T[] | undefined,
  searchTerm: string,
  searchKeys?: string[]
): T[] => {
  return useMemo(() => {
    if (!data) return [];

    const trimmedSearch = searchTerm.trim().toLowerCase();
    if (!trimmedSearch) return data;

    return data.filter((item) => {
      const valuesToSearch = searchKeys 
        ? searchKeys.map(key => item[key]).filter(Boolean)
        : Object.values(item).filter(value => 
            value !== null && value !== undefined && value !== ''
          );

      const searchableText = valuesToSearch
        .map(value => {
          if (typeof value === 'string') return value;
          if (typeof value === 'number') return value.toString();
          if (typeof value === 'boolean') return value.toString();
          return '';
        })
        .join(' ')
        .toLowerCase();

      return searchableText.includes(trimmedSearch);
    });
  }, [data, searchTerm, searchKeys]);
};