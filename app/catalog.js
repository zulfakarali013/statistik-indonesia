// The catalogue: what each figure means, its unit, its World Bank code and which topic page shows it.
// better: 1 when a higher value is the better outcome, -1 when lower is better, 0 when neither.

export const TOPICS = [
  { id: 'people', name: 'Population', blurb: 'How many Indonesians there are, where they live and how the age mix is shifting.' },
  { id: 'economy', name: 'Economy', blurb: 'Output, growth, prices, trade and investment in current US dollars and percent.' },
  { id: 'work', name: 'Work & welfare', blurb: 'Jobs, poverty and how evenly income is shared.' },
  { id: 'society', name: 'Health & society', blurb: 'Life expectancy, child survival, schooling, power and internet access.' },
  { id: 'environment', name: 'Environment', blurb: 'Forest cover and carbon dioxide per person.' },
];

const I = (key, code, topic, label, unit, fmt, dp, better, note, src = 'wdi') => ({ key, code, topic, label, unit, fmt, dp, better, note, src });

export const INDICATORS = [
  I('pop', 'SP.POP.TOTL', 'people', 'Population', 'people', 'people', 0, 0, 'Midyear estimate of all residents.'),
  I('popgrow', 'SP.POP.GROW', 'people', 'Population growth', '% a year', 'pct', 2, 0, 'Change on the year before.'),
  I('urban', 'SP.URB.TOTL.IN.ZS', 'people', 'Living in towns and cities', '% of people', 'pct', 1, 0, 'Urban share as defined nationally.'),
  I('young', 'SP.POP.0014.TO.ZS', 'people', 'Aged 0 to 14', '% of people', 'pct', 1, 0, 'Children as a share of everyone.'),
  I('old', 'SP.POP.65UP.TO.ZS', 'people', 'Aged 65 and over', '% of people', 'pct', 1, 0, 'Older people as a share of everyone.'),
  I('fert', 'SP.DYN.TFRT.IN', 'people', 'Fertility rate', 'births per woman', 'num', 2, 0, '2.1 is about the replacement level.'),
  I('gdp', 'NY.GDP.MKTP.CD', 'economy', 'GDP', 'current US$', 'usd', 0, 1, 'Gross domestic product at market prices.'),
  I('growth', 'NY.GDP.MKTP.KD.ZG', 'economy', 'GDP growth', '% a year, real', 'pct', 2, 1, 'At constant prices, so inflation is taken out.'),
  I('gdppc', 'NY.GDP.PCAP.CD', 'economy', 'GDP per person', 'current US$', 'usd', 0, 1, 'GDP divided by midyear population.'),
  I('cpi', 'FP.CPI.TOTL.ZG', 'economy', 'Inflation', '% a year, consumer prices', 'pct', 2, 0, 'Change in the consumer price index.'),
  I('exports', 'NE.EXP.GNFS.ZS', 'economy', 'Exports', '% of GDP', 'pct', 1, 0, 'Goods and services sold abroad.'),
  I('imports', 'NE.IMP.GNFS.ZS', 'economy', 'Imports', '% of GDP', 'pct', 1, 0, 'Goods and services bought abroad.'),
  I('fdi', 'BX.KLT.DINV.CD.WD', 'economy', 'Foreign direct investment', 'net inflow, current US$', 'usd', 0, 1, 'Balance of payments, net inflows.'),
  I('debt', 'GGXWDG_NGDP', 'economy', 'Government debt', '% of GDP', 'pct', 1, -1, 'General government gross debt.', 'imf'),
  I('current', 'BCA_NGDPD', 'economy', 'Current account balance', '% of GDP', 'pct', 1, 0, 'Trade, income and transfers with the rest of the world.', 'imf'),
  I('agri', 'NV.AGR.TOTL.ZS', 'economy', 'Farming, forestry, fishing', '% of GDP', 'pct', 1, 0, 'Value added share.'),
  I('manuf', 'NV.IND.MANF.ZS', 'economy', 'Manufacturing', '% of GDP', 'pct', 1, 0, 'Value added share.'),
  I('services', 'NV.SRV.TOTL.ZS', 'economy', 'Services', '% of GDP', 'pct', 1, 0, 'Value added share.'),
  I('unemp', 'SL.UEM.TOTL.ZS', 'work', 'Unemployment', '% of labour force', 'pct', 2, -1, 'Modelled ILO estimate, ages 15+.'),
  I('lfpr', 'SL.TLF.CACT.ZS', 'work', 'Labour force participation', '% of ages 15+', 'pct', 1, 1, 'Modelled ILO estimate.'),
  I('poverty', 'SI.POV.NAHC', 'work', 'Below the national poverty line', '% of people', 'pct', 1, -1, 'Each country sets its own line, so compare trends.'),
  I('gini', 'SI.POV.GINI', 'work', 'Gini index', '0 equal to 100 unequal', 'num', 1, -1, 'Spread of consumption or income.'),
  I('life', 'SP.DYN.LE00.IN', 'society', 'Life expectancy', 'years at birth', 'num', 1, 1, 'Years a newborn would live at today\u2019s death rates.'),
  I('infant', 'SP.DYN.IMRT.IN', 'society', 'Infant deaths', 'per 1,000 live births', 'num', 1, -1, 'Deaths before age one.'),
  I('literacy', 'SE.ADT.LITR.ZS', 'society', 'Adult literacy', '% of ages 15+', 'pct', 1, 1, 'Can read and write a short statement.'),
  I('internet', 'IT.NET.USER.ZS', 'society', 'Using the internet', '% of people', 'pct', 1, 1, 'Used it in the last three months.'),
  I('power', 'EG.ELC.ACCS.ZS', 'society', 'Access to electricity', '% of people', 'pct', 1, 1, 'Share with an electricity connection.'),
  I('healthspend', 'SH.XPD.CHEX.GD.ZS', 'society', 'Health spending', '% of GDP', 'pct', 2, 0, 'Current health expenditure, all payers.'),
  I('forest', 'AG.LND.FRST.ZS', 'environment', 'Forest area', '% of land', 'pct', 1, 1, 'Land under natural or planted trees.'),
  I('co2', 'EN.GHG.CO2.PC.CE.AR5', 'environment', 'CO\u2082 per person', 'tonnes a year', 'num', 2, -1, 'Excludes land use change.'),
];

export const HEADLINE = ['pop', 'gdp', 'growth', 'gdppc', 'cpi', 'unemp', 'poverty', 'life'];

export const byKey = Object.fromEntries(INDICATORS.map((d) => [d.key, d]));
export const SOURCES = {
  wdi: { name: 'World Bank, World Development Indicators', short: 'World Bank WDI', url: (c) => `https://data.worldbank.org/indicator/${c}?locations=ID` },
  imf: { name: 'IMF, World Economic Outlook (Oct 2026)', short: 'IMF WEO', url: (c) => `https://www.imf.org/external/datamapper/${c}@WEO/IDN` },
  bps: { name: 'BPS-Statistics Indonesia', short: 'BPS', url: () => 'https://www.bps.go.id' },
};
export const SOURCE_NAME = SOURCES.wdi.name;
export const sourceOf = (ind) => SOURCES[ind.src || 'wdi'];
export const sourceUrl = (ind) => sourceOf(ind).url(ind.code);
