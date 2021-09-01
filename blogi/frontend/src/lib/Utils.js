import { customAlphabet } from "nanoid";
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const uuid = customAlphabet(alphabet, 8);

export const postSkeleton = () => {
    return {
        title: 'Your title', body: 'Your blog post', publishAt: new Date(), slug: uuid(), author: '', comments: []
    }
}