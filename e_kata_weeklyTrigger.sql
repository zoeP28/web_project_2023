-- Trigger to set up an event about checking an offer older than one week
SET GLOBAL event_scheduler = ON;
DELIMITER //
CREATE EVENT delete_expired_offers
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    -- Average price of the past day
    SET @avgPriceDay = (SELECT AVG(price) 
                        FROM discounts 
                        WHERE DATE(date) = DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY));

    -- Average price of the past week
    SET @avgPriceWeek = (SELECT AVG(price) 
                         FROM discounts 
                         WHERE DATE(date) BETWEEN DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY) AND DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY));

    -- Delete offers that are older than a week and do not meet the price conditions
    DELETE FROM discounts 
    WHERE date < DATE_SUB(CURRENT_DATE, INTERVAL 1 WEEK) 
    AND (
        price >= (@avgPriceDay - @avgPriceDay * 0.2)
        OR
        price >= (@avgPriceWeek - @avgPriceWeek * 0.2)
    );
END //
DELIMITER ;
