-- Add Las Piñas TODAs data
INSERT INTO todas (name, area, center_latitude, center_longitude, radius)
VALUES 
  ('ACAPODA', 'Admiral Village, Talon Tres', 14.447, 120.977, 1.0),
  ('APHDA', 'Angela Village, Talon Kuatro', 14.442, 120.979, 1.0),
  ('ATODA', 'Pilar Village', 14.458, 120.975, 1.0),
  ('PETHTODA', 'BF Executive, Almanza Uno', 14.452, 120.985, 1.0),
  ('BFRSSCV', 'BF Sta Cecilia, Talon Dos', 14.445, 120.983, 1.0),
  ('BFRV-VG', 'BF Vista Grande, Talon Dos', 14.446, 120.984, 1.0),
  ('TEPTODA', 'Talon Equitable', 14.441, 120.978, 1.0),
  ('GGTODA', 'Golden Gate, Talon Tres', 14.447, 120.976, 1.0),
  ('BFATODA', 'BF Almanza, Almanza Dos', 14.450, 120.986, 1.0),
  ('MAMTTODA', 'Moonwalk Village, Talon Singko', 14.438, 120.980, 1.0),
  ('MDVPTODA', 'Manila Doctors, Almanza Uno', 14.453, 120.986, 1.0),
  ('MSTODA', 'Metrocor Subdivision, Almanza Uno', 14.454, 120.987, 1.0),
  ('PVTODA', 'Philamlife Village, Pamplona Dos', 14.460, 120.982, 1.0),
  ('RSTODA', 'Remarville Subdivision, Pamplona Dos', 14.462, 120.981, 1.0),
  ('SAVTODA', 'SAV 17, Talon Kuatro', 14.443, 120.979, 1.0),
  ('SMCTODA', 'Saint Michael Village, Talon Dos', 14.444, 120.982, 1.0),
  ('TSCTODA', 'TS Cruz Subdivision, Almanza Dos', 14.451, 120.987, 1.0),
  ('TSTODA', 'Talon Singko', 14.439, 120.981, 1.0),
  ('NUVTODA', 'Urbanville Village, Talon Tres', 14.447, 120.977, 1.0),
  ('ZOLIVIMATODA', 'DBP Village, Almanza Uno', 14.455, 120.986, 1.0);

-- Create indexes for faster location-based queries
CREATE INDEX idx_todas_latitude ON todas (center_latitude);
CREATE INDEX idx_todas_longitude ON todas (center_longitude); 