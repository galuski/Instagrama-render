import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

export const userService = {
    add,            // Create (Signup)
    getById,        // Read (Profile page)
    update,         // Update (Edit profile)
    remove,         // Delete (remove user)
    query,          // List (of users)
    getByUsername,   // Used for Login
    getAll,
    getUser
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            // Returning fake fresh data
            // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getAll() {
    try {
        const collection = await dbService.getCollection('user')
        const userCursor = await collection.find({})
        const userList = await userCursor.toArray()
        return userList
    }
    catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}
async function getUser(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: ObjectId(userId) })
        return user
    }
    catch (err) {
        logger.error('cannot find user', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user');
        
        const user = await collection.findOne({ _id: ObjectId(userId) });

        delete user.password

        /*
        user.givenReviews = await reviewService.query({ byUserId: ObjectId(user._id) });
        user.givenReviews = user.givenReviews.map(review => {
            delete review.byUser;
            return review;
        });
        */

        console.log('ttttttttt', user);
        return user;
    } catch (err) {
        logger.error(`while finding user by id: ${userId}`, err);
        throw err;
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user by username: ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ _id: ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        // Peek only updatable properties
        const userToSave = {
            _id: ObjectId(user._id), // Needed for the return object
            fullname: user.fullname,
            imgUrl: user.imgUrl // Update imgUrl property
        };

        const collection = await dbService.getCollection('user');
        await collection.updateOne({ _id: userToSave._id }, { $set: { imgUrl: userToSave.imgUrl } }); // Update imgUrl in the database
        return userToSave;
    } catch (err) {
        logger.error(`Cannot update user ${user._id}`, err);
        throw err;
    }
}

async function add(user) {
    try {
        // peek only updatable fields!
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: user.imgUrl
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error('cannot add user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance }
    }
    return criteria
}




