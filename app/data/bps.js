// BPS-Statistics Indonesia province tables, read from bps.go.id on 26 November 2026.
// One value per province, in the order of NAMES; `national` is the Indonesia row of the same table.

export const NAMES = ['Aceh','Sumatera Utara','Sumatera Barat','Riau','Jambi','Sumatera Selatan','Bengkulu','Lampung','Kep. Bangka Belitung','Kep. Riau','DKI Jakarta','Jawa Barat','Jawa Tengah','DI Yogyakarta','Jawa Timur','Banten','Bali','Nusa Tenggara Barat','Nusa Tenggara Timur','Kalimantan Barat','Kalimantan Tengah','Kalimantan Selatan','Kalimantan Timur','Kalimantan Utara','Sulawesi Utara','Sulawesi Tengah','Sulawesi Selatan','Sulawesi Tenggara','Gorontalo','Sulawesi Barat','Maluku','Maluku Utara','Papua Barat','Papua Barat Daya','Papua','Papua Selatan','Papua Tengah','Papua Pegunungan'];

// Island group of each province, same order.
export const ISLAND = ['Sumatra','Sumatra','Sumatra','Sumatra','Sumatra','Sumatra','Sumatra','Sumatra','Sumatra','Sumatra','Java','Java','Java','Java','Java','Java','Bali & Nusa Tenggara','Bali & Nusa Tenggara','Bali & Nusa Tenggara','Kalimantan','Kalimantan','Kalimantan','Kalimantan','Kalimantan','Sulawesi','Sulawesi','Sulawesi','Sulawesi','Sulawesi','Sulawesi','Maluku','Maluku','Papua','Papua','Papua','Papua','Papua','Papua'];

const POP_URL = 'https://www.bps.go.id/id/statistics-table/3/V1ZSbFRUY3lTbFpEYTNsVWNGcDZjek53YkhsNFFUMDkjMyMwMDAw/jumlah-penduduk-laju-pertumbuhan-penduduk-distribusi-persentase-penduduk-kepadatan-penduduk-rasio-jenis-kelamin-penduduk-menurut-provinsi.html';

export const pop2024 = [5554.8,15588.5,5836.2,6728.1,3724.3,8837.3,2112.2,9419.6,1531.5,2183.3,10684.9,50345.2,37892.3,3759.5,41814.5,12431.4,4433.3,5646.0,5656.0,5695.5,2809.7,4273.4,4045.9,739.8,2701.8,3121.8,9463.4,2793.1,1227.8,1503.2,1945.6,1355.6,578.7,627.1,1060.6,542.1,1472.9,1467.0];
export const pop2024National = 281603.8;

const RAW = [
  { key: 'pop', label: 'Population', unit: 'thousand people', period: '2025', dp: 1, better: 0,
    title: 'Penduduk \u2026 Menurut Provinsi (Jumlah Penduduk, Ribu), 2025', url: POP_URL + '?year=2025', national: 284438.8,
    values: [5631.8,15801.9,5920.7,6817.9,3772.1,8935.9,2140.1,9531.3,1552.4,2215.9,10724.3,50942.8,38261.4,3783.3,42111.1,12582.5,4463.5,5738.1,5749.7,5771.7,2847.9,4327.4,4050.6,750.1,2723.0,3158.9,9571.3,2840.3,1243.4,1527.2,1972.6,1375.3,588.4,637.2,1074.8,550.3,1493.9,1486.4] },
  { key: 'poor', label: 'Poverty rate', unit: '% of people', period: 'March 2026', dp: 2, better: -1,
    title: 'Persentase Penduduk Miskin (P0) Menurut Provinsi dan Daerah (Persen), 2026', url: 'https://www.bps.go.id/id/statistics-table/2/MTkyIzI=/persentase-penduduk-miskin-p0-menurut-provinsi-dan-daerah-persen.html', national: 8.07,
    values: [12.34,7.10,5.27,6.19,6.67,9.50,11.83,9.31,4.75,4.09,3.96,6.54,9.21,9.70,9.06,5.38,3.44,11.17,17.52,5.78,5.09,3.63,5.14,5.18,6.32,10.46,7.24,10.02,12.16,10.00,14.91,5.79,18.68,16.49,18.39,18.54,30.41,26.34] },
  { key: 'tpt', label: 'Open unemployment', unit: '% of labour force', period: 'August 2026', dp: 2, better: -1,
    title: 'Tingkat Pengangguran Terbuka Menurut Provinsi (Persen), 2026', url: 'https://www.bps.go.id/id/statistics-table/2/NTQzIzI=/tingkat-pengangguran-terbuka-menurut-provinsi-persen.html', national: 4.75,
    values: [5.70,5.22,5.57,4.12,4.26,3.45,3.40,4.01,4.40,6.37,5.75,6.67,4.65,3.33,3.60,6.61,1.42,3.03,3.42,4.87,4.01,4.04,5.23,3.79,5.90,2.94,4.23,3.52,3.61,2.93,6.23,4.57,4.29,6.56,7.12,5.17,3.87,1.83] },
  { key: 'ipm', label: 'Human Development Index', unit: 'index, 0\u2013100', period: '2024', dp: 2, better: 1,
    title: '[Metode Baru] Indeks Pembangunan Manusia (IPM) menurut Provinsi, 2024', url: 'https://www.bps.go.id/id/statistics-table/2/NDk0IzI=/metode-baru-indeks-pembangunan-manusia-ipm-menurut-provinsi.html', national: 74.20,
    values: [74.03,74.02,74.49,74.79,73.43,72.30,73.39,71.81,73.33,77.97,83.08,74.43,73.88,81.55,74.09,74.48,77.76,70.93,67.39,70.13,72.73,73.03,78.83,73.02,75.03,71.56,74.05,73.48,71.23,68.20,71.57,71.03,67.02,68.63,73.00,67.90,59.75,53.42] },
];

export const tables = RAW.map((t) => ({ ...t, rows: NAMES.map((n, i) => [n, t.values[i]]) }));
