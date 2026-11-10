import { token } from './config.json';
import self from "discord.js-selfbot-v13";

const client = new self.Client({
//   checkUpdate: false,
//   patchVoice: true
});

const methods = ["user", "userDMReaction"];

for (let i of methods)
{
    const r = (await import(`./methods/${i}`)).default;
    r(client);
}

client.login(token);