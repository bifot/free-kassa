const xml2js = require('xml2js')
const util = require('util')

xml2js.parseString = util.promisify(xml2js.parseString)

module.exports = async (xml) => {
  const { root: json } = await xml2js.parseString(xml)

  return Object.entries(json)
    .map(([key, value]) => {
      const array = value.map(item => isNaN(item) ? item : +item)

      return array.length > 1 ? array : array[0]
    })
    .reduce((a, b) => ({ ...a, ...b }))
}
