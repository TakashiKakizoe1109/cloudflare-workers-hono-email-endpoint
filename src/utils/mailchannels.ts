import {ContentItem, EmailAddress, Env, MailSendBody, ForApiMailRequest, Personalization} from '../interface';

export const sendTransferMail = async (
  request: ForApiMailRequest,
  env: Env
): Promise<Response> => {
  let toEmailAddresses = [
    {
      email: request.personalizations[0].to[0].email,
    }
  ];
  const fromEmailAddress: EmailAddress = {
    email: env.MC_FROM_EMAIL,
    name: env.MC_FROM_NAME
  };
  const personalization: Personalization = {
    to: toEmailAddresses,
    from: fromEmailAddress,
    dkim_domain: env.MC_DKIM_DOMAIN,
    dkim_selector: env.MC_DKIM_SELECTOR,
    dkim_private_key: env.DKIM_PRIVATE_KEY
  };
  const content: ContentItem = {
    type: request.content[0].type,
    value: request.content[0].value
  };
  const payload: MailSendBody = {
    personalizations: [personalization],
    from: fromEmailAddress,
    subject: request.subject,
    content: [content]
  };
  const response = await fetch(env.API_END_POINT_MAILCHANNELS, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  console.log('mailchannels:', response.status, response.statusText, await response.text());
  return response;
};
