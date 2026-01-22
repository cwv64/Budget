// Storage module for persisting budget data
const Storage = {
    STORAGE_KEY: 'budgetTrackerData',

    // Save budget data to localStorage
    save(budget) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(budget));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },

    // Load budget data from localStorage
    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            return null;
        }
    },

    // Clear all data
    clear() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    },

    // Export data as JSON file
    exportToFile(budget) {
        const dataStr = JSON.stringify(budget, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `budget-tracker-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },

    // Import data from JSON file
    importFromFile(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                callback(data, null);
            } catch (error) {
                callback(null, error);
            }
        };
        reader.readAsText(file);
    }
};
