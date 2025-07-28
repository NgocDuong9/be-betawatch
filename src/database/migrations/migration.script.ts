import { connect, connection } from 'mongoose';

export class DatabaseMigration {
  private static async connectToDatabase(uri: string) {
    try {
      await connect(uri);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  private static async createIndexes() {
    const db = connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    try {
      // Users collection indexes
      await db.collection('users').createIndexes([
        {
          key: { email: 1, isActive: 1, isDeleted: 1 },
          name: 'email_active_deleted',
        },
        {
          key: { username: 1, isActive: 1, isDeleted: 1 },
          name: 'username_active_deleted',
        },
        { key: { role: 1, isActive: 1 }, name: 'role_active' },
        {
          key: { username: 'text', email: 'text', fullName: 'text' },
          name: 'user_text_search',
          weights: { username: 10, email: 5, fullName: 3 },
        },
      ]);

      // Products collection indexes
      await db.collection('products').createIndexes([
        {
          key: { category: 1, isActive: 1, isDeleted: 1 },
          name: 'category_active_deleted',
        },
        { key: { price: 1, isActive: 1 }, name: 'price_active' },
        { key: { tags: 1, isActive: 1 }, name: 'tags_active' },
        { key: { createdBy: 1, isActive: 1 }, name: 'created_by_active' },
        {
          key: { name: 'text', description: 'text', tags: 'text' },
          name: 'product_text_search',
          weights: { name: 10, description: 5, tags: 3 },
        },
      ]);

      // Categories collection indexes
      await db.collection('categories').createIndexes([
        { key: { parent: 1, isActive: 1 }, name: 'parent_active' },
        { key: { name: 1, isActive: 1 }, name: 'name_active' },
      ]);

      // Orders collection indexes
      await db.collection('orders').createIndexes([
        { key: { user: 1, isDeleted: 1 }, name: 'user_deleted' },
        { key: { status: 1, createdAt: -1 }, name: 'status_created' },
        { key: { 'products.product': 1 }, name: 'order_products' },
      ]);

      console.log('✅ All indexes created successfully');
    } catch (error) {
      console.error('❌ Failed to create indexes:', error);
    }
  }

  private static async addMissingFields() {
    const db = connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    try {
      // Add missing fields to users collection
      await db
        .collection('users')
        .updateMany(
          { loginAttempts: { $exists: false } },
          { $set: { loginAttempts: 0 } },
        );

      await db
        .collection('users')
        .updateMany(
          { refreshTokens: { $exists: false } },
          { $set: { refreshTokens: [] } },
        );

      await db
        .collection('users')
        .updateMany(
          { language: { $exists: false } },
          { $set: { language: 'vi' } },
        );

      await db
        .collection('users')
        .updateMany(
          { timezone: { $exists: false } },
          { $set: { timezone: 'Asia/Ho_Chi_Minh' } },
        );

      console.log('✅ Missing fields added successfully');
    } catch (error) {
      console.error('❌ Failed to add missing fields:', error);
    }
  }

  private static async validateData() {
    const db = connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    try {
      // Validate user data
      const invalidUsers = await db
        .collection('users')
        .find({
          $or: [
            { email: { $not: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } },
            { username: { $not: /^[a-zA-Z0-9_]+$/ } },
          ],
        })
        .toArray();

      if (invalidUsers.length > 0) {
        console.warn(
          `⚠️  Found ${invalidUsers.length} users with invalid data`,
        );
      }

      // Validate product data
      const invalidProducts = await db
        .collection('products')
        .find({
          $or: [{ price: { $lt: 0 } }, { stock: { $lt: 0 } }],
        })
        .toArray();

      if (invalidProducts.length > 0) {
        console.warn(
          `⚠️  Found ${invalidProducts.length} products with invalid data`,
        );
      }

      console.log('✅ Data validation completed');
    } catch (error) {
      console.error('❌ Failed to validate data:', error);
    }
  }

  static async run(uri: string) {
    console.log('🚀 Starting database migration...');

    await this.connectToDatabase(uri);
    await this.createIndexes();
    await this.addMissingFields();
    await this.validateData();

    console.log('✅ Database migration completed successfully');
    await connection.close();
  }
}

// Usage:
// import { DatabaseMigration } from './migration.script';
// DatabaseMigration.run(process.env.MONGOOSE_URI_MAIN);
