module.exports = {
  apps : [{
    name: 'nguyenthotuan.me',
    script: 'src/bin/www',
    instance: 'max',
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
      "NODE_ENV": "production"
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : ['178.128.104.66'],
      ref  : 'origin/master',
      repo : 'git@github.com:ngthotuan/nguyenthotuan.me.git',
      path : '/home/nttuan/',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
