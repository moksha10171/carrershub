-- Create table for storing contact form submissions
create table if not exists contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  company text,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'new' check (status in ('new', 'read', 'archived'))
);

-- Enable RLS
alter table contact_messages enable row level security;

-- Allow public to insert messages (for the contact form)
create policy "Allow public to insert messages"
  on contact_messages for insert
  with check (true);

-- Allow admins/company owners to view (example policy - adjust based on actual role system)
-- For now, we restrict read/delete to authenticated users for simplicity or specific admin roles
create policy "Allow authenticated users to view messages"
  on contact_messages for select
  to authenticated
  using (true);
