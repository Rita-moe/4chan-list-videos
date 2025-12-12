'use strict'

/**
 * Returns a video url
 * @func  videoUrl
 * @param {String} protocol  The protocol used for the URL
 * @param {String} board     Board shortname, eg. 'b'
 * @param {Number} timestamp Unix timestamp of the video
 * @param {String} ext       File extension
 */
function videoUrl (protocol, board, timestamp, ext) {
  return `${protocol}://i.4cdn.org/${board}/${timestamp}${ext}`
}

/**
 * Returns whether the file is a mp4
 * @func    isMp4
 * @param   {String}  file The filename of the file
 * @returns {Boolean}      True if *.mp4
 */
function isMp4 (file) {
  return file.ext === '.mp4'
}

/**
 * Returns a thumbnail url
 * @func  thumbUrl
 * @param {String} protocol  The protocol used for the URL
 * @param {String} board     Board shortname, eg. 'b'
 * @param {Number} timestamp Unix timestamp of the thumbnail
 */
function thumbUrl (protocol, board, timestamp) {
  return `${protocol}://i.4cdn.org/${board}/${timestamp}s.jpg`
}

/**
 * Returns whether the file is a webm
 * @func    isWebm
 * @param   {String}  file The filename of the file
 * @returns {Boolean}      True if *.webm
 */
function isWebm (file) {
  return file.ext === '.webm'
}

/**
 * Transforms a 4chan thread payload into a JSON with webm data
 * @func    transform
 * @param   {Object} raw      Raw thread JSON payload
 * @param   {String} protocol Protocol to use for generating links
 * @param   {String} board    Board shortname, eg. 'b'
 * @returns {Object}          JSON containing thread subject and webm data
 */
function transform (raw, protocol, board) {
  const reducer = (acc, file) => acc.concat([{
    filename: file.filename,
    url: videoUrl(protocol, board, file.tim, file.ext),
    thumbnail: thumbUrl(protocol, board, file.tim)
  }])

  const payload = {
    mp4s: raw.posts.filter(isMp4).reduce(reducer, []),
    webms: raw.posts.filter(isWebm).reduce(reducer, [])
  }

  if (raw.posts[0].sub) {
    payload.subject = raw.posts[0].sub
  }

  return payload
}

module.exports = transform
