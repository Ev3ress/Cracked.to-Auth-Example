var pp = require("child_process");
var color = require("colors");
var req = require("request");
var readline  = require("readline");
var fs = require("fs");

function Say(message)
{
console.log(color.cyan("[") + color.white("~") + color.cyan("] ") + color.white(message));
};

function LoggedIn(key, username, posts, likes, group)
{
group = group.replace("12", "Supreme");
group = group.replace("93", "Infinity");
group = group.replace("11", "Premium");
/////////// Logged In! Change It To Your Menu    
console.clear();
Say(`Hey ${username}`);
console.log();
Say(`Key: ${key}`);
Say(`Posts: ${posts}`);
Say(`Likes: ${likes}`);
Say(`Group: ${group}`)
var f = fs.existsSync("Login.txt")
if(!f)
{
try
{
var filepath = (__dirname, "Login.txt");
var writer = fs.createWriteStream(filepath)
writer.write(key)
}
catch{}
}
};

function Login(hwid, key)
{
try
{
    var content = 
    {
        "a": "auth",
        "k": key,
        "hwid": hwid
    }
req.post("https://cracked.to/auth.php", {form: content, headers: {"Content-Type": "application/x-www-form-urlencoded"}},function(err,res,body)
{
try
{
if(body.includes("\"auth\":true"))
{
var info = JSON.parse(body);
var username = info["username"];
var posts = info["posts"];
var likes = info["likes"];
var group = info["group"];
LoggedIn(key, username, posts, likes, group);
}
else
{
var p = JSON.parse(body)["error"];
if(p == "invalid_hwid")
{
Say("HWID Error!");
var f = fs.existsSync("Login.txt")
if(f)
{
    try
    {
        fs.unlinkSync("Login.txt")
    }
    catch{}
}
return setTimeout(() => {
MainMenu();
}, 3000);
}
else if(p == "invalid key")
{
Say("Invalid Key!");
var f = fs.existsSync("Login.txt")
if(f)
{
    try
    {
        fs.unlinkSync("Login.txt")
    }
    catch{}
}
return setTimeout(() => {
MainMenu();
}, 3000);
}
else{Say(`unexpected Response [${p}]`)}};
}
catch(e)
{
Say("Something Went Wrong..");
Say(e);
}})
}
catch(e)
{
console.log(e);
}
};

function MainMenu()
{
    var f = fs.existsSync("Login.txt")
    if(!f)
    {
    console.clear();
        pp.exec("wmic csproduct get uuid",function(err, data)
        {
        var hwid = data.split("\n")[1];
        var keyread = readline.createInterface({input: process.stdin, output: process.stdout});
        keyread.question("Key: ",(key)=>{
            keyread.close();
            if(key.length == 0) MainMenu();
            else Login(hwid, key)
        })
    })
}
else
{
fs.readFile("Login.txt",function(err, data)
{
    if(data.length == 0)
    {
    try
    {
        fs.unlinkSync("Login.txt")
    }
    catch{}
    MainMenu();
}
else
{
    pp.exec("wmic csproduct get uuid",function(err, data)
    {
    var hwid = data.split("\n")[1];
    Login(hwid, data);
    })
}
});
}  
};
MainMenu();