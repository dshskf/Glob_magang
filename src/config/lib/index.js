let crypto = require('crypto');

export const encrypt=(text)=>{
  let cipher = crypto.createCipheriv("aes-128-cbc","gcm-e-commerce19", "19gcm-e-commerce");
  let crypted = cipher.update(text, 'utf8', 'binary');
  // let cbase64  = Buffer.from(crypted, 'binary').toString('base64');
  crypted += cipher.final('binary');
  crypted = Buffer.from(crypted, 'binary').toString('base64');
  return crypted;
}

export const decrypt=(crypted)=>{
    crypted = Buffer.from(crypted, 'base64').toString('binary');
    let decipher = crypto.createDecipheriv("aes-128-cbc","gcm-e-commerce19", "19gcm-e-commerce");
    let decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
}