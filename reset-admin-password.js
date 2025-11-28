const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const uri =
  'mongodb+srv://can:can123@cluster0.3p317iv.mongodb.net/can_ecommerce_db';
const client = new MongoClient(uri);

(async () => {
  try {
    await client.connect();
    const db = client.db('can_ecommerce');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const result = await db
      .collection('users')
      .updateOne(
        { email: 'can@admin.com' },
        { $set: { hashedPassword: hashedPassword, updatedAt: new Date() } }
      );

    console.log(' Admin password has been reset successfully!');
    console.log('');
    console.log(' Email: can@admin.com');
    console.log(' Password: admin123');
    console.log('');
    console.log('You can now log in with these credentials.');

    await client.close();
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
})();
