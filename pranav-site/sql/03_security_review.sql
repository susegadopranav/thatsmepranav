-- Run after 01 and 02. Safe to re-run.
-- 1. The contact form was removed: close the public insert path entirely.
drop policy if exists "anyone sends message" on contact_messages;
drop trigger if exists msg_limit on contact_messages;
-- 2. Gallery: new uploads hidden until approved
alter table gallery alter column is_public set default false;
-- 3. Admin-only helper must not be callable to leak role info beyond a boolean (it only returns true/false for the caller)
revoke all on function is_admin() from public; grant execute on function is_admin() to anon, authenticated;
-- 4. Nobody can change roles through the API
revoke update, insert, delete on profiles from anon, authenticated;
-- 5. Sanity checks (run separately, read-only):
-- select tablename, policyname, cmd, roles from pg_policies where schemaname in ('public','storage') order by 1,2;
-- select id, public, file_size_limit, allowed_mime_types from storage.buckets;
