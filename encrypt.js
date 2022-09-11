const { encrypt, decrypt } = require('./crypto');
const { nullOrUndefined } = require('./utils');

class EncryptionError extends Error { }

function main() {
    if (nullOrUndefined(process.argv[2]) || nullOrUndefined(process.argv[3])) {
        console.error('Expected two command-line arguments. (string to encrypt and password)');
        return;
    } else {
        if (process.argv[3].length != 32) {
            console.error(`Password must be exactly 32 characters! Your password is ${process.argv[3].length} characters long!`);
            return;
        }

        let text = process.argv[2];
        let key = process.argv[3];
        let encrypted = encrypt(text, key);
        let decrypted = decrypt(encrypted, key);
        if (text != decrypted) {
            throw new EncryptionError('Decrypted value and original text do not match!');
        } else {
            console.log(`Successfully encryted data\nStore this carefully ${JSON.stringify(encrypted, null, 4)}`);
            return;
        }
    }
}

main();