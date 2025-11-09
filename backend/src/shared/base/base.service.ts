
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

export abstract class BaseService<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findOne(id: ObjectId): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async create(data: any): Promise<T> {
    const createdEntity = new this.model(data);
    return createdEntity.save();
  }

  async update(id: ObjectId, data: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: ObjectId): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}
