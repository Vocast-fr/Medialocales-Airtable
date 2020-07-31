const superagent = require('superagent')
const cheerio = require('cheerio')
const sleep = require('sleep')

async function getCategoryFromAnnuaireRadio(radioname) {
  const htmlRes = await superagent
    .post('https://annuaireradio.fr')
    .set('Content-Type', 'multipart/form-data')
    .field('radioname', radioname)
    .field('bande', 'radios')
    .field('mode', 'rech')

  const $ = cheerio.load(htmlRes.text)

  let categCSA = null
  try {
    categCSA = $('#categ-csa')[0].children[0].children[0].data || ''
  } catch (e) {
    console.error('error - ', radioname)
  }

  let categoryLabel

  if (categCSA === 'A') categoryLabel = 'Radio privée associative (A)'
  else if (categCSA === 'B') categoryLabel = 'Radio privée locale (B)'
  else if (categCSA === 'C' || categCSA === 'D') {
    categoryLabel = 'Radio privée nationale (C, D)'
  } else if (categCSA === 'E') categoryLabel = 'Radio périphérique (E)'
  else if (categCSA === 'Service public') categoryLabel = 'Service public'
  else if (categCSA === 'Autre') {
    categoryLabel = "Autre (radio d'autoroute, disparue, ...)"
  } else categoryLabel = ''

  return categoryLabel
}

async function main(radionames) {
  const radiosCats = {}

  for (const radioname of radionames) {
    radiosCats[radioname] = await getCategoryFromAnnuaireRadio(radioname)
    sleep.sleep(1)
  }

  console.log(radiosCats)
}
main(Object.keys(require('./radios.json'))).catch(console.error)
