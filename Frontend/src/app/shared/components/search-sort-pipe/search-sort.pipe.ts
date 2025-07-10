import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchSort',
  standalone: true,
  pure: false // unrein, damit bei jeder Change Detection neu berechnet wird
})
export class SearchSortPipe<T extends Record<string, any>> implements PipeTransform {
  /**
   * Filtert und sortiert ein Array anhand von Suchbegriff und Sortierkriterium.
   * @param items zu verarbeitendes Array
   * @param searchTerm Suchbegriff für Filter
   * @param sortCriteria Sortierkriterium im Format 'key-direction' (z.B. 'question-asc')
   * @param searchableKeys Keys von T, die durchsucht werden
   * @returns gefiltertes und sortiertes Array
   */
  transform(
    items: T[] = [],// Eingabe-Array
    searchTerm: string = '',// Suchbegriff
    sortCriteria: string = '',// Sortierkriterium
    searchableKeys: (keyof T)[] = []// Felder zum durchsuchen
  ): T[] {
    // Nur Items behalten, die den Suchbegriff enthalten
    const term = searchTerm.trim().toLowerCase();
    let filtered = term
      ? items.filter(item =>
          searchableKeys.some(key =>
            String(item[key] ?? '')
              .toLowerCase()
              .includes(term)
          )
        )
      : [...items];  // kein Suchbegriff → alle Items kopieren

    // 2) Sortierkriterium parsen (Format: 'key-order')
    let key = '';
    let order = '';
    if (sortCriteria) {
      [key, order] = sortCriteria.split('-');
    }
    const ascending = order === 'asc'; // aufsteigend oder absteigend

    // 3) Alias 'progress' auf echtes Feld mappen
    const sortKey = (key === 'progress' ? 'learningProgress' : key) as keyof T;

    // 4) Sortieren: nach numerischem oder String-Vergleich
    if (sortKey) {
      filtered.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        // undefined/null → ans Ende
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        // numerischer Vergleich
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return ascending ? aVal - bVal : bVal - aVal;
        }

        // String-Vergleich
        return ascending
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return filtered; // gefilterte & sortierte Items zurückgeben
  }
}
