const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const body_parser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(body_parser.json());
// moongoose connection
const uri =
  "mongodb+srv://ibk:iqube@cluster0.6ewfr.mongodb.net/UsersBday?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Db connected"))
  .catch((err) => console.log(err));

// cronjob setup
let CronJob = require("cron").CronJob;
let job = new CronJob(
  "1 * * * * *",
  async () => {
    await bday_checker();
  },
  null,
  true,
  "Asia/Kolkata"
);


// a function to get today in required format dd-mm-yyyy
const get_today = () => {
  const today = new Date();
  const current_day = today.getDate();
  const current_month = today.getMonth() + 1;
  console.log(current_day, current_month, " is the current day and month");
  return [current_day, current_month];
};

// a function to check whether today is birthday for someone and greet them via mail
const indiv_bday_checker = (user, current_day, current_month) => {
  let [year, month, day] = user.dob.split("-");

  if (parseInt(month) == current_month && parseInt(day) == current_day) {
    send_email_to_user(user.name, user.email);
  }
};

// to get the users from mongodb and send mail to all users who have bday on that day (today)
const bday_checker = async () => {
  const all_users = await User.find();
  const [current_day, current_month] = get_today();

  // Debugging
  // console.log(all_users, " are the users.");

  for (let user of all_users) {
    indiv_bday_checker(user, current_day, current_month);
  }
};

app.get("/", async (req, res) => {
  res.send("hello backend");
});

app.post("/", async (req, res) => {
  try {
    let [name, email, dob] = [req.body.name, req.body.email, req.body.dob];
    const [current_day, current_month] = get_today();

    const user = new User({
      name,
      email,
      dob,
    });
    const saved_user = await user.save();
    if (saved_user) {
      indiv_bday_checker(saved_user, current_day, current_month);

      res
        .status(201)
        .json({ success: true, message: "User Created.", data: saved_user });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
});
const get_user = async () => {};

const send_email_to_user = async (name, email) => {
  const nodemailer = require("nodemailer");
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "kctiqube@gmail.com", // generated ethereal user
      pass: "8870608877", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"iQube-😎" <foo@example.com>', // sender address
    to: `${email}`, // list of receivers
    subject: `HAPPY BIRTHDAY!❤`, // Subject line
    text: "birthday wishes", // plain text body
    html: `Hey ${name}, hope you are doing awesome!. <br/><b>On behalf of the iQube, We wish you a very happy birthday ${name} and send you our best wishes for much happiness in your life </b>`, // html body
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

app.get("/controlCron", (req, res) => {
  if (req.query.start == "true") {
    if (job.running) {
      res.send("job is already running");
      //nothing
    } else {
      job.start();
      res.send("job is started");
    }
  } 
  else if (req.query.stop == "true") {
    job.stop();
    res.send("job stopped");
  }
});
// job.start();


//heroku function
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname,'b-day/build')));

  app.get( "*", (req, res) => {
    res.sendFile(path.join(__dirname + "b-day/build/index.html"));
    });
}

app.listen(PORT, () => {
  console.log("server is listening at the port 5000");
});


