import 'dotenv/config'

import { createApp } from './server.js'

const port = Number(process.env.PORT ?? 8787)
const app = createApp()

app.listen(port, () => {
  console.log(`Fish Scan API listening on http://localhost:${port}`)
})
