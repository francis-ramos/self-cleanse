import { Client, TextChannel, NewsChannel, DMChannel } from 'discord.js-selfbot-v13';
import chalk from 'chalk';
import { target } from '../config.json';

export default function (client: Client) {
    let checking = false;

    async function checkChannels() {
        if (checking) return;
        checking = true;

        console.log(chalk.cyan('\n[CHECKER] Starting channel scan...'));

        try {
            const channels = client.channels.cache.filter(channel => {
                const supported =
                    channel.type === 'GUILD_TEXT' ||
                    channel.type === 'GUILD_NEWS' ||
                    channel.type === 'DM';

                return supported &&
                    (target === 'all' || channel.id === target);
            });

            console.log(chalk.cyan(
                `Found ${channels.size} target channel(s).`
            ));

            for (const [channelId, channel] of channels) {
                try {
                    if (
                        !channel.isText() ||
                        !('messages' in channel)
                    ) continue;

                    const name =
                        channel.type === 'DM'
                            ? (channel as DMChannel).recipient?.username || 'Unknown User'
                            : channel.name || 'Unknown Channel';

                    let lastId: string | undefined;
                    let deletedCount = 0;

                    while (true) {
                        const options: { limit: number; before?: string } = {
                            limit: 100
                        };

                        if (lastId) options.before = lastId;

                        const messages = await channel.messages.fetch(options);

                        if (messages.size === 0) break;

                        lastId = messages.last()?.id;

                        for (const message of messages.values()) {
                            if (message.author.id !== client.user?.id) continue;

                            try {
                                await message.delete();
                                deletedCount++;

                                console.log(
                                    `Channel [${chalk.green(name)}] deleted [${chalk.blue(deletedCount)}] bot message`
                                );
                            } catch (error: any) {
                                console.log(
                                    chalk.red(`[DELETE ERROR] ${message.id}: ${error.message}`)
                                );
                            }
                        }

                        if (messages.size < 100) break;
                    }

                    console.log(
                        chalk.bold.bgGreen.white("[MESSAGE]") + " " +
                        chalk.yellow(
                            `Finished [${name}]. Deleted: ${deletedCount}`
                        )
                    );

                } catch (error: any) {
                    console.log(
                        chalk.red(`[ERROR] ${channelId}: ${error.message}`)
                    );
                }
            }

        } catch (error: any) {
            console.log(chalk.red(`[ERROR] ${error.message}`));
        } finally {
            checking = false;
            console.log(chalk.cyan('[CHECKER] Scan completed.'));
        }
    }

    client.on('ready', async () => {
        console.log(chalk.green(
            `${client.user?.tag} message cleaner started!`
        ));

        await checkChannels();

        setInterval(checkChannels, 10 * 60 * 1000);
    });
}