'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with files
 */
class FileController {
  async show ({ params, response }) {
    try {
      // const file = await File.findOrFail('file', params.id)
      response.download(Helpers.tmpPath(`uploads/${params.name}`))
      // return file
    } catch (e) {
      response.status(e.status).send({ error: 'File is not exists!' })
    }
  }

  async store ({ request, response }) {
    try {
      if (!request.file('file')) return

      const upload = request.file('file', { size: '2mb' })

      const fileNameHash = `${Date.now()}.${upload.subtype}`

      await upload.move(Helpers.tmpPath('uploads'), { name: fileNameHash })

      if (!upload.moved()) {
        throw upload.error()
      }

      const file = await File.create({
        file: fileNameHash,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      return file
    } catch (e) {
      return response.status(e.status).send({ error: 'Upload error!' })
    }
  }
}

module.exports = FileController
