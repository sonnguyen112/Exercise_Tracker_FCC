const { default: mongoose } = require("mongoose")

const user_db = require("../config/db").UserModel
const exercise_db = require("../config/db").ExerciseModel
class ApiController{

    async users(req, res){
        if (req.method === "POST"){
            var username = req.body["username"]
            var user = await user_db.find({username:username})
            if (user.length===0){ //User not exist
                var new_user = await user_db.create([{
                    username : username,
                }])
                var id = new_user[0]["_id"]
            }
            else{ //user is exist
                var id = user[0]["_id"]
            }
            return res.json({
                username:username,
                _id : id
            })
        }
        else if (req.method === "GET"){
            var users_list = await user_db.find()
            return res.json(users_list)
        }
    }

    async excercises(req, res){
        if (req.method==="POST"){
            var id_user = req.params["_id"]
            var description = req.body["description"]
            var duration = req.body["duration"]
            var date_input = req.body["date"]

            var user = await user_db.findById(id_user)
            var username = user["username"]
            var date = new Date(date_input)
            if (date_input.length === 0){
                date = new Date()
            }
            await exercise_db.create({
                id_user:id_user,
                duration:duration,
                description:description,
                date:date
            })
        
            return res.json({
                _id:id_user,
                username : username,
                date: date.toDateString(),
                duration: parseInt(duration),
                description: description
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
        var limit = req.query["limit"]

        var user = await user_db.findById(id_user)
        var username = user["username"]

        var log_list = await exercise_db.find({id_user:id_user}).limit(limit)
        if (from){
            log_list = log_list.filter(function(item){
                return item["date"] >= new Date(from)
            })
        }
        if (to){
            log_list = log_list.filter(function(item){
                return item["date"] <= new Date(to)
            })
        }
        log_list = log_list.map(function(item){
            return {
                description:item["description"],
                duration:item["duration"],
                date:item["date"].toDateString()
            }
        })
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