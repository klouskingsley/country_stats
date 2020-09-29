
const jsdom = require('jsdom')
const fs = require('fs')
const path = require('path')
const utils = require('../util/index')

const pageUrl = 'https://zh.wikipedia.org/zh-cn/%E5%90%84%E5%9B%BD%E5%AE%98%E6%96%B9%E8%AF%AD%E8%A8%80%E5%88%97%E8%A1%A8'

const pophtml = fs.readFileSync(path.resolve(__dirname, './language.html')).toString()

const parseTable = function (table) {
    const headers = [...table.querySelectorAll('tbody th')]
    const rows = [...table.querySelectorAll('tbody tr')]
    const data = {}

    data.headers = {}   // xxx: {index: 0, key: '', title: ''}
    data.data = []
    data.stat = {}
    data.countryMapData = {}
    data.countryList = []

    headers.forEach((hd, index) => {
        switch(hd.innerHTML) {
            case '国家／地区\n':
                data.headers['language_country'] = {
                    index,
                    key: 'language_country',
                    title: '国家/地区'
                }
                break;
            case '官方语言\n':
                data.headers['language_official_value'] = {
                    index,
                    key: 'language_official_value',
                    title: '官方语言'
                }
                break
            case '工作语言\n':
                data.headers['language_work_value'] = {
                    index,
                    key: 'language_work_value',
                    title: '工作语言'
                }
                break;
            case '备注\n':
                data.headers['language_remark'] = {
                    index,
                    key: 'language_remark',
                    title: '语言备注'
                }
                break
        }
    })
    rows.forEach((row, index) => {
        const tds = row.querySelectorAll('td')
        if (!tds.length) {
            return
        }

        const countryLink = tds[0].querySelector('a')
        const country = countryLink.innerHTML
        const officialLanguage = [...tds[1].querySelectorAll('a')].map(link => link.innerHTML).filter(text => text.indexOf('<span') < 0)
        const workLanguage = [...tds[2].querySelectorAll('a')].map(link => link.innerHTML).filter(text => text.indexOf('<span') < 0)
        let remark = tds[3].innerText

        const d = {
            language_country: {
                value: utils.countryConvert(country),
                type: 'country',
            },
            language_official_value: {
                value: officialLanguage,
                type: 'string-array',
            },
            language_work_value: {
                value: workLanguage,
                type: 'string-array'
            },
            language_remark: {
                value: remark,
                type: 'string'
            }
        }

        if (country === '世界') {
            data.stat = d
        } else {
            data.data.push(d)
            data.countryMapData[d.language_country.value] = d
            data.countryList.push(d.language_country.value)
        }
    })


    return data
}

const parseHTML = function (str) {
    const dom = new jsdom.JSDOM(str)
    const tableList = [...dom.window.document.querySelectorAll('#mw-content-text .mw-parser-output table.wikitable')]

    const data = {
        headers: {},
        data: [],
        stat: null,
        countryMapData: {},
        countryList: []
    }

    tableList.forEach((table, index) => {
        const d = parseTable(table)
        if (index === 0) {
            data.headers = d.headers
        }
        data.data = [...data.data, ...d.data]
        data.countryMapData = {...data.countryMapData, ...d.countryMapData}
        data.countryList = [...data.countryList, ...d.countryList]
    })
    data.countryMapData
    return data
}


const getStat = function () {
    return parseHTML(pophtml)
}


module.exports.getStat = getStat
