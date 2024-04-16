SELECT *
FROM Customer
WHERE ((total_order > 5 ) AND ((name ILIKE '%mangesh%') OR (email = '@gmail')))
LIMIT 10;