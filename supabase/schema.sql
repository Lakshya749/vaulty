-- ==============================================================================
-- VAULTY (SubTrack) - Master Supabase PostgreSQL Database Schema
-- BCA-508 Minor Project | Dual Persistence Engine with Row-Level Security (RLS)
-- ==============================================================================

-- 1. Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 2. Create custom enum types if supported
do $$ begin
    create type billing_cycle_type as enum ('weekly', 'monthly', 'quarterly', 'yearly');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type subscription_status_type as enum ('active', 'paused', 'cancelled');
exception
    when duplicate_object then null;
end $$;

-- 3. PROFILES TABLE (Mirrors auth.users)
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    display_name text default 'Arjun',
    currency_pref text default 'INR',
    default_reminder_days int default 3,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- 4. CATEGORIES TABLE
create table if not exists public.categories (
    id uuid default uuid_generate_v4() primary key,
    name text unique not null,
    color text default '#8B5CF6',
    icon text default 'tag',
    created_at timestamptz default now() not null
);

-- 5. SUBSCRIPTIONS TABLE
create table if not exists public.subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    category_id uuid references public.categories(id) on delete set null,
    service_name text not null,
    category text not null,
    cost numeric(10, 2) not null check (cost >= 0),
    currency text default 'INR' not null,
    billing_cycle text not null check (billing_cycle in ('weekly', 'monthly', 'quarterly', 'yearly')),
    first_bill_date date default current_date,
    next_billing_date date not null,
    status text default 'active' not null check (status in ('active', 'paused', 'cancelled')),
    is_free_trial boolean default false not null,
    trial_end_date date,
    reminder_days int default 3 not null check (reminder_days between 1 and 30),
    cancel_url text,
    notes text,
    color text default '#8B5CF6',
    last_used_at timestamptz default now(),
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- 6. PRICE HISTORY TABLE (For Price Hike Watchdog)
create table if not exists public.price_history (
    id uuid default uuid_generate_v4() primary key,
    subscription_id uuid references public.subscriptions(id) on delete cascade not null,
    old_cost numeric(10, 2) not null,
    new_cost numeric(10, 2) not null,
    percentage_change numeric(5, 2) not null,
    effective_date date not null,
    created_at timestamptz default now() not null
);

-- 7. ALERTS & NOTIFICATIONS TABLE
create table if not exists public.alerts (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    subscription_id uuid references public.subscriptions(id) on delete cascade,
    alert_type text not null check (alert_type in ('trial_expiry', 'zombie_detected', 'price_hike', 'renewal_due')),
    title text not null,
    message text not null,
    is_read boolean default false not null,
    trigger_date timestamptz not null,
    created_at timestamptz default now() not null
);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.subscriptions enable row level security;
alter table public.price_history enable row level security;
alter table public.alerts enable row level security;

-- Profiles: Users can only read and edit their own profile
create policy "Users can view own profile" on public.profiles
    for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
    for update using (auth.uid() = id);

-- Categories: Read-only for authenticated users
create policy "Authenticated users can view categories" on public.categories
    for select using (auth.role() = 'authenticated');

-- Subscriptions: Full CRUD restricted to owner
create policy "Users can select own subscriptions" on public.subscriptions
    for select using (auth.uid() = user_id);

create policy "Users can insert own subscriptions" on public.subscriptions
    for insert with check (auth.uid() = user_id);

create policy "Users can update own subscriptions" on public.subscriptions
    for update using (auth.uid() = user_id);

create policy "Users can delete own subscriptions" on public.subscriptions
    for delete using (auth.uid() = user_id);

-- Alerts: Users can view and manage their own alerts
create policy "Users can view own alerts" on public.alerts
    for select using (auth.uid() = user_id);

create policy "Users can update own alerts" on public.alerts
    for update using (auth.uid() = user_id);

-- Price History: Users can view price history for their own subscriptions
create policy "Users can view own price history" on public.price_history
    for select using (
        exists (
            select 1 from public.subscriptions
            where public.subscriptions.id = price_history.subscription_id
            and public.subscriptions.user_id = auth.uid()
        )
    );

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, display_name)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', 'Arjun')
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger firing when auth.users is inserted
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- SEED DATA (Default Categories)
-- ==============================================================================

insert into public.categories (name, color, icon) values
    ('Streaming', '#8B5CF6', 'tv'),
    ('AI Tools', '#06B6D4', 'bot'),
    ('Gym / Fitness', '#F43F5E', 'dumbbell'),
    ('Cloud & Storage', '#3B82F6', 'cloud'),
    ('Gaming', '#10B981', 'gamepad-2'),
    ('Music', '#EC4899', 'music'),
    ('Productivity', '#F59E0B', 'briefcase'),
    ('Other', '#6B7280', 'tag')
on conflict (name) do nothing;
