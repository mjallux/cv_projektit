import axios from 'axios'

export class Driver {
    constructor(username = null, password = null) {
        this.instance = axios.create({
            baseURL: 'http://localhost:3000/api',
            timeout: 2000,
            headers: { 'Content-Type': 'application/json' }
        })
        if(username && password) {
            this.user = this.authenticate(username, password).then((result) => {
                this.user = result
            })
        } else {
            this.user = {
                admin: false
            }
        }
    }

    fetchPosts() {
        return new Promise((resolve, reject) => {
            this.instance.get('/posts')
                .then((result) => {
                    let data = result.data.posts.sort((x, y) => {
                        x = new Date(x.createdAt).valueOf();
                        y = new Date(x.createdAt).valueOf();
                        return x < y ? 1 : -1;
                    })
                    resolve(data)
                })
                .catch((err) => reject(err))
        })
    }

    createPost(post) {
        return new Promise((resolve, reject) => {
            this.instance.post('/posts', {
                token: this.user.token,
                title: post.title,
                body: post.body,
                publishAt: post.publishAt,
                author: this.user.id
            })
            .then((result) => {
                console.log(result)
                resolve(result)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            })
        })

    }

    updatePost(post) {
        return new Promise((resolve, reject) => {
            post.token = this.user.token
            this.instance.patch(`/posts/${post.slug}`, post)
            .then((result) => {
               console.log(result)
               resolve(result)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            })
        })
    }

    removePost(post) {
        return new Promise((resolve, reject) => {
            this.instance.delete(`/posts/${post.slug}`, { data: { token: this.user.token }})
            .then((result) => {
                console.log(result)
                resolve(result)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            })
        })
    }

    async commentPost(comment, post) {

    }

    authenticate(username, password) {
        return new Promise((resolve, reject) => {
            this.instance.post('/authenticate',{ username: username, password: password })
            .then((auth) => {
                resolve({
                    token: auth.data.token,
                    id: auth.data.id,
                    admin: auth.data.admin
                })
            })
            .catch((err) => {
                reject(err)
            })
        })
        
    }

}