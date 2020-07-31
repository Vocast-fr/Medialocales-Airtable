require('dotenv').config()

const Airtable = require('airtable')
const xlsParser = require('node-xlsx')
const radiosCats = require('./radiosCats.json')

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

const insertInAirtable = (obj) =>
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
    endIndexPart = sheetDataPart.findIndex((el) => el.length === 0)

    if (endIndexPart < 0) {
      endIndexPart = sheetData.length
    } else {
      endIndexPart = endIndexPart - 1 + startIndexPart
    }

    sheetDataPart = sheetData.slice(startIndexPart, endIndexPart + 1)
  }

  return { sheetDataPart, startIndexPart, endIndexPart }
}

const validValue = (v) => (Number.isNaN(Number(v)) ? 0 : Number(v))

const buildAirtableObj = async (row, type, univers, zone) => {
  let category = ''
  if (row && row[0].length && type === 'Radio') {
    category = radiosCats[row[0]] ? radiosCats[row[0]] : ''
  }

  if (row && row.length === 25 && row[0].length) {
    return {
      Entité: row[0],
      Type: type,
      'Catégorie (radio)': category,
      Univers: univers,
      Zone: zone,
      'AC%17-18': validValue(row[1]),
      'AC%18-19': validValue(row[2]),
      'AC%19-20': validValue(row[3]),
      'AC%EvolN-1': validValue(row[4]),
      'AC%EvolN-1%': validValue(row[4])
        ? validValue(row[4]) / 100 / validValue(row[2])
        : 0,
      'AC#17-18': validValue(row[5]),
      'AC#18-19': validValue(row[6]),
      'AC#19-20': validValue(row[7]),
      'AC#EvolN-1': validValue(row[8]),
      'AC#EvolN-1%': validValue(row[8])
        ? validValue(row[8]) / validValue(row[6])
        : 0,
      'QHM%17-18': validValue(row[9]),
      'QHM%18-19': validValue(row[10]),
      'QHM%19-20': validValue(row[11]),
      'QHM%EvolN-1': validValue(row[12]),
      'QHM%EvolN-1%': validValue(row[12])
        ? validValue(row[12]) / 100 / validValue(row[10])
        : 0,
      'QHM#17-18': validValue(row[13]),
      'QHM#18-19': validValue(row[14]),
      'QHM#19-20': validValue(row[15]),
      'QHM#EvolN-1': validValue(row[16]),
      'QHM#EvolN-1%': validValue(row[16])
        ? validValue(row[16]) / validValue(row[14])
        : 0,
      'PDA%17-18': validValue(row[17]),
      'PDA%18-19': validValue(row[18]),
      'PDA%19-20': validValue(row[19]),
      'PDA%EvolN-1': validValue(row[20]),
      'PDA%EvolN-1%': validValue(row[20])
        ? validValue(row[20]) / 100 / validValue(row[18])
        : 0,
      'DEA17-18': validValue(row[21]),
      'DEA18-19': validValue(row[22]),
      'DEA19-20': validValue(row[23]),
      'DEAEvolN-1': validValue(row[24]),
      'DEAEvolN-1%': validValue(row[24])
        ? validValue(row[24]) / validValue(row[22])
        : 0
    }
  } else if (row && row.length === 19 && row[0].length) {
    return {
      Entité: row[0],
      Type: type,
      'Catégorie (radio)': category,
      Univers: univers,
      Zone: zone,

      'AC%17-18': 0,
      'AC%18-19': validValue(row[1]),
      'AC%19-20': validValue(row[2]),
      'AC%EvolN-1': validValue(row[3]),
      'AC%EvolN-1%': validValue(row[3])
        ? validValue(row[3]) / 100 / validValue(row[1])
        : 0,
      'AC#17-18': 0,
      'AC#18-19': validValue(row[4]),
      'AC#19-20': validValue(row[5]),
      'AC#EvolN-1': validValue(row[6]),
      'AC#EvolN-1%': validValue(row[6])
        ? validValue(row[6]) / validValue(row[4])
        : 0,
      'QHM%17-18': 0,
      'QHM%18-19': validValue(row[7]),
      'QHM%19-20': validValue(row[8]),
      'QHM%EvolN-1': validValue(row[9]),
      'QHM%EvolN-1%': validValue(row[9])
        ? validValue(row[9]) / 100 / validValue(row[7])
        : 0,
      'QHM#17-18': 0,
      'QHM#18-19': validValue(row[10]),
      'QHM#19-20': validValue(row[11]),
      'QHM#EvolN-1': validValue(row[12]),
      'QHM#EvolN-1%': validValue(row[12])
        ? validValue(row[12]) / validValue(row[10])
        : 0,
      'PDA%17-18': 0,
      'PDA%18-19': validValue(row[13]),
      'PDA%19-20': validValue(row[14]),
      'PDA%EvolN-1': validValue(row[15]),
      'PDA%EvolN-1%': validValue(row[15])
        ? validValue(row[15]) / 100 / validValue(row[13])
        : 0,
      'DEA17-18': 0,
      'DEA18-19': validValue(row[16]),
      'DEA19-20': validValue(row[17]),
      'DEAEvolN-1': validValue(row[18]),
      'DEAEvolN-1%': validValue(row[18])
        ? validValue(row[18]) / validValue(row[16])
        : 0
    }
  } else {
    return undefined
  }
}

const processAirtableInsertionsForType = (rows, type, univers, zone) => {
  // console.log(rows.length, type, univers, zone)

  return Promise.all(
    rows.map(async (row) => {
      const airtableObj = await buildAirtableObj(row, type, univers, zone)

      // console.log(airtableObj)

      return insertInAirtable(airtableObj).catch((e) =>
        console.error('Airtable error ', e, row, type, univers, zone)
      )
    })
  )
}

const processOneResultFile = async ({ univers, filePath }) => {
  const sheets = xlsParser.parse(filePath) // parses a file

  // looping through all sheets
  for (let sheetIndex = 0; sheetIndex < sheets.length; sheetIndex++) {
    const { name: sheetName, data: sheetData } = sheets[sheetIndex]

    if (sheetName === 'Effectifs') {
      // console.log('We do not handle "effectifs"')
    } else if (sheetName === 'Seuils') {
      // console.log('We do not handle "seuils"')
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

      const {
        sheetDataPart: sheetDataRegies
        // startIndexPart,
        //  endIndexPart
      } = getPartOfDataSheet(sheetData, endDataRadiosIndex)

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
        console.error('exception caught on process airtable insertion', e)
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

  // console.log(`Univers ${univers} done`)
}

function main() {
  console.log('Parsing medialocales results...')
  Promise.all(results.map(processOneResultFile))
    .then(() => {
      console.log('OK')
    })
    .catch(console.error)
}

main()
