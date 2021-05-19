const fs = require('fs');
const http = require('http');
const express = require('express');
const moment = require('moment');
const ayarlar = require('./ayarlar.json');
const app = express();

const Discord = require('discord.js');
const client = new Discord.Client();
const log = message => {
  console.log(` ${message}`);
};
require('./util/eventLoader.js')(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};


client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

//oto isim
client.on("guildMemberAdd", async member => {

  member.setNickname('İsim')
 member.roles.add(ayarlar.kayitsizRolu)
 });

 ///bot ses
 client.on("ready", () => {
    let sesegir = ayarlar.botses
    client.channels.cache.get(sesegir).join();
    });  
   
//Hoşgeldin Mesajı

//-----------------------HOŞ-GELDİN-MESAJI----------------------\\     

client.on("guildMemberAdd", member => {  
    const register = "** <@&809389184179240960> kayıt olmayı bekleyen birisi var! <@" + member + "> **"
    var üyesayısı = member.guild.members.cache.size.toString().replace(/ /g, "    ")
    var üs = üyesayısı.match(/([0-9])/g)
    üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase()
    if(üs) {
      üyesayısı = üyesayısı.replace(/([0-9])/g, d => {
        return {
'0': `<a:0_:844641926107496509>`,
'1': `<a:1_:844641937088446514>`,
'2': `<a:2_:844641946098073651>`,
'3': `<a:3_:844641955132342309>`,
'4': `<a:4_:844641966401781810>`,                       
'5': `<a:5_:844641975474585680>`,
'6': `<a:6_:844641984294682655>`,
'7': `<a:7_:844641993417424909>`,
'8': `<a:8_:844642002267930685>`,
'9': `<a:9_:844642010291765270>`}[d];
        })
      }
  const kanal = member.guild.channels.cache.find(r => r.id === "809387096284200980"); //kANALID
  let user = client.users.cache.get(member.id);
    var hggif = [
        "https://cdn.discordapp.com/attachments/832803209009561610/844627779202711562/1471953914_naruto_gif_2.gif",
        "https://cdn.discordapp.com/attachments/832803209009561610/844627777675722763/1489759175_1442530660_large.gif",
        "https://cdn.discordapp.com/attachments/832803209009561610/844627771921268816/tumblr_ns4zu6jco71ub8ogio1_500.gif",
        "https://cdn.discordapp.com/attachments/832803209009561610/844627774672207882/6095715.gif"
    ] //Böyle arttırırsın gifleri
    let randomgif = hggif[Math.floor(Math.random() * hggif.length)]
  require("moment-duration-format");
    const kurulus = new Date().getTime() - user.createdAt.getTime();  
 
  var kontrol;
if (kurulus < 1296000000) kontrol = '<:peperage:833034273639759893> • Hesap Durumu: Güvenli Değil! <a:arp:844646056947744777> **'
if (kurulus > 1296000000) kontrol = '<:yeey:840247077341888512> • Hesap Durumu: Güvenli! <a:mavitik:844648077906018386>'
    moment.locale("tr");
      const registerlog = new Discord.MessageEmbed()
    .setColor("#00ffe3")
    .setThumbnail(user.avatarURL({dynamic: true}))
    .setDescription("**<a:wait:844646078452465666> • Sunucuya hoş geldin\n\n<a:kristal:844646068193198080> <@" + member + "> seninle Beraber " + üyesayısı + " Kişiye Ulaştık!\n\n<a:bekleme:844646089805791272>  Kayıt olmak için yetkilileri beklemen yeterlidir. \n\n<:yeey:840247077341888512> • Hesabın Oluşturulma Tarihi: " + moment(member.user.createdAt).format("`YYYY DD MMMM dddd`") +  "\n\n"  + kontrol + " **\n")
    .setImage(randomgif)
    .setTimestamp() 
    .setFooter('SUBASHI') 
   kanal.send(registerlog)
   kanal.send(register)   
  });



///TAG ALANA ROL///
client.on("userUpdate", async (oldUser, newUser) => {  
  if (oldUser.username !== newUser.username) {
          let tag = ayarlar.tag
          let sunucu = ayarlar.sunucu
          let kanal = ayarlar.tagkanal 
          let rol = ayarlar.tagrol

          

  try {

  if (newUser.username.includes(tag) && !client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.cache.has(rol)) {
  await client.channels.cache.get(kanal).send(new Discord.MessageEmbed().setColor("RED").setDescription(` ${newUser} \`${tag}\` Tagımızı Aldığı İçin <@&${rol}> Rolünü Verdim`));
  await client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.add(rol);  
  }
  if (!newUser.username.includes(tag) && client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.cache.has(rol)) {
  await client.channels.cache.get(kanal).send(new Discord.MessageEmbed().setColor("RED").setDescription(` ${newUser} \`${tag}\` Tagımızı Çıkardığı İçin <@&${rol}> Rolünü Aldım`));
  await client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.remove(rol);
  }  
} catch (e) {
console.log(`Bir hata oluştu! ${e}`)
 }
}  
});


client.login(process.env.token)