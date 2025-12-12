/* global beforeEach, describe, it */

'use strict'

const chai = require('chai')
const nock = require('nock')
const listVideos = require('../')
const payloads = require('./data')

const { expect } = chai

describe('4chan-list-videos gets video URLs from a thread', () => {
  const protocols = ['http', 'https']

  protocols.forEach((protocol) => {
    beforeEach(() => {
      Object.keys(payloads).forEach((name) => {
        protocols.forEach((protocol) => {
          const payload = payloads[name]

          nock(`${protocol}://a.4cdn.org`, { allowUnmocked: true })
            .get(`/${payload.board}/thread/${payload.threadNo}.json`)
            .reply(200, payload.json)
        })
      })
    })

    const config = protocol === 'https'
      ? { https: true }
      : { http: false }

    describe(`Behaviour with ${protocol}`, () => {
      it('returns an empty list when no webms are present', async () => {
        const { board, threadNo } = payloads.empty
        const expected = require(`./expected/${protocol}-empty-thread.json`)
        const result = await listVideos(board, threadNo, config)

        expect(expected.webms.length).to.equal(0)
        expect(result).to.deep.equal(expected)
      })

      it('includes subject data when the thread has a subject', async () => {
        const { board, threadNo } = payloads.subject
        const expected = require(`./expected/${protocol}-subject-thread.json`)
        const result = await listVideos(board, threadNo, config)

        expect(expected.subject).to.not.equal(undefined)
        expect(result).to.deep.equal(expected)
      })

      it('returns an array of objects containing webm data', async () => {
        const { board, threadNo } = payloads.normal
        const expected = require(`./expected/${protocol}-normal-thread.json`)
        const result = await listVideos(board, threadNo, config)

        expect(expected.webms[0]).to.have.all.keys('url', 'filename', 'thumbnail')
        expect(expected.subject).to.equal(undefined)
        expect(result).to.deep.equal(expected)
      })

      it('can handle a url as input', async () => {
        const { board, threadNo } = payloads.normal
        const url = `${protocol}://boards.4chan.org/${board}/thread/${threadNo}`
        const expected = require(`./expected/${protocol}-normal-thread.json`)

        expect(await listVideos(url)).to.deep.equal(expected)
      })
    })
  })

  describe('Behaviour with 4chan API (ie. functional test)', () => {
    it('succeeds with a 200 status code and some sort of payload', async () => {
      const board = 'wsg'
      const data = await fetch(`https://a.4cdn.org/${board}/1.json`).then((r) => r.json())
      const threadNo = data.threads[1].posts[0].no

      const threadData = await listVideos(board, threadNo)

      expect(threadData.webms).to.be.an('array')
    })
  })

  describe('Invalid input', () => {
    it('throws an error if the URL cannot be parsed', async () => {
      try {
        await listVideos('this aint kansas any more ayyylmao')

        expect.fail()
      } catch (err) {
        expect(err).to.be.an('error')
        expect(err.message).to.equal('Invalid 4chan URL!')
      }
    })
  })
})
