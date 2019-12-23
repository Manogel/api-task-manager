'use strict'

const Project = use('App/Models/Project')

class ProjectController {
  async index ({ response }) {
    try {
      const projects = await Project.query().with('user').fetch()
      return projects
    } catch (e) {
      response.status(e.status).send({ error: 'Server error!' })
    }
  }

  async store ({ request, response, auth }) {
    try {
      const { title, description } = request.all()

      const project = await Project.create({ title, description, user_id: auth.user.id })
      return project
    } catch (e) {
      response.status(e.status).send({ error: 'Server error!' })
    }
  }

  async show ({ params, response }) {
    try {
      const project = await Project.findOrFail(params.id)
      await project.load('user')
      await project.load('tasks')
      return project
    } catch (e) {
      response.status(e.status).send({ error: 'Server error!' })
    }
  }

  async update ({ params, request, response }) {
    try {
      const project = await Project.findOrFail(params.id)
      const { title, description } = request.all()

      project.merge({ title, description })
      await project.save()

      return project
    } catch (e) {
      response.status(e.status).send({ error: 'Server error!' })
    }
  }

  /**
   * Delete a project with id.
   * DELETE projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const project = await Project.findOrFail(params.id)
      await project.delete()

      return response.send({ ok: 'Project is deleted!' })
    } catch (e) {
      response.status(e.status).send({ error: 'Server error!' })
    }
  }
}

module.exports = ProjectController
