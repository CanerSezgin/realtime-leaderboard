import uniqueNameGenerator from "./uniqueNameGenerator"

export const createUser = () => {
    const userId = uniqueNameGenerator();
    return { userId, score: 0 }
}

export const createScore = () => {
    return Math.floor(Math.random() * 100)
}

export const createUserWithScore = () => {
    const user = createUser();
    user.score = createScore();
    return user;
}

export const createUsersWithScore = (noOfUsers: number) => {
    const users = []
    for (let i = 0; i < noOfUsers; i++) {
        users.push(createUserWithScore())
    }
    return users;
}

