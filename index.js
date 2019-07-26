require('dotenv').config()

const Airtable = require('airtable')
const xlsParser = require('node-xlsx')

const {
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID,
  AIRTABLE_TABLE_NAME,
  XLS_AGGLOS,
  XLS_DPT,
  XLS_REGIONS
} = process.env

const results = [
  {
    univers: 'Agglos',
    filePath: XLS_AGGLOS
  },
  {
    univers: 'Départements',
    filePath: XLS_DPT
  },
  {
    univers: 'Régions',
    filePath: XLS_REGIONS
  }
]

const airtableBase = new Airtable({ AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID)

const insertInAirtable = obj =>
  new Promise((resolve, reject) => {
    if (obj) {
      airtableBase(AIRTABLE_TABLE_NAME).create(obj, function (err, record) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    } else {
      resolve()
    }
  })

const getPartOfDataSheet = (
  sheetData,
  endIndexOfPrevious,
  doEndSplice = true
) => {
  const startIndexPart = endIndexOfPrevious + 2
  let sheetDataPart = sheetData.slice(startIndexPart)
  let endIndexPart

  if (doEndSplice) {
    endIndexPart =
      sheetDataPart.findIndex(el => el.length === 0) - 1 + startIndexPart
    sheetDataPart = sheetData.slice(startIndexPart, endIndexPart + 1)
  }

  return { sheetDataPart, endIndexPart }
}

const validValue = v => (Number.isNaN(Number(v)) ? 0 : Number(v))

const buildAirtableObj = (row, type, univers, zone) => {
  if (row && row.length === 25 && row[0].length) {
    return {
      Entité: row[0],
      Type: type,
      Univers: univers,
      Zone: zone,
      'AC%16-17': validValue(row[1]) * 100,
      'AC%17-18': validValue(row[2]) * 100,
      'AC%18-19': validValue(row[3]) * 100,
      'AC%EvolN-1': validValue(row[4]),
      'AC#16-17': validValue(row[5]),
      'AC#17-18': validValue(row[6]),
      'AC#18-19': validValue(row[7]),
      'AC#EvolN-1': validValue(row[8]),
      'QHM%16-17': validValue(row[9]) * 100,
      'QHM%17-18': validValue(row[10]) * 100,
      'QHM%18-19': validValue(row[11]) * 100,
      'QHM%EvolN-1': validValue(row[12]),
      'QHM#16-17': validValue(row[13]),
      'QHM#17-18': validValue(row[14]),
      'QHM#18-19': validValue(row[15]),
      'QHM#EvolN-1': validValue(row[16]),
      'PDA%16-17': validValue(row[17]) * 100,
      'PDA%17-18': validValue(row[18]) * 100,
      'PDA%18-19': validValue(row[19]) * 100,
      'PDA%EvolN-1': validValue(row[20]),
      'DEA16-17': validValue(row[21]),
      'DEA17-18': validValue(row[22]),
      'DEA18-19': validValue(row[23]),
      'DEAEvolN-1': validValue(row[24])
    }
  } else if (row && row.length === 19 && row[0].length) {
    return {
      Entité: row[0],
      Type: type,
      Univers: univers,
      Zone: zone,
      'AC%16-17': 0,
      'AC%17-18': validValue(row[1]) * 100,
      'AC%18-19': validValue(row[2]) * 100,
      'AC%EvolN-1': validValue(row[3]),
      'AC#16-17': 0,
      'AC#17-18': validValue(row[4]),
      'AC#18-19': validValue(row[5]),
      'AC#EvolN-1': validValue(row[6]),
      'QHM%16-17': 0,
      'QHM%17-18': validValue(row[7]) * 100,
      'QHM%18-19': validValue(row[8]) * 100,
      'QHM%EvolN-1': validValue(row[9]),
      'QHM#16-17': 0,
      'QHM#17-18': validValue(row[10]),
      'QHM#18-19': validValue(row[11]),
      'QHM#EvolN-1': validValue(row[12]),
      'PDA%16-17': 0,
      'PDA%17-18': validValue(row[13]) * 100,
      'PDA%18-19': validValue(row[14]) * 100,
      'PDA%EvolN-1': validValue(row[15]),
      'DEA16-17': 0,
      'DEA17-18': validValue(row[16]),
      'DEA18-19': validValue(row[17]),
      'DEAEvolN-1': validValue(row[18])
    }
  } else {
    return undefined
  }
}

const processAirtableInsertionsForType = (rows, type, univers, zone) =>
  Promise.all(
    rows.map(row => {
      // if (row.length !== 25 && row.length !== 19) console.log(row.length, type, univers, zone)

      return insertInAirtable(buildAirtableObj(row, type, univers, zone)).catch(
        e => console.error('Airtable error ', e, row, type, univers, zone)
      )
    })
  )

const processOneResultFile = async ({ univers, filePath }) => {
  const sheets = xlsParser.parse(filePath) // parses a file

  // looping through all sheets
  for (let sheetIndex = 0; sheetIndex < sheets.length; sheetIndex++) {
    const { name: sheetName, data: sheetData } = sheets[sheetIndex]

    if (sheetName === 'Effectifs') {
      console.log('We do not handle "effectifs"')
    } else if (sheetName === 'Seuils') {
      console.log('We do not handle "seuils"')
    } else {
      const zone = sheetName
      const totalRadioIndex = sheetData.findIndex(
        ([el]) => el === 'TOTAL RADIO'
      )

      const {
        sheetDataPart: sheetDataTypesRadio,
        endIndexPart: endDataTypeIndex
      } = getPartOfDataSheet(sheetData, totalRadioIndex)
      const {
        sheetDataPart: sheetDataRadios,
        endIndexPart: endDataRadiosIndex
      } = getPartOfDataSheet(sheetData, endDataTypeIndex)
      const { sheetDataPart: sheetDataRegies } = getPartOfDataSheet(
        sheetData,
        endDataRadiosIndex
      )

      try {
        await Promise.all(
          [
            { rows: sheetDataTypesRadio, type: 'Programme' },
            { rows: sheetDataRadios, type: 'Radio' },
            { rows: sheetDataRegies, type: 'Régie' }
          ].map(({ rows, type }) =>
            processAirtableInsertionsForType(rows, type, univers, zone)
          )
        )
      } catch (e) {
        console.log('exception caught on process airtable insertion', e)
      }

      /*
      if (sheetIndex === 0) {
        console.log('Programmes', univers, zone, sheetDataTypesRadio)
        console.log('Radios - ', sheetDataRadios)
        console.log('Regies - ', sheetDataRegies)
      }
      */
    }
  }

  console.log(`Univers ${univers} done`)
}

function main () {
  console.log('Parsing medialocales results...')
  Promise.all(results.map(processOneResultFile))
    .then('finish !')
    .catch(console.error)
}

main()
