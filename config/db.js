require("dotenv").config()
const mongoose = require("mongoose")
mongoose.connect(process.env.URI_MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })

const {Schema} = mongoose
const UserSchema = new Schema({
    username : String
})

const ExerciseSchema = new Schema({
    id_user : String,
    description: String,
    duration: Number,
    date: {type: Date, require: false}
})

const User = mongoose.model("User", UserSchema)
const Exercise = mongoose.model("Exercise", ExerciseSchema)

exports.UserModel = User
exports.ExerciseModel = Exercise