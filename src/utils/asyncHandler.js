//way 1
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err)=> next(err))
    }
}


export{asyncHandler}

//we are trying to create a wrapper function which we'll be using everwhere further

// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}

//way 2

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch(error) {
//         res.status(error.code || 500 ).json({
//             success: false,
//             message: error.message
//         })
//     }
// }