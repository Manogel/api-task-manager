'use strict'
const Mail = use('Mail')
const Helpers = use('Helpers')

const TaskHook = exports = module.exports = {}

TaskHook.sendNewTaskMail = async (taskInstance) => {
  try {
    if (!taskInstance.user_id && !taskInstance.dirty.user_id) return

    const { email, username } = await taskInstance.user().fetch()
    const file = await taskInstance.file().fetch()
    const { title } = taskInstance
    await Mail.send(
      ['emails.new_task'],
      { username, title, hasAttachment: !!file },
      message => {
        message.to(email).from('manoelgomes53@gmail.com', 'Manoel').subject('Nova tarefa para você')

        if (file) {
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
            filename: file.name
          })
        }
      }
    )
  } catch (e) {
    console.log(e)
  }
}
