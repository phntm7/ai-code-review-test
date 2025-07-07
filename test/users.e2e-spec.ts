import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  isAdmin?: unknown;
}

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
    // Test should verify that extra properties are NOT assigned
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John Doe', email: 'john.doe@example.com', isAdmin: true })
      .expect(201)
      .expect((res: { body: UserResponse }) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        ); // UUID format
        expect(res.body.name).toEqual('John Doe');
        expect(res.body.email).toEqual('john.doe@example.com');
        expect(res.body.isAdmin).toBeUndefined(); // Verify mass assignment is prevented
      });
  });

  it('/users/:id (GET) - should retrieve a user by ID', async () => {
    // First create a user
    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Jane Doe', email: 'jane.doe@example.com' });

    const userId = (createResponse.body as UserResponse).id;

    // Then retrieve the user
    const getResponse = await request(app.getHttpServer()).get(
      `/users/${userId}`,
    );

    expect(getResponse.status).toBe(200);
    const user: UserResponse = getResponse.body;
    expect(user.id).toBe(userId);
    expect(user.name).toBe('Jane Doe');
    expect(user.email).toBe('jane.doe@example.com');
  });

  it('/users/:id (GET) - should return 404 for non-existent user', async () => {
    const response = await request(app.getHttpServer()).get(
      '/users/non-existent-id',
    );
    expect(response.status).toBe(404);
  });
});
