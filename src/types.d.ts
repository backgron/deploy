interface DeployConfig extends NodeSSHConfig {
  host: string
  username: string
  password:string
  privateKeyPath: string
  originDir: string
  targetDir: string
  buildScript: string
}
