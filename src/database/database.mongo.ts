import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

export class DatabaseMongodbDefinitions {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
