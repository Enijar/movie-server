import { schedule } from "node-cron";
import Job from "../entities/job";
import updateMovies from "../jobs/update-movies";

const jobs = [
  {
    name: "updateMovies",
    fn: updateMovies,
    interval: 3600 * 12, // 12 hours
  },
];

async function run() {
  await Promise.all(
    jobs.map(async ({ name, fn }) => {
      const job = await Job.findOne({ where: { name, processing: false } });
      const lastRun = job.lastRun === null ? -Infinity : +new Date(job.lastRun);
      const shouldRun = lastRun + job.interval <= Date.now();
      if (job && shouldRun) {
        await job.update({ processing: true, lastRun: new Date() });
        console.log(`[scheduler] start ${name}`);
        await fn();
        await job.update({ processing: false });
        console.log(`[scheduler] end ${name}`);
      }
    })
  );
}

export default async function scheduler() {
  await Job.bulkCreate(
    jobs.map((job) => {
      return {
        name: job.name,
        interval: job.interval,
      };
    }),
    {
      ignoreDuplicates: true,
    }
  );
  const processingJobs = await Job.findAll({ where: { processing: true } });
  await Promise.all(
    processingJobs.map((job) => job.update({ processing: false }))
  );
  schedule("* * * * *", run);
}
