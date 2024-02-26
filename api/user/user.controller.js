import {userService} from './user.service.js'
import {logger} from '../../services/logger.service.js'
import {socketService} from '../../services/socket.service.js'

export async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(400).send({ err: 'Failed to get user' })
    }
}

export async function getUsers(req, res) {
    try {
        const filterBy = {
            txt: req.query?.txt || '',
            minBalance: +req.query?.minBalance || 0
        }
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(400).send({ err: 'Failed to get users' })
    }
}

export async function getAllUsers(req, res) {
    try {
      logger.debug('Getting Posts:', req.query)

      const users = await userService.getAll()
  
      res.json(users)
    } catch (err) {
      logger.error('Failed to get users', err)
      res.status(400).send({ err: 'Failed to get users' })
    }
  }
export async function getUseer(req, res) {
    try {
      logger.debug('Getting User:', req.query)

      const users = await userService.getUser()
  
      res.json(users)
    } catch (err) {
      logger.error('Failed to get users', err)
      res.status(400).send({ err: 'Failed to get users' })
    }
  }

export async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(400).send({ err: 'Failed to delete user' })
    }
}

export async function updateUser(req, res) {
  try {
      const user = req.body;
      const savedUser = await userService.update(user);
      res.send(savedUser);
  } catch (err) {
      logger.error('Failed to update user', err);
      res.status(400).send({ err: 'Failed to update user' });
  }
}


export async function addUser(req, res) {
    const {loggedinUser} = req
    try {
      const user = req.body
      const addedUser = await userService.add(user)
      res.json(addedUser)
    } catch (err) {
      logger.error('Failed to add user', err)
      res.status(400).send({ err: 'Failed to add user' })
    }
  }
