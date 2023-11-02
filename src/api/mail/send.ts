import {app} from '../../di';
import {validator} from 'hono/validator'
import {sendTransferMail} from '../../utils/mailchannels'
import {type ForApiMailRequest} from '../../interface'

const jsonValidator = validator('json', (value: ForApiMailRequest, c) => {
  const personalizations = value['personalizations'];
  const subject = value['subject'];
  const content = value['content'];
  const from = value['from'];

  // Validate personalizations
  if (!Array.isArray(personalizations) || !personalizations.length) {
    return c.text('Invalid personalizations', 400)
  }
  for (let personalization of personalizations) {
    if (!personalization.to || !Array.isArray(personalization.to)) {
      return c.text('Invalid personalizations', 400)
    }
  }

  // Validate subject
  if (!subject || subject.length > 78) {
    return c.text('Invalid subject', 400)
  }

  // Validate content
  if (!Array.isArray(content) || !content.length) {
    return c.text('Invalid content', 400)
  }
  for (let item of content) {
    if (!item.type || !item.value) {
      return c.text('Invalid content', 400)
    }
  }

  // Validate from
  if (!from || !from.email.includes('@')) {
    return c.text('Invalid from', 400)
  }

  return {
    personalizations: personalizations,
    subject: subject,
    content: content,
    from: from,
  }
});

// const apiMailSend = new Hono()
const apiMailSend = app.post(
  "/",
  jsonValidator,
  async (c) => {
    const response = await sendTransferMail(c.req.valid('json'), c.env);
    return c.json({status: response.status, statusText: response.statusText}, response.status);
  }
);

export {apiMailSend};
