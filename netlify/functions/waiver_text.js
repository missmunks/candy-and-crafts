import { ensureSchema } from './_db_util.js';
export const handler = async () => (await ensureSchema(), { statusCode:200, headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text: `CARAMEL APPLE BAR — BUILD YOUR OWN ADVENTURE
LIABILITY WAIVER AND RELEASE — VERSION 7 (v7)

Read carefully. By signing electronically, you agree to the terms.
(…shortened text — you can edit WAIVER_v7.txt to your exact wording.)
` }) });