
const jsdom = require('jsdom')
const fs = require('fs')
const path = require('path')

const pageUrl = 'https://zh.wikipedia.org/zh-cn/%E5%90%84%E5%9B%BD%E5%9B%BD%E5%86%85%E7%94%9F%E4%BA%A7%E6%80%BB%E5%80%BC%E5%88%97%E8%A1%A8_(%E5%9B%BD%E9%99%85%E6%B1%87%E7%8E%87)'

const pophtml = fs.readFileSync(path.resolve(__dirname, './fullgdp.html')).toString()

const parseHTML = function (str) {
    const dom = new jsdom.JSDOM(str)
    const table = dom.window.document.querySelector('#mw-content-text > div.mw-parser-output > table.wikitable > tbody > tr:nth-child(2) > td:nth-child(3) > table')
    
    // console.log(table.innerHTML.substr(0, 600));
    // return

    const headers = [...table.querySelectorAll('tbody th')]
    const rows = [...table.querySelectorAll('tbody tr')]
    const data = {}

    data.headers = {}   // xxx: {index: 0, key: '', title: ''}
    data.data = []
    data.stat = {}

    headers.forEach((hd, index) => {
        switch(hd.innerHTML) {
            case '排名':
                data.headers['fullgdp_rank'] = {
                    index,
                    key: 'fullgdp_rank',
                    title: '总GDP排名(联合国)'
                }
                break;
            case '国家/地区':
                data.headers['fullgdp_country'] = {
                    index,
                    key: 'fullgdp_country',
                    title: '国家/地区'
                }
                break
            case 'GDP<br>(百万美元)\n':
                data.headers['fullgdp_value'] = {
                    index,
                    key: 'fullgdp_value',
                    title: '总GDP(百万美元)'
                }
                break;
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

        const rank = tds[0].innerHTML
        // const countryB = tds[1].querySelector('b') || tds[1].querySelector('i')
        const countryLink = tds[1].querySelector('a')
        const country = countryLink.innerHTML
        const fullgdpRaw = tds[2].innerHTML.replace(tds[2].querySelector('span').outerHTML, '').replace('\n', '')
        const fullgdp = +fullgdpRaw.replace(/,/g, '')

        const d = {
            fullgdp_rank: {
                value: rank,
                type: 'number',
            },
            fullgdp_country: {
                value: country,
                type: 'country',
            },
            fullgdp_value: {
                value: fullgdp,
                type: 'number'
            },
        }

        if (country === '世界') {
            data.stat = d
        } else {
            data.data.push(d)
        }

    })

    return data

}

parseHTML(pophtml)


const getStat = function () {
    return parseHTML(pophtml)
}

getStat()

module.exports.getStat = getStat
