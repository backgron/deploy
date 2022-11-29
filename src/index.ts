import childProcess from "child_process"
import { NodeSSH } from "node-ssh"
import ora from "ora"
import path from "path"

import { getTime, getDeltaT } from "./utils"

class Deploy {
  ssh: NodeSSH
  config: DeployConfig
  configPath: string
  targetDirName: string
  targetBaseName: string

  startTime: Date

  constructor() {
    this.ssh = new NodeSSH()
    this.config = {} as DeployConfig
    this.configPath = path.resolve(process.cwd(), "./deploy.config.js")

    this.startTime = new Date()

    this.targetDirName = ""
    this.targetBaseName = ""
  }

  async init() {
    this.config = await this.getConfig()
    this.targetBaseName = path.basename(this.config.targetDir)
    this.targetDirName = path.dirname(this.config.targetDir)
  }

  getConfigPath = () => {
    console.log(process.argv)
  }

  getConfig = async () => {
    const spinner = ora("正在读取配置文件...").start()
    try {
      const config = (await import("file://" + this.configPath)).default
      spinner.succeed("配置文件读取成功")
      return config
    } catch {
      spinner.fail("deploy配置文件未找到")
      throw Error("无法找到配置文件")
    }
  }

  async run() {
    await this.connectSSH()
    await this.clearOldFile()
    await this.buildProject()
    await this.putFile()

    await this.close()
  }

  connectSSH = async () => {
    const ssh = new NodeSSH()

    let privateKeyPath = this.config.privateKeyPath

    if (privateKeyPath.startsWith("~")) {
      privateKeyPath = privateKeyPath.replace(
        "~",
        process.env.HOME || process.env.USERPROFILE || ""
      )
    }

    const spinner = ora("正在连接服务器...").start()
    await ssh.connect({ ...this.config, privateKeyPath })
    spinner.succeed("服务器连接成功")
    this.ssh = ssh
  }

  clearOldFile = async () => {
    const spinner = ora("正在删除旧资源...").start()
    const res = await this.ssh.execCommand(`rm -rf ${this.targetBaseName}`, {
      cwd: this.targetDirName,
    })

    if (res.code !== 0) {
      throw Error(res.stderr || res.stdout)
    } else {
      spinner.succeed("旧资源删除成功")
    }
  }

  buildProject = () => {
    return new Promise((resolve, reject) => {
      const spinner = ora("正在打包项目...").start()
      childProcess.exec(this.config.buildScript, (err) => {
        if (!err) {
          spinner.succeed("项目打包成功")
          resolve(true)
        } else {
          spinner.succeed("项目打包成功")
          reject()
          throw err
        }
      })
    })
  }

  putFile = async () => {
    const spinner = ora("正在推送新的项目文件...").start()
    await this.ssh.putDirectory(
      path.resolve(this.config.originDir),
      this.config.targetDir
    )
    spinner.succeed("项目文件推送成功")
  }

  close = async () => {
    const endTime = new Date()

    console.log("开始时间：", getTime(this.startTime))
    console.log("结束时间：", getTime(endTime))
    console.log("部署时间：", getDeltaT(this.startTime, endTime))

    this.ssh.dispose()
  }
}

export default Deploy
