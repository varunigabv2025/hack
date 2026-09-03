import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import nudgeRouter from './routes/nudge.js'
import demoRouter from './routes/demo.js'
import schemesRouter from './routes/schemes.js'

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') })

const app = express()
const PORT = Number(process.env.PORT) || 5000

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({
    service: 'Resilience Engine — Member 4 (AI Nudge, Schemes & Demo)',
    endpoints: [
      'POST /nudge',
      'POST /nudge/chat',
      'GET /nudge/health',
      'POST /schemes/analyse',
      'GET /schemes/health',
      'GET /demo/profiles',
      'GET /demo/profiles/:id',
      'GET /demo/preview/:id',
    ],
  })
})

app.use('/nudge', nudgeRouter)
app.use('/schemes', schemesRouter)
app.use('/demo', demoRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Server error' })
})

app.listen(PORT, () => {
  console.log(`Member 4 nudge service on http://localhost:${PORT}`)
  console.log(`Gemini: ${process.env.GEMINI_API_KEY ? 'configured' : 'off (fallback only)'}`)
})
