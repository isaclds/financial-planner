CREATE TABLE expense_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE income_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value NUMERIC(10, 2) NOT NULL,
    category_id INTEGER REFERENCES expense_categories(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE incomes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value NUMERIC(10, 2) NOT NULL,
    category_id INTEGER REFERENCES income_categories(id),
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO expense_categories (name) VALUES
    ('Loan Payment'),
    ('Food'),
    ('Health'),
    ('Transportation'),
    ('Housing'),
    ('Entertainment'),
    ('Bills'),
    ('Clothing'),
    ('Credit Card'),
    ('Insurance'),
    ('Bank Fees')
ON CONFLICT (name) DO NOTHING;

INSERT INTO income_categories (name) VALUES
    ('Salary'),
    ('Freelance'),
    ('Investments'),
    ('Rental Income'),
    ('Other')
ON CONFLICT (name) DO NOTHING;