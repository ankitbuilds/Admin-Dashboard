const STORAGE_KEY = "productMutations";

const getMutations = () => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        return {
            added: [],
            updated: {},
            deleted: [],
        };
    }

    try {
        return JSON.parse(stored);
    } catch {
        return {
            added: [],
            updated: {},
            deleted: [],
        };
    }
};

const saveMutations = (mutations) => {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(mutations)
    );
};

export const addLocalProduct = (product) => {
    const mutations = getMutations();

    mutations.added.push(product);

    saveMutations(mutations);
};

export const updateLocalProduct = (product) => {
    const mutations = getMutations();

    mutations.updated[product.id] = product;

    saveMutations(mutations);
};

export const deleteLocalProduct = (id) => {
    const mutations = getMutations();

    mutations.deleted.push(id);

    delete mutations.updated[id];

    saveMutations(mutations);
};

export const getLocalMutations = () => {
    return getMutations();
};