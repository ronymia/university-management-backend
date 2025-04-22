const searchableFields = (searchableFields: string[], searchTerm: string) => {
    return {
        $or: searchableFields.map((field) => ({
            [field]: {
                $regex: searchTerm,
                $options: 'i',
            },
        })),
    };
};

const fieldFilter = (filtersData: any) => {
    return {
        $and: Object.entries(filtersData).map(([field, value]) => ({
            [field]: value,
        })),
    };
};

export const QueryBuilder = {
    searchableFields,
    fieldFilter,
};
