export type ComponentStructure = {
    id: string;
    entityType: string;
    tenantId?: {
        id: string;
        entityType: string;
    };
    template?: {
        id: string;
        entityType: string;
        tenantId?: {
            id: string;
            entityType: string;
        };
    };
};
