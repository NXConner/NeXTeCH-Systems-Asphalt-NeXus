-- Vehicles
INSERT INTO vehicles (id, name, type, status, location, driver, fuel_level, mileage, maintenance_score, route, speed, engine_hours)
VALUES
  (gen_random_uuid(), 'Truck 1', 'truck', 'active', '{"lat":40.7128,"lng":-74.0060,"address":"NYC","lastUpdate":"2024-06-01T00:00:00Z"}', 'John Doe', 80, 12000, 90, 'Route A', 60, 500),
  (gen_random_uuid(), 'Van 1', 'van', 'maintenance', '{"lat":34.0522,"lng":-118.2437,"address":"LA","lastUpdate":"2024-06-01T00:00:00Z"}', 'Jane Smith', 50, 8000, 70, 'Route B', 50, 300);

-- Jobs
INSERT INTO jobs (id, title, client, project, status, priority, schedule, assigned_vehicles, assigned_crew, progress, timeline)
VALUES
  (gen_random_uuid(), 'Paving Main St', '{"name":"Acme Corp","email":"acme@example.com","phone":"555-1234","address":"123 Main St"}', '{"type":"paving","description":"Main St paving","location":"123 Main St","estimatedArea":1000,"estimatedCost":50000}', 'in-progress', 'high', '{"startDate":"2024-06-01","endDate":"2024-06-10","estimatedDuration":10}', ARRAY['Truck 1'], ARRAY['John Doe'], 40, NULL),
  (gen_random_uuid(), 'Sealcoating Elm Ave', '{"name":"Beta LLC","email":"beta@example.com","phone":"555-5678","address":"456 Elm Ave"}', '{"type":"sealcoating","description":"Elm Ave sealcoating","location":"456 Elm Ave","estimatedArea":500,"estimatedCost":20000}', 'scheduled', 'medium', '{"startDate":"2024-06-15","endDate":"2024-06-20","estimatedDuration":5}', ARRAY['Van 1'], ARRAY['Jane Smith'], 0, NULL);

-- Maintenance Records
INSERT INTO maintenance_records (id, vehicle_id, type, title, description, status, priority, scheduled_date, completed_date, cost, mileage, performed_by, notes, parts)
VALUES
  (gen_random_uuid(), (SELECT id FROM vehicles LIMIT 1), 'scheduled', 'Oil Change', 'Routine oil change', 'pending', 'medium', '2024-06-05T09:00:00Z', NULL, 100, 12000, 'John Doe', 'Change oil and filter', '[{"part":"oil filter","qty":1}]'),
  (gen_random_uuid(), (SELECT id FROM vehicles OFFSET 1 LIMIT 1), 'repair', 'Brake Repair', 'Replace brake pads', 'completed', 'high', '2024-05-20T09:00:00Z', '2024-05-20T12:00:00Z', 300, 8000, 'Jane Smith', 'Replaced front brake pads', '[{"part":"brake pad","qty":4}]'); 