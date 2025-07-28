import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGOOSE_URI_MAIN'),
        // Production optimizations
        maxPoolSize: 10, // Limit connection pool
        minPoolSize: 2,
        maxIdleTimeMS: 30000, // Close idle connections after 30s
        serverSelectionTimeoutMS: 5000, // Timeout for server selection
        socketTimeoutMS: 45000, // Socket timeout
        bufferMaxEntries: 0, // Disable mongoose buffering
        bufferCommands: false,
        // Read preferences for better performance
        readPreference: 'secondaryPreferred',
        // Write concern for data durability
        writeConcern: {
          w: 'majority',
          j: true,
          wtimeout: 10000,
        },
        // Connection options
        retryWrites: true,
        retryReads: true,
        // SSL/TLS for security
        ssl: true,
        sslValidate: true,
        // Authentication
        authSource: 'admin',
        // Logging
        loggerLevel:
          config.get('NODE_ENV') === 'production' ? 'error' : 'debug',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseProductionModule {}
