import { describe, beforeEach, it, expect, beforeAll } from '@jest/globals';
import { faker } from '@faker-js/faker';
import * as mongoDBTestContainer from '@testcontainers/mongodb';
import mongoose from 'mongoose';
import { UserRepository } from './repository';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { ErrDataNotFound } from '../api/types';
describe('Repository suite test', () => {
  let mongodbContainer: mongoDBTestContainer.StartedMongoDBContainer;
  let userRepository: UserRepository;
  let rawMongoDBConnection: Db;
  let dbName: string;
  beforeAll(async () => {
    dbName = 'testrepository';
    mongodbContainer = await new mongoDBTestContainer.MongoDBContainer('mongo:6.0.1').start();
    await mongoose.connect(mongodbContainer.getConnectionString(), { directConnection: true, dbName });
    const client = new MongoClient(mongodbContainer.getConnectionString() + '?directConnection=true');
    rawMongoDBConnection = client.db(dbName);
    await rawMongoDBConnection.command({ ping: 1 });
  }, 100000);

  beforeEach(() => {
    userRepository = new UserRepository();
  })

  afterAll(async () => {
    console.log('Closing MongoDB connection...');
    await mongoose.disconnect();
    await mongodbContainer.stop();
  });

  it('Should insert user to the database', async() => {
    const userCreationDto = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const user = await userRepository.create(userCreationDto);
    // Check the returned result.
    expect(user).toBeTruthy();
    expect(user.id).toBeTruthy();
    expect(user.name).toEqual(userCreationDto.name);
    expect(user.email).toEqual(userCreationDto.email);
    // Check in database
    console.log('user', user);
    const doc = await rawMongoDBConnection.collection('users')
      .findOne({ _id: new ObjectId(user.id) });
    console.log( 'doc', doc);
    expect(doc).toBeTruthy();
    expect(doc?.name).toEqual(userCreationDto.name);
    expect(doc?.email).toEqual(userCreationDto.email);
  });

  it('Should get one from the database', async () => {
    //case if user not found
    await expect(async () => await userRepository.getOneById(String(new ObjectId()))).rejects.toThrowError(ErrDataNotFound);
    //case if user found
    const userCreationDto = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const user = await rawMongoDBConnection.collection('users').insertOne(userCreationDto);
    const result = await userRepository.getOneById(user.insertedId.toHexString());

    expect(result).toBeTruthy();
    expect(result?.id).toEqual(user.insertedId.toHexString());
    expect(result?.name).toEqual(userCreationDto.name);
    expect(result?.email).toEqual(userCreationDto.email);
  });
  it('Should get all from the database', async () => {
    for( let i = 0; i < 10; i++) {
      await rawMongoDBConnection.collection('users').insertOne({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
    }
    const result = await userRepository.getAll();
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
    result.forEach((u) => {
      expect(u.id).toBeTruthy();
      expect(u.name).toBeTruthy();
      expect(u.email).toBeTruthy();
    });
  });
  it('Should delete user from the database', async () => {
    //case if user not found
    await expect(async () => await userRepository.delete(String(new ObjectId()))).rejects.toThrowError(ErrDataNotFound);
    //case if user found
    const userCreationDto = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const user = await rawMongoDBConnection.collection('users').insertOne(userCreationDto);
    await userRepository.delete(user.insertedId.toHexString());
    const result = await rawMongoDBConnection.collection('users').findOne({ _id: user.insertedId });
    expect(result).toBeFalsy();
  });
  it('Should update user in the database', async () => {
    //case if user not found
    await expect(async () => await userRepository.update(String(new ObjectId()), {
      name: faker.person.firstName(),
      email: faker.internet.email(),
    })).rejects.toThrowError(ErrDataNotFound);
    //case if user found
    const userCreationDto = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const user = await rawMongoDBConnection.collection('users').insertOne(userCreationDto);
    const userUpdateDto = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
    };
    await userRepository.update(user.insertedId.toHexString(), userUpdateDto);
    const result = await rawMongoDBConnection.collection('users').findOne({ _id: user.insertedId });
    expect(result).toBeTruthy();
    expect(result?.name).toEqual(userUpdateDto.name);
    expect(result?.email).toEqual(userUpdateDto.email);
  });
});