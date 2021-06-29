var express = require('express');
var router = express.Router();
var moment = require('moment')
const nodemailer = require("nodemailer");

const fs = require('fs');
const carbone = require('carbone');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rafailovicirooms@gmail.com', // generated ethereal user
    pass: 'bg486009', // generated ethereal password
  },
});

/* GET home page. */
router.post('/', async function(req, res, next) {
  let data = req.body


  data.dolazak = moment(data.dolazak).format("DD.MM.YYYY")
  data.odlazak = moment(data.odlazak).format("DD.MM.YYYY")
  data.taksa = data.taksa == 'no'? "Napomena: boravišna taksa nije ukljčuena u cenu i plaća se po dolasku u smeštaj" : "Napomena: boravišna taksa je ukljčuena"
  console.log(data);

  var options = {
    convertTo : 'pdf' //can be docx, txt, ...
  };



  await carbone.render('rafTemplate.odt', data, options, async function(err, result){
    if (err) {
      return console.log(err);
    }
    // write the result
    fs.writeFileSync('result.pdf', result);

    let info = await transporter.sendMail({
      from: '"Rooms Rafailovici 🏖️" <rafailovicirooms@gmail.com>', // sender address
      to: `${data.email}, radomanp@gmail.com`, // list of receivers
      subject: `Rezervacija smeštaja za ${data.dolazak} - ${data.odlazak} ✔`, // Subject line
      text: "Hvala što letujete u našem smestaju! Rooms Rafailovići", // plain text body
      html: "<b>Hvala što letujete u našem smestaju! Rooms Rafailovići</b>", // html body
      attachments: [
        {   // utf-8 string as an attachment
          filename:`Rezervacija ${data.dolazak} ${data.soba}.pdf`,
          path: 'result.pdf'
        },
      ]
    });

    res.sendStatus(200)
  });
});

module.exports = router;
