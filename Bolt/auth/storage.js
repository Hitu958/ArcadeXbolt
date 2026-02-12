const Storage = {
    // Generic Get
    get(key) {
        try { return JSON.parse(localStorage.getItem(`arcadex_${key}`)) || []; }
        catch (e) { console.error(e); return []; }
    },

    // Save item to list (prepend)
    save(key, item) {
        const list = this.get(key);
        item.id = Date.now();
        item.date = new Date().toLocaleDateString();
        item.timestamp = Date.now();
        list.unshift(item);
        localStorage.setItem(`arcadex_${key}`, JSON.stringify(list));
        return list;
    },

    // Delete item by ID
    delete(key, id) {
        let list = this.get(key);
        list = list.filter(i => i.id !== id);
        localStorage.setItem(`arcadex_${key}`, JSON.stringify(list));
        return list;
    },

    // Get specific item
    getOne(key, id) {
        const list = this.get(key);
        return list.find(i => i.id === id);
    },

    // Clear all
    clear(key) {
        localStorage.removeItem(`arcadex_${key}`);
    }
};
