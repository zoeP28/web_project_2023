-- Trigger to set up a procedure about updating score and tokens every month
DELIMITER //
CREATE PROCEDURE DistributeTokensAndResetScores()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE userId INT;
    DECLARE userScore INT;
    DECLARE userTokens INT;
    DECLARE totalTokens INT;
    DECLARE totalScore INT;

    DECLARE cur CURSOR FOR SELECT `user_id`, `score` FROM `users`;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Calculate the total number of tokens generated for the month
    SELECT COUNT(*) * 100 INTO totalTokens FROM `users`;
    SET @eightyPercentTokens = ROUND(totalTokens * 0.8);

    -- Get the total score of all users for the month
    SELECT SUM(`score`) INTO totalScore FROM `users`;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO userId, userScore;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Calculate tokens for this user based on their score
        SET userTokens = ROUND(@eightyPercentTokens * (userScore / totalScore));
        
        -- Add the tokens to the user's overallTokens and reset monthly tokens and score
        UPDATE `users` SET 
            `score` = 0,
            `tokens` = 0,
            `overallTokens` = `overallTokens` + userTokens,
            `overallScore` = `overallScore` + `score`
        WHERE `user_id` = userId;
    END LOOP;

    CLOSE cur;

END //
DELIMITER ;
