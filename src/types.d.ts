interface DeployConfig {
  host: string
  username: string
  privateKeyPath: string

  originDir: string
  targetDir: string
  buildScript: string
}
