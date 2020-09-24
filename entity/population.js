const request = require('request')
const cheerio = require('cheerio')
const jsdom = require('jsdom')
const fs = require('fs')
const path = require('path')

const pageUrl = 'https://zh.wikipedia.org/zh-cn/%E5%90%84%E5%9B%BD%E5%AE%B6%E5%92%8C%E5%9C%B0%E5%8C%BA%E4%BA%BA%E5%8F%A3%E5%88%97%E8%A1%A8'

const pophtml = fs.readFileSync(path.resolve(__dirname, './population.html')).toString()



const parseHTML = function (str) {
    const dom = new jsdom.JSDOM(str)
    const table = dom.window.document.querySelector('#mw-content-text > div.mw-parser-output > table.wikitable')
    const headers = [...table.querySelectorAll('tbody th')]
    const rows = [...table.querySelectorAll('tbody tr')]
    const data = {}

    data.headers = {}   // xxx: {index: 0, key: '', title: ''}
    data.data = []
    data.stat = {
        population_rank: '',
        population_country: '世界'
    }

    headers.forEach((hd, index) => {
        switch(hd.innerHTML) {
            case '排名':
                data.headers['population_rank'] = {
                    index,
                    key: 'population_rank',
                    title: '人口排名',
                    type: 'number'
                }
                break;
            case '国家/地区':
                data.headers['population_country'] = {
                    index,
                    key: 'population_country',
                    title: '国家/地区',
                    type: 'country'
                }
                break
            case '人口':
                data.headers['population_value'] = {
                    index,
                    key: 'population_value',
                    title: '人口',
                    type: 'number'
                }
                break;
            case '统计截至日期':
                data.headers['population_date'] = {
                    index,
                    key: 'population_date',
                    title: '人口统计截止日期',
                    type: 'string'
                }
                break;
            case '占世界比':
                data.headers['population_percentage'] = {
                    index,
                    key: 'population_percentage',
                    title: '人口占世界比',
                    type: 'number'
                }
                break
            case '来源':
                data.headers['population_source'] = {
                    index,
                    key: 'population_source',
                    title: '人口统计来源',
                    type: 'link'
                }
                break
        }
    })

    const parsePercentage = (str) => {
        let num = 0
        if (str.endsWith('%')) {
            num = +str.replace('%', '') / 100
        }
        if (str.endsWith('‰')) {
            num = +str.replace('‰', '') / 1000
        }
        return +num.toFixed(8)
    }


    rows.forEach((row, index) => {
        const tds = row.querySelectorAll('td')

        if (!tds.length) {
            return
        }

        const rank = tds[0].querySelector('i') ? tds[0].querySelector('i').innerHTML : tds[0].innerHTML
        const countryB = tds[1].querySelector('b') || tds[1].querySelector('i')
        const countryLink = countryB.querySelector('a')
        let country
        if (countryLink) {
            country = countryLink.title
        } else {
            country = countryB.innerHTML
        }
        const populationRaw = tds[2].innerHTML
        const population = +populationRaw.replace(/,/g, '')
        const dateRaw = tds[3].innerHTML
        const percentageRaw = tds[4].innerHTML
        const percentage = parsePercentage(percentageRaw)
        const sourceLink = tds[5].querySelector('a')
        const sourceTitle = sourceLink.innerHTML
        const sourceUrl = sourceLink.href

        const d = {
            population_rank: {
                value: rank,
                type: 'number',
            },
            population_country: {
                value: country,
                type: 'country',
            },
            population_value: {
                value: population,
                type: 'number'
            },
            population_date: {
                value: dateRaw,
                type: 'string'
            },
            population_percentage: {
                value: percentage,
                type: 'number'
            },
            population_source: {
                value: {
                    title: sourceTitle,
                    href: sourceUrl
                },
                type: 'link'
            }
        }

        if (country === '世界') {
            data.stat = d
        } else {
            data.data.push(d)
        }

    })

    return data

}

const getStat = function () {
    return parseHTML(pophtml)
}

// getStat()

module.exports.getStat = getStat
