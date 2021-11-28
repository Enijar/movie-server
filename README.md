# Movie Server

Browse and stream movie torrents.

### Getting Started

```shell
cp env.example.ts env.ts
npm install
npm start
```

### Production Installation

Install pm2 globally

```shell
npm add -g pm2
```

```shell
cp env.example.ts env.ts
npm install
npm run build
pm2 start --name movie-server build/src/index.js
pm2 start --name torrent-stream-server npm -- run server-stream
```

Add cron job

```shell
crontab -l > cron
echo "* */1 * * * node /var/www/movie-server/build/src/scheduler.js" >> cron
crontab cron
rm cron
```
