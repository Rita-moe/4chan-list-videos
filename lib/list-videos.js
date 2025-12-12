'use strict'

const parseUrl = require('./parse-url')
const transform = require('./transform')

/**
 * Get video data from a thread
 * @func    listVideos
 * @param   {Array} args      Argument array containing either a thread URL,
 *                            or a board shortname and a thread number
 * @returns {Promise<Object>} Resolves to JSON object with video URLs
 */
function listVideos (...args) {
  let board
  let threadNo
  let protocol

  if (args[1] === undefined) {
    ;({ board, threadNo, protocol } = parseUrl(args[0]))
  } else {
    [board, threadNo] = args
    args[2] = args[2] || {}
    protocol = args[2].https ? 'https' : 'http'
  }

  const apiUrl = `${protocol}://a.4cdn.org/${board}/thread/${threadNo}.json`

  return fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => transform(data, protocol, board))
}

module.exports = listVideos
