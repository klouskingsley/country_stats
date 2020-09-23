
const jsdom = require('jsdom')
const fs = require('fs')
const path = require('path')

const pageUrl = 'https://zh.wikipedia.org/zh-cn/%E5%90%84%E5%9B%BD%E4%BA%BA%E5%9D%87%E5%9B%BD%E5%86%85%E7%94%9F%E4%BA%A7%E6%80%BB%E5%80%BC%E5%88%97%E8%A1%A8_(%E5%9B%BD%E9%99%85%E6%B1%87%E7%8E%87)'

const pophtml = fs.readFileSync(path.resolve(__dirname, './avggdp.html')).toString()

const parseHTML = function (str) {
    const dom = new jsdom.JSDOM(str)
    const table = dom.window.document.querySelector('#mw-content-text > div.mw-parser-output > table:nth-child(8) > tbody > tr:nth-child(2) > td:nth-child(3) > table')

    const headers = [...table.querySelectorAll('tbody th')]
    const rows = [...table.querySelectorAll('tbody tr')]
    const data = {}

    data.headers = {}   // xxx: {index: 0, key: '', title: ''}
    data.data = []
    data.stat = {}

    headers.forEach((hd, index) => {
        switch(hd.innerHTML) {
            case '排名\n':
                data.headers['avggdp_rank'] = {
                    index,
                    key: 'avggdp_rank',
                    title: '平均GDP排名(联合国)'
                }
                break;
            case '经济体\n':
                data.headers['avggdp_country'] = {
                    index,
                    key: 'avggdp_country',
                    title: '国家/地区'
                }
                break
            case '人均GDP<br>（<a href="/wiki/%E7%BE%8E%E5%85%83" title="美元">现价美元</a>）\n':
                data.headers['avggdp_value'] = {
                    index,
                    key: 'avggdp_value',
                    title: '人均GDP(美元)'
                }
                break;
        }
    })
    rows.forEach((row, index) => {
        const tds = row.querySelectorAll('td')

        if (!tds.length) {
            return
        }

        const rank = tds[0].innerHTML
        const countryLink = tds[1].querySelector('a')
        const country = countryLink.innerHTML
        const avgGdpRaw = tds[2].innerHTML.replace('\n', '')
        const avgGdp = +avgGdpRaw.replace(/,/g, '')

        const d = {
            avggdp_rank: {
                value: rank,
                type: 'number',
            },
            avggdp_country: {
                value: country,
                type: 'country',
            },
            avggdp_value: {
                value: avgGdp,
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
