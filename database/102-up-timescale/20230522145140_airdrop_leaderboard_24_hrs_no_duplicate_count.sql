-- migrate:up

DROP FUNCTION airdrop_leaderboard_24_hours;

CREATE OR REPLACE FUNCTION airdrop_leaderboard_24_hours()
RETURNS SETOF airdrop_leaderboard_return
LANGUAGE SQL
STABLE
AS
$$
SELECT 
    address,
    -- placeholder
    ROW_NUMBER() OVER () AS rank,
    COUNT(DISTINCT referee) AS referral_count, 
    lb.total_box_count,
    lb.highest_reward_tier, 
    COALESCE(liquidity.result, 1) AS liquidity_multiplier 
FROM (
    -- subquery to avoid re-summing lootbox_count for every referee
    SELECT address, SUM(lootbox_count) as total_box_count, MAX(reward_tier) as highest_reward_tier
    FROM lootbox 
    WHERE awarded_time > now() - interval '1 day'
    GROUP BY address
) lb
    JOIN lootbox_referrals 
        ON lb.address = lootbox_referrals.referrer, 
    LATERAL calculate_a_y(address, now()::TIMESTAMP) AS liquidity 
GROUP BY address, liquidity_multiplier, total_box_count, highest_reward_tier
$$;

--migrate:down

DROP FUNCTION airdrop_leaderboard_24_hours;

CREATE OR REPLACE FUNCTION airdrop_leaderboard_24_hours()
RETURNS SETOF airdrop_leaderboard_return
LANGUAGE SQL
STABLE
AS
$$
SELECT 
    address,
    -- placeholder
    ROW_NUMBER() OVER () AS rank,
    COUNT(DISTINCT referee) AS referral_count, 
    SUM(lootbox_count) AS total_lootboxes, 
    MAX(reward_tier) AS highest_reward_tier, 
    COALESCE(liquidity.result, 1) AS liquidity_multiplier 
FROM lootbox 
    LEFT JOIN lootbox_referrals 
        ON lootbox.address = lootbox_referrals.referrer, 
    LATERAL calculate_a_y(address, now()::TIMESTAMP) AS liquidity 
WHERE awarded_time > now() - interval '1 day'
GROUP BY address, liquidity_multiplier
$$;

