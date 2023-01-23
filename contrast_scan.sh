zip -vrD scan.zip ./WebGoat/DeployToAzure/deploy/
export PATH="/usr/local/opt/node@12/bin:$PATH"
contrast-cli --yaml_path ./contrast-cli.yaml --wait_for_scan --scan scan.zip
