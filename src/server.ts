import express from 'express'

const app = express()

app.get('/ads', (request, response)=>{
  return response.json([
    {id:1 , name: 'Advertising 1'},
    {id:2 , name: 'Advertising 2'},
    {id:3 , name: 'Advertising 3'},
    {id:4 , name: 'Advertising 4'}
  ])
})


app.listen(3333)
