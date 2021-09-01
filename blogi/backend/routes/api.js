import express from 'express'
import { authenticate, expressAuth } from '../lib/auth.js'
import cors from 'cors'
import Post from '../models/Post.js'
import User from '../models/User.js'

// env variables & mongoose conn
import '../lib/init.js'

const router = express.Router()

router.use(cors())

const logger = (req, res, next) => {
    console.log(req.body.username)
    next()
}

router.use(logger)

// get all posts
router.get('/posts', (req, res) => {
    Post.find({}, {'_id': false, 'createdAt': false, 'updatedAt': false})
    .populate({ path:'author', select: ['username', 'slug']})
    .then((result) => {
        res.status(200).json({
            message: 'success',
            posts: result
        })
    })
    .catch((err) => {
        res.status(400).json({
            message: err._message
        })
    })
})

// create post, auth
router.post('/posts', expressAuth, (req, res) => {
    let post = new Post({
        title: req.body.title,
        body: req.body.body,
        publishAt: req.body.publishAt,
        author: req.body.author,
    })
    post.save()
    .then((result) => {
        console.log("posted:" + result)
        res.status(200).json({
            message: 'successfully posted',
            'post': result
        })
    })
    .catch((err) => {
        res.status(400).json({
            message: err._message
        })
    })
})

// get one post
router.get('/posts/:slug', (req, res) => {
    Post.find({slug: req.params.slug})
    .then((result) => {
        res.status(200).json({
            message: 'success',
            post: result
        })
    })
    .catch((err) => {
        res.status(400).json({
            message: err._message
        })
    })
})

// comment to post
router.post('/posts/:slug', (req, res) => {

})


// edit post, auth
router.patch('/posts/:slug', expressAuth, (req, res) => {
    let update = {}
    let filter = ['publishAt', 'comments', 'title', 'body', 'author']

    for(const field in req.body) {
        if(filter.indexOf(field) !== -1) {
            update[field] = req.body[field]
        }
    }
    Post.findOneAndUpdate({slug: req.params.slug}, update)
    .then((result) => {
        res.status(200).json({
            message: 'Succesfully updated post',
            post: result
        })
    })
    .catch((err) => {
        res.status(400).json({
            message: 'Error updating post',
            error: err.message
        })
    })
})

// delete post, auth
router.delete('/posts/:slug', expressAuth, (req, res) => {
    Post.deleteOne({slug: req.params.slug})
    .then((result) => {
        res.status(200).json({
            message: 'Succesfully removed post',
            post: result
        })
    })
    .catch((err) => {
        res.status(400).json({
            message: 'Error deleting post',
            error: err.message
        })
    })
})

// get user, auth
router.get('/user/:username', (req, res) => {

})

router.post('/user', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    user.save()
    .then((result) => {
        res.status(200).json({
            message: 'Succesfully created user',
            user: result
        })
    })
    .catch((err) => {
        res.status(400).json({
            message: err._message,
            err: err.errors
        })
    })
})

router.post('/authenticate', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})
        const token = await authenticate(user, req.body.password, 60*60)
        res.status(200).json({
            message: 'Succesfully authenticated',
            token: token,
            admin: user.admin,
            id: user.id
        })
    } catch (err) {
        console.log(`${err} for user ${req.body.username}`)
        res.status(400).json({
            message: 'Authentication failed',
        })
    }
})

router.use(function (err, req, res, next) {
    if(err.name === "Authorization") {
        res.sendStatus(401)
    } else {
        console.log(error.stack)
        res.status(500).send('Something broke!')
    }
  })

module.exports = router