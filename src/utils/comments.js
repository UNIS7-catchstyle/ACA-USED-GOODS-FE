const COMMENTS_STORAGE_KEY = "aca-goods-comments";

export function getComments() {
    try {
        const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
        return storedComments ? JSON.parse(storedComments) : [];
    } catch {
        return [];
    }
}

export function addComment(body, imageUrl = "") {
    const comments = getComments();
    const nextComment = {
        id: Date.now(),
        body,
        imageUrl,
        createdAt: new Date().toISOString(),
    };

    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify([...comments, nextComment]));
    return nextComment;
}