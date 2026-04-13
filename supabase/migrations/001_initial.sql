-- Enable pgvector for AI features (Plan 2)
create extension if not exists vector;

-- Profiles (one per auth user)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  plan_tier text not null default 'free'
    check (plan_tier in ('free', 'personal', 'pro', 'business')),
  storage_used_bytes bigint not null default 0,
  ai_calls_used_this_month int not null default 0,
  created_at timestamptz not null default now()
);

-- Folders
create table folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  parent_folder_id uuid references folders(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Files
create table files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  folder_id uuid references folders(id) on delete set null,
  name text not null,
  size_bytes bigint not null,
  mime_type text not null,
  wasabi_key text not null unique,
  ai_tags text[] not null default '{}',
  embedding vector(1536),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  last_accessed_at timestamptz
);

-- Indexes
create index files_user_id_idx on files(user_id);
create index files_folder_id_idx on files(folder_id);
create index files_deleted_at_idx on files(deleted_at);

-- RLS
alter table profiles enable row level security;
alter table folders enable row level security;
alter table files enable row level security;

create policy "users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "users can manage own folders"
  on folders for all using (auth.uid() = user_id);

create policy "users can manage own files"
  on files for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Keep storage_used_bytes in sync
create or replace function update_storage_used()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' then
    update profiles set storage_used_bytes = storage_used_bytes + new.size_bytes
    where id = new.user_id;
  elsif TG_OP = 'DELETE' then
    update profiles set storage_used_bytes = storage_used_bytes - old.size_bytes
    where id = old.user_id;
  end if;
  return null;
end;
$$;

create trigger on_file_inserted
  after insert on files
  for each row execute procedure update_storage_used();

create trigger on_file_deleted
  after delete on files
  for each row execute procedure update_storage_used();
