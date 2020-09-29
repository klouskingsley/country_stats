const populationEntity = require('./entity/population');
const avgGdpEntity = require('./entity/avggdp')
const fullGdpEntity = require('./entity/fullgdp')
const languageEntity = require('./entity/language')

const path = require('path')
const fs = require('fs');
const xlsx = require('xlsx');

const renderValue = (d, pipe = _ => _) => {
    switch (d.type) {
        case 'number':
        case 'string':
            return pipe(d.value)
        case 'country':
            return pipe(d.value)
        case 'link':
            return pipe(d.value.title)
        case 'string-array':
            return pipe(d.value.join())
    }
    return d.value.toString()
}


const exportPopulationEntity = () => {
    const data = populationEntity.getStat()
    const ws_data = []
    const headerKeyList = Object.keys(data.headers)
    ws_data.push(headerKeyList.map(key => data.headers[key]['title']))

    data.data.forEach(d => {
        ws_data.push(
            headerKeyList.map(key => {
                if (key === 'population_value') {
                    return renderValue(d[key], value => value / 1000000)
                }
                if (key === 'population_percentage') {
                    return renderValue(d[key])
                }
                return renderValue(d[key])
            })
        )
    })

    const ws = xlsx.utils.aoa_to_sheet(ws_data)
    const csvData = xlsx.utils.sheet_to_csv(ws)
    fs.writeFileSync(path.resolve(__dirname, 'population.csv'), csvData)
}

const exportLanguageEntity = () => {
    const data = languageEntity.getStat()
    const ws_data = []
    const headerKeyList = Object.keys(data.headers)
    ws_data.push(headerKeyList.map(key => data.headers[key]['title']))

    data.data.forEach(d => {
        ws_data.push(
            headerKeyList.map(key => {
                return renderValue(d[key])
            })
        )
    })
    const ws = xlsx.utils.aoa_to_sheet(ws_data)
    const csvData = xlsx.utils.sheet_to_csv(ws)
    fs.writeFileSync(path.resolve(__dirname, 'language.csv'), csvData)
}

const exportAvgGdpEntity = () => {
    const data = avgGdpEntity.getStat()
    const ws_data = []
    const headerKeyList = Object.keys(data.headers)
    ws_data.push(headerKeyList.map(key => data.headers[key]['title']))

    data.data.forEach(d => {
        ws_data.push(
            headerKeyList.map(key => {
                return renderValue(d[key])
            })
        )
    })
    const ws = xlsx.utils.aoa_to_sheet(ws_data)
    const csvData = xlsx.utils.sheet_to_csv(ws)
    fs.writeFileSync(path.resolve(__dirname, 'avggdp.csv'), csvData)
}

const exportFullGdpEntity = () => {
    const data = fullGdpEntity.getStat()
    const ws_data = []
    const headerKeyList = Object.keys(data.headers)
    ws_data.push(headerKeyList.map(key => data.headers[key]['title']))

    data.data.forEach(d => {
        ws_data.push(
            headerKeyList.map(key => {
                return renderValue(d[key])
            })
        )
    })
    const ws = xlsx.utils.aoa_to_sheet(ws_data)
    const csvData = xlsx.utils.sheet_to_csv(ws)
    fs.writeFileSync(path.resolve(__dirname, 'fullgdp.csv'), csvData)
}

const exportAll = () => {
    const avggdpData = avgGdpEntity.getStat()
    const fullgdpData = fullGdpEntity.getStat()
    const languageData = languageEntity.getStat()
    const populationData = populationEntity.getStat()

    const countryList = new Set([
        ...avggdpData.countryList, 
        ...fullgdpData.countryList, 
        ...languageData.countryList, 
        ...populationData.countryList])

    console.log(countryList)
    const headerKeyList = [
        ...Object.keys(avggdpData.headers), 
        ...Object.keys(fullgdpData.headers), 
        ...Object.keys(languageData.headers), 
        ...Object.keys(populationData.headers), 
    ].filter(h => {
        return h.indexOf('country') < 0
    })
    const headers = {
        ...avggdpData.headers,
        ...fullgdpData.headers,
        ...languageData.headers,
        ...populationData.headers,
    }

    const ws_data = []

    const wsDataHeader = [
        '国家',
        ...headerKeyList.map(key => headers[key]['title'])
    ]
    ws_data.push(wsDataHeader)

    const getCellData = (country, key) => {

        const avg = avggdpData.countryMapData[country]
        const full = fullgdpData.countryMapData[country]
        const lang = languageData.countryMapData[country]
        const popu = populationData.countryMapData[country]


        if (avg && avg[key] !== undefined) {
            return renderValue(avg[key])
        }
        if (full && full[key] !== undefined) {
            return renderValue(full[key])
        }
        if (lang && lang[key] !== undefined) {
            return renderValue(lang[key])
        }
        if (popu && popu[key] !== undefined) {
            return renderValue(popu[key])
        } 
        return '空'
    }

    countryList.forEach(country => {
        ws_data.push(
            [
                country,
                ...headerKeyList.map(key => getCellData(country, key))
            ]
        )
    })

    const ws = xlsx.utils.aoa_to_sheet(ws_data)
    const csvData = xlsx.utils.sheet_to_csv(ws)
    fs.writeFileSync(path.resolve(__dirname, 'full.csv'), csvData)
}

exportAll()

// exportLanguageEntity()
// exportPopulationEntity()
// exportFullGdpEntity()
// exportAvgGdpEntity()
