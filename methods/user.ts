export default function (client: any) {
    client.on('ready', async () => {
        console.log(`${client.user.tag} is online!`);
    });
}