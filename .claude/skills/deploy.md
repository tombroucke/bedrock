---
name: deploy
description: Deploy this website to different environments
---

To deploy the website, we use deployer. The config is found in ./deploy.php. We have some custom commands, thanks to tombroucke/otomaties-deployer.

- We deploy manually. Our ssh key is forwarded to the server, so the server can authenticate with github
- The auth.json file is copied over to the server during deploy, and deleted after deploy.

We have multiple environments:

- staging (dep deploy staging)
- production (dep deploy rollback)
