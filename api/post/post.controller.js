import {postService} from './post.service.js'
import {logger} from '../../services/logger.service.js'

export async function getPosts(req, res) {
  try {
    logger.debug('Getting Posts:', req.query)
    // const filterBy = {}
    //   txt: req.query.txt || '',
    //   // pageIdx: req.query.pageIdx
    // }
    //const sortBy= {txt: ''}
    //const posts = await postService.query(sortBy)
    const posts = await postService.getAll()

    res.json(posts)
  } catch (err) {
    logger.error('Failed to get posts', err)
    res.status(400).send({ err: 'Failed to get posts' })
  }
}

export async function getPostById(req, res) {
  try {
    const postId = req.params.id
    const post = await postService.getById(postId)
    res.json(post)
  } catch (err) {
    logger.error('Failed to get post', err)
    res.status(400).send({ err: 'Failed to get post' })
  }
}

export async function addPost(req, res) {
  const {loggedinUser} = req
  try {
    const post = req.body
    const addedPost = await postService.add(post)
    res.json(addedPost)
  } catch (err) {
    logger.error('Failed to add post', err)
    res.status(400).send({ err: 'Failed to add post' })
  }
}


export async function updatePost(req, res) {
  try {
    const post = req.body
    const updatedPost = await postService.update(post)
    res.json(updatedPost)
  } catch (err) {
    logger.error('Failed to update post', err)
    res.status(400).send({ err: 'Failed to update post' })

  }
}

export async function removePost(req, res) {
  try {
    const postId = req.params.id
    const removedId = await postService.remove(postId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove post', err)
    res.status(400).send({ err: 'Failed to remove post' })
  }
}

export async function addPostMsg(req, res) {
  const {loggedinUser} = req
  try {
    const postId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await postService.addPostMsg(postId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update post', err)
    res.status(400).send({ err: 'Failed to update post' })

  }
}

// export async function removePostMsg(req, res) {
//   const {loggedinUser} = req
//   try {
//     const postId = req.params.id
//     const {msgId} = req.params

//     const removedId = await postService.removePostMsg(postId, msgId)
//     res.send(removedId)
//   } catch (err) {
//     logger.error('Failed to remove post msg', err)
//     res.status(400).send({ err: 'Failed to remove post msg' })

//   }
// }


