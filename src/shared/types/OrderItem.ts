export type OrderItem = {
    id: number;
    product_id?: number;
    title: string;
    name: string;
    descriptionMarkdown?: string;
    thumbnail?: string;
    images?: string;
    url?: string;
    authors?: string;
    tags?: string;
    genre?: string;
    orderBy?: string;
    sortOrder?: string;
    ageRating?: string;
    price: number;
};
