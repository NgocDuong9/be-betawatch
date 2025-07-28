import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export interface DatabaseHealth {
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  collections: string[];
  indexes: Record<string, any[]>;
  stats: {
    totalCollections: number;
    totalIndexes: number;
    databaseSize: number;
  };
  errors?: string[];
}

@Injectable()
export class DatabaseHealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async checkHealth(): Promise<DatabaseHealth> {
    const startTime = Date.now();
    const health: DatabaseHealth = {
      status: 'healthy',
      responseTime: 0,
      collections: [],
      indexes: {},
      stats: {
        totalCollections: 0,
        totalIndexes: 0,
        databaseSize: 0,
      },
      errors: [],
    };

    try {
      const db = this.connection.db;
      if (!db) {
        throw new Error('Database connection not available');
      }

      // Get database stats
      const dbStats = await db.stats();
      health.stats.databaseSize = dbStats.dataSize;

      // Get collections
      const collections = await db.listCollections().toArray();
      health.collections = collections.map((col) => col.name);
      health.stats.totalCollections = collections.length;

      // Check each collection
      for (const collection of collections) {
        try {
          const coll = db.collection(collection.name);

          // Get collection indexes
          const indexes = await coll.indexes();
          health.indexes[collection.name] = indexes;
          health.stats.totalIndexes += indexes.length;

          // Quick query test
          await coll.findOne({}, { limit: 1 });
        } catch (error) {
          health.errors?.push(
            `Collection ${collection.name}: ${error.message}`,
          );
          health.status = 'unhealthy';
        }
      }

      // Check connection status
      if (this.connection.readyState !== 1) {
        health.status = 'unhealthy';
        health.errors?.push('Database connection is not ready');
      }
    } catch (error) {
      health.status = 'unhealthy';
      health.errors?.push(`Database health check failed: ${error.message}`);
    }

    health.responseTime = Date.now() - startTime;
    return health;
  }

  async getDetailedStats() {
    const db = this.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }

    const stats = await db.stats();
    const collections = await db.listCollections().toArray();

    const collectionStats = {};

    for (const collection of collections) {
      try {
        const coll = db.collection(collection.name);
        const collStats = await db.command({ collStats: collection.name });
        collectionStats[collection.name] = {
          count: collStats.count,
          size: collStats.size,
          avgObjSize: collStats.avgObjSize,
          indexes: collStats.nindexes,
        };
      } catch (error) {
        collectionStats[collection.name] = { error: error.message };
      }
    }

    return {
      database: {
        name: stats.db,
        collections: stats.collections,
        dataSize: stats.dataSize,
        indexSize: stats.indexSize,
        storageSize: stats.storageSize,
      },
      collections: collectionStats,
    };
  }

  async checkIndexes() {
    const db = this.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }

    const collections = await db.listCollections().toArray();
    const indexReport = {};

    for (const collection of collections) {
      try {
        const coll = db.collection(collection.name);
        const indexes = await coll.indexes();

        indexReport[collection.name] = indexes.map((index) => ({
          name: index.name,
          key: index.key,
          unique: index.unique || false,
          sparse: index.sparse || false,
          background: index.background || false,
        }));
      } catch (error) {
        indexReport[collection.name] = { error: error.message };
      }
    }

    return indexReport;
  }
}
