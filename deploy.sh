#!/bin/bash
az webapp deployment source config-zip --resource-group $resourcegroupname --name $webappname --src ./WebGoat/DeployToAzure/deploy.zip
az webapp restart --name $webappname --resource-group $resourcegroupname

echo "Deploy complete. Please remember to Rebuild Database in Webgoat.Net"
