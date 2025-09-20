import { query, ensureSchema } from './_db_util.js';
export const handler = async (event)=>{try{await ensureSchema();const {code}=JSON.parse(event.body||'{}');if(!code)return{statusCode:400,body:JSON.stringify({ok:false,error:'Missing code'})};
const now=new Date().toISOString();const r=await query(`SELECT * FROM verifications WHERE code=$1 AND used=false AND expires_at>$2 ORDER BY id DESC LIMIT 1`,[code,now]);
if(r.rowCount===0)return{statusCode:400,body:JSON.stringify({ok:false,error:'Invalid or expired code'})};const ver=r.rows[0],p=ver.payload;let attendeeId=p.attendeeId;
if(!attendeeId){const ins=await query(`INSERT INTO attendees(name,email,mobile) VALUES($1,$2,$3) RETURNING id`,[p.fullName,p.email||null,p.mobile||null]);attendeeId=ins.rows[0].id;}
const ip=event.headers['x-nf-client-connection-ip']||event.headers['client-ip']||event.headers['x-forwarded-for']||'';
await query(`INSERT INTO waivers(attendee_id,waiver_version,ip,fingerprint,signature_name) VALUES($1,$2,$3,$4,$5)`,[attendeeId,p.waiver_version,ip,p.fingerprint||null,p.signature||null]);
await query(`INSERT INTO rsvps(attendee_id,status) VALUES($1,'confirmed')`,[attendeeId]);await query(`UPDATE verifications SET used=true WHERE id=$1`,[ver.id]);
return{statusCode:200,body:JSON.stringify({ok:true})};}catch(e){console.error(e);return{statusCode:500,body:JSON.stringify({ok:false,error:e.message})}}};