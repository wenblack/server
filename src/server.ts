import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

//Route to show All Games
app.get('/games', async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }

      }
    }
  })


  return response.json(games)
})

//Route to show Ads Without Discord information
app.post('/ads', (request, response) => {
  return response.status(201).json([])
})

//Route to show ADs by game ID
app.get('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id

  const ads = await prisma.aD.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      hourStart: true,
      hourEnd: true,
      useVoiceChannel: true,
      yearsPlaying: true
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return response.send(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(',')
    }
  }));
})


app.get('/ads/:id/discord', async (request, response) => {
  const adId = request.params.id


  const ads = await prisma.aD.findFirstOrThrow({
    select: {
      discord: true
    },
    where: {
      id: adId
    }
  })

  return response.json({
    discord: ads.discord
  })
})

app.listen(3333)
