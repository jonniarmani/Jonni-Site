/**
 * Service to interact with Gmail API
 */

export interface GmailMessage {
  id: string;
  snippet: string;
  from: string;
  subject: string;
  date: string;
}

export const fetchRecentEmails = async (accessToken: string): Promise<string> => {
  try {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    
    if (!data.messages) return "No recent emails found.";

    const emailDetails = await Promise.all(data.messages.map(async (msg: { id: string }) => {
      const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const detail = await detailRes.json();
      
      const subject = detail.payload.headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
      const from = detail.payload.headers.find((h: any) => h.name === 'From')?.value || 'Unknown';
      
      return `From: ${from}\nSubject: ${subject}\nSnippet: ${detail.snippet}\n---`;
    }));

    return emailDetails.join('\n\n');
  } catch (error) {
    console.error("Gmail Fetch Error:", error);
    return "Error fetching emails. Please ensure you are signed in.";
  }
};

export const sendGmail = async (accessToken: string, to: string, subject: string, body: string) => {
  try {
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');

    const base64Message = btoa(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: base64Message }),
    });

    return response.ok;
  } catch (error) {
    console.error("Gmail Send Error:", error);
    return false;
  }
};
