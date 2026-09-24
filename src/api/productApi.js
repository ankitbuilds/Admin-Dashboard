import api from "./axios";

export const getProducts = async ({ limit, skip }) => {
    const response = await api.get("/products", {
        params: {
            limit,
            skip,
        },
    });

    return response.data;
};

export const searchProducts = async ({
    query,
    limit,
    skip,
    signal,
}) => {
    const response = await api.get("/products/search", {
        params: {
            q: query,
            limit,
            skip,
        },
        signal,
    });

    return response.data;
};

export const getCategories = async () => {
    const response = await api.get("/products/categories");

    return response.data;
};

export const getProductsByCategory = async ({
    category,
    limit,
    skip,
}) => {
    const response = await api.get(
        `/products/category/${category}`,
        {
            params: {
                limit,
                skip,
            },
        }
    );

    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};