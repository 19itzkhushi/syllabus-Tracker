import cron from 'node-cron';

cron.schedule('*/1 * * * *', () => {
  console.log("⏰ Test cron job running every minute...");
});
