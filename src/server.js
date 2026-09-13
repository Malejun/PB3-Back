import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"
import cartRouter from "./routes/cart.routes.js"
import productsRouter from "./routes/products.routes.js"
import wishlistRouter from "./routes/wishlist.routes.js"
import authRouter from "./routes/auth.routes.js"
import invoiceRouter from "./routes/invoice.routes.js"
import { authMiddleware } from "./middlewares/authMiddleware.js"
import { meController } from "./controllers/auth.controller.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: process.env.FRONTEND_URL || "https://hilarious-raindrop-1a1a75.netlify.app",
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.get("/api/me", authMiddleware, meController)
app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)
app.use("/api/wishlist", wishlistRouter)
app.use("/api/invoices", invoiceRouter)

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    ok: false,
    error: error.message || "Internal server error",
  })
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
