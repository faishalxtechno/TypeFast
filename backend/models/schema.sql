-- =============================================================
-- TYPEFAST V4 POSTGRESQL PRODUCTION DATABASE SCHEMA
-- =============================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    bio TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. TYPING TESTS TABLE
CREATE TABLE IF NOT EXISTS typing_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    wpm INTEGER NOT NULL,
    raw_wpm INTEGER NOT NULL,
    accuracy NUMERIC(5, 2) NOT NULL,
    errors INTEGER NOT NULL,
    duration INTEGER NOT NULL, -- 15, 30, 60, 120
    difficulty VARCHAR(20) NOT NULL, -- 'easy', 'medium', 'hard'
    correct_chars INTEGER NOT NULL,
    incorrect_chars INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_typing_tests_user_id ON typing_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_tests_created_at ON typing_tests(created_at);
CREATE INDEX IF NOT EXISTS idx_typing_tests_wpm ON typing_tests(wpm DESC);

-- 3. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id VARCHAR(50) UNIQUE NOT NULL, -- 'TF-2026-8A72F4'
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    wpm INTEGER NOT NULL,
    accuracy NUMERIC(5, 2) NOT NULL,
    errors INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    test_result_id UUID REFERENCES typing_tests(id) ON DELETE SET NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_certificates_cert_id ON certificates(certificate_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);

-- 4. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(50) PRIMARY KEY, -- 'ach-first-step'
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(20) NOT NULL,
    category VARCHAR(30) NOT NULL,
    requirement_type VARCHAR(30) NOT NULL,
    requirement_value INTEGER NOT NULL
);

-- 5. USER ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(50) NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_achievement UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- 6. DAILY CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS daily_challenges (
    id VARCHAR(50) PRIMARY KEY, -- 'challenge-2026-08-17'
    date_key DATE UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    prompt_text TEXT NOT NULL,
    duration INTEGER DEFAULT 60,
    difficulty VARCHAR(20) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. DAILY CHALLENGE RESULTS TABLE
CREATE TABLE IF NOT EXISTS daily_challenge_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id VARCHAR(50) REFERENCES daily_challenges(id) ON DELETE CASCADE,
    wpm INTEGER NOT NULL,
    accuracy NUMERIC(5, 2) NOT NULL,
    errors INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_daily_challenge UNIQUE(user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_results_challenge ON daily_challenge_results(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_results_wpm ON daily_challenge_results(wpm DESC);
