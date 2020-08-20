# WebGoat.Net: A deliberately insecure .NET Framework web application

Based on https://github.com/jerryhoff/WebGoat.NET with changes made to run this as an Azure App Service with the 'MySql in App' database.

**Warning**: The computer running this application will be vulnerable to attacks, please take appropriate precautions.

# Running in Azure (Azure Container Instance):

## Pre-Requisites

1. Place a `contrast_security.yaml` file into the application's root folder.
1. Install Terraform from here: https://www.terraform.io/downloads.html.
1. Install PyYAML using `pip install PyYAML`.
1. Install the Azure cli tools using `brew update && brew install azure-cli`.
1. Log into Azure to make sure you cache your credentials using `az login`.
1. Edit the [variables.tf](variables.tf) file (or add a terraform.tfvars) to add your initials, preferred Azure location, app name, server name and environment.
1. Run `terraform init` to download the required plugins.
1. Run `terraform plan` and check the output for errors.
1. Run `terraform apply` to build the infrastructure that you need in Azure, this will output the web address for the application. If you receive a HTTP 503 error when visiting the app then wait 30 seconds for the application to initialize.
1. Use the 'Rebuild Database' option from within WebGoat.net, the MySql details will be pre-populated.
1. Run `terraform destroy` when you would like to stop the app service and release the resources.

The terraform file will automatically add the Contrast .NET Azure site extension, so you will always get the latest version.

# Running automated tests

There is a test script which you can use to reveal vulnerabilities which requires node and puppeteer.

1. Install Node, NPM and Chrome.
1. From the app folder run `npm i puppeteer`.
1. Run `BASEURL=https://<your service name>.azurewebsites.net node exercise.js` or `BASEURL=https://<your service name>.azurewebsites.net DEBUG=true node exercise.js` to watch the automated script.

## Deploying a new version

If you change the application you should run the Publish option in Visual Studio which will update the content in WebGoat/DeployToAzure