'use strict'

const Task = use('App/Models/Task')

class TaskController {
  async index ({ params, response }) {
    try {
      const tasks = await Task.query().where('project_id', params.projects_id).with('user').fetch()
      return tasks
    } catch (e) {
      response.status(e.status).send({ error: 'Server error!' })
    }
  }

  async store ({ request, response, params }) {
    try {
      const data = request.only([
        'user_id',
        'title',
        'description',
        'due_date',
        'file_id'
      ])

      const task = await Task.create({ ...data, project_id: params.projects_id })
      return task
    } catch (e) {
      response.status(e.status).send({ error: 'Server error!' })
    }
  }

  async show ({ params, response }) {
    try {
      const task = await Task.findOrFail(params.id)

      return task
    } catch (e) {
      response.status(e.status).send({ error: 'Server error!' })
    }
  }

  async update ({ params, request, response }) {
    try {
      const task = await Task.findOrFail(params.id)
      const data = request.only([
        'user_id',
        'title',
        'description',
        'due_date',
        'file_id'
      ])
      task.merge(data)
      await task.save()
      return task
    } catch (e) {
      response.status(e.status).send({ error: 'Server error!' })
    }
  }

  async destroy ({ params, response }) {
    try {
      const task = await Task.findOrFail(params.id)

      await task.delete()
    } catch (e) {
      response.status(e.status).send({ error: 'Server error!' })
    }
  }
}

module.exports = TaskController
