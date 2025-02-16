import express, { Router } from 'express';
import { UserService } from './service';

function initUserRouter(service: UserService): Router {
  const router = express.Router();

  // Get all users
  router.get('/', async (req, res) => {
    const users = await service.getAll();

    return res.status(200).json(users);
  });

  // Get a single user by ID
  router.get('/:id', async (req, res) => {
    const userID = req.params.id;

    const user = await service.getOne(userID);

    if (!user) {
      return res.status(404).json({ message: 'Not Found' });
    }

    return res.status(200).json(user);
  });

  // Create a new user
  router.post('/', async (req, res) => {
    const {
      name,
      email,
      password
    } = req.body;

    const createdUser = await service.createUser({
      name,
      email,
      password
    });

    return res.status(201).json(createdUser);
  });

  // Update a user
  router.put('/:id', async (req, res) => {
    const {
      name,email
    } = req.body
    const id = req.params.id

    const updated = await service.updateUser(id,{name,email})
    return res.status(200).json({_id: updated})
  });

  // Delete a user
  router.delete('/:id', async (req, res) => {
    const id = req.params.id
    const deleted = await service.deleteUser(id)
    return res.status(200).json({_id: deleted})
  });

  return router;
}

export default initUserRouter;