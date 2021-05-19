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

  member.setNickname(' İsim | Yaş')
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
'0': `<a:0x:797156909283016754>`,
'1': `<a:1x:797156909668892682>`,
'2': `<a:2x:797156909689995305>`,
'3': `<a:3x:797157222097616926>`,
'4': `<a:4x:797157222186090534>`,                       
'5': `<a:5x:797157221325996033>`,
'6': `<a:6x:797157223020232744>`,
'7': `<a:7x:797157221486034974>`,
'8': `<a:8x:797157222198411324>`,
'9': `<a:9x:797157222434078730>`}[d];
        })
      }
  const kanal = member.guild.channels.cache.find(r => r.id === "809387096284200980"); //kANALID
  let user = client.users.cache.get(member.id);
    var hggif = [
        "https://i.pinimg.com/originals/2c/43/ac/2c43acd8c41ee853cf9fbb04960e4fa6.gif",
        "https://cdn.discordapp.com/attachments/784443098730201094/830093748457177108/kedi_gif.gif",
        "https://cdn.discordapp.com/attachments/738105499014135909/773981744226762762/181dd8d229025a4c71a2faf4fa77da7b.gif",
        "https://ariuscdn.suleymanbal.com.tr/resim/gif/5.gif"
    ] //Böyle arttırırsın gifleri
    let randomgif = hggif[Math.floor(Math.random() * hggif.length)]
  require("moment-duration-format");
    const kurulus = new Date().getTime() - user.createdAt.getTime();  
 
  var kontrol;
if (kurulus < 1296000000) kontrol = '<a:rainbow:838755853271564358> • Hesap Durumu: Güvenli Değil! <a:hyir:797147979801821204> **'
if (kurulus > 1296000000) kontrol = '<a:rainbow:838755853271564358> • Hesap Durumu: Güvenli! <a:onays:797147979797495879> **'
    moment.locale("tr");
      const registerlog = new Discord.MessageEmbed()
    .setColor("#00ffe3")
    .setThumbnail(user.avatarURL({dynamic: true}))
    .setDescription("**<a:rainbow:838755853271564358> • Sunucuya hoş geldin\n\n<a:rainbow:838755853271564358> •<@" + member + "> seninle Beraber " + üyesayısı + " Kişiye Ulaştık!\n\n<a:rainbow:838755853271564358> • Ses kanalına girerek kayıt olabilirsin. \n\n<a:rainbow:838755853271564358> • Hesabın Açılış Süresi: " + moment(member.user.createdAt).format("`YYYY DD MMMM dddd`") +  "\n\n"  + kontrol + " **\n")
    .setImage(randomgif)
    .setTimestamp() 
    .setFooter('Erdem Çakıroğlu 💙 Registery') 
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