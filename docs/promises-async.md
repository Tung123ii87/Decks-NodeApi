#promises
(req, res, next)
db.phuongthuc({}).then((doi so) => {
    return ...
}).catch((err) => next(err))

#async/await
async (req, res, next) =>{
    try {
        await db.phuongthuc({})
    } catch (err) {
        next(err)
    }
}


handle try catch: npm express-promise-router bo phan xu ly loi trong catch 
=> {
    #async/await
    async (req, res, next) =>{
        await db.phuongthuc({})
        return ...
    }
}