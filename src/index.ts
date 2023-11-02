import {app} from './di';
import {apiMailSend} from './api/mail/send'

app.route('/api/mail/send', apiMailSend)

export default app
