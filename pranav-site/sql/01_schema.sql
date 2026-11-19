-- Run in Supabase SQL editor. Untested until run against your project.
create table profiles(id uuid primary key references auth.users on delete cascade,email text,role text not null default 'visitor' check(role in('visitor','admin')),created_at timestamptz default now());
create table blog_posts(id uuid primary key default gen_random_uuid(),title text not null,slug text unique not null,subtitle text,content text,category text,cover_image text,status text not null default 'draft' check(status in('draft','published')),created_at timestamptz default now(),updated_at timestamptz default now(),published_at timestamptz);
create table gallery(id uuid primary key default gen_random_uuid(),title text,description text,image_url text not null,category text,created_at timestamptz default now());
create table resume(id uuid primary key default gen_random_uuid(),file_url text not null,file_name text,updated_at timestamptz default now());
create table contact_messages(id uuid primary key default gen_random_uuid(),name text not null check(char_length(name)<200),email text not null check(char_length(email)<200),subject text check(char_length(subject)<300),message text not null check(char_length(message)<5000),created_at timestamptz default now());
create table calendar_events(id uuid primary key default gen_random_uuid(),title text not null,starts_at timestamptz not null,ends_at timestamptz,notes text,created_at timestamptz default now());

create function is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from profiles where id=auth.uid() and role='admin') $$;
create function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into profiles(id,email) values(new.id,new.email); return new; end $$;
create trigger on_signup after insert on auth.users for each row execute function handle_new_user();

alter table profiles enable row level security;alter table blog_posts enable row level security;alter table gallery enable row level security;alter table resume enable row level security;alter table contact_messages enable row level security;alter table calendar_events enable row level security;
create policy "own profile" on profiles for select using(id=auth.uid());
create policy "read published" on blog_posts for select using(status='published' or is_admin());
create policy "admin write posts" on blog_posts for all using(is_admin()) with check(is_admin());
create policy "read gallery" on gallery for select using(true);
create policy "admin write gallery" on gallery for all using(is_admin()) with check(is_admin());
create policy "read resume" on resume for select using(true);
create policy "admin write resume" on resume for all using(is_admin()) with check(is_admin());
create policy "anyone sends message" on contact_messages for insert with check(true);
create policy "admin reads messages" on contact_messages for select using(is_admin());
create policy "admin deletes messages" on contact_messages for delete using(is_admin());
create policy "read calendar" on calendar_events for select using(true);
create policy "admin write calendar" on calendar_events for all using(is_admin()) with check(is_admin());

-- Public buckets with size and type limits (role is never user-editable: no update policy on profiles)
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
('photos','photos',true,5242880,array['image/jpeg','image/png','image/webp']),
('resume','resume',true,5242880,array['application/pdf']) on conflict do nothing;
create policy "public read files" on storage.objects for select using(bucket_id in('photos','resume'));
create policy "admin upload files" on storage.objects for insert with check(bucket_id in('photos','resume') and is_admin());
create policy "admin update files" on storage.objects for update using(bucket_id in('photos','resume') and is_admin());
create policy "admin delete files" on storage.objects for delete using(bucket_id in('photos','resume') and is_admin());

-- First admin: sign up / create your user in Authentication > Users, then run:
-- update profiles set role='admin' where email='YOUR_EMAIL_HERE';
