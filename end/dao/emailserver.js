const nodemailer = require("nodemailer");

// 引入qq邮箱授权码
const credentials = require("../config/credentials");

// 创建一个传输方式
let Transport = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 587,
  secure: false,
  auth: {
    user: credentials.qq.user,
    pass: credentials.qq.pass,
  },
});

// 注册发送邮件给用户
exports.emailSignUp = function (email, res) {
  console.log(email);
  let str = "0123456789";
  let code = ""; //存放验证码
  for (let i = 0; i < 5; i++) {
    let index = Math.floor(Math.random() * str.length);
    code += str[index];
  }
  //对code验证码通过ASCII码加密后面随机拼接一个字符串之后 传递给前端
  asc_code = "";
  code.split("").forEach((item, index) => {
    asc_code += code.charCodeAt(index) + ".";
  });
  asc_code += Math.floor(Math.random() * 130);
  console.log(asc_code);

  let options = {
    from: credentials.qq.user,
    to: email,
    subject: "感谢您加入熊仔音乐,一起来听歌吧!",
    html: `<head>
    <base target="_blank" />
    <style type="text/css">::-webkit-scrollbar{ display: none; }</style>
    <style id="cloudAttachStyle" type="text/css">#divNeteaseBigAttach, #divNeteaseBigAttach_bak{display:none;}</style>
    <style id="blockquoteStyle" type="text/css">blockquote{display:none;}</style>
    <style type="text/css">
        body{font-size:14px;font-family:arial,verdana,sans-serif;line-height:1.666;padding:0;margin:0;overflow:auto;white-space:normal;word-wrap:break-word;min-height:100px}
        td, input, button, select, body{font-family:Helvetica, 'Microsoft Yahei', verdana}
        pre {white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;width:95%}
        th,td{font-family:arial,verdana,sans-serif;line-height:1.666}
        img{ border:0}
        header,footer,section,aside,article,nav,hgroup,figure,figcaption{display:block}
        blockquote{margin-right:0px}
    </style>
</head>
<body tabindex="0" role="listitem">
<table width="700" border="0" align="center" cellspacing="0" style="width:700px;">
    <tbody>
    <tr>
        <td>
            <div style="width:700px;margin:0 auto;border-bottom:1px solid #ccc;margin-bottom:30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="700" height="39" style="font:12px Tahoma, Arial, 宋体;">
                    <tbody><tr><td width="210"></td></tr></tbody>
                </table>
            </div>
            <div style="width:680px;padding:0 10px;margin:0 auto;">
                <div style="line-height:1.5;font-size:14px;margin-bottom:25px;color:#4d4d4d;">
                    <strong style="display:block;margin-bottom:15px;">尊敬的用户：<span style="color:#f60;font-size: 16px;"></span>您好！</strong>
                    <strong style="display:block;margin-bottom:15px;">
                        您正在进行<span style="color: red">登录验证</span>操作，请在验证码输入框中输入：<span style="color:#f60;font-size: 24px">${code}</span>，以完成操作。
                    </strong>
                </div>
                <div style="margin-bottom:30px;">
                    <small style="display:block;margin-bottom:20px;font-size:12px;">
                        <p style="color:#747474;">
                            注意：此操作可能会修改您的密码、登录邮箱或绑定手机。如非本人操作，请及时登录并修改密码以保证帐户安全
                            <br>（工作人员不会向你索取此验证码，请勿泄漏！)
                        </p>
                    </small>
                </div>
            </div>
            <div style="width:700px;margin:0 auto;">
                <div style="padding:10px 10px 0;border-top:1px solid #ccc;color:#747474;margin-bottom:20px;line-height:1.3em;font-size:12px;">
                    <p>此为系统邮件，请勿回复<br>
                        请保管好您的邮箱，避免账号被他人盗用
                    </p>
                    <p>熊仔音乐网络科技团队</p>
                </div>
            </div>
        </td>
    </tr>
    </tbody>
</table>
</body>`,
  };
  Transport.sendMail(options, function (err, info) {
    if (err) return console.log(err);
    res.send({ msg: "验证码发送到邮箱,请查收!", info_code: asc_code });
  });
};
