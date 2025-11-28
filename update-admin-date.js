const { MongoClient } = require('mongodb');

const uri =
  'mongodb+srv://can:can123@cluster0.3p317iv.mongodb.net/can_ecommerce_db';
const client = new MongoClient(uri);

(async () => {
  try {
    await client.connect();
    const db = client.db('can_ecommerce');

    const result = await db.collection('users').updateOne(
      { email: 'can@admin.com' },
      {
        $set: {
          createdAt: new Date('2025-10-30'),
          updatedAt: new Date(),
        },
      }
    );

    console.log('✅ Admin join date updated to October 30, 2025');
    console.log(`Modified ${result.modifiedCount} document(s)`);

    await client.close();
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
})();
