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
 * Returns whether the file is a video (*.webm and *.mp4)
 * @func    isVideo
 * @param   {String}  file The filename of the file
 * @returns {Boolean}      True if *.webm or *.mp4
 */
function isVideo (file) {
  return file.ext === '.webm' || file.ext === '.mp4'
}

/**
 * Transforms a 4chan thread payload into a JSON with video data
 * @func    transform
 * @param   {Object} raw      Raw thread JSON payload
 * @param   {String} protocol Protocol to use for generating links
 * @param   {String} board    Board shortname, eg. 'b'
 * @returns {Object}          JSON containing thread subject and video data
 */
function transform (raw, protocol, board) {
  const reducer = (acc, file) => acc.concat([{
    filename: file.filename,
    url: videoUrl(protocol, board, file.tim, file.ext),
    thumbnail: thumbUrl(protocol, board, file.tim)
  }])

  const payload = {
    videos: raw.posts.filter(isVideo).reduce(reducer, [])
  }

  if (raw.posts[0].sub) {
    payload.subject = raw.posts[0].sub
  }

  return payload
}

module.exports = transform
