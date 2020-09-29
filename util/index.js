
module.exports.countryConvert = (name) => {

    switch (name) {
        case '中华人民共和国':
            return '中国'
        case '中华民国':
            return '台湾'
        case '朝鲜民主主义人民共和国':
            return '朝鲜'
    }
    return name
}


module.exports.isChineseLanguage = (lang) => {
    if (lang.indexOf('汉语') >= 0) {
        return true
    }
    if (lang.indexOf('华语') >= 0) {
        return true
    }
    if (lang.indexOf('普通话') >= 0) {
        return true
    }
    if (lang.indexOf('中文') >= 0) {
        return true
    }

    return false
}

// 殖民
module.exports.isEnglishLanguage = (lang) => {
    if (lang.indexOf('英语') >= 0) {
        return true
    }
    if (lang.indexOf('英文') >= 0) {
        return true
    }
    
    return false
}

// 欧洲
module.exports.isDeutschLanguage = (lang) => {
    if (lang.indexOf('德语') >= 0) {
        return true
    }
    return false
}

// 殖民
module.exports.isFrancaisLanguage = (lang) => {
    if (lang.indexOf('法语') >= 0) {
        return true
    }
    return false
}

// 殖民
module.exports.isEspanolLanguage = (lang) => {
    if (lang.indexOf('西班牙语') >= 0) {
        return true
    }
    return false
}

// 中东
module.exports.isArabLanguage = (lang) => {
    if (lang.indexOf('阿拉伯语') >= 0) {
        return true
    }
    return false
}


// 中亚
module.exports.isUrdLanguage = (lang) => {
    if (lang.indexOf('乌尔都') >= 0) {
        return true
    }
    return false
}

// 东南亚
module.exports.isIndonesiaLanguage = (lang) => {
    if (lang.indexOf('印尼语') >= 0) {
        return true
    }
    return false
}

// 殖民
module.exports.isPortuguesLanguage = (lang) => {
    if (lang.indexOf('葡萄牙语') >= 0) {
        return true
    }
    return false
}