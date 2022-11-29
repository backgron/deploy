#!/usr/bin/env node

import Deploy from "../dist/index.js"

async function main() {
  const deploy = new Deploy()
  await deploy.init()
  await deploy.run()
}

main()
