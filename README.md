# TeamRoles

A discord bot to manage teams in any game!

[Invite to your server](https://discord.com/oauth2/authorize?client_id=1018309566334767165&permissions=8&scope=bot%20applications.commands%20messages.read)

## Security

Normally, when working with Discord bots, the bot token is stored in plaintext in a `config.json` file or `.env` file. However, it's easy to forget to add this file to your .gitignore, and it becomes a hassle to copy paste it in every environment you need it. So, I created a solution using AES-256 encryption.

An encrypted version of the token, which is actually a JSON object containing an `iv` and `content` property, is stored in `config.json`. This is then decrypted at runtime using a command-line argument (the first argument is the password / secret key).
