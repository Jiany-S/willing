import config from '../../config.ts';

type ResendClient = {
  emails: {
    send: (payload: {
      from: string;
      to: string[];
      subject: string;
      html: string;
    }) => Promise<{ error?: unknown }>;
  };
};

let resendClient: ResendClient | undefined;
const dynamicImport = new Function('modulePath', 'return import(modulePath)') as (modulePath: string) => Promise<unknown>;

const getResendClient = async () => {
  if (resendClient) return resendClient;
  if (!config.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing');
  }

  const resendModule = await dynamicImport('resend') as { Resend: new (apiKey: string) => ResendClient };
  resendClient = new resendModule.Resend(config.RESEND_API_KEY);
  return resendClient;
};

function indentLines(content: string): string {
  return content
    .split('\n')
    .map(line => `    ${line}`)
    .join('\n');
}

export async function sendEmail(opts: {
  to: string[];
  subject: string;
  text: string;
  html?: string;
}) {
  if (config.NODE_ENV === 'production') {
    try {
      const resend = await getResendClient();
      const { error } = await resend.emails.send({
        from: 'Willing <' + config.WILLING_SENDER_EMAIL + '>',
        to: opts.to,
        subject: opts.subject,
        html: opts.html || opts.text,
      });
      if (error) {
        console.error('Couldn\'t send mail:', error);
      }
    } catch (error) {
      console.error('Couldn\'t initialize or send with Resend:', error);
    }
  } else {
    const timestamp = new Date().toISOString();
    const output = [
      '',
      '============================== [DEV] EMAIL =============================',
      `Time: ${timestamp}`,
      `To: ${opts.to}`,
      `Subject: ${opts.subject}`,
      `Text length: ${opts.text.length} chars`,
      `HTML length: ${opts.html ? `${opts.html.length} chars` : 'none'} (preview hidden in dev logs)`,
      '------------------------------------------------------------------------',
      'Text preview:',
      indentLines(opts.text),
      '========================================================================',
      '',
    ].join('\n');

    console.log(output);
  }
}
