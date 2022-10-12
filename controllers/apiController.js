const { default: mongoose } = require("mongoose")

const user_db = require("../config/db").UserModel
const exercise_db = require("../config/db").ExerciseModel
class ApiController{

    async users(req, res){
        if (req.method === "POST"){
            var username = req.body["username"]
            var new_user = await user_db.create([{
                username : username,
            }])
            var id = new_user[0]["_id"]
            console.log(new_user)
            return res.json({
                username:username,
                _id : id
            })
        }
        else if (req.method === "GET"){
            var users_list = await user_db.find()
            console.log(users_list)
            return res.json(users_list)
        }
    }

    async excercises(req, res){
        if (req.method==="POST"){
            var id_user = req.params["_id"]
            var description = req.body["description"]
            var duration = parseInt(req.body["duration"])
            var date_input = req.body["date"]

            if (!id_user || !description || !duration){
                return res.json({
                    error: "Missing field"
                })
            }
            try {
                var user = await user_db.findById(id_user)
            } catch (error) {
                return res.json({
                    error:error
                })
            }
            if (!user){
                return res.json({
                    error: "User not exist"
                })
            }
            var username = user["username"]
            if (!date_input){
                var date = new Date()
            }
            else{
                var date = new Date(date_input)
            }
            date = date.toDateString()
            var new_exercise = await exercise_db.create({
                id_user:id_user,
                duration:duration,
                description:description,
                date:date
            })

            console.log(new_exercise)
        
            return res.json({
                username : username,
                description: description,
                duration: duration,
                date: date,
                _id:id_user
            })
        }
        return res.json({
            error:"Not Access"
        })
    }

    async logs(req, res){
        var id_user = req.params["_id"]
        var from = req.query["from"]
        var to = req.query["to"]
        var limit = parseInt(req.query["limit"])

        var user = await user_db.findById(id_user)
        var username = user["username"]

        var log_list = await exercise_db.find({id_user:id_user}).select("description duration date -_id")
        if (from){
            log_list = log_list.filter(function(item){
                return new Date(item["date"]) > new Date(from)
            })
        }
        if (to){
            log_list = log_list.filter(function(item){
                return new Date(item["date"]) < new Date(to)
            })
        }
        if (limit){
            log_list = log_list.slice(0, limit)
        }
        var count = log_list.length

        return res.json({
            _id:id_user,
            username:username,
            count:count,
            log: log_list
        }) 
    }
}

module.exports = new ApiController