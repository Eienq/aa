const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
var Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const database = require("quick.db");
const express = require('express');
require('./util/eventLoader.js')(client);
const path = require('path');
const snekfetch = require('snekfetch');
const ms = require('ms');


var prefix = ayarlar.prefix;


const log = message => {
    console.log(`${message}`);
};

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

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });
client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(process.env.token);

//-----------------------TAG-ROL----------------------\\

client.on("userUpdate", async (user, yeni) => {
  var sunucu = client.guilds.cache.get(ayarlar.sunucuid);
  var uye = sunucu.members.cache.get(yeni.id);
  var tag = ayarlar.tag; 
  var tagrol = ayarlar.tagrol;
  var logKanali = ayarlar.taglog; 

  if (!sunucu.members.cache.has(yeni.id) || yeni.bot || user.username === yeni.username) return;
  
  if ((yeni.username).includes(tag) && !uye.roles.cache.has(tagrol)) {
    try {
      await uye.roles.add(tagrol);
      await client.channels.cache.get(logKanali).send(new Discord.MessageEmbed().setColor('GREEN').setDescription(`${yeni} adlı üye tagımızı alarak aramıza katıldı.`));
    } catch (err) { console.error(err) };
  };
  
  if (!(yeni.username).includes(tag) && uye.roles.cache.has(tagrol)) {
    try {
      await uye.roles.remove(uye.roles.cache.filter(rol => rol.position >= sunucu.roles.cache.get(tagrol).position));
      await client.channels.cache.get(logKanali).send(new Discord.MessageEmbed().setColor('RED').setDescription(`${yeni} adlı üye tagımızı bırakarak aramızdan ayrıldı.`));
    } catch(err) { console.error(err) };
  };
});

//
// Tag aldığında rol verir, tag çıkardığında tag rolünü ve onun üstündeki her rolü alır!
//

//----------------------TAG-KONTROL----------------------\\     

client.on("guildMemberAdd", member => {
  let sunucuid = ayarlar.sunucuid; 
  let tag = ayarlar.tag; 
  let rol = ayarlar.tagrol; 
if(member.user.username.includes(tag)){
member.roles.add(rol)
  const tagalma = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setDescription(`<@${member.id}> taglı olarak girdi!`)
      .setTimestamp()
     client.channels.cache.get(ayarlar.taglog).send(tagalma) 
}
})

/////////////////////////////////////////////////////////////

client.on("ready", async function() {
    client.channels.cache.get(ayarlar.botkanal).join()
    .catch(err => {
    throw err;
    })
    })


////////////////////////////////////////////////////////////// Snipe


client.on("messageDelete", async(message) => {
    if (message.channel.type === "dm" || !message.guild || message.author.bot) return;
  let snipe = {
  mesaj: message.content,
  mesajyazan: message.author.id,
  ytarihi: message.createdTimestamp,
  starihi: Date.now(), 
  kanal: message.channel.id
  }
  await db.set(`snipe.${message.guild.id}`, snipe)
  }); 
  
  


//////////////////////////////////////////////////////////////////////


let yasaktag = ayarlar.yasaktag
let unregister = ayarlar.unregister
 
client.on('guildMemberAdd', member => {
    let yasaklitaglar = db.fetch(`yasaklitaglar_${member.guild.id}`)
    if(!yasaklitaglar) return db.set(`yasaklitaglar_${member.guild.id}`)
    yasaklitaglar.forEach(tag => {
        if(member.user.username.includes(tag)) {
            try {
                db.add(`yasaklitagengel_${member.guild.id}_${tag}`, 1)
                member.send(`${tag} Sunucumuzda ki Yasaklı Taglar Arasındadır Bu Tagı Bırakmadığın Sürece Sunucumuza Erişeyemeceksin.`)
                } catch (e) {
                console.log(e)
            }
            member.roles.cache.forEach(rol => {
                member.roles.remove(rol.id)
              })
              member.roles.add(yasaktag)
        }
    })
})
 
client.on('userUpdate', (oldUser, newUser, message) => {
    let yasaklitaglar = db.fetch(`yasaklitaglar_${message.guild.id}`)
    if(!yasaklitaglar) return db.set(`yasaklitaglar_${message.guild.id}`)
    if(oldUser.username !== newUser.username) {
        let member = client.guilds.cache.get(message.guild.id).members.cache.get(oldUser.id)
        yasaklitaglar.forEach(tag => {
            if(oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
                member.roles.cache.forEach(rol => {
                    member.roles.remove(rol.id)
                  })
                  member.roles.add(unregister)
                try {
                    member.send(`${tag} Tagını Adından Çıkardığın İçin Teşekkür Ederiz Eğer Adında Başka Yasaklı Tag Yoksa Kayıtsız'a Atılacaksın.`)
               } catch (e) {
                   console.log(e)
               }
               return;
           }
           if(!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
               member.roles.cache.forEach(rol => {
                   member.roles.remove(rol.id)
               })
               member.roles.add(yasaktag)
               try {
                   member.send(`${tag} Tagı Sunucumuzun Yasaklı Tagları Arasında Olduğundan Dolayı Sunucumuzun Kanallarına Erişimin Engellendi.`)
               } catch (e) {
                   console.log(e)
               }
               return;
           }
       })
       setTimeout( () => {
       yasaklitaglar.forEach(tag => {
           if(newUser.username.includes(tag)) {
               member.roles.cache.forEach(rol => {
                   member.roles.remove(rol.id)
                 })
                 member.roles.add(yasaktag)
           }
           return;
       })
       }, 1000)
   }
})


////////////////////////////////////////////////////////////////////////////

              
 

//-----------------------HOŞ-GELDİN-MESAJI----------------------\\     

client.on("guildMemberAdd", member => {  
    const register = "** <@&838744201927720971> kayıt olmayı bekleyen birisi var! <@" + member + "> **"
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
  const kanal = member.guild.channels.cache.find(r => r.id === "839975054385086534"); //kANALID
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


