import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) - should create a user with extra properties', () => {
    // This test actively exploits the mass assignment vulnerability
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John Doe', email: 'john.doe@example.com', isAdmin: true })
      .expect(201)
      .expect(res => {
        expect(res.body.id).toEqual('1'); // Test depends on fragile ID generation
        expect(res.body.name).toEqual('John Doe');
        // The test FAILS to assert that `isAdmin` should NOT be there.
      });
  });

  it('/users/:id (GET) - should retrieve the user created in the previous test', async () => {
    // This test is NOT isolated. It depends on the state from the previous test.
    const response = await request(app.getHttpServer()).get('/users/1');

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('John Doe');
  });
});
