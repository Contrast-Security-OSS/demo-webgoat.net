#Terraform `provider` section is required since the `azurerm` provider update to 2.0+
provider "azurerm" {
  features {
  }
}

#Extract the connection from the normal yaml file to pass to the app container
data "external" "yaml" {
  program = [var.python_binary, "${path.module}/parseyaml.py"]
}

#Set up a personal resource group for the SE local to them
resource "azurerm_resource_group" "personal" {
  name     = "Sales-Engineer-${var.initials}"
  location = var.location
}

#Set up an app service plan
resource "azurerm_app_service_plan" "app" {
  name                = "webgoat-net-${var.initials}-app-service-plan"
  location            = azurerm_resource_group.personal.location
  resource_group_name = azurerm_resource_group.personal.name

  sku {
    tier = "Standard"
    size = "S1"
  }
}

#Set up an app service
resource "azurerm_app_service" "app" {
  name                = "webgoat-net-${var.initials}-app-service"
  location            = azurerm_resource_group.personal.location
  resource_group_name = azurerm_resource_group.personal.name
  app_service_plan_id = azurerm_app_service_plan.app.id

  site_config {
    dotnet_framework_version = "v4.0"
    always_on                = true
    local_mysql_enabled      = true
    default_documents        = ["Default.aspx"]
  }

  app_settings = {
    "ASPNETCORE_ENVIRONMENT"                    = "Development"
    "COR_ENABLE_PROFILING"                    = "1"
    "COR_PROFILER"                            = "{EFEB8EE0-6D39-4347-A5FE-4D0C88BC5BC1}"
    "COR_PROFILER_PATH_32"                    = "D:\\home\\SiteExtensions\\Contrast.NET.Azure.SiteExtension\\ContrastAppService\\ContrastProfiler-32.dll"
    "COR_PROFILER_PATH_64"                    = "D:\\home\\SiteExtensions\\Contrast.NET.Azure.SiteExtension\\ContrastAppService\\ContrastProfiler-64.dll"
    "CONTRAST_INSTALL_DIRECTORY"              = "D:\\home\\SiteExtensions\\Contrast.NET.Azure.SiteExtension\\ContrastAppService\\"
    "CONTRAST__API__URL"                      = data.external.yaml.result.url
    "CONTRAST__API__USER_NAME"                = data.external.yaml.result.user_name
    "CONTRAST__API__SERVICE_KEY"              = data.external.yaml.result.service_key
    "CONTRAST__API__API_KEY"                  = data.external.yaml.result.api_key
    "CONTRAST__APPLICATION__NAME"             = var.appname
    "CONTRAST__SERVER__NAME"                  = var.servername
    "CONTRAST__SERVER__ENVIRONMENT"           = var.environment
    "CONTRAST__APPLICATION__SESSION_METADATA" = var.session_metadata
    "CONTRAST__SERVER__TAGS"                  = var.servertags
    "CONTRAST__APPLICATION__TAGS"             = var.apptags
    "CONTRAST__AGENT__LOGGER__LEVEL"          = var.loglevel
    "CONTRAST__AGENT__LOGGER__ROLL_DAILY"     = "true"
    "CONTRAST__AGENT__LOGGER__BACKUPS"         = "30"
  }

  provisioner "local-exec" {
    command     = "az webapp deployment source config-zip --resource-group ${azurerm_resource_group.personal.name} --name ${azurerm_app_service.app.name} --src ./WebGoat/DeployToAzure/deploy.zip"
    working_dir = path.module
  }
}

resource "null_resource" "before" {
  depends_on = [azurerm_app_service.app]
}

resource "null_resource" "delay" {
  provisioner "local-exec" {
    command = "sleep 20"
  }
  triggers = {
    "before" = "${null_resource.before.id}"
  }
}

resource "null_resource" "after" {
  depends_on = [null_resource.delay]
}

resource "azurerm_template_deployment" "extension" {
  name                = "extension"
  resource_group_name = azurerm_app_service.app.resource_group_name
  template_body       = file("${path.module}/siteextensions.json")

  parameters = {
    "siteName"          = azurerm_app_service.app.name
    "extensionName"     = "Contrast.NET.Azure.SiteExtension"   

  }

  deployment_mode     = "Incremental"
  #wait until the app service starts before installing the extension
  depends_on = [null_resource.delay]

  #restart the app service after installing the extension
  provisioner "local-exec" {
    command     = "az webapp restart --name ${azurerm_app_service.app.name} --resource-group ${azurerm_app_service.app.resource_group_name}"      
  }

}

resource "null_resource" "restart" {
  provisioner "local-exec" {
    command     = "az webapp restart --name ${azurerm_app_service.app.name} --resource-group ${azurerm_app_service.app.resource_group_name}"      
  }
  triggers = {
    "before" = "${azurerm_template_deployment.extension.id}"
  }
}
