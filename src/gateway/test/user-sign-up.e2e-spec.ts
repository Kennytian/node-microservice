import { Test, TestingModule } from '@nestjs/testing';

import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { userSignupRequestSuccess } from './mocks/user-signup-request-success.mock';

import {
  userSignupRequestFailInvalidEmail,
  userSignupRequestFailNoPw,
  userSignupRequestFailShortPw,
} from './mocks/user-signup-request-fail.mock';
