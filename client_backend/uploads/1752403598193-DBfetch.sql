show databases;
use dummy_api;
show tables;
select * from user_credentials;
select * from polygonStore;
select * from user_details;
select * from paymentGateway;
select * from purchase_units where clientID=73671;

/* for total area*/
select * from user_key where user_id=53618;
select sum(area) from polygonStore where clientID in (
select user_id from user_credentials where user_name in 
(select mobile_no from user_details where referal_code=73671));

/*for paid area*/
select sum(area) from polygonStore where clientID in (
select user_id from user_credentials where user_name in (
select mobile_no from user_details where referal_code=73671
));
SELECT SUM(area) FROM polygonStore WHERE clientID IN (
    SELECT user_id FROM user_credentials WHERE user_name IN (
        SELECT mobile_no FROM user_details WHERE referal_code = 73671
    )
)
AND id IN (
    SELECT farm_id FROM paymentGateway
);