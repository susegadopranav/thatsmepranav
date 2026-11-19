-- Run AFTER supabase_schema.sql, once, in the Supabase SQL Editor.
alter table blog_posts add column if not exists images jsonb not null default '[]';
create index if not exists blog_posts_feed_idx on blog_posts(status, published_at desc);
create index if not exists blog_posts_cat_idx on blog_posts(category);
create or replace function touch_post() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  if new.status='published' and new.published_at is null then new.published_at := now(); end if;
  if new.status='draft' then new.published_at := null; end if;
  return new;
end $$;
drop trigger if exists blog_touch on blog_posts;
create trigger blog_touch before insert or update on blog_posts for each row execute function touch_post();

alter table gallery add column if not exists sort_order int not null default 0;
alter table gallery add column if not exists is_public boolean not null default true;
create index if not exists gallery_cat_idx on gallery(category, sort_order);
drop policy if exists "read gallery" on gallery;
create policy "read public gallery" on gallery for select using(is_public or is_admin());

create unique index if not exists resume_single on resume((true));

create table if not exists site_content(key text primary key, value jsonb not null, updated_at timestamptz default now());
alter table site_content enable row level security;
create policy "read content" on site_content for select using(true);
create policy "admin write content" on site_content for all using(is_admin()) with check(is_admin());

drop policy if exists "anyone sends message" on contact_messages;
create policy "anyone sends message" on contact_messages for insert to anon, authenticated
  with check(char_length(name) between 1 and 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(message) between 1 and 5000);
create or replace function limit_messages() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if (select count(*) from contact_messages where created_at > now()-interval '1 hour') >= 20 then
    raise exception 'Too many messages right now. Please try again later.';
  end if;
  return new;
end $$;
drop trigger if exists msg_limit on contact_messages;
create trigger msg_limit before insert on contact_messages for each row execute function limit_messages();
