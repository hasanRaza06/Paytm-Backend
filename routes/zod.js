const zod=require("zod");

const signUpValidator=zod.object({
    username:zod.string().min(11).max(30).trim().email(),
    password:zod.string().min(6).max(12).trim(),
    firstname:zod.string().min(3).trim(),
    lastname:zod.string().trim()
})

const signInValidator=zod.object({
    username:zod.string().email().trim(),
    password:zod.string().min(6).max(12).trim()
})

// const updateValidator=zod.object({
//     password:zod.string().min(6).max(12).trim(),
//     firstname:zod.string().min(3).trim(),
//     lastname:zod.string().trim()
// })

module.exports={
    signUpValidator,
    signInValidator,
    // updateValidator
}