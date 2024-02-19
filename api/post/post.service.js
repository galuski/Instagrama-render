import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

const PAGE_SIZE = 3

async function getAll() {
    try {
        const collection = await dbService.getCollection('post')
        const postCursor = await collection.find({})
        const postsList = await postCursor.toArray()
        return postsList
    //     // Query all posts
    //      collection.find({}, async(err, posts) => {
    //     if (err) { 
    //       console.error('Error fetching posts:', err);
    //     } else {
         
    //       console.log('All posts:', postsList);

    //         return postsList
    //       // Do something with the posts
    //     }
    //     // Close the connecti//on
    //   });
    //     //console.log('postCursor',postCursor)
    //    // return postCursor
    } catch (err) {
        logger.error('cannot find posts', err)
        throw err
    }



 }


async function query(filterBy) {
    try {
        const criteria = {
            vendor: { $regex: filterBy.txt, $options: 'i' }
        }
        const collection = await dbService.getCollection('post')
        var postCursor = await collection.find(criteria)

        if (filterBy.pageIdx !== undefined) {
            postCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
        }

        const posts = postCursor.toArray()
        return posts
    } catch (err) {
        logger.error('cannot find posts', err)
        throw err
    }
}

async function getById(postId) {
    try {
        const collection = await dbService.getCollection('post')
        const post = collection.findOne({ _id: ObjectId(postId) })
        return post
    } catch (err) {
        logger.error(`while finding post ${postId}`, err)
        throw err
    }
}

async function remove(postId) {
    try {
        const collection = await dbService.getCollection('post')
        await collection.deleteOne({ _id: ObjectId(postId) })
        return postId
    } catch (err) {
        logger.error(`cannot remove post ${postId}`, err)
        throw err
    }
}

async function add(post) {
    try {
        const collection = await dbService.getCollection('post');

        // Generate ObjectId for the post
        const postId = new ObjectId();
        post._id = postId; // Assign the generated ObjectId to the post

        await collection.insertOne(post);
        return post;
    } catch (err) {
        logger.error('cannot insert post', err);
        throw err;
    }
}

async function update(post) {
    try {
        const postToSave = {
            comments: post.comments,
            likedBy: post.likedBy,
            updatedPost: post.updatedPost,
        };

        // Convert _id string to ObjectId
        const postId = ObjectId(post._id);

        const collection = await dbService.getCollection('post');
        
        // Update the document with the specified _id
        const result = await collection.updateOne({ _id: postId }, { $set: postToSave });

        // Check if the update was successful
        if (result.modifiedCount === 1) {
            console.log('Post updated successfully:', post);
            return post;
        } else {
            throw new Error(`Failed to update post with ID ${post._id}`);
        }
    } catch (err) {
        logger.error(`cannot update post ${post._id}`, err);
        throw err;
    }
}


async function addPostMsg(postId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('post')
        await collection.updateOne({ _id: ObjectId(postId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add post msg ${postId}`, err)
        throw err
    }
}

// async function removePostMsg(postId, msgId) {
//     try {
//         const collection = await dbService.getCollection('post')
//         await collection.updateOne({ _id: ObjectId(postId) }, { $pull: { msgs: {id: msgId} } })
//         return msgId
//     } catch (err) {
//         logger.error(`cannot add car msg ${postId}`, err)
//         throw err
//     }
// }

export const postService = {
    remove,
    query,
    getById,
    getAll,
    add,
    update,
    addPostMsg,
}
