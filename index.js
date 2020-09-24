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
    }
    // console.log(d)
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

exportPopulationEntity()
