Sure, here's a simple PM2 configuration file (`ecosystem.config.js`) for your real estate backend app:

```javascript
module.exports = {
  apps: [
    {
      name: 'real-estate-app',
      script: 'server.js',
      instances: 'max', // Use maximum available CPU cores
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

### Explanation:

- **name**: Name of your application process managed by PM2.
- **script**: Path to the main entry file of your application (e.g., `server.js`).
- **instances**: Number of instances of your application to run. `'max'` uses maximum available CPU cores.
- **autorestart**: Automatically restarts the application if it crashes or encounters an error.
- **watch**: Whether to watch for changes in your application files and restart when changes are detected. Set to `false` for production.
- **max_memory_restart**: Maximum memory usage threshold (in megabytes) at which PM2 automatically restarts the application.
- **env**: Environment variables to be used in all environments.
- **env_production**: Environment variables specific to the production environment.

### Usage:

1. Save the `ecosystem.config.js` file in the root directory of your project.
2. Install PM2 globally if you haven't already:

   ```bash
   npm install -g pm2
   ```

3. Start your application using PM2:

   ```bash
   pm2 start ecosystem.config.js --env production
   ```

4. View running processes:

   ```bash
   pm2 list
   ```

5. Monitor application logs:

   ```bash
   pm2 logs
   ```

This configuration provides a basic setup for managing your real estate backend app with PM2 in a production environment. You can customize it further based on your specific requirements, such as setting up log rotation, defining environment-specific configurations, or integrating with monitoring services like Keymetrics.