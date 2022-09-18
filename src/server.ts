import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { convertHourStringToMinutes } from './utils/convertHourStringToMinutes'
import { convertMinutesToHour } from './utils/convertMinutesToHour'

const app = express()
app.use(express.json())
app.use(cors({}))


const prisma = new PrismaClient({
  log: ['query']
})

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

//Route to show Discord Name by Ad ID
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

//Route to show ADs by game ID Without Discord information
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
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutesToHour(ad.hourStart),
      hourEnd: convertMinutesToHour(ad.hourEnd)
    }
  }));
})

//Route to Create Ads 
app.post('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id
  const body: any = request.body

  const createAd = await prisma.aD.create({
    data: {
      gameId: gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hourStart: convertHourStringToMinutes(body.hourStart),
      hourEnd: convertHourStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,


    }
  })

  return response.status(201).json([createAd])
})

app.listen(3333)
