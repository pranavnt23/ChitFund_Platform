const { MongoClient } = require('mongodb');

// MongoDB connection string (update with your connection details)
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const dbName = 'FundVerse'; // Your database name
const collectionName = 'schemes'; // Your collection name

const iconMap = {
    "Gold Savings Scheme": "Coins",
    "Diamond Wealth Plan": "Diamond",
    "Silver Harvest Scheme": "Scale",
    "Platinum Prestige Scheme": "Crown",
    "Education Savings Scheme": "GraduationCap",
    "Travel Dream Scheme": "Plane",
    "Wedding Bliss Fund": "Heart",
    "Tech Gadget Scheme": "Smartphone",
    "Healthcare Savings Plan": "Stethoscope"
};

async function updateIcons() {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Fetch all schemes from the collection
        const schemes = await collection.find().toArray();

        // Iterate over each scheme and update with corresponding icon
        for (const scheme of schemes) {
            const icon = iconMap[scheme.name]; // Get the icon from the map
            if (icon) {
                // Update the document with the new icon field
                await collection.updateOne(
                    { _id: scheme._id },
                    { $set: { icon } }
                );
                console.log(`Updated scheme: ${scheme.name} with icon: ${icon}`);
            } else {
                console.log(`No icon found for scheme: ${scheme.name}`);
            }
        }
        console.log("Icons updated successfully.");
    } catch (error) {
        console.error("Error updating icons:", error);
    } finally {
        await client.close();
    }
}

updateIcons();
