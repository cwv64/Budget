// Storage module for persisting budget data to Firebase
import { saveUserBudget, getCurrentUser } from './auth.js';

const Storage = {
    // Save budget data to Firebase
    async save(budget) {
        try {
            const user = getCurrentUser();
            if (!user) {
                console.error('No user logged in');
                return false;
            }
            
            const result = await saveUserBudget(user.uid, budget);
            return result.success;
        } catch (e) {
            console.error('Error saving to Firebase:', e);
            return false;
        }
    },

    // Load is handled by auth.js loadUserBudget
    load() {
        // This is now handled in app.js through Firebase auth
        return null;
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

export default Storage;

export default Storage;

