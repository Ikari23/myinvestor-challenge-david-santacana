export const sortByName = <T extends { id: string; name?: string }>(
    items: T[],
    getDisplayName?: (item: T) => string
): T[] => {
    return [...items].sort((a, b) => {
        const nameA = getDisplayName ? getDisplayName(a) : (a.name || `Fondo ${a.id}`);
        const nameB = getDisplayName ? getDisplayName(b) : (b.name || `Fondo ${b.id}`);

        return nameA.localeCompare(nameB, 'es', {
            numeric: true,
            sensitivity: 'base'
        });
    });
};