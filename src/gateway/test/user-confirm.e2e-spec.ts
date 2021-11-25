import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';
import * as mongoose from 'mongoose';

import { userSignupRequestSuccess } from './mocks/user-signup-request-success.mock';

describe('Users Confirm Email (e2e)', () => {
  let app;
  let userToken: string;
  let userConfirmation: any[];

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DSN, { useNewUrlParser: true });
    await mongoose.connection.dropDatabase();
  });
});
