var express = require("express");
var app=express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/new_domino_db');

var MongoSchema = new mongoose.Schema({
    email:{type: String, required:true,unique:true, minlength:4},
    password:{type:String,required:true,minlength:8},
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    wins:{type:Number,default:0},
    loses:{type:Number,default:0},
    total_points_scored:{type:Number,default:0},
    game_played:{type:Number,default:0},
    hand:{type:Array,default:[]}
    },
    {timestamps:true}
)

mongoose.model("Users",MongoSchema);

var Users = mongoose.model('Users');

var DominoSchema= new mongoose.Schema({
    head:{type:Number},
    tail:{type:Number},
    points:{type:Number}
})

mongoose.model("Dominos",DominoSchema);
var Dominos = mongoose.model('Dominos')




app.use(express.static(__dirname+'/public/dist/public'))

var bodyParser= require("body-parser");



var path =require("path");

app.use(bodyParser.json());


// creating session
const session = require('express-session');
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))




app.get('/api/createDominos',function(req,res){
    // Dominos.create({head:0,tail:0,points:0})
    Dominos.count({},function(err,data){
        //console.log("database count ",data)
        if(data<1){
            //console.log("database is empty creating dominos")
            // var dominos=[]
            for(var i =0 ;i<7;i++){
               Dominos.create({head:i,tail:i,points:i+i})
                for(var j=i+1;j<7;j++){
                    Dominos.create({head:i,tail:j,points:i+j})
                }
            }
            // console.log("created domino, ",dominos)
            // console.log(dominos.length)
            Dominos.find({},function(err,deck){
                if(err){
                    res.json({msg:"error loading dominos"})
                }
                else{

                    res.json({msg:"created deck ",data:deck})
                }
            })



        }
        else{
            //console.log("database is not empty continue to game")
            Dominos.find({},function(err,deck){
                if(err){
                    res.json({msg:"error loading dominos"})
                }
                else{

                    res.json({msg:"deck exist ",data:deck})
                }
            })
        }
    })
})

app.get('/api/isLogged',function(req,res){
    //console.log('got inside isLogged function')
    if(req.session.email){
      //  console.log("logged in user",req.session.name)
        Users.findOne({email:req.session.email},function(err,user){
            if(err){
                res.json({msg:"error finding user in log in session"})
            }
            else{
                // console.log("sending data to home:",user)
                res.json({msg:"user logged in",user:user})
            }
        })
    }
    else{
       // console.log("No user logged in!")
    }
})



app.post('/api/signUp',function(req,res){

    // console.log('trying to signUp in database',req.body)
    Users.create(req.body,function(err,user){
        if(err){
            res.json({msg:"e"})
        }
        else{
            Users.find({},function(err,users){
                if(err){
                    res.json({msg:"error reloading all users"})
                }
                else{
                    req.session.id=user._id;
                    req.session.email=user.email;
                    res.json({msg:"success added user",data:users})

                }
            })
        }
    })
   
})


app.get('/api/logout',function(req,res){
    console.log("loging out")
    req.session.destroy();
    res.json({msg:"logged out session is empty"})
})

app.post('/api/login',function(req,res){
    // console.log('trying to login in database',req.body)
    Users.findOne({email:req.body.email,password:req.body.password},function(err,user){
        if(err){
            res.json({msg:"Error loging user"})

        }
        else{

            if(user){
                console.log("user logging in ",user)
                req.session.id=user._id;
                req.session.email=user.email;
                req.session.name=user.first_name+" "+user.last_name
                res.json({msg:"user logged in",user:user})
                

            }
            else{
                res.json({msg:"e"})
            }
        }
    })
})



// redirect to home
app.all("*",(req,res,)=>{
    res.sendFile(path.resolve('./public/dist/public/index.html'))    
})


app.listen(8000,function(){
    console.log("listining on port 8000")
})