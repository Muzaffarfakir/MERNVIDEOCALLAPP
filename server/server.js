//////libs declaration 
let express = require("express");
let app = express();
let port = 8080 || process.env.PORT;
let mongoose = require("mongoose");
let http = require("http").createServer(app);
let socketio = require("socket.io");
let io = socketio(http, {
    cors: {
        origin: "*", // Frontend URL
        methods: ["GET", "POST"]
    }
});
let bodyParser = require("body-parser");
let cors = require("cors");
let nodemailer = require("nodemailer");
let otpGenerator = require("otp-generator");
let jwt = require("jsonwebtoken");

////nodemailer auth
let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "fakirmuzaffar771@gmail.com",
        pass: "pqio grou nvrk zhov"
    }
});

//////////socket.io connection 
const peerIds = {}; // Store peerIds with socket IDs for managing calls
io.on("connection", (socket) => {

    // Store peer ID when received from client
    socket.on('peerId', (peerId) => {
        peerIds[socket.id] = peerId;

        // Emit the peerId to other connected clients (you can filter by friends)
        socket.broadcast.emit('peerId', { peerId, id: socket.id });
    });

    // Handling incoming call requests
    socket.on("reqCall", ({ callerId, name, calleeId }) => {
        socket.broadcast.emit("recivecall", { calleeId, callerId, name });
    });

    // Clean up when socket disconnects
    socket.on("disconnect", () => {
        delete peerIds[socket.id]; // Remove peer ID on disconnect
    });
});

/////otp generator
let o = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

/////////connect mongoose 
let url = "mongodb+srv://fakirmuzaffar771:Muzaffar@cluster0.nrcw3vg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(url)
    .then(() => console.log("Connected successfully"))
    .catch((error) => console.log(error));

///Schema for mongoose 
let mongooseSchema = new mongoose.Schema({
    username: String,
    email: String,
    pass: String,
    des: String,
    friends: [String],
});

let collectionDb = mongoose.model("mongoseSchemaDb", mongooseSchema);

////////middlewares declaration 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

/////////routes declaration 
/// OTP route
let otpStore = {};
app.post("/otp", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    otpStore[req.body.email] = {
        otp: o,
        time: Date.now() + 600000, // 10 minutes validity
    };

    let mailOptions = {
        from: "fakirmuzaffar771@gmail.com",
        to: req.body.email,
        subject: "OTP Verification Code",
        text: `Otp Verification 
        For your security, we've sent a One-Time Password (OTP) to your registered mobile number/email. Please enter the 6-digit OTP below to verify your identity and proceed.
${o}
Didn't receive the OTP? You can request it again in 30 seconds.
Note: The OTP is valid for 60 seconds
        
        .`,
    };

    transport.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to send OTP.");
        } else {
            res.send("sendOtp");
        }
    });
});

/// Signup route
app.post("/verify", (req, res) => {
    if (otpStrore.hasOwnProperty(req.body.email)) {
        let storedOtp = otpStrore[req.body.email].otp;
        let storedtime = otpStrore[req.body.email].time;
        if (storedOtp == req.body.otp) {
            res.send("verify");
        }
        else {
            res.send("invalid");
        }
    }
})
app.post("/sign", async (req, res) => {
    let signDataAuth = await collectionDb.findOne({ email: req.body.email });
    if (!signDataAuth) {
        let data = new collectionDb({
            username: req.body.name,
            email: req.body.email,
            pass: req.body.pass,
            des: req.body.des
        });
        data.save();
        res.send("e");
    } else {
        res.send("exist");
    }
    console.log(signDataAuth);
});

/// Login route
app.post("/login", async (req, res) => {
    let logData = await collectionDb.findOne({ email: req.body.email, pass: req.body.pass });
    if (logData) {
        let token = jwt.sign({ data: logData }, "MUJUUUUUUU", { expiresIn: "24h" });
        res.json({ mess: "valid", token: token, data: logData });
    } else {
        res.json({ mess: "invalid" });
    }
});

// Friend list retrieval
app.get("/dost", async (req, res) => {
    try {
        let data = await collectionDb.find();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching friends.");
    }
});

// Add friend
app.post("/addFriend", async (req, res) => {
    try {
        let updatedData = await collectionDb.findOneAndUpdate(
            { email: req.body.email },
            { $addToSet: { friends: req.body.name } },
            { new: true }
        );
        res.send(updatedData.friends);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding friend.");
    }
});

// Remove friend
app.post("/removeFriend", async (req, res) => {
    try {
        let updatedData = await collectionDb.findOneAndUpdate(
            { email: req.body.email },
            { $pull: { friends: req.body.name } },
            { new: true }
        );
        res.send(updatedData.friends);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error removing friend.");
    }
});

http.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
